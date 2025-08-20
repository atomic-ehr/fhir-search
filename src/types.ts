// FHIR Search Parser AST Design

// This file contains the type definitions for the FHIR Search Parser AST.
// It is based on the design in sessions/search-parser.md.

// Core Philosophy:
// - The `type` of every node defines its operation.
// - Modifiers are normalized into their equivalent comparison operators.
// - All values are arrays to naturally support multi-value params.
// - Pragmatic, SQL-like mental model.

// Root Query Structure
export interface SearchQuery {
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

// Expression Types
// All expression nodes are part of a discriminated union identified by the `type` property.

// Base for all comparison operations
export interface ComparisonExpression {
  // The literal name of the search param from the URL.
  param: string;
  value: Value[];
  
  // Enrichment: Full SearchParameter definition from ModelProvider
  searchParam?: SearchParameter;
}

// Specific Comparison Expressions
export interface EqualsExpression extends ComparisonExpression { type: '='; }
export interface NotEqualsExpression extends ComparisonExpression { type: '!='; }
export interface GreaterThanExpression extends ComparisonExpression { type: '>'; }
export interface LessThanExpression extends ComparisonExpression { type: '<'; }
export interface GreaterThanOrEqualExpression extends ComparisonExpression { type: '>='; }
export interface LessThanOrEqualExpression extends ComparisonExpression { type: '<='; }
export interface ApproximatelyExpression extends ComparisonExpression { type: '~'; }
export interface ContainsExpression extends ComparisonExpression { type: 'contains'; }
export interface StartsWithExpression extends ComparisonExpression { type: 'starts-with'; }
export interface EndsWithExpression extends ComparisonExpression { type: 'ends-with'; }
export interface ExactExpression extends ComparisonExpression { type: 'exact'; }
export interface StartsAfterExpression extends ComparisonExpression { type: 'starts-after'; }
export interface EndsBeforeExpression extends ComparisonExpression { type: 'ends-before'; }
export interface OverlapsExpression extends ComparisonExpression { type: 'overlaps'; }
export interface ExistsExpression extends ComparisonExpression { type: 'exists'; }
export interface MissingExpression extends ComparisonExpression { type: 'missing'; }
export interface TextExpression extends ComparisonExpression { type: 'text'; }
export interface MatchExpression extends ComparisonExpression { type: 'match'; }
export interface InExpression extends ComparisonExpression { type: 'in'; }
export interface NotInExpression extends ComparisonExpression { type: 'not-in'; }
export interface SubsumesExpression extends ComparisonExpression { type: 'subsumes'; }
export interface SubsumedByExpression extends ComparisonExpression { type: 'subsumed-by'; }
export interface ReferencesExpression extends ComparisonExpression { type: 'references'; }
export interface IdentifiedByExpression extends ComparisonExpression { type: 'identified-by'; }
// A wrapper to allow Join operations within the expression tree
export interface JoinExpression {
  type: 'join';
  join: Join;
}

// Logical groupings
export interface AndExpression {
  type: 'and';
  expressions: Expression[];
}

export interface OrExpression {
  type: 'or';
  expressions: Expression[];
}

export interface NotExpression {
  type: 'not';
  expression: Expression;
}

// Union type for all expressions
export type Expression =
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
  | StartsAfterExpression
  | EndsBeforeExpression
  | OverlapsExpression
  | ExistsExpression
  | MissingExpression
  | TextExpression
  | MatchExpression
  | InExpression
  | NotInExpression
  | SubsumesExpression
  | SubsumedByExpression
  | ReferencesExpression
  | IdentifiedByExpression
  | JoinExpression
  | AndExpression
  | OrExpression
  | NotExpression;

// Value Types
export interface StringValue {
  type: 'string';
  value: string;
}

export interface NumberValue {
  type: 'number';
  value: number;
}

export interface DateValue {
  type: 'date';
  value: string;  // ISO 8601 format
  precision: 'year' | 'month' | 'day' | 'time' | 'second';
}

export interface TokenValue {
  type: 'token';
  system?: string;
  code: string;
  display?: string;
}

export interface ReferenceValue {
  type: 'reference';
  resourceType?: string;
  id: string;
  url?: string;  // For absolute references
}

export interface QuantityValue {
  type: 'quantity';
  value: number;
  comparator?: '<' | '<=' | '>=' | '>';
  unit?: string;
  system?: string;
  code?: string;
}

export interface BooleanValue {
  type: 'boolean';
  value: boolean;
}

export interface CompositeValue {
  type: 'composite';
  parts: Value[];
}

export type Value =
  | StringValue
  | NumberValue
  | DateValue
  | TokenValue
  | ReferenceValue
  | QuantityValue
  | BooleanValue
  | CompositeValue;

// Join Support (Unified Chain and _has)
export interface Join {
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

// Special Parameters
export interface ElementSelection {
  [field: string]: boolean | ElementSelection;
}

export interface IncludeExpression {
  direction: 'forward' | 'reverse';  // forward = _include, reverse = _revinclude
  source?: string;                   // Source resource type (optional for wildcards)
  param?: string | '*';          // Reference param or "*" for wildcard
  target?: string;                   // Optional target resource type constraint
  iterate?: boolean;                 // Apply recursively to included resources (standard)
  recurse?: boolean;                 // Alternative to iterate (Aidbox extension)
  logical?: boolean;                 // Include via logical references/identifiers (Aidbox)
  select?: string[] | ElementSelection;  // Elements to select from included resources
}

export interface SortParam {
  param: string;
  direction: 'asc' | 'desc';
}

// FHIR SearchParameter resource structure for enrichment
export interface SearchParameter {
  id?: string;
  url?: string;
  name: string;
  code: string;
  base: string[];
  type: 'number' | 'date' | 'string' | 'token' | 'reference' | 'composite' | 'quantity' | 'uri' | 'special';
  expression?: string;
  target?: string[];
  chain?: string[];
  component?: Array<{
    definition: string;
    expression: string;
  }>;
}

// Mapping from FHIR syntaxes to standard operator types
export const FHIRToStandardOperators: { [key: string]: string } = {
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

// Error handling
export class ParseError extends Error {
  constructor(
    message: string,
    public readonly text: string,
    public readonly position?: number
  ) {
    super(message);
    this.name = 'ParseError';
  }
}

export interface ParseResult<T> {
  success: boolean;
  data?: T;
  error?: ParseError;
}
