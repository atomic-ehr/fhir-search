# FHIR Search Parser AST Design

## Core Philosophy
- Modifiers are operators, not separate concepts
- Flat expression arrays with implicit AND semantics
- Explicit separation of local filtering (where), forward chaining (chain), and reverse chaining (has)
- All values are arrays to naturally support multi-value parameters
- Pragmatic, SQL-like mental model

## AST Structure

### Root Query Structure
```typescript
interface SearchQuery {
  resource: string;
  
  // Selection
  summary?: 'true' | 'false' | 'count' | 'data';
  elements?: ElementSelection;  // Nested structure for element selection
  
  // Filtering
  where?: Expression[];        // Local resource filters (ANDed)

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
```

### Expression Types
```typescript
// Base expression for search parameters
interface SearchExpression {
  param: string | string[];  // string[] for nested paths like ["address", "city"]
  operator: Operator;
  value: Value[];
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
  | SearchExpression
  | AndExpression
  | OrExpression
  | NotExpression;
```

### Standard Operators (Unified AST)
```typescript
type Operator =
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

// Mapping from FHIR syntaxes to standard operators
const FHIRToStandardOperators = {
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
  'eq': '=',
  'ne': '!=',
  'co': 'contains',
  'sw': 'starts-with',
  'ew': 'ends-with',
  'gt': '>',
  'lt': '<',
  'ge': '>=',
  'le': '<=',
  'ap': '~',
  'sa': 'starts-after',
  'eb': 'ends-before',
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

type Value =
  | StringValue
  | NumberValue
  | DateValue
  | TokenValue
  | ReferenceValue
  | QuantityValue
  | BooleanValue;
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
    parameter: string;               // The reference parameter
    // For 'reference': parent.parameter -> joined.id
    // For 'reverse-reference': joined.parameter -> parent.id
  };
  
  // Additional joins from this resource
  join?: Join[];                      // Nested joins from this table
  
  // WHERE conditions for this joined resource
  where?: Expression[];               // Filters on the joined resource
}

// Alternative: More explicit but still unified
interface ReferenceTraversalAlt {
  type: 'chain' | 'has';             // Explicit type instead of direction
  
  // For chain (forward)
  parameter?: string;                 // The reference parameter to follow
  targetType?: string;                // Optional type constraint (e.g., "Patient")
  
  // For has (reverse)  
  sourceType?: string;                // The referencing resource type (required for _has)
  referenceParam?: string;            // The reference parameter in that resource
  
  // Recursive traversal
  next?: ReferenceTraversalAlt;      // Next level (can be chain or has)
  
  // Final conditions
  where?: Expression[];               // Filters at this level
}
```

### Special Parameters
```typescript
// Element selection (GraphQL-like nested structure)
interface ElementSelection {
  [field: string]: boolean | ElementSelection;
}

// Alternative: More explicit structure
interface ElementSelectionAlt {
  fields?: string[];                          // Direct fields on this resource
  nested?: { [path: string]: ElementSelection };  // Nested selections
}

// Unified Include parameters (handles both _include and _revinclude)
interface IncludeExpression {
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

interface SortParam {
  parameter: string;
  direction: 'asc' | 'desc';
}
```

## Examples

### Simple Search
```
GET /Patient?name=John&birthdate=ge2010-01-01
```

AST:
```typescript
{
  resource: "Patient",
  where: [
    {
      param: "name",
      operator: "=",              // Default (no prefix) -> '='
      value: [{ type: "string", value: "John" }]
    },
    {
      param: "birthdate",
      operator: ">=",             // 'ge' prefix -> '>='
      value: [{ type: "date", value: "2010-01-01", precision: "day" }]
    }
  ]
}
```

### Search with Modifiers
```
GET /Patient?name:exact=John&identifier:missing=false
```

AST:
```typescript
{
  resource: "Patient",
  where: [
    {
      param: "name",
      operator: "exact",          // :exact modifier -> 'exact'
      value: [{ type: "string", value: "John" }]
    },
    {
      param: "identifier",
      operator: "exists",         // :missing=false -> 'exists'
      value: [{ type: "boolean", value: true }]
    }
  ]
}
```

### Search with Element Selection
```
GET /Patient?name=John&_elements=id,name,birthDate,address
```

AST (with nested structure):
```typescript
{
  resource: "Patient",
  where: [
    {
      param: "name",
      operator: "=",
      value: [{ type: "string", value: "John" }]
    }
  ],
  elements: {
    id: true,
    name: true,
    birthDate: true,
    address: true
  }
}
```

### OR Logic
```
GET /Patient?name=John,Jane
```

AST:
```typescript
{
  resource: "Patient",
  where: [
    {
      param: "name",
      operator: "=",
      value: [
        { type: "string", value: "John" },
        { type: "string", value: "Jane" }
      ]
    }
  ]
}
```

### Simple Chained Search
```
GET /Observation?subject:Patient.name=John&code=1234-5
```

AST (with SQL-like joins):
```typescript
{
  resource: "Observation",
  where: [
    {
      param: "code",
      operator: "=",
      value: [{ type: "token", code: "1234-5" }]
    }
  ],
  joins: [
    {
      resource: "Patient",
      on: {
        type: 'reference',
        parameter: "subject"  // Observation.subject -> Patient.id
      },
      where: [
        {
          param: "name",
          operator: "=",
          value: [{ type: "string", value: "John" }]
        }
      ]
    }
  ]
}

// Equivalent SQL:
// SELECT * FROM Observation
// INNER JOIN Patient ON Observation.subject_id = Patient.id
// WHERE Observation.code = '1234-5' AND Patient.name = 'John'
```

### Deep Chained Search (2 levels)
```
GET /Encounter?subject.organization.name=Acme
```

AST (with SQL-like joins):
```typescript
{
  resource: "Encounter",
  joins: [
    {
      resource: "Patient",
      on: {
        type: 'reference',
        parameter: "subject"  // Encounter.subject -> Patient.id
      },
      join: [
        {
          resource: "Organization",
          on: {
            type: 'reference',
            parameter: "organization"  // Patient.organization -> Organization.id
          },
          where: [
            {
              param: "name",
              operator: "=",
              value: [{ type: "string", value: "Acme" }]
            }
          ]
        }
      ]
    }
  ]
}

// Equivalent SQL:
// SELECT * FROM Encounter
// INNER JOIN Patient ON Encounter.subject_id = Patient.id
// INNER JOIN Organization ON Patient.organization_id = Organization.id
// WHERE Organization.name = 'Acme'
```

### Very Deep Chained Search (3 levels)
```
GET /Observation?subject.organization.partOf.name=HealthSystem
```

AST (with unified joins):
```typescript
{
  resource: "Observation",
  joins: [
    {
      direction: 'forward',
      parameter: "subject",  // Observation -> Patient
      join: {
        direction: 'forward',
        parameter: "organization",  // Patient -> Organization
        join: {
          direction: 'forward',
          parameter: "partOf",  // Organization -> parent Organization
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
}
```

### Deep Chain with Resource Type Constraints
```
GET /Observation?performer:Practitioner.organization:Organization.partOf:Organization.name=Regional
```

AST:
```typescript
{
  resource: "Observation",
  chain: [
    {
      parameter: "performer",
      resourceType: "Practitioner",  // Only follow if performer is Practitioner
      chain: {
        parameter: "organization",
        resourceType: "Organization",  // Explicit type (though redundant here)
        chain: {
          parameter: "partOf",
          resourceType: "Organization",  // Ensure partOf points to Organization
          where: [
            {
              param: "name",
              operator: "=",
              value: [{ type: "string", value: "Regional" }]
            }
          ]
        }
      }
    }
  ]
}
```

### Mixed Resource Types in Deep Chain
```
GET /Encounter?subject:Patient.generalPractitioner:Practitioner.organization.partOf.identifier=12345
```

AST:
```typescript
{
  resource: "Encounter",
  chain: [
    {
      parameter: "subject",
      resourceType: "Patient",  // Subject must be Patient (not Group)
      chain: {
        parameter: "generalPractitioner",
        resourceType: "Practitioner",  // GP must be Practitioner (not Organization)
        chain: {
          parameter: "organization",
          // No type constraint - organization is unambiguous
          chain: {
            parameter: "partOf",
            where: [
              {
                param: "identifier",
                operator: "=",
                value: [{ type: "token", value: "12345" }]
              }
            ]
          }
        }
      }
    }
  ]
}
```

### Multiple Independent Chains
```
GET /Patient?general-practitioner.name=Joe&general-practitioner.address-state=MN
```

AST:
```typescript
{
  resource: "Patient",
  chain: [
    {
      parameter: "general-practitioner",
      where: [
        {
          param: "name",
          operator: "=",
          value: [{ type: "string", value: "Joe" }]
        }
      ]
    },
    {
      parameter: "general-practitioner",
      where: [
        {
          param: "address-state",
          operator: "=",
          value: [{ type: "string", value: "MN" }]
        }
      ]
    }
  ]
}
```

### Simple Reverse Chaining (_has)
```
GET /Patient?_has:Observation:patient:code=1234-5
```

AST (with SQL-like joins):
```typescript
{
  resource: "Patient",
  joins: [
    {
      resource: "Observation",
      on: {
        type: 'reverse-reference',
        parameter: "patient"  // Observation.patient -> Patient.id
      },
      where: [
        {
          param: "code",
          operator: "=",
          value: [{ type: "token", code: "1234-5" }]
        }
      ]
    }
  ]
}

// Equivalent SQL:
// SELECT * FROM Patient
// INNER JOIN Observation ON Observation.patient_id = Patient.id
// WHERE Observation.code = '1234-5'
```

### Nested Reverse Chaining (2 levels)
```
GET /Patient?_has:Observation:patient:_has:AuditEvent:entity:agent=MyUserId
```

AST:
```typescript
{
  resource: "Patient",
  has: [
    {
      resourceType: "Observation",
      parameter: "patient",
      has: {
        resourceType: "AuditEvent",
        parameter: "entity",
        where: [
          {
            param: "agent",
            operator: "=",
            value: [{ type: "string", value: "MyUserId" }]
          }
        ]
      }
    }
  ]
}
```

### Deep Nested Reverse Chaining (3 levels)
```
GET /Organization?_has:Patient:organization:_has:Observation:patient:_has:DiagnosticReport:result:code=123
```

AST:
```typescript
{
  resource: "Organization",
  has: [
    {
      resourceType: "Patient",
      parameter: "organization",
      has: {
        resourceType: "Observation",
        parameter: "patient",
        has: {
          resourceType: "DiagnosticReport",
          parameter: "result",
          where: [
            {
              param: "code",
              operator: "=",
              value: [{ type: "token", code: "123" }]
            }
          ]
        }
      }
    }
  ]
}
```

### Mixed Chain and _has
```
GET /Encounter?patient._has:Group:member:_id=102
```

AST (with unified joins - mixing forward and reverse):
```typescript
{
  resource: "Encounter",
  joins: [
    {
      direction: 'forward',
      parameter: "patient",
      join: {
        direction: 'reverse',  // Switch to reverse at this level
        parameter: "member",
        resourceType: "Group",
        where: [
          {
            param: "_id",
            operator: "=",
            value: [{ type: "string", value: "102" }]
          }
        ]
      }
    }
  ]
}
```

### Complex Mixed Chain and _has
```
GET /Patient?organization.partOf.name=Regional&_has:Observation:patient:_has:DiagnosticReport:result:status=final
```

AST (with SQL-like joins):
```typescript
{
  resource: "Patient",
  joins: [
    {
      resource: "Organization",
      on: {
        type: 'reference',
        parameter: "organization"  // Patient.organization -> Organization.id
      },
      join: [
        {
          resource: "Organization",
          on: {
            type: 'reference',
            parameter: "partOf"  // org1.partOf -> org2.id
          },
          where: [
            {
              param: "name",
              operator: "=",
              value: [{ type: "string", value: "Regional" }]
            }
          ]
        }
      ]
    },
    {
      resource: "Observation",
      on: {
        type: 'reverse-reference',
        parameter: "patient"  // Observation.patient -> Patient.id
      },
      join: [
        {
          resource: "DiagnosticReport",
          on: {
            type: 'reverse-reference',
            parameter: "result"  // DiagnosticReport.result -> Observation.id
          },
          where: [
            {
              param: "status",
              operator: "=",
              value: [{ type: "token", code: "final" }]
            }
          ]
        }
      ]
    }
  ]
}

// Equivalent SQL:
// SELECT DISTINCT Patient.* FROM Patient
// INNER JOIN Organization org1 ON Patient.organization_id = org1.id
// INNER JOIN Organization org2 ON org1.partOf_id = org2.id
// INNER JOIN Observation ON Observation.patient_id = Patient.id
// INNER JOIN DiagnosticReport ON DiagnosticReport.result_id = Observation.id
// WHERE org2.name = 'Regional' AND DiagnosticReport.status = 'final'
```

### Complex Query with OR/AND
```
GET /Patient?name=John&(birthdate=2010-01-01,birthdate=2011-01-01)
```

AST:
```typescript
{
  resource: "Patient",
  where: [
    {
      param: "name",
      operator: "=",
      value: [{ type: "string", value: "John" }]
    },
    {
      param: "birthdate",
      operator: "=",
      value: [
        { type: "date", value: "2010-01-01", precision: "day" },
        { type: "date", value: "2011-01-01", precision: "day" }
      ]
    }
  ]
}
```

### Unified Operator Examples

#### Search parameters mapped to standard operators
```
GET /Patient?name:contains=John&birthdate=ge2010-01-01&age=lt65
```

AST:
```typescript
{
  resource: "Patient",
  where: [
    {
      param: "name",
      operator: "contains",       // :contains -> 'contains'
      value: [{ type: "string", value: "John" }]
    },
    {
      param: "birthdate",
      operator: ">=",             // 'ge' prefix -> '>='
      value: [{ type: "date", value: "2010-01-01", precision: "day" }]
    },
    {
      param: "age",
      operator: "<",              // 'lt' prefix -> '<'
      value: [{ type: "number", value: 65 }]
    }
  ]
}
```

#### _filter with same unified operators
```
GET /Patient?_filter=name co "John" and birthdate ge 2010-01-01 and age lt 65
```

AST (identical operators):
```typescript
{
  resource: "Patient",
  where: [
    {
      type: "and",
      expressions: [
        {
          param: "name",
          operator: "contains",   // 'co' -> 'contains'
          value: [{ type: "string", value: "John" }]
        },
        {
          param: "birthdate",
          operator: ">=",         // 'ge' -> '>='
          value: [{ type: "date", value: "2010-01-01", precision: "day" }]
        },
        {
          param: "age",
          operator: "<",          // 'lt' -> '<'
          value: [{ type: "number", value: 65 }]
        }
      ]
    }
  ]
}
```

#### Complex search with various operators
```
GET /Patient?name:exact=John&code:in=http://example.org/valueset&birthdate=ap2010&score=gt0.8
```

AST:
```typescript
{
  resource: "Patient",
  where: [
    {
      param: "name",
      operator: "exact",          // :exact -> 'exact'
      value: [{ type: "string", value: "John" }]
    },
    {
      param: "code",
      operator: "in",             // :in -> 'in'
      value: [{ type: "string", value: "http://example.org/valueset" }]
    },
    {
      param: "birthdate",
      operator: "~",              // 'ap' prefix -> '~' (approximately)
      value: [{ type: "date", value: "2010", precision: "year" }]
    },
    {
      param: "score",
      operator: ">",              // 'gt' prefix -> '>'
      value: [{ type: "number", value: 0.8 }]
    }
  ]
}
```

### Include Examples (Unified)

#### Simple _include (forward reference)
```
GET /MedicationRequest?_include=MedicationRequest:requester
```

AST:
```typescript
{
  resource: "MedicationRequest",
  includes: [
    {
      direction: 'forward',
      source: 'MedicationRequest',
      parameter: 'requester'
    }
  ]
}
```

#### _revinclude (reverse reference)
```
GET /Patient?_revinclude=Observation:subject
```

AST:
```typescript
{
  resource: "Patient",
  includes: [
    {
      direction: 'reverse',
      source: 'Observation',
      parameter: 'subject'
    }
  ]
}
```

#### Wildcard _include
```
GET /Patient?_include=*
```

AST:
```typescript
{
  resource: "Patient",
  includes: [
    {
      direction: 'forward',
      parameter: '*'  // Wildcard - all references
    }
  ]
}
```

#### Resource-specific wildcard
```
GET /Encounter?_include=Encounter:*
```

AST:
```typescript
{
  resource: "Encounter",
  includes: [
    {
      direction: 'forward',
      source: 'Encounter',
      parameter: '*'  // All references from Encounter
    }
  ]
}
```

#### Include with target type constraint
```
GET /Observation?_include=Observation:subject:Patient
```

AST:
```typescript
{
  resource: "Observation",
  includes: [
    {
      direction: 'forward',
      source: 'Observation',
      parameter: 'subject',
      target: 'Patient'  // Only include if target is Patient
    }
  ]
}
```

#### Nested includes (chained inclusion)
```
GET /Observation?_include=Observation:subject&_include=Patient:organization
```

AST:
```typescript
{
  resource: "Observation",
  includes: [
    {
      direction: 'forward',
      source: 'Observation',
      parameter: 'subject',
      includes: [  // Nested include on the included Patients
        {
          direction: 'forward',
          source: 'Patient',
          parameter: 'organization'
        }
      ]
    }
  ]
}
```

#### Complex nested includes
```
GET /Observation?_include=Observation:subject&_include=Patient:organization&_include=Organization:partOf
```

AST:
```typescript
{
  resource: "Observation",
  includes: [
    {
      direction: 'forward',
      source: 'Observation',
      parameter: 'subject',
      includes: [  // On included Patients
        {
          direction: 'forward',
          source: 'Patient',
          parameter: 'organization',
          includes: [  // On included Organizations
            {
              direction: 'forward',
              source: 'Organization',
              parameter: 'partOf'
            }
          ]
        }
      ]
    }
  ]
}
```

#### Iterate modifier for recursive includes
```
GET /Observation?_include:iterate=Observation:has-member
```

AST:
```typescript
{
  resource: "Observation",
  includes: [
    {
      direction: 'forward',
      source: 'Observation',
      parameter: 'has-member',
      iterate: true  // Recursively follow has-member on included Observations
    }
  ]
}
```

#### Complex nested with iterate
```
GET /MedicationRequest?_include=MedicationRequest:requester&_include:iterate=Practitioner:organization&_include=Organization:partOf
```

AST:
```typescript
{
  resource: "MedicationRequest",
  includes: [
    {
      direction: 'forward',
      source: 'MedicationRequest',
      parameter: 'requester',
      includes: [
        {
          direction: 'forward',
          source: 'Practitioner',
          parameter: 'organization',
          iterate: true,  // Keep following organization refs on any included Organizations
          includes: [
            {
              direction: 'forward',
              source: 'Organization',
              parameter: 'partOf'
            }
          ]
        }
      ]
    }
  ]
}
```

#### Mixed forward and reverse includes with nesting
```
GET /Patient?_include=Patient:organization&_include=Organization:partOf&_revinclude=Observation:subject&_include=Observation:performer
```

AST:
```typescript
{
  resource: "Patient",
  includes: [
    {
      direction: 'forward',
      source: 'Patient',
      parameter: 'organization',
      includes: [
        {
          direction: 'forward',
          source: 'Organization',
          parameter: 'partOf'
        }
      ]
    },
    {
      direction: 'reverse',
      source: 'Observation',
      parameter: 'subject',
      includes: [  // On the Observations that reference the Patient
        {
          direction: 'forward',
          source: 'Observation',
          parameter: 'performer'
        }
      ]
    }
  ]
}
```

#### Logical reference includes (Aidbox extension)
```
GET /Encounter?_include:logical=Encounter:patient
```

AST:
```typescript
{
  resource: "Encounter",
  includes: [
    {
      direction: 'forward',
      source: 'Encounter',
      parameter: 'patient',
      logical: true  // Include via identifier match, not just direct reference
    }
  ]
}
```

#### Recurse modifier (Aidbox alternative to iterate)
```
GET /Organization?_include:recurse=Organization:partOf
```

AST:
```typescript
{
  resource: "Organization",
  includes: [
    {
      direction: 'forward',
      source: 'Organization',
      parameter: 'partOf',
      recurse: true  // Aidbox's recurse modifier (similar to iterate)
    }
  ]
}
```

#### Elements filtering with nested structure (GraphQL-like)
```
GET /Encounter?_include=Encounter:patient&_elements=id,status,Patient.name,Patient.birthDate
```

AST (with nested element selection):
```typescript
{
  resource: "Encounter",
  elements: {
    id: true,
    status: true
  },
  includes: [
    {
      direction: 'forward',
      source: 'Encounter',
      parameter: 'patient',
      select: {
        name: true,
        birthDate: true
      }
    }
  ]
}
```

#### Alternative: Elements as simple arrays per resource
```
GET /Encounter?_include=Encounter:patient:Organization&_elements=id,status,class
```

AST (with array-based selection):
```typescript
{
  resource: "Encounter",
  elements: {
    fields: ['id', 'status', 'class']
  },
  includes: [
    {
      direction: 'forward',
      source: 'Encounter',
      parameter: 'patient',
      target: 'Organization',
      select: ['name', 'identifier', 'address']  // Can be array or nested object
    }
  ]
}
```

#### Elements with resource type prefixes
```
GET /Patient?_include=Patient:organization&_elements=id,name,Organization.name,Organization.identifier
```

AST (corrected - _elements is flat list, but can be structured in AST):
```typescript
{
  resource: "Patient",
  elements: {
    id: true,
    name: true
  },
  includes: [
    {
      direction: 'forward',
      source: 'Patient',
      parameter: 'organization',
      select: {
        name: true,
        identifier: true
      }
    }
  ]
}
```

Note: The FHIR spec uses flat comma-separated lists for _elements (including resource-prefixed paths like "Organization.name"). 
The AST can represent this as a nested structure for easier processing, but the input syntax is flat.

#### Include with :iterate modifier (recursive)
```
GET /MedicationDispense?_include=MedicationDispense:prescription&_include:iterate=MedicationRequest:requester
```

AST:
```typescript
{
  resource: "MedicationDispense",
  includes: [
    {
      direction: 'forward',
      source: 'MedicationDispense',
      parameter: 'prescription'
    },
    {
      direction: 'forward',
      source: 'MedicationRequest',
      parameter: 'requester',
      iterate: true  // Apply to included resources recursively
    }
  ]
}
```

#### Mixed includes and revincludes (unified)
```
GET /Patient?_include=Patient:organization&_include=Patient:general-practitioner&_revinclude=Observation:subject
```

AST:
```typescript
{
  resource: "Patient",
  includes: [
    {
      direction: 'forward',
      source: 'Patient',
      parameter: 'organization'
    },
    {
      direction: 'forward',
      source: 'Patient',
      parameter: 'general-practitioner'
    },
    {
      direction: 'reverse',
      source: 'Observation',
      parameter: 'subject'
    }
  ]
}
```

## Benefits of This Design

1. **Simplicity**: Flat structure with clear semantics for filters, nested for selections
2. **SQL-like**: Maps naturally to database queries
3. **Unified Operators**: Modifiers and operators are the same concept
4. **Unified Joins**: Chain and _has unified as bidirectional joins (INNER JOINs)
5. **Unified Eager Loading**: _include and _revinclude share the same structure for eager loading
6. **Type Safety**: Strong typing for values and operators
7. **Extensibility**: Easy to add new operators or value types
8. **Performance**: Flat arrays are easier to optimize than deep trees
9. **Clarity**: Three unified concepts - filtering (where), joins (chain/_has), and eager loading (includes)
10. **GraphQL-like Selection**: Nested element selection matches modern API patterns
11. **Flexible Joins**: Can mix forward and reverse joins at any level

## Implementation Notes

### Parser Architecture
```typescript
class FHIRSearchParser {
  parse(url: string): SearchQuery {
    // 1. Parse URL and extract query parameters
    // 2. Identify resource type from path
    // 3. Categorize parameters (standard vs special)
    // 4. Parse each parameter into expressions
    // 5. Handle chaining and _has parameters
    // 6. Return structured AST
  }

  parseParameter(name: string, value: string): Expression {
    // 1. Detect operator/modifier from parameter name
    // 2. Parse value based on parameter type
    // 3. Handle comma-separated values (OR)
    // 4. Return appropriate expression
  }

  parseFilter(filter: string): Expression[] {
    // Parse _filter syntax into expressions
    // Can reuse the same Expression types
  }
}
```

### LSP Integration Points
```typescript
interface SearchLSPProvider {
  // Validate AST against SearchParameter definitions
  validate(ast: SearchQuery): Diagnostic[];

  // Suggest completions based on cursor position
  complete(ast: SearchQuery, position: Position): CompletionItem[];

  // Show parameter documentation on hover
  hover(ast: SearchQuery, position: Position): Hover;

  // Navigate to SearchParameter definition
  definition(ast: SearchQuery, position: Position): Location;
}


let pts = PatientSearch
 .id.in([1, 2, 3])
 .name.eq('John').select(['els'])
 .include((i)=> i.generalPractitioner)
 .select(['id', 'name']).fetch()

```

## Next Steps

1. Implement tokenizer for URL query strings
2. Build parser to generate AST
3. Create validator using SearchParameter definitions
4. Implement AST to SQL/MongoDB query transformer
5. Build LSP server with completion and validation
6. Create tests for all FHIR search scenarios
