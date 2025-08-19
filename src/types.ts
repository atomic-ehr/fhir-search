// FHIR Search AST Types

// Standard operators using symbols
export type Operator =
  // Standard comparison operators (using symbols)
  | '='              // Equals
  | '!='             // Not equals
  | '>'              // Greater than
  | '<'              // Less than
  | '>='             // Greater than or equal
  | '<='             // Less than or equal
  | '~'              // Approximately equal
  
  // String matching operators
  | 'contains'       // Substring match (case insensitive)
  | 'starts-with'    // String starts with
  | 'ends-with'      // String ends with
  | 'exact'          // Exact string match (case sensitive)
  
  // Date/time operators
  | 'starts-after'   // Date/period starts after
  | 'ends-before'    // Date/period ends before
  | 'overlaps'       // Period overlaps
  
  // Existence operators
  | 'exists'         // Field/value exists
  | 'missing'        // Field/value does not exist
  
  // Text search operators
  | 'text'           // Full text search
  | 'match'          // Pattern matching
  
  // Set membership operators
  | 'in'             // Value in set/ValueSet
  | 'not-in'         // Value not in set/ValueSet
  
  // Hierarchy operators
  | 'subsumes'       // Concept subsumes (is parent of)
  | 'subsumed-by'    // Concept is subsumed by (is child of)
  
  // Reference operators
  | 'references'     // References a resource
  | 'identified-by'  // Match by identifier
  
  // Logical operator
  | 'not';           // Logical NOT

// Value types
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

// FHIR SearchParameter resource structure
export interface SearchParameter {
  id?: string;
  url?: string;
  name: string;                      // Human-readable name
  code: string;                      // Code used in search query
  base: string[];                    // Resource types this applies to
  type: 'number' | 'date' | 'string' | 'token' | 'reference' | 'composite' | 'quantity' | 'uri' | 'special';
  expression?: string;               // FHIRPath expression
  xpath?: string;                    // XPath expression (legacy)
  target?: string[];                 // For reference types - valid target resources
  multipleOr?: boolean;              // Can be used multiple times with OR semantics
  multipleAnd?: boolean;             // Can be used multiple times with AND semantics
  comparator?: string[];             // Allowed comparators (eq, ne, gt, lt, ge, le, sa, eb, ap)
  modifier?: string[];               // Allowed modifiers (missing, exact, contains, text, etc.)
  chain?: string[];                  // Allowed chained parameters (for reference types)
  component?: Array<{                // For composite parameters
    definition: string;              // Reference to component SearchParameter
    expression: string;              // FHIRPath for this component
  }>;
}

// Expression types
export interface SearchExpression {
  param: string | string[];  // string[] for nested paths like ["address", "city"]
  operator: Operator;
  value: Value[];
  
  // Enrichment: Full SearchParameter definition from ModelProvider
  searchParam?: SearchParameter;
}

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

export type Expression = 
  | SearchExpression
  | AndExpression
  | OrExpression
  | NotExpression;

// Join Support (Unified Chain and _has)
export interface Join {
  // Join target
  resource: string;                   // The resource type to join with
  
  // ON condition - how the join relates to parent
  on: {
    type: 'reference' | 'reverse-reference';
    parameter: string;               // The reference parameter
    // For 'reference': parent.parameter -> joined.id
    // For 'reverse-reference': joined.parameter -> parent.id
  };
  
  // Additional joins from this resource
  join?: Join[];                      // Nested joins from this table
  
  // WHERE conditions for this joined resource
  where?: Expression[];               // Filters on the joined resource
  
  // Enrichment: SearchParameter for the reference being joined on
  searchParam?: SearchParameter;
}

// Element selection (GraphQL-like nested structure)
export interface ElementSelection {
  [field: string]: boolean | ElementSelection;
}

// Include/Revinclude parameters
export interface IncludeExpression {
  direction: 'forward' | 'reverse';  // forward = _include, reverse = _revinclude
  source?: string;                   // Source resource type (optional for wildcards)
  parameter?: string | '*';          // Reference parameter or "*" for wildcard
  target?: string;                   // Optional target resource type constraint
  iterate?: boolean;                 // Apply recursively to included resources (standard)
  recurse?: boolean;                 // Alternative to iterate (Aidbox extension)
  logical?: boolean;                 // Include via logical references/identifiers (Aidbox)
  select?: string[] | ElementSelection;  // Elements to select from included resources
  includes?: IncludeExpression[];   // Nested includes on the included resources
}

export interface SortParam {
  parameter: string;
  direction: 'asc' | 'desc';
}

// Main search query structure
export interface SearchQuery {
  resource: string;
  
  // Selection
  summary?: 'true' | 'false' | 'count' | 'data';
  elements?: ElementSelection;
  
  // Filtering
  where?: Expression[];
  
  // Joins (unified chain and _has - these filter the result set)
  joins?: Join[];  // Both forward chains and reverse _has (INNER JOINs)
  
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

// Mapping from FHIR syntaxes to standard operators
export const FHIRToStandardOperators: { [key: string]: Operator } = {
  // Search parameter prefixes
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
  
  // Search parameter modifiers
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

// Parser-specific types
export interface ParseError {
  message: string;
  position?: number;
  parameter?: string;
  value?: string;
}

export interface ParseResult {
  query?: SearchQuery;
  errors?: ParseError[];
}