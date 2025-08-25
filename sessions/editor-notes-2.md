Why not use FHIRPath for everything?

If we introduce search-specific subset of FHIRPath, it is possible to express
everything using it. And since search parameters use FHIRPath, it would be
a unified way to search.

Api:
```
search(resource_type, base_expression, include_expression)
```

Forward chains are already here (resolve function).
It would be neccessary to create reverse resolve function.

`include_expression` semantically starts with all results from the base expression.
`iterate` could be exressed via the `repeat` function.
