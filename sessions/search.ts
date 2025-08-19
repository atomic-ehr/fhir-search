// FHIR Search AST Types (from search-parser.md)

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

export type Value = 
  | StringValue
  | NumberValue
  | DateValue
  | TokenValue
  | ReferenceValue
  | QuantityValue
  | BooleanValue;

// Expression types
export interface SearchExpression {
  param: string | string[];  // string[] for nested paths like ["address", "city"]
  operator: Operator;
  value: Value[];
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

// Chaining support
export interface ChainExpression {
  parameter: string;              // The reference parameter
  resourceType?: string;          // Optional type constraint (e.g., "Patient")
  chain?: ChainExpression;        // Nested chain for deep references (recursive)
  has?: HasExpression;            // Can have _has at any point in the chain
  where?: Expression[];           // Final filters at the end of the chain
}

export interface HasExpression {
  resourceType: string;           // The referencing resource type
  parameter: string;              // The reference parameter in that resource
  has?: HasExpression;            // Nested _has for deeper reverse chaining
  where?: Expression[];           // Final filters on the deepest resource
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
  
  // Joins
  chain?: ChainExpression[];
  has?: HasExpression[];
  
  // Include/Revinclude
  includes?: IncludeExpression[];
  
  // Result control
  sort?: SortParam[];
  count?: number;
  offset?: number;
  
  // Container control
  contained?: 'true' | 'false' | 'both';
  containedType?: 'container' | 'contained';
}

// Example usage with new types
const simpleSearch: SearchQuery = {
  resource: "Patient",
  where: [
    {
      param: "name",
      operator: "=",
      value: [{ type: "string", value: "John" }]
    },
    {
      param: "birthdate",
      operator: ">=",
      value: [{ type: "date", value: "2010-01-01", precision: "day" }]
    }
  ]
};

const chainedSearch: SearchQuery = {
  resource: "Observation",
  where: [
    {
      param: "code",
      operator: "=",
      value: [{ type: "token", code: "1234-5" }]
    }
  ],
  chain: [
    {
      parameter: "subject",
      resourceType: "Patient",
      where: [
        {
          param: "name",
          operator: "=",
          value: [{ type: "string", value: "John" }]
        }
      ]
    }
  ]
};

const deepChainSearch: SearchQuery = {
  resource: "Observation",
  chain: [
    {
      parameter: "subject",
      chain: {
        parameter: "organization",
        chain: {
          parameter: "partOf",
          where: [
            {
              param: "name",
              operator: "=",
              value: [{ type: "string", value: "HealthSystem" }]
            }
          ]
        }
      }
    }
  ]
};

const hasSearch: SearchQuery = {
  resource: "Patient",
  has: [
    {
      resourceType: "Observation",
      parameter: "patient",
      where: [
        {
          param: "code",
          operator: "=",
          value: [{ type: "token", code: "1234-5" }]
        }
      ]
    }
  ]
};

const includeSearch: SearchQuery = {
  resource: "MedicationRequest",
  elements: {
    id: true,
    status: true,
    medication: true
  },
  includes: [
    {
      direction: 'forward',
      source: 'MedicationRequest',
      parameter: 'requester',
      select: {
        name: true,
        identifier: true
      },
      includes: [
        {
          direction: 'forward',
          source: 'Practitioner',
          parameter: 'organization',
          iterate: true,
          select: {
            name: true,
            partOf: true
          }
        }
      ]
    }
  ]
};

const complexSearch: SearchQuery = {
  resource: "Patient",
  where: [
    {
      type: 'and',
      expressions: [
        {
          param: "name",
          operator: "contains",
          value: [{ type: "string", value: "John" }]
        },
        {
          type: 'or',
          expressions: [
            {
              param: "birthdate",
              operator: ">=",
              value: [{ type: "date", value: "2010-01-01", precision: "day" }]
            },
            {
              param: "age",
              operator: "<",
              value: [{ type: "number", value: 65 }]
            }
          ]
        }
      ]
    }
  ],
  sort: [
    { parameter: "name", direction: "asc" },
    { parameter: "birthdate", direction: "desc" }
  ],
  count: 20,
  offset: 40
};

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