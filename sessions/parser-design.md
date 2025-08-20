# Architecture Decision Record: FHIR Search Parser Implementation

## Title
FHIR Search Parser Implementation Strategy

## Status
Accepted

## Context
We need to implement a parser that converts FHIR search URLs into the unified, expression-tree-based AST structure defined in `search-parser.md`. The parser must be a purely syntactic tool, deferring semantic analysis to a later stage.

### Requirements
1.  **Syntactic Purity**: The parser must create a literal representation of the URL's syntax without relying on semantic knowledge (e.g., `SearchParameter` definitions).
2.  **Unified AST**: All filter parameters (`_filter`, standard, chained, `_has`) must be parsed into a single `where` expression tree.
3.  **Correctness**: Must correctly parse all FHIR search grammar, including modifiers, prefixes, chains, and composite values.
4.  **Error Reporting**: Must produce clear, actionable error messages with position information where possible.
5.  **No Dependencies**: The core parser should be implemented in pure TypeScript.
6.  **Extensibility**: The architecture should be modular to allow for future enhancements (e.g., new operators).

## Decision
The chosen approach is a **Two-Phase Parser leveraging the standard `URLSearchParams` API**.

### Rationale
1.  **Leverage `URLSearchParams`**: This standard API handles the initial, complex work of URL decoding and splitting key-value pairs, which is a robust and reliable starting point.
2.  **Custom Logic for FHIR Syntax**: A custom, hand-written parser is required for the FHIR-specific grammar *within* the parameter keys (e.g., `subject:Patient.name`) and values (e.g., `ge2022-01-01`).
3.  **Control and Performance**: A hand-written parser provides full control over the parsing logic and error handling, avoids external dependencies, and can be optimized for performance.
4.  **Clean Architecture**: A two-phase approach (URL splitting -> FHIR syntax parsing) creates a clean separation of concerns.

## Implementation Plan
The implementation will be centered around a main `FHIRSearchParser` class that orchestrates several specialized, private methods for tokenizing and parsing different parts of the URL.

### 1. Main Parser Class (`FHIRSearchParser`)
This class is the public entry point. It manages the overall workflow from URL string to the final `SearchQuery` AST.

```typescript
// In a new src/parser.ts
import { SearchQuery, Expression, /* ...other types */ } from './types';

class FHIRSearchParser {
  public parse(url: string): SearchQuery {
    // 1. Extract resource type and query string from URL
    const { resource, queryString } = this.extractUrlParts(url);
    const query: SearchQuery = { resource };
    
    // 2. Use URLSearchParams for initial decoding and splitting
    const params = new URLSearchParams(queryString);
    
    // 3. Collect all filter expressions from parameters
    const expressions: Expression[] = [];
    for (const [key, value] of params) {
      if (this.isFilterParam(key)) {
        const exprs = this.parseParameter(key, value);
        expressions.push(...exprs);
      } else {
        // Handle special params like _sort, _include, etc.
        this.parseSpecialParameter(query, key, value);
      }
    }
    
    // 4. Combine all filter expressions into a single `where` clause
    if (expressions.length > 0) {
      query.where = expressions.length === 1 
        ? expressions[0] 
        : { type: 'and', expressions };
    }
    
    return query;
  }
  
  // ... private helper methods will be defined below
}
```

### 2. Core Parameter Parsing Logic
This is the heart of the parser, responsible for turning a single key-value pair from the URL into one or more `Expression` objects.

```typescript
// Inside FHIRSearchParser...

private parseParameter(key: string, value: string): Expression[] {
  // A. Handle _filter separately, as its value is a full expression string
  if (key === '_filter') {
    return [this.parseFilterExpression(value)];
  }
  
  // B. Tokenize the parameter name to identify its parts
  const paramParts = this.tokenizeParamName(key);
  
  // C. The value can contain comma-separated OR values.
  // Each one becomes a separate expression.
  const valueStrings = value.split(',');
  const expressions = valueStrings.map(vStr => {
    // D. Parse the individual value string into a typed Value object
    const parsedValue = this.parseValue(vStr);
    
    // E. Determine the operator type from the modifier or value prefix
    const operator = this.determineOperator(paramParts.modifier, vStr);

    // F. Build the base comparison expression
    let expression: Expression = {
      type: operator,
      param: paramParts.base,
      value: [parsedValue]
    } as Expression; // Simplified for clarity
    
    // G. If it's a chained search, wrap it in a JoinExpression
    if (paramParts.chain.length > 0) {
      return this.buildJoinExpression(paramParts.chain, expression);
    }
    
    // H. If it's a _has search, build the JoinExpression
    if (paramParts.isHas) {
        return this.buildHasJoinExpression(paramParts, expression);
    }
    
    return expression;
  });

  // I. If there was more than one comma-separated value, wrap them in an OR expression
  if (expressions.length > 1) {
    return [{ type: 'or', expressions }];
  }
  
  return expressions;
}
```

### 3. Tokenizers and Value Parsers (Helper Methods)

These private methods will handle the detailed, specific parts of the FHIR search syntax.

*   **`tokenizeParamName(key: string)`**: This method is a crucial tokenizer for the parameter *name*.
    *   Input: `"subject:Patient.name"`
    *   Output: `{ base: "subject", modifier: ":Patient", chain: ["name"], isHas: false }`
    *   Input: `"_has:Observation:patient:code"`
    *   Output: `{ base: "_has", parts: ["Observation", "patient", "code"], isHas: true }`

*   **`parseValue(valueString: string)`**: This method implements the `ValueParser` concept. It is a purely syntactic operation.
    *   It will check for prefixes (e.g., `ge`, `lt`) and strip them before further processing.
    *   It will check for a `$` separator to parse a `CompositeValue`.
    *   It will check for a `|` separator to parse a `TokenValue`.
    *   It will use regular expressions to identify numbers, dates, and quantities.
    *   It will default to a `StringValue`.

*   **`parseFilterExpression(filterString: string)`**: This method will parse the `_filter` parameter's content using a standard **recursive descent** algorithm. This is a well-known and powerful technique for parsing expressions with operator precedence and parentheses.
    1.  **Lexer/Tokenizer**: First, the `filterString` is broken into a stream of tokens (e.g., `['(', 'status', 'eq', "'final'", ')', 'and', '...']`).
    2.  **Parser**: A set of mutually recursive functions (`parseOr`, `parseAnd`, `parsePrimary`) will consume the token stream and build the nested `Expression` tree.

### 4. Error Handling Strategy
The parser will be designed for robust error handling.
-   Parsing functions will throw a `ParseError` exception on failure.
-   `ParseError` will contain a descriptive message, the text being parsed, and a character position.
-   The main `parse` method will catch these errors and return them in a structured `ParseResult` object, separating successful results from errors.

This implementation plan provides a clear, modular, and testable path to building a high-quality parser that correctly targets our refined AST design.