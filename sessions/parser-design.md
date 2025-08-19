# Architecture Decision Record: FHIR Search Parser Implementation

## Title
FHIR Search Query Parser Implementation Strategy

## Status
Proposed

## Context

We need to implement a parser that converts FHIR search URLs into the AST structure defined in `search-parser.md`. The parser must handle:

- Standard search parameters with various operators and modifiers
- Chained parameters (forward references via dots)
- Reverse chaining (_has parameter)
- Composite parameters with $ separators
- Include/revinclude parameters
- Special parameters (_filter, _sort, _count, etc.)
- Complex value parsing (tokens with |, dates with prefixes, quantities)
- URL encoding/decoding

### Requirements

1. **Correctness**: Must parse all valid FHIR search syntax
2. **Error Reporting**: Clear, actionable error messages with position info
3. **Performance**: Fast enough for real-time IDE usage
4. **Incremental**: Support partial/incremental parsing for LSP
5. **Type Safety**: Full TypeScript support with proper types
6. **Browser Compatible**: Should work in browser environments
7. **Maintainable**: Easy to understand and modify
8. **Extensible**: Easy to add new operators or parameter types

## Decision Options

### Option 1: Hand-Written Recursive Descent Parser

**Description**: Write a custom parser using recursive descent technique.

```typescript
class FHIRSearchParser {
  private pos = 0;
  private input: string;
  
  parseQuery(): SearchQuery {
    const params = this.parseParameters();
    return this.buildAST(params);
  }
  
  parseParameter() {
    const name = this.parseParameterName();
    const operator = this.parseOperator();
    const value = this.parseValue();
    return { name, operator, value };
  }
}
```

**Pros**:
- Full control over parsing logic
- Excellent error messages with custom handling
- No external dependencies
- Optimal performance possible
- Easy debugging with standard tools
- Small bundle size

**Cons**:
- More code to write and maintain
- Complex grammar rules harder to implement
- Need to handle all edge cases manually
- Tokenization logic mixed with parsing

### Option 2: Parser Combinator Library (e.g., Parsimmon)

**Description**: Use a parser combinator library to compose smaller parsers.

```typescript
import * as P from 'parsimmon';

const SearchParser = P.createLanguage({
  query: (r) => P.seq(
    r.resource,
    P.string('?'),
    r.parameters
  ),
  
  parameter: (r) => P.seq(
    r.parameterName,
    P.string('='),
    r.value
  ),
  
  parameterName: () => P.regexp(/[a-z][a-z0-9_-]*/i),
  
  value: () => P.regexp(/[^&]+/)
});
```

**Pros**:
- Declarative grammar definition
- Composable and reusable parsers
- Good TypeScript support
- Built-in error handling
- Well-tested libraries available

**Cons**:
- External dependency
- Learning curve for combinator pattern
- May be overkill for URL parsing
- Harder to customize error messages
- Larger bundle size

### Option 3: Parser Generator (PEG.js/Peggy)

**Description**: Define grammar in PEG format and generate parser code.

```peg
Query = resource:Resource "?" params:Parameters {
  return { resource, params };
}

Resource = [A-Z][a-zA-Z]+

Parameters = param:Parameter ("&" rest:Parameters)? {
  return [param].concat(rest || []);
}

Parameter = name:ParameterName "=" value:Value {
  return { name, value };
}
```

**Pros**:
- Clear grammar specification
- Generates optimized parser
- Good for complex grammars
- Separation of grammar and logic

**Cons**:
- Build step required
- Generated code harder to debug
- Less flexibility for custom logic
- TypeScript integration can be tricky
- Another DSL to learn

### Option 4: Two-Phase (Tokenizer + Parser)

**Description**: Separate tokenization from parsing for cleaner architecture.

```typescript
// Phase 1: Tokenize
class Tokenizer {
  tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    // Split by &, then by =, identify token types
    return tokens;
  }
}

// Phase 2: Parse tokens into AST
class Parser {
  parse(tokens: Token[]): SearchQuery {
    // Build AST from token stream
    return ast;
  }
}
```

**Pros**:
- Clean separation of concerns
- Easier to test each phase
- Can reuse tokenizer for other purposes
- Simpler parsing logic
- Good for incremental parsing

**Cons**:
- More complex architecture
- Need to maintain token-position mapping
- May be overengineered for URL parsing

### Option 5: Regex-Based Simple Parser

**Description**: Use regular expressions for pattern matching with simple state machine.

```typescript
class SimpleParser {
  parseQuery(url: string): SearchQuery {
    const [path, query] = url.split('?');
    const resource = path.split('/').pop();
    const params = new URLSearchParams(query);
    
    const ast: SearchQuery = { resource, where: [] };
    
    for (const [key, value] of params) {
      const param = this.parseParameter(key, value);
      this.addToAST(ast, param);
    }
    
    return ast;
  }
  
  parseParameter(key: string, value: string) {
    // Regex to extract modifiers, prefixes, etc.
    const chainMatch = key.match(/^([^:]+):([^.]+)\.(.+)$/);
    const modifierMatch = key.match(/^([^:]+):(.+)$/);
    const prefixMatch = value.match(/^(eq|ne|gt|lt|ge|le|sa|eb|ap)(.+)$/);
    // ... handle each case
  }
}
```

**Pros**:
- Simple and straightforward
- Leverages URLSearchParams API
- Good enough for most cases
- Fast implementation
- Easy to understand

**Cons**:
- Complex regex patterns
- Hard to maintain for complex cases
- Poor error messages
- Limited extensibility

## Recommendation

**Chosen Approach: Two-Phase Parser (Tokenizer + Parser) with URLSearchParams**

### Rationale

1. **Leverage URLSearchParams**: For initial parameter extraction (handles URL encoding)
2. **Custom tokenizer**: For parameter names (chains, modifiers) and values
3. **Simple recursive parser**: To build AST from tokens
4. **Incremental support**: Tokenizer can work on partial input

This approach balances simplicity with flexibility and provides:
- Clean architecture
- Good error reporting
- Incremental parsing capability
- No external dependencies
- Reasonable complexity

### Implementation Architecture

```typescript
// Types for tokenization
type TokenType = 
  | 'PARAM_NAME'
  | 'MODIFIER' 
  | 'CHAIN'
  | 'PREFIX'
  | 'VALUE'
  | 'SEPARATOR'
  | 'PIPE'
  | 'DOLLAR';

interface Token {
  type: TokenType;
  value: string;
  position: { start: number; end: number };
  raw: string;
}

// Main parser class
export class FHIRSearchParser {
  private tokenizer: Tokenizer;
  private astBuilder: ASTBuilder;
  
  parse(url: string): SearchQuery {
    // 1. Extract query string
    const { resource, queryString } = this.extractParts(url);
    
    // 2. Use URLSearchParams for initial parsing
    const params = new URLSearchParams(queryString);
    
    // 3. Process each parameter
    const context = new ParseContext(resource);
    
    for (const [key, value] of params) {
      this.processParameter(context, key, value);
    }
    
    // 4. Build final AST
    return context.build();
  }
  
  private processParameter(context: ParseContext, key: string, value: string) {
    // Handle special parameters
    if (key.startsWith('_')) {
      this.processSpecialParameter(context, key, value);
      return;
    }
    
    // Parse parameter structure
    const paramStruct = this.parseParameterStructure(key);
    
    if (paramStruct.type === 'chain') {
      this.processChain(context, paramStruct, value);
    } else if (paramStruct.type === 'has') {
      this.processHas(context, paramStruct, value);
    } else {
      this.processSimple(context, paramStruct, value);
    }
  }
  
  private parseParameterStructure(key: string): ParameterStructure {
    // Check for _has
    if (key.startsWith('_has:')) {
      return this.parseHasStructure(key);
    }
    
    // Check for chains (dots)
    if (key.includes('.')) {
      return this.parseChainStructure(key);
    }
    
    // Check for modifiers (colons)
    if (key.includes(':')) {
      return this.parseModifierStructure(key);
    }
    
    // Simple parameter
    return {
      type: 'simple',
      name: key
    };
  }
}

// Parse context to build AST incrementally
class ParseContext {
  constructor(public resource: string) {}
  
  private where: Expression[] = [];
  private joins: Join[] = [];
  private includes: IncludeExpression[] = [];
  
  addWhere(expr: Expression) {
    this.where.push(expr);
  }
  
  addJoin(join: Join) {
    this.joins.push(join);
  }
  
  build(): SearchQuery {
    return {
      resource: this.resource,
      where: this.where.length ? this.where : undefined,
      joins: this.joins.length ? this.joins : undefined,
      includes: this.includes.length ? this.includes : undefined
    };
  }
}

// Value parser for complex value types
class ValueParser {
  parseValue(value: string, type?: string): Value[] {
    // Handle comma-separated values (OR)
    const values = value.split(',').map(v => this.parseSingleValue(v, type));
    return values;
  }
  
  private parseSingleValue(value: string, type?: string): Value {
    // Check for prefixes (dates/numbers)
    const prefixMatch = value.match(/^(eq|ne|gt|lt|ge|le|sa|eb|ap)(.+)$/);
    if (prefixMatch) {
      return this.parseWithPrefix(prefixMatch[1], prefixMatch[2], type);
    }
    
    // Check for token (system|code)
    if (value.includes('|')) {
      return this.parseToken(value);
    }
    
    // Check for quantity
    if (type === 'quantity') {
      return this.parseQuantity(value);
    }
    
    // Default to string
    return { type: 'string', value };
  }
}
```

### Error Handling Strategy

```typescript
class ParseError extends Error {
  constructor(
    message: string,
    public position: { line: number; column: number },
    public context: string,
    public suggestion?: string
  ) {
    super(message);
  }
}

class ErrorReporter {
  reportError(input: string, position: number, message: string): ParseError {
    const { line, column } = this.getLineColumn(input, position);
    const context = this.getContext(input, position);
    const suggestion = this.getSuggestion(message);
    
    return new ParseError(message, { line, column }, context, suggestion);
  }
}
```

### Incremental Parsing Support

```typescript
interface IncrementalParseResult {
  ast: Partial<SearchQuery>;
  errors: ParseError[];
  completions: CompletionItem[];
}

class IncrementalParser {
  parsePartial(partial: string, cursor: number): IncrementalParseResult {
    // Parse what we can
    // Identify where cursor is
    // Provide completions based on context
    // Report errors for invalid parts
  }
}
```

## Consequences

### Positive

1. **Clean Architecture**: Separation of tokenization, parsing, and AST building
2. **No Dependencies**: Pure TypeScript implementation
3. **Good Error Messages**: Full control over error reporting
4. **Incremental Support**: Can parse partial queries for IDE
5. **Extensible**: Easy to add new parameter types or operators
6. **Testable**: Each component can be tested independently
7. **Performance**: Direct parsing without overhead

### Negative

1. **More Code**: Need to implement tokenizer and parser
2. **Complexity**: Two-phase approach adds architectural complexity
3. **Maintenance**: More code to maintain vs. using a library

### Mitigation Strategies

1. **Comprehensive Tests**: Cover all FHIR search patterns
2. **Clear Documentation**: Document parsing rules and edge cases
3. **Modular Design**: Keep components small and focused
4. **Error Recovery**: Implement robust error recovery for IDE usage

## Implementation Plan

1. **Phase 1**: Basic parameter parsing
   - Simple parameters
   - Operators and modifiers
   - Basic value types

2. **Phase 2**: Complex features
   - Chains and _has
   - Composite parameters
   - _include/_revinclude

3. **Phase 3**: Advanced features
   - _filter parameter
   - Custom search parameters
   - Incremental parsing

4. **Phase 4**: IDE features
   - Error recovery
   - Completions
   - Quick fixes

## Example Usage

```typescript
const parser = new FHIRSearchParser();

// Simple search
const ast1 = parser.parse('/Patient?name=John&birthdate=ge2010-01-01');

// Chain
const ast2 = parser.parse('/Observation?subject:Patient.name=John');

// _has
const ast3 = parser.parse('/Patient?_has:Observation:patient:code=1234-5');

// Composite
const ast4 = parser.parse('/Observation?code-value-quantity=1234-5$gt150');

// Error handling
try {
  const ast = parser.parse('/Patient?invalid:=value');
} catch (error) {
  if (error instanceof ParseError) {
    console.log(`Error at ${error.position.line}:${error.position.column}`);
    console.log(error.context);
    console.log(error.suggestion);
  }
}
```

## References

- [FHIR Search Specification](https://www.hl7.org/fhir/search.html)
- [URL Search Params API](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- [Recursive Descent Parsing](https://en.wikipedia.org/wiki/Recursive_descent_parser)
- [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)