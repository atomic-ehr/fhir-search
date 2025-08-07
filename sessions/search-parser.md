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
  // select
  summary?: 'true' | 'false' | 'count' | 'data';
  elements?: string[];
  //
  where?: Expression[];        // Local resource filters (ANDed)

  // joins
  chain?: ChainExpression[];   // Forward reference chaining
  has?: HasExpression[];       // Reverse reference chaining (_has)

  // Special parameters
  includes?: IncludeExpression[];  // Unified includes (both _include and _revinclude)

  sort?: SortParam[];
  count?: number;
  offset?: number;

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

### Operators (Including Modifiers as Operators)
```typescript
type Operator =
  // Standard search operators
  | 'eq'        // equals (default)
  | 'ne'        // not equal
  | 'gt'        // greater than
  | 'lt'        // less than
  | 'ge'        // greater or equal
  | 'le'        // less or equal

  // String operators (formerly modifiers)
  | 'exact'     // exact match (case sensitive)
  | 'contains'  // substring match

  // Text search
  | 'text'      // search in human-readable text

  // Token operators
  | 'not'       // exclude this code
  | 'above'     // subsumes in hierarchy
  | 'below'     // subsumed by in hierarchy
  | 'in'        // in value set
  | 'not-in'    // not in value set

  // Special operators
  | 'missing'   // field exists (true) or not (false)

  // Additional filter operators
  | 'co'        // contains (same as 'contains')
  | 'sw'        // starts with
  | 'ew'        // ends with
  | 'ap'        // approximately
  | 'sa'        // starts after
  | 'eb'        // ends before
  | 'pr'        // present (exists)
  | 'po'        // period overlaps
  | 'ss'        // subsumes
  | 'sb'        // subsumed by
  | 're';       // references
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

### Chaining Support
```typescript
// Forward chaining - following references forward
interface ChainExpression {
  parameter: string;              // The reference parameter
  resourceType?: string;          // Optional type constraint (e.g., "Patient")
  chain?: ChainExpression;        // Nested chain for deep references (recursive)
  has?: HasExpression;            // Can have _has at any point in the chain
  where?: Expression[];           // Final filters at the end of the chain
}

// Reverse chaining - _has parameter
interface HasExpression {
  resourceType: string;           // The referencing resource type
  parameter: string;              // The reference parameter in that resource
  has?: HasExpression;            // Nested _has for deeper reverse chaining
  where?: Expression[];           // Final filters on the deepest resource
}
```

### Special Parameters
```typescript
// Unified Include parameters (handles both _include and _revinclude)
interface IncludeExpression {
  direction: 'forward' | 'reverse';  // forward = _include, reverse = _revinclude
  source?: string;                   // Source resource type (optional for wildcards)
  parameter?: string | '*';          // Reference parameter or "*" for wildcard
  target?: string;                   // Optional target resource type constraint
  iterate?: boolean;                 // Apply recursively to included resources
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
      operator: "eq",
      value: [{ type: "string", value: "John" }]
    },
    {
      param: "birthdate",
      operator: "ge",
      value: [{ type: "date", value: "2010-01-01", precision: "day" }]
    }
  ]
}
```

### Search with Modifiers (as Operators)
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
      operator: "exact",  // Modifier becomes operator
      spDefininition: {
        expression: "exact"
      },
      paramType: { type: "HumanName"}
      value: [{ type: "string", value: "John" }]
    },
    {
      param: "identifier",
      operator: "missing",
      value: [{ type: "boolean", value: false }]
    }
  ]
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
      operator: "eq",
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

AST:
```typescript
{
  resource: "Observation",
  where: [
    {
      param: "code",
      operator: "eq",
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
          operator: "eq",
          value: [{ type: "string", value: "John" }]
        }
      ]
    }
  ]
}
```

### Deep Chained Search
```
GET /Encounter?subject.organization.name=Acme
```

AST:
```typescript
{
  resource: "Encounter",
  chain: [
    {
      parameter: "subject",
      chain: {
        parameter: "organization",
        where: [
          {
            param: "name",
            operator: "eq",
            value: [{ type: "string", value: "Acme" }]
          }
        ]
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
          operator: "eq",
          value: [{ type: "string", value: "Joe" }]
        }
      ]
    },
    {
      parameter: "general-practitioner",
      where: [
        {
          param: "address-state",
          operator: "eq",
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

AST:
```typescript
{
  resource: "Patient",
  has: [
    {
      resourceType: "Observation",
      parameter: "patient",
      where: [
        {
          param: "code",
          operator: "eq",
          value: [{ type: "token", code: "1234-5" }]
        }
      ]
    }
  ]
}
```

### Nested Reverse Chaining
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
            operator: "eq",
            value: [{ type: "string", value: "MyUserId" }]
          }
        ]
      }
    }
  ]
}
```

### Chaining with _has
```
GET /Encounter?patient._has:Group:member:_id=102
```

AST:
```typescript
{
  resource: "Encounter",
  chain: [
    {
      parameter: "patient",
      has: {
        resourceType: "Group",
        parameter: "member",
        where: [
          {
            param: "_id",
            operator: "eq",
            value: [{ type: "string", value: "102" }]
          }
        ]
      }
    }
  ]
}
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
      operator: "eq",
      value: [{ type: "string", value: "John" }]
    },
    {
      param: "birthdate",
      operator: "eq",
      value: [
        { type: "date", value: "2010-01-01", precision: "day" },
        { type: "date", value: "2011-01-01", precision: "day" }
      ]
    }
  ]
}
```

### Filter Expression Integration
```
GET /Patient?_filter=name co "John" and birthdate ge 2010-01-01
```

AST:
```typescript
{
  resource: "Patient",
  filter: "name co \"John\" and birthdate ge 2010-01-01",
  // Optionally parse into where expressions:
  where: [
    {
      type: "and",
      expressions: [
        {
          param: "name",
          operator: "co",
          value: [{ type: "string", value: "John" }]
        },
        {
          param: "birthdate",
          operator: "ge",
          value: [{ type: "date", value: "2010-01-01", precision: "day" }]
        }
      ]
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

1. **Simplicity**: Flat structure with clear semantics
2. **SQL-like**: Maps naturally to database queries
3. **Unified Operators**: Modifiers and operators are the same concept
4. **Type Safety**: Strong typing for values and operators
5. **Extensibility**: Easy to add new operators or value types
6. **Performance**: Flat arrays are easier to optimize than deep trees
7. **Clarity**: Explicit separation of concerns (where/chain/has)

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
