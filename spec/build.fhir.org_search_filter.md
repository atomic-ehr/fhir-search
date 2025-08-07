Search\_filter - FHIR v6.0.0-ballot2                  

[![logo fhir](./assets/images/fhir-logo-www.png)](http://hl7.org/fhir)

**FHIR CI-Build**

[![visit the hl7 website](./assets/images/hl7-logo.png)](http://www.hl7.org)

[![Search CI-Build FHIR](./assets/images/search.png)](http://build.fhir.org/search-build.html)

[FHIR](index.html)

-   [Home](./index.html)
-   [Getting Started](./modules.html)
-   [Documentation](./documentation.html)
-   [Data Types](./datatypes.html)
-   [**_Resource Types_**](./resourcelist.html)
-   [Terminologies](./terminologies-systems.html)
-   [Artifacts](#)
    -   [Extensions](https://build.fhir.org/ig/HL7/fhir-extensions/extension-registry.html)
    -   [Operations](./operationslist.html)
    -   [Patterns](./patterns.html)
    -   [Profiles](./profilelist.html)
    -   [Search Parameters](./searchparameter-registry.html)
    
    -   [Artifact Registry ![icon](external.png)](http://registry.fhir.org) 
-   [Implementation Guides ![icon](external.png)](http://fhir.org/guides/registry) 

-    [![link](exchange.png) Exchange](exchange-module.html)
-   [RESTful API](http.html)
-   **\_filter Parameter**

This is the Continuous Integration Build of FHIR (will be incorrect/inconsistent at times).  
See the [Directory of published versions ![icon](external.png)](http://hl7.org/fhir/directory.html) 

### 3.2.3 \_filter Parameter[](search_filter.html#3.2.3 "link to here")

[FHIR Infrastructure ![icon](external.png)](http://www.hl7.org/Special/committees/fiwg/index.cfm) Work Group

[Maturity Level](versions.html#maturity): 2

[Standards Status](versions.html#std-process): [Trial Use](versions.html#std-process)

#### 3.2.3.1 Introduction[](search_filter.html#intro "link to here")

`_filter` is a parameter that can be used with the [Search Operation](search.html). Filter requests have access to the same set of search parameters that are available to the search operation in that resource context on the server (e.g., [standard parameters](search.html#standard), [parameters for each resource](search.html#parameters), etc.). The `_filter` parameter provides a syntax for expressing a set of query expressions on the underlying resources.

Examples of filters:

-   `Patient: name co "pet"` - all patients with the characters "pet" in a given or family name
-   `Patient: given eq "peter" and birthdate ge 2014-10-10` - all patients with a given name of peter, born on or after 10-Oct 2014
-   `Observation: code eq http://loinc.org|1234-5` - all observations with the LOINC code "1234-5"
-   `Observation: subject.name co "pet"` - all observations on a patient with the characters "pet" in a given or family name
-   `Observation: related[type eq "has-component"].target pr true` - all observations that have component observations (note: this uses one of the search parameters defined for this mechanism, see below)
-   `Observation: related[type eq has-component].target re Observation/4` - all observations that have Observation/v as a component
-   `Observation: subject.id eq 3425 and code-value-quantity eq code$loinc|12907-2,value$ge150|http://unitsofmeasure.org|mmol/L` - all observations for a particular patient that have a LOINC code of "12907-2" (Sodium \[Moles/volume\] in Red Blood Cells) AND a value greater than "150 mmol/L"
-   `Patient: given eq "peter" and birthdate ge 2014-10-10 and _has:Observation:patient:code eq http://loinc.org|1234-5` - all patients with a given name of peter, born on or after 10-Oct 2014 that have an observation referring to them with a LOINC code of 1234-5

The \_filter syntax has the following features:

-   A filter can be a logical one (x or x, or x and x, or not x).
-   A filter can contain other filters in a set of parentheses: "()".
-   A filter can be a test - path operation value, where operation is taken from the table below, and value is either a "true", "false", a JSON string, or a token (any sequence of non-whitespace characters, excluding ")" and "\]". Values are never case sensitive.
-   A 'path' is a name, with chained searches done by name.name etc.as per existing source. There can also be a filter: name\[filter\].name.
-   Reverse chaining is also allowed, using \_has:Resource:index1:index2 as the parameter
-   The name is one of the defined search parameters that are used with the other search mechanism, with some special exemptions defined below.

Note: The only difference between a "string" value and a "token" value is that a string can contain spaces and ')' and '\]'. There is otherwise no significant difference between them.

Formal grammar for the syntax:

filter        = paramExp / logExp / ("not") "(" filter ")"
logExp        = filter ("and" / "or" filter)+
paramExp      = paramValue SP compareOp SP compValue
compareOp     = (see table below)
compValue     = string / numberOrDate / token
string        = json string
token         = any sequence of non-whitespace characters (by Unicode rules) except "\]" and ")"
paramValue    = hasSpecifier / paramPath
hasSpecifier  = "\_has:" resource ":" index ":" index
resource      = ALPHA (DIGIT / ALPHA)\*
index         = nameCharStart (nameChar)\*
paramPath     = paramName (("\[" filter "\]") "." paramValue)
paramName     = nameCharStart (nameChar)\*
nameCharStart = "\_" / ALPHA
nameChar      = "\_" / "-" / DIGIT / ALPHA
numberOrDate  = DIGIT (DateChar)\*
dateChar      = DIGIT / "T" / "-" / "." / "+" / ":" / "Z"

Notes about using the syntax:

-   Logical expressions are evaluated left to right, with no precedence between "and" and "or". If there is ambiguity, use parentheses to be explicit.
-   The compareOp is always evaluated against the set of values produced by evaluating the param path.
-   The parameter names are those defined by the specification for search parameters, except for those defined below.
-   The date format is a standard XML (i.e. XSD) dateTime (including timezone).

#### 3.2.3.2 Operators[](search_filter.html#ops "link to here")

This table summarizes the comparison operations available:

Operation

Definition

eq

an item in the set has an equal value

ne

An item in the set has an unequal value

co

An item in the set contains this value

sw

An item in the set starts with this value

ew

An item in the set ends with this value

gt / lt / ge / le

A value in the set is (greater than, less than, greater or equal, less or equal) the given value

ap

A value in the set is approximately the same as this value.  
Note that the recommended value for the approximation is 10% of the stated value (or for a date, 10% of the gap between now and the date), but systems may choose other values where appropriate

sa

The value starts after the specified value

eb

The value ends before the specified value

pr

The set is empty or not (value is false or true)

po

True if a (implied) date period in the set overlaps with the implied period in the value

ss

True if the value subsumes a concept in the set

sb

True if the value is subsumed by a concept in the set

in

True if one of the concepts is in the nominated value set by URI, either a relative, literal or logical vs

ni

True if none of the concepts are in the nominated value set by URI, either a relative, literal or logical vs

re

True if one of the references in set points to the given URL

For detailed rules about the operators eq, ne, le, ge, lt, gt, sa, and eb see [Search Prefixes](search.html#prefix).

The interpretation of the operation depends on the type of the search parameter it is being evaluated against. This table contains those details:

Operation

String

Number

Date

Token

Reference

Quantity

eq

Character sequence is the same (case insensitive)

Number is the same incl same precision

Date is the same including same precision and timezone if provided

Token is the same, including namespace if specified (case insensitive)

n/a

Unit and value are the same

ne

(same)

Co

Character sequence matches somewhere (case insensitive)

An item in the set's implicit imprecision includes the stated value

An item in the set's implicit period includes the stated value

n/a

n/a

n/a?

sw

Character sequence matches from first digit (left most, when L->R) (case insensitive)

n/a

n/a

n/a

n/a

n/a

ew

Character sequence matches up to last digit (right most, when L->R) (case insensitive)

n/a

n/a

n/a

n/a

n/a

gt / lt / ge / le

Based on Integer comparison of Unicode code points of starting character (trimmed) (case insensitive)

Based on numerical comparison

Based on date period comparison per 2.2.2.3

n/a

n/a

Based on numerical comparison if units are the same (or are canonicalized)

pr

po

n/a

n/a

Based on date period comparison per 2.2.2.3

n/a

n/a

ss

n/a

n/a

n/a

Based on logical subsumption; potentially catering for mapping between tx

n/a

n/a

sb

n/a

n/a

n/a

Based on logical subsumption; potentially catering for mapping between tx

n/a

n/a

in

n/a

n/a

n/a

Based on logical subsumption; potentially catering for mapping between tx

n/a

n/a

re

n/a

n/a

n/a

n/a

Relative or absolute url

n/a

Note:

-   For token, the format is the same as the existing search parameter.
-   For convenience, the codes "loinc", "snomed", "rxnorm" and "ucum" are predefined and can be used in place of their associated full namespace.
-   The evaluation of composite search parameters is very complex; only the codes `eq` and `ne` are appropriate in this case

FHIR ®© HL7.org 2011+. FHIR R6 hl7.fhir.core#6.0.0-ballot2 generated on Wed, Jul 30, 2025 01:06+0000.  
Links: [Search ![icon](external.png)](http://hl7.org/fhir/search.cfm) | [Version History](history.html) | [Contents](toc.html) | [Glossary](help.html) | [QA](qa.html) | [Compare to R5 ![icon](external.png)](https://www5.aptest.com/standards/htmldiff/htmldiff.pl?oldfile=http%3A%2F%2Fhl7.org%2Ffhir%2FR5%2Fsearch_filter.html&newfile=http%3A%2F%2Fbuild.fhir.org%2Fsearch_filter.html) | [![CC0](cc0.png)](license.html) | [Propose a change ![icon](external.png)](https://jira.hl7.org/secure/CreateIssueDetails!init.jspa?pid=10405&issuetype=10600&customfield_11302=FHIR-core&customfield_11808=R5&customfield_10612=http://build.fhir.org/search_filter.html)