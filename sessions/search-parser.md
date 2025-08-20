# FHIR Search Parser AST Design

## Core Philosophy
- **Syntactic Purity**: The parser's role is to create a literal, syntactic representation of the URL. It does not perform semantic analysis (e.g., case sensitivity, terminology lookups).
- **Unified Expression Tree**: All filtering logic, from simple key-value pairs to complex `_filter` expressions, is represented as a single, unified expression tree.
- **Operator-Driven AST**: The `type` of every node in the expression tree explicitly defines its operation (e.g., `type: '='`, `type: 'and'`, `type: 'join'`).
- **Normalized Syntax**: All FHIR search syntax variations (prefixes like `ge`, modifiers like `:contains`) are normalized into a canonical set of operator types in the AST.

## Architectural Principles: Syntactic vs. Semantic Parsing

The design of this AST and the parser that creates it is guided by a strict separation of concerns:

1.  **The Parser is Purely Syntactic**: The parser's only job is to transform the sequence of characters in a URL into a well-defined, literal tree structure (the AST). It understands FHIR search grammar (parameters, modifiers, prefixes, `_filter` logic) but has no knowledge of the semantics of specific search parameters.
    -   The AST is **case-preserving and accent-preserving**.
    -   The parser does not know which parameters are composite, what their components are, or what data types they expect. It parses `code-value-quantity` as a single parameter name.

2.  **Semantic Analysis is a Separate Step**: All semantic logic is the responsibility of a downstream consumer of the AST, often called a "Query Engine" or "AST Transformer". This is the stage that would use a `ModelProvider` to fetch `SearchParameter` definitions and perform actions like:
    -   Applying case-insensitivity or accent-insensitivity rules.
    -   Validating that a parameter is valid for a given resource.
    -   Resolving terminology lookups (e.g., for the `:in` operator).
    -   Performing unit conversions for quantities.
    -   Deconstructing composite parameters into their components for query building.

This separation makes the parser robust, reusable, and independent of any specific FHIR data model, while allowing the semantic engine to be highly specialized.

## AST Structure

### Root Query Structure
```typescript
interface SearchQuery {
  resource: string;
  
  // Selection
  summary?: 'true' | 'false' | 'count' | 'data';
  elements?: ElementSelection;  // Nested structure for element selection
  
  // Filtering - A single, unified expression tree for all filter logic
  where?: Expression;

  // Eager loading (unified _include and _revinclude - these don't filter)
  includes?: IncludeExpression[];  // Resource inclusion for eager loading

  // Result control
  sort?: SortParam[];
  count?: number;
  offset?: number;

  // Container control
  contained?: 'true' | 'false' | 'both';
  containedType?: 'container' | 'contained';
}
```

### Expression Types
All expression nodes are part of a discriminated union identified by the `type` property.

```typescript
// Base for all comparison operations
interface ComparisonExpression {
  // The literal name of the search param from the URL.
  param: string;
  value: Value[];
  
  // Enrichment: Full SearchParameter definition from ModelProvider
  searchParam?: SearchParameter;
}

// Specific Comparison Expressions
interface EqualsExpression extends ComparisonExpression { type: '='; }
interface NotEqualsExpression extends ComparisonExpression { type: '!='; }
interface GreaterThanExpression extends ComparisonExpression { type: '>'; }
interface LessThanExpression extends ComparisonExpression { type: '<'; }
interface GreaterThanOrEqualExpression extends ComparisonExpression { type: '>='; }
interface LessThanOrEqualExpression extends ComparisonExpression { type: '<='; }
interface ApproximatelyExpression extends ComparisonExpression { type: '~'; }
interface ContainsExpression extends ComparisonExpression { type: 'contains'; }
interface StartsWithExpression extends ComparisonExpression { type: 'starts-with'; }
interface EndsWithExpression extends ComparisonExpression { type: 'ends-with'; }
interface ExactExpression extends ComparisonExpression { type: 'exact'; }
// ... and so on for all other operators

// A wrapper to allow Join operations within the expression tree
interface JoinExpression {
  type: 'join';
  join: Join;
}

// Logical groupings
interface AndExpression {
  type: 'and';
  expressions: Expression[];
}

interface OrExpression {
  type: 'or';
  expressions: Expression[];
}

interface NotExpression {
  type: 'not';
  expression: Expression;
}

// Union type for all expressions
type Expression =
  | EqualsExpression
  | NotEqualsExpression
  | GreaterThanExpression
  | LessThanExpression
  | GreaterThanOrEqualExpression
  | LessThanOrEqualExpression
  | ApproximatelyExpression
  | ContainsExpression
  | StartsWithExpression
  | EndsWithExpression
  | ExactExpression
  // ... other comparison expressions
  | JoinExpression
  | AndExpression
  | OrExpression
  | NotExpression;
```

### Standard Operators (Unified AST)
The `Operator` type is no longer needed, as each operator is now a distinct `type` in the `Expression` union. The mapping from FHIR syntax is still critical for the parser.

*Note: This mapping is a purely syntactic tool for the parser. The semantic interpretation of these operators (e.g., case sensitivity) is handled by a downstream query engine as described in the "Architectural Principles" section.*
```typescript
// Mapping from FHIR syntaxes to standard operator types
const FHIRToStandardOperators = {
  // Search param prefixes
  '': '=',                // Default (no prefix)
  'eq': '=',
  'ne': '!=',
  'gt': '>',
  'lt': '<',
  'ge': '>=',
  'le': '<=',
  'sa': 'starts-after',
  'eb': 'ends-before',
  'ap': '~',

  // Search param modifiers
  ':exact': 'exact',
  ':contains': 'contains',
  ':missing': 'missing',
  ':text': 'text',
  ':above': 'subsumes',
  ':below': 'subsumed-by',
  ':in': 'in',
  ':not-in': 'not-in',
  ':not': 'not',
  ':identifier': 'identified-by',

  // _filter operators
  'co': 'contains',
  'sw': 'starts-with',
  'ew': 'ends-with',
  'pr': 'exists',
  'po': 'overlaps',
  'ss': 'subsumes',
  'sb': 'subsumed-by',
  're': 'references',
  'in': 'in',
  'ni': 'not-in'
};
```

### Value Types
```typescript
interface StringValue {
  type: 'string';
  value: string;
}

interface NumberValue {
  type: 'number';
  value: number;
}

interface DateValue {
  type: 'date';
  value: string;  // ISO 8601 format
  precision: 'year' | 'month' | 'day' | 'time' | 'second';
}

interface TokenValue {
  type: 'token';
  system?: string;
  code: string;
  display?: string;
}

interface ReferenceValue {
  type: 'reference';
  resourceType?: string;
  id: string;
  url?: string;  // For absolute references
}

interface QuantityValue {
  type: 'quantity';
  value: number;
  comparator?: '<' | '<=' | '>=' | '>';
  unit?: string;
  system?: string;
  code?: string;
}

interface BooleanValue {
  type: 'boolean';
  value: boolean;
}

interface CompositeValue {
  type: 'composite';
  parts: Value[];
}

type Value =
  | StringValue
  | NumberValue
  | DateValue
  | TokenValue
  | ReferenceValue
  | QuantityValue
  | BooleanValue
  | CompositeValue;
```

### Join Support (Unified Chain and _has)
```typescript
// Unified joins - handles both chain and _has
// These are INNER JOINs that filter the result set
interface Join {
  // Join target
  resource: string;                   // The resource type to join with
  
  // ON condition - how the join relates to parent
  on: {
    type: 'reference' | 'reverse-reference';
    param: string;               // The reference param
    // For 'reference': parent.param -> joined.id
    // For 'reverse-reference': joined.param -> parent.id
  };
  
  // WHERE conditions for this joined resource.
  // Can contain nested JoinExpressions for deep chaining.
  where?: Expression;
  
  // Enrichment: SearchParameter for the reference being joined on
  searchParam?: SearchParameter;
}
```

### Special Parameters
```typescript
// Element selection (GraphQL-like nested structure)
interface ElementSelection {
  [field: string]: boolean | ElementSelection;
}

// Unified Include params (handles both _include and _revinclude)
interface IncludeExpression {
  direction: 'forward' | 'reverse';  // forward = _include, reverse = _revinclude
  source?: string;                   // Source resource type (optional for wildcards)
  param?: string | '*';          // Reference param or "*" for wildcard
  target?: string;                   // Optional target resource type constraint
  iterate?: boolean;                 // Apply recursively to included resources (standard)
  recurse?: boolean;                 // Alternative to iterate (Aidbox extension)
  logical?: boolean;                 // Include via logical references/identifiers (Aidbox)
  select?: string[] | ElementSelection;  // Elements to select from included resources
}

interface SortParam {
  param: string;
  direction: 'asc' | 'desc';
}
```

## Examples (Unified AST)

### Simple Search
`GET /Patient?name=John&birthdate=ge2010-01-01`

AST:
```typescript
{
  resource: "Patient",
  where: {
    type: "and",
    expressions: [
      {
        type: "=",
        param: "name",
        value: [{ type: "string", value: "John" }]
      },
      {
        type: ">=",
        param: "birthdate",
        value: [{ type: "date", value: "2010-01-01", precision: "day" }]
      }
    ]
  }
}
```

### Mixed Simple and Chained Params
`GET /Observation?subject:Patient.name=John&code=1234-5`

AST:
```typescript
{
  resource: "Observation",
  where: {
    type: "and",
    expressions: [
      {
        type: "=",
        param: "code",
        value: [{ type: "token", code: "1234-5" }]
      },
      {
        type: "join",
        join: {
          resource: "Patient",
          on: { type: 'reference', param: "subject" },
          where: {
            type: "=",
            param: "name",
            value: [{ type: "string", value: "John" }]
          }
        }
      }
    ]
  }
}
```

### Composite Param Search
`GET /Observation?code-value-quantity=http://loinc.org|1234-5$gt150`

The parser treats the param name literally and parses the value parts without semantic knowledge.

AST:
```typescript
{
  resource: "Observation",
  where: {
    type: "=",
    param: "code-value-quantity", // The literal param name from the URL
    value: [{
      type: "composite",
      parts: [
        // The parser splits the value by '$' and parses each part.
        // It does not know what these parts correspond to.
        { type: "token", system: "http://loinc.org", code: "1234-5" },
        { type: "quantity", value: 150, comparator: ">" }
      ]
    }]
  }
}
```

### Mixed Standard and _filter Params
`GET /Observation?code=1234-5&_filter=status eq 'final' or value-quantity gt 150`

AST:
```typescript
{
  resource: "Observation",
  where: {
    type: "and",
    expressions: [
      {
        type: "=",
        param: "code",
        value: [{ type: "token", code: "1234-5" }]
      },
      {
        type: "or",
        expressions: [
          {
            type: "=",
            param: "status",
            value: [{ type: "token", code: "final" }]
          },
          {
            type: ">",
            param: "value-quantity",
            value: [{ type: "quantity", value: 150 }]
          }
        ]
      }
    ]
  }
}
```

### Include and Revinclude Examples

#### Simple _include
`GET /MedicationRequest?_include=MedicationRequest:requester`

AST:
```typescript
{
  resource: "MedicationRequest",
  includes: [
    {
      direction: 'forward',
      source: 'MedicationRequest',
      param: 'requester'
    }
  ]
}
```

#### Multiple Includes
`GET /Observation?_include=Observation:subject&_include=Patient:organization`

The parser creates a flat list of include directives. A later processing step can resolve the dependency graph.

AST:
```typescript
{
  resource: "Observation",
  includes: [
    {
      direction: 'forward',
      source: 'Observation',
      param: 'subject'
    },
    {
      direction: 'forward',
      source: 'Patient',
      param: 'organization'
    }
  ]
}
```

## Benefits of This Design

1.  **Maximum Consistency**: Every node in the expression tree is a discriminated union where the `type` *is* the operation, providing a single, predictable pattern for AST traversal.
2.  **Decoupled Parser**: The parser is purely syntactic. It does not need semantic knowledge of `SearchParameter` definitions to parse any valid URL, including those with composite params.
3.  **Type-Driven Logic**: Consumers of the AST can use `switch(node.type)` to handle all possible operations, with compile-time safety ensuring all cases are handled.
4.  **Clarity and Explicitness**: The role of every node is explicit in its type, removing any ambiguity between logical, structural, and comparison operations.
5.  **Robust & Type-Safe**: Strong typing for values (including `CompositeValue`) prevents errors.

## Implementation Notes

### Parser Architecture
```typescript
class FHIRSearchParser {
  parse(url: string): SearchQuery {
    // 1. Parse URL and extract query params.
    // 2. Identify resource type from path.
    // 3. Parse all params into a flat list of `Expression` objects, using the operator map to determine the `type` of each comparison expression.
    // 4. If more than one expression exists, combine them into a single root `AndExpression`.
    // 5. Assign the final root expression to `SearchQuery.where`.
    // 6. Parse special params (_sort, _include, etc.) and populate the AST.
    // 7. Return structured AST.
  }
}
```