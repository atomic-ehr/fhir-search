# Comments

> Modifiers are operators, not separate concepts

This is unclear. What is meant by "operators"?

> Flat expression arrays with implicit AND semantics

The `_filter` special parameter disagrees.

> Explicit separation of local filtering (where), forward chaining (chain), and reverse chaining (has)

I'm still not sure about this. Maybe non-chained search is a special case with 0-length chain.

> Pragmatic, SQL-like mental model

For parsing it would be too complex


```
interface SearchQuery {
...
>  where?: Expression[];        // Local resource filters (ANDed)
>  joins?: Join[];  // Both forward chains and reverse _has (INNER JOINs)
```
I don't like the choice of these names. I would prefer something more close to FHIR
and semantics like `filter` and `chains`.

```
> interface SearchExpression {
> ...
>  param: string | string[];  // string[] for nested paths like ["address", "city"]
```
???

```
> interface SearchExpression {
> ...
>  value: Value[];
```
It should account for composites too.

```
// Mapping from FHIR syntaxes to standard operators
const FHIRToStandardOperators = {
```
FHIR operator are more complex than that.
In normal search they are case-sensitive accent-insensitive;
In \_filter they are case-insensitive accent-sensitive.

```
> ### Join Support (Unified Chain and _has)
```
This is not very convenient: you need recursion to navigate chains.

# Discussion
I like the idea of SQL-inspired queries. I would want to have a single query engine
to work with search parameters, \_filter, GraphDefinition and GraphQL.

But I think it should work on a lower level: after all Search parameters are replaced with their
expressions and only something FHIRPath-like remains.

Imagine
```
SELECT resource & '{"status", "name"}'
FROM Patient p
WHERE EXISTS (
    SELECT resource
    FROM Organization o
    WHERE p.managingOrganization REFERS o
)
```

# Alternative?
I would use simpler structure for parsing which does not use any semantic information
and do semantic analysis and further transformations at the later stage.

```rust
mod search_query {
    /// Just split and URL-decode
	struct RawQuery {
		parameters: Vec<(String, Option<String>)>,
	}

	enum IncludeDirection {
		Forward,
		Reverse,
	}

	enum IncludeSpecifier {
		Everything,
		Resource {
			resource_type: String,
		},
		ResourceParameter {
			resource_type: String,
			parameter: String,
		},
		ResourceParameterTarget {
			resource_type: String,
			parameter: String,
			target_type: String,
		},
	}

	struct Include {
		iterate: bool,
		direction: IncludeDirection,
		specifier: IncludeSpecifier,
	}

	struct ForwardChainNode {
		target_type: Option<String>,
		parameter: String,
	}

	struct ReverseChainNode {
		source_type: Option<String>,
		parameter: String,
	}

	enum ChainNode {
		Forward(ForwardChainNode),
		Reverse(ReverseChainNode),
	}

	enum TokenValue {
		Code { code: String },
		SystemCode { system: String, code: String },
		OnlyCode { code: String },
		OnlySystem { system: String },
	}

	enum SearchParameterSingleValue {
		Token(TokenValue),
		Regular(String),
	}

	enum SearchParameterValue {
		Composite(Vec<SearchParameterSingleValue>),
		Normal(SearchParameterSingleValue),
	}

	struct SearchParameter {
		modifier: Option<String>,
		value: Option<Vec<SearchParameterValue>>,
	}

	struct Chain {
		nodes: Vec<ChainNode>,
		terminal: SearchParameter,
	}
}
```
