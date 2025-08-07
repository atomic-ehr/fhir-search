SearchParameter - FHIR v6.0.0-ballot2                  

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

-    [![link](conformance.jpg) Conformance](conformance-module.html)
-   **SearchParameter**

This is the Continuous Integration Build of FHIR (will be incorrect/inconsistent at times).  
See the [Directory of published versions ![icon](external.png)](http://hl7.org/fhir/directory.html) 

-   [Content](#)
-   [Examples](searchparameter-examples.html)
-   [Detailed Descriptions](searchparameter-definitions.html)
-   [Mappings](searchparameter-mappings.html)
-   [Operations](searchparameter-operations.html)
-   [Search Params](searchparameter-search.html)
-   [Profiles](searchparameter-profiles.html)
-   [Extensions](https://build.fhir.org/ig/HL7/fhir-extensions/extensions-SearchParameter.html)

# 5.6 Resource SearchParameter - Content[](searchparameter.html#5.6 "link to here")

[FHIR Infrastructure ![icon](external.png)](http://www.hl7.org/Special/committees/fiwg/index.cfm) Work Group

[Maturity Level](versions.html#maturity): 5

 [Trial Use](versions.html#std-process "Standard Status")

[Security Category](security.html#SecPrivConsiderations): Anonymous

[Compartments](compartmentdefinition.html): No defined compartments

A search parameter that defines a named search item that can be used to search/filter on a resource.

## 5.6.1 Scope and Usage[](searchparameter.html#scope "link to here")

A `SearchParameter` resource specifies a search parameter that may be used on the RESTful API to search or filter on a resource. The SearchParameter resource declares:

-   how to typically refer to the search parameter from a client ([SearchParameter.code](searchparameter-definitions.html#SearchParameter.code))
-   how the search parameter is to be understood by the server
-   where in the source resource the parameter matches

## 5.6.2 Boundaries and Relationships[](searchparameter.html#bnr "link to here")

-   Search Parameters are referred to by [CapabilityStatement](capabilitystatement.html) resources via the canonical URL for a search parameter ([CapabilityStatement.rest.resource.searchParam.definition](capabilitystatement-definitions.html#CapabilityStatement.rest.resource.searchParam.definition))
-   Search Parameters can appear in an [Implementation Guide](implementationguide.html) to specify how resources can be found

## 5.6.3 Background and Context[](searchparameter.html#bnc "link to here")

Implementers should be familiar with the background and concepts described in [Search](search.html) on the RESTful API before working with this resource.

There is a [registry of all Search Parameters](searchparameter-registry.html).

## 5.6.4 References to this Resource[](searchparameter.html#5.6.4 "link to here")

-   Resource References: [CapabilityStatement](capabilitystatement.html#CapabilityStatement), itself and [TestPlan](testplan.html#TestPlan)

## 5.6.5 Resource Content[](searchparameter.html#resource "link to here")

-   [Structure](#tabs-struc)
-   [UML](#tabs-uml)
-   [XML](#tabs-xml)
-   [JSON](#tabs-json)
-   [Turtle](#tabs-ttl)
-   [R4 Diff](#tabs-diff)
-   [All](#tabs-all)

**Structure**

[Name](https://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#table-views "The logical name of the element")

[Flags](https://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#table-views "Information about the use of the element")

[Card.](https://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#table-views "Minimum and Maximum # of times the element can appear in the instance")

[Type](https://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#table-views "Reference to the type of the element")

[Description & Constraints](https://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#table-views "Additional information about the element")[![doco](help16.png)](https://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#table-views "Legend for this format")

![.](tbl_spacer.png)![.](icon_resource.png "Resource") [SearchParameter](searchparameter-definitions.html#SearchParameter "SearchParameter : A search parameter that defines a named search item that can be used to search/filter on a resource.")

[TU](versions.html#std-process "Standards Status = Trial Use")

[DomainResource](domainresource.html)

Search parameter for a resource  
\+ Warning: Name should be usable as an identifier for the module by machine processing applications such as code generation  
\+ Rule: If an expression is present, there SHALL be a processingMode  
\+ Rule: Search parameters can only have chain names when the search parameter type is 'reference'  
\+ Rule: Search parameters comparator can only be used on type 'number', 'date', 'quantity' or 'special'.  
  
Elements defined in Ancestors: [id](resource.html#Resource "The logical id of the resource, as used in the URL for the resource. Once assigned, this value never changes."), [meta](resource.html#Resource "The metadata about the resource. This is content that is maintained by the infrastructure. Changes to the content might not always be associated with version changes to the resource."), [implicitRules](resource.html#Resource "A reference to a set of rules that were followed when the resource was constructed, and which must be understood when processing the content. Often, this is a reference to an implementation guide that defines the special rules along with other profiles etc."), [language](resource.html#Resource "The base language in which the resource is written."), [text](domainresource.html#DomainResource "A human-readable narrative that contains a summary of the resource and can be used to represent the content of the resource to a human. The narrative need not encode all the structured data, but is required to contain sufficient detail to make it \"clinically safe\" for a human to just read the narrative. Resource definitions may define what content should be represented in the narrative to ensure clinical safety."), [contained](domainresource.html#DomainResource "These resources do not have an independent existence apart from the resource that contains them - they cannot be identified independently, nor can they have their own independent transaction scope. This is allowed to be a Parameters resource if and only if it is referenced by a resource that provides context/meaning."), [extension](domainresource.html#DomainResource "May be used to represent additional information that is not part of the basic definition of the resource. To make the use of extensions safe and managable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension."), [modifierExtension](domainresource.html#DomainResource "May be used to represent additional information that is not part of the basic definition of the resource and that modifies the understanding of the element that contains it and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and managable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer is allowed to define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.
Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself).")  
Interfaces Implemented: [CanonicalResource](canonicalresource.html#CanonicalResource "Common Interface declaration for conformance and knowledge artifact resources.")

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [url](searchparameter-definitions.html#SearchParameter.url "SearchParameter.url : An absolute URI that is used to identify this search parameter when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which an authoritative instance of this search parameter is (or will be) published. This URL can be the target of a canonical reference. It SHALL remain the same when the search parameter is stored on different servers.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")[C](conformance-rules.html#constraints "This element has or is affected by some invariants")

1..1

[uri](datatypes.html#uri)

Canonical identifier for this search parameter, represented as a URI (globally unique)  
\+ Warning: URL should not contain | or # - these characters make processing canonical references problematic  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_datatype.gif "Data Type") [identifier](searchparameter-definitions.html#SearchParameter.identifier "SearchParameter.identifier : A formal identifier that is used to identify this search parameter when it is represented in other formats, or referenced in a specification, model, design or an instance.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

0..\*

[Identifier](datatypes.html#Identifier)

Additional identifier for the search parameter (business identifier)  
  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [version](searchparameter-definitions.html#SearchParameter.version "SearchParameter.version : The identifier that is used to identify this version of the search parameter when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the search parameter author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequence.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

0..1

[string](datatypes.html#string)

Business version of the search parameter  

![.](tbl_spacer.png)![.](tbl_vjoin-open.png)![.](icon_choice.gif "Choice of Types") [versionAlgorithm\[x\]](searchparameter-definitions.html#SearchParameter.versionAlgorithm_x_ "SearchParameter.versionAlgorithm[x] : Indicates the mechanism used to compare versions to determine which is more current.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

0..1

How to compare versions  
Binding: [Version Algorithm](valueset-version-algorithm.html) ([Extensible](terminologies.html#extensible "To be conformant, the concept in this element SHALL be from the specified value set if any of the codes within the value set can apply to the concept being communicated.  If the value set does not cover the concept (based on human review), alternate codings (or, data type allowing, text) may be included instead."))  

![.](tbl_spacer.png)![.](tbl_vline.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") versionAlgorithmString

[string](datatypes.html#string)

![.](tbl_spacer.png)![.](tbl_vline.png)![.](tbl_vjoin_end.png)![.](icon_datatype.gif "Data Type") versionAlgorithmCoding

[Coding](datatypes.html#Coding)

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [name](searchparameter-definitions.html#SearchParameter.name "SearchParameter.name : A natural language name identifying the search parameter. This name should be usable as an identifier for the module by machine processing applications such as code generation.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")[C](conformance-rules.html#constraints "This element has or is affected by some invariants")

1..1

[string](datatypes.html#string)

Name for this search parameter (computer friendly)  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [title](searchparameter-definitions.html#SearchParameter.title "SearchParameter.title : A short, descriptive, user-friendly title for the search parameter.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")[T](languages.html#translatable "This element is a candidate for being translated")

0..1

[string](datatypes.html#string)

Name for this search parameter (human friendly)  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_reference.png "Reference to another Resource") [derivedFrom](searchparameter-definitions.html#SearchParameter.derivedFrom "SearchParameter.derivedFrom : Where this search parameter is originally defined. If a derivedFrom is provided, then the details in the search parameter must be consistent with the definition from which it is defined. i.e. the parameter should have the same meaning, and (usually) the functionality should be a proper subset of the underlying search parameter.")

0..1

[canonical](datatypes.html#canonical)([SearchParameter](searchparameter.html))

Original definition for the search parameter  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [status](searchparameter-definitions.html#SearchParameter.status "SearchParameter.status : The status of this search parameter. Enables tracking the life-cycle of the content.")

[?!](conformance-rules.html#isModifier "This element is a modifier element")[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

1..1

[code](datatypes.html#code)

draft | active | retired | unknown  
Binding: [PublicationStatus](valueset-publication-status.html) ([Required](terminologies.html#required "To be conformant, the concept in this element SHALL be from the specified value set."))  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [experimental](searchparameter-definitions.html#SearchParameter.experimental "SearchParameter.experimental : A Boolean value to indicate that this search parameter is authored for testing purposes (or education/evaluation/marketing) and no version of this resource will ever be intended for genuine usage.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

0..1

[boolean](datatypes.html#boolean)

For testing only - never for real usage  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [date](searchparameter-definitions.html#SearchParameter.date "SearchParameter.date : The date  (and optionally time) when the search parameter was last significantly changed. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the search parameter changes.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

0..1

[dateTime](datatypes.html#dateTime)

Date last changed  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [publisher](searchparameter-definitions.html#SearchParameter.publisher "SearchParameter.publisher : The name of the organization or individual tresponsible for the release and ongoing maintenance of the search parameter.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")[T](languages.html#translatable "This element is a candidate for being translated")

0..1

[string](datatypes.html#string)

Name of the publisher/steward (organization or individual)  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_datatype.gif "Data Type") [contact](searchparameter-definitions.html#SearchParameter.contact "SearchParameter.contact : Contact details to assist a user in finding and communicating with the publisher.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

0..\*

[ContactDetail](metadatatypes.html#ContactDetail)

Contact details for the publisher  
  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [description](searchparameter-definitions.html#SearchParameter.description "SearchParameter.description : And how it used.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")[T](languages.html#translatable "This element is a candidate for being translated")

1..1

[markdown](datatypes.html#markdown)

Natural language description of the search parameter  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_datatype.gif "Data Type") [useContext](searchparameter-definitions.html#SearchParameter.useContext "SearchParameter.useContext : The content was developed with a focus and intent of supporting the contexts that are listed. These contexts may be general categories (gender, age, ...) or may be references to specific programs (insurance plans, studies, ...) and may be used to assist with indexing and searching for appropriate search parameter instances.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

0..\*

[UsageContext](metadatatypes.html#UsageContext)

The context that the content is intended to support  
  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_datatype.gif "Data Type") [jurisdiction](searchparameter-definitions.html#SearchParameter.jurisdiction "SearchParameter.jurisdiction : A legal or geographic region in which the search parameter is intended to be used.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")[XD](versions.html#std-process "Standards Status = Deprecated")

0..\*

[CodeableConcept](datatypes.html#CodeableConcept)

Intended jurisdiction for search parameter (if applicable)  
Binding: [Jurisdiction ValueSet](valueset-jurisdiction.html) ([Extensible](terminologies.html#extensible "To be conformant, the concept in this element SHALL be from the specified value set if any of the codes within the value set can apply to the concept being communicated.  If the value set does not cover the concept (based on human review), alternate codings (or, data type allowing, text) may be included instead."))  
  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [purpose](searchparameter-definitions.html#SearchParameter.purpose "SearchParameter.purpose : Explanation of why this search parameter is needed and why it has been designed as it has.")

[T](languages.html#translatable "This element is a candidate for being translated")

0..1

[markdown](datatypes.html#markdown)

Why this search parameter is defined  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [copyright](searchparameter-definitions.html#SearchParameter.copyright "SearchParameter.copyright : A copyright statement relating to the search parameter and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the search parameter.")

[T](languages.html#translatable "This element is a candidate for being translated")

0..1

[markdown](datatypes.html#markdown)

Use and/or publishing restrictions  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [copyrightLabel](searchparameter-definitions.html#SearchParameter.copyrightLabel "SearchParameter.copyrightLabel : A short string (<50 characters), suitable for inclusion in a page footer that identifies the copyright holder, effective period, and optionally whether rights are resctricted. (e.g. 'All rights reserved', 'Some rights reserved').")

[T](languages.html#translatable "This element is a candidate for being translated")

0..1

[string](datatypes.html#string)

Copyright holder and year(s)  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [code](searchparameter-definitions.html#SearchParameter.code "SearchParameter.code : The label that is recommended to be used in the URL or the parameter name in a parameters resource for this search parameter.  In some cases, servers may need to use a different CapabilityStatement searchParam.name to differentiate between multiple SearchParameters that happen to have the same code.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

1..1

[code](datatypes.html#code)

Recommended name for parameter in search url  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [aliasCode](searchparameter-definitions.html#SearchParameter.aliasCode "SearchParameter.aliasCode : Additional label that are recommended to be used in the URL or the parameter name in a parameters resource for this search parameter. Typically used to provide backwards-compatibility for renamed search parameters and translations into localized languages.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

0..\*

[code](datatypes.html#code)

Additional recommended names for parameter in search url  
  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [base](searchparameter-definitions.html#SearchParameter.base "SearchParameter.base : The base resource type(s) that this search parameter can be used against.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

1..\*

[code](datatypes.html#code)

The resource type(s) this search parameter applies to  
Binding: [Version Independent Resource Types (All)](valueset-version-independent-all-resource-types.html) ([Required](terminologies.html#required "To be conformant, the concept in this element SHALL be from the specified value set."))

**Additional Bindings**

Purpose

[All Resource Types](valueset-all-resource-types.html)

[UI Binding](valueset-additional-binding-purpose.html#additional-binding-purpose-ui "This value set is provided to user look up in a given context")

  
  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [type](searchparameter-definitions.html#SearchParameter.type "SearchParameter.type : The type of value that a search parameter may contain, and how the content is interpreted.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")[C](conformance-rules.html#constraints "This element has or is affected by some invariants")

1..1

[code](datatypes.html#code)

number | date | string | token | reference | composite | quantity | uri | special | resource  
Binding: [SearchParamType](valueset-search-param-type.html) ([Required](terminologies.html#required "To be conformant, the concept in this element SHALL be from the specified value set."))  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [expression](searchparameter-definitions.html#SearchParameter.expression "SearchParameter.expression : A FHIRPath expression that returns a set of elements for the search parameter.")

[C](conformance-rules.html#constraints "This element has or is affected by some invariants")

0..1

[string](datatypes.html#string)

FHIRPath expression that extracts the values  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [processingMode](searchparameter-definitions.html#SearchParameter.processingMode "SearchParameter.processingMode : How the search parameter relates to the set of elements returned by evaluating the expression query.")

[C](conformance-rules.html#constraints "This element has or is affected by some invariants")

0..1

[code](datatypes.html#code)

normal | phonetic | other  
Binding: [Search Processing Mode Type](valueset-search-processingmode.html) ([Required](terminologies.html#required "To be conformant, the concept in this element SHALL be from the specified value set."))  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [constraint](searchparameter-definitions.html#SearchParameter.constraint "SearchParameter.constraint : FHIRPath expression that defines/sets a complex constraint for when this SearchParameter is applicable.")

0..1

[string](datatypes.html#string)

FHIRPath expression that constraints the usage of this SearchParamete  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [target](searchparameter-definitions.html#SearchParameter.target "SearchParameter.target : Types of resource (if a resource is referenced).")

0..\*

[code](datatypes.html#code)

Types of resource (if a resource reference)  
Binding: [Version Independent Resource Types (All)](valueset-version-independent-all-resource-types.html) ([Required](terminologies.html#required "To be conformant, the concept in this element SHALL be from the specified value set."))

**Additional Bindings**

Purpose

[All Resource Types](valueset-all-resource-types.html)

[UI Binding](valueset-additional-binding-purpose.html#additional-binding-purpose-ui "This value set is provided to user look up in a given context")

  
  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [multipleOr](searchparameter-definitions.html#SearchParameter.multipleOr "SearchParameter.multipleOr : Whether multiple values are allowed for each time the parameter exists. Values are separated by commas, and the parameter matches if any of the values match.")

0..1

[boolean](datatypes.html#boolean)

Allow multiple values per parameter (or)  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [multipleAnd](searchparameter-definitions.html#SearchParameter.multipleAnd "SearchParameter.multipleAnd : Whether multiple parameters are allowed - e.g. more than one parameter with the same name. The search matches if all the parameters match.")

0..1

[boolean](datatypes.html#boolean)

Allow multiple parameters (and)  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [comparator](searchparameter-definitions.html#SearchParameter.comparator "SearchParameter.comparator : Comparators supported for the search parameter.")

[C](conformance-rules.html#constraints "This element has or is affected by some invariants")

0..\*

[code](datatypes.html#code)

eq | ne | gt | lt | ge | le | sa | eb | ap  
Binding: [Search Comparator](valueset-search-comparator.html) ([Required](terminologies.html#required "To be conformant, the concept in this element SHALL be from the specified value set."))  
  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [modifier](searchparameter-definitions.html#SearchParameter.modifier "SearchParameter.modifier : A modifier supported for the search parameter.")

0..\*

[code](datatypes.html#code)

missing | exact | contains | not | text | in | not-in | below | above | type | identifier | of-type | code-text | text-advanced | iterate  
Binding: [Search Modifier Code](valueset-search-modifier-code.html) ([Required](terminologies.html#required "To be conformant, the concept in this element SHALL be from the specified value set."))  
  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [chain](searchparameter-definitions.html#SearchParameter.chain "SearchParameter.chain : Contains the names of any search parameters which may be chained to the containing search parameter. Chained parameters may be added to search parameters of type reference and specify that resources will only be returned if they contain a reference to a resource which matches the chained parameter value. Values for this field should be drawn from SearchParameter.code for a parameter on the target resource type.")

[C](conformance-rules.html#constraints "This element has or is affected by some invariants")

0..\*

[string](datatypes.html#string)

Chained names supported  
  

![.](tbl_spacer.png)![.](tbl_vjoin_end-open.png)![.](icon_element.gif "Element") [component](searchparameter-definitions.html#SearchParameter.component "SearchParameter.component : Used to define the parts of a composite search parameter.")

0..\*

[BackboneElement](types.html#BackBoneElement)

For Composite resources to define the parts  
  

![.](tbl_spacer.png)![.](tbl_blank.png)![.](tbl_vjoin.png)![.](icon_reference.png "Reference to another Resource") [definition](searchparameter-definitions.html#SearchParameter.component.definition "SearchParameter.component.definition : The definition of the search parameter that describes this part.")

1..1

[canonical](datatypes.html#canonical)([SearchParameter](searchparameter.html))

Defines how the part works  

![.](tbl_spacer.png)![.](tbl_blank.png)![.](tbl_vjoin_end.png)![.](icon_primitive.png "Primitive Data Type") [expression](searchparameter-definitions.html#SearchParameter.component.expression "SearchParameter.component.expression : A sub-expression that defines how to extract values for this component from the output of the main SearchParameter.expression.")

1..1

[string](datatypes.html#string)

Subexpression relative to main expression  

  
 [![doco](help16.png) Documentation for this format ![icon](external.png)](https://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#table-views "Legend for this format") 

[See the Extensions](searchparameter-profiles.html#extensions) for this resource

**UML Diagram** ([Legend](formats.html#uml))

SearchParameter (DomainResource) +CanonicalResourceAn absolute URI that is used to identify this search parameter when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which an authoritative instance of this search parameter is (or will be) published. This URL can be the target of a canonical reference. It SHALL remain the same when the search parameter is stored on different serversurl : uri \[1..1\]A formal identifier that is used to identify this search parameter when it is represented in other formats, or referenced in a specification, model, design or an instanceidentifier : Identifier \[0..\*\]The identifier that is used to identify this version of the search parameter when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the search parameter author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequenceversion : string \[0..1\]Indicates the mechanism used to compare versions to determine which is more currentversionAlgorithm\[x\] : DataType \[0..1\] « string|Coding; null (Strength=Extensible) VersionAlgorithm\+ »A natural language name identifying the search parameter. This name should be usable as an identifier for the module by machine processing applications such as code generationname : string \[1..1\] « This element has or is affected by some invariantsC »A short, descriptive, user-friendly title for the search parametertitle : string \[0..1\]Where this search parameter is originally defined. If a derivedFrom is provided, then the details in the search parameter must be consistent with the definition from which it is defined. i.e. the parameter should have the same meaning, and (usually) the functionality should be a proper subset of the underlying search parameterderivedFrom : canonical \[0..1\] « SearchParameter »The status of this search parameter. Enables tracking the life-cycle of the content (this element modifies the meaning of other elements)status : code \[1..1\] « null (Strength=Required)PublicationStatus! »A Boolean value to indicate that this search parameter is authored for testing purposes (or education/evaluation/marketing) and no version of this resource will ever be intended for genuine usageexperimental : boolean \[0..1\]The date (and optionally time) when the search parameter was last significantly changed. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the search parameter changesdate : dateTime \[0..1\]The name of the organization or individual tresponsible for the release and ongoing maintenance of the search parameterpublisher : string \[0..1\]Contact details to assist a user in finding and communicating with the publishercontact : ContactDetail \[0..\*\]And how it useddescription : markdown \[1..1\]The content was developed with a focus and intent of supporting the contexts that are listed. These contexts may be general categories (gender, age, ...) or may be references to specific programs (insurance plans, studies, ...) and may be used to assist with indexing and searching for appropriate search parameter instancesuseContext : UsageContext \[0..\*\]A legal or geographic region in which the search parameter is intended to be usedjurisdiction : CodeableConcept \[0..\*\] « null (Strength=Extensible)JurisdictionValueSet\+ »Explanation of why this search parameter is needed and why it has been designed as it haspurpose : markdown \[0..1\]A copyright statement relating to the search parameter and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the search parametercopyright : markdown \[0..1\]A short string (<50 characters), suitable for inclusion in a page footer that identifies the copyright holder, effective period, and optionally whether rights are resctricted. (e.g. 'All rights reserved', 'Some rights reserved')copyrightLabel : string \[0..1\]The label that is recommended to be used in the URL or the parameter name in a parameters resource for this search parameter. In some cases, servers may need to use a different CapabilityStatement searchParam.name to differentiate between multiple SearchParameters that happen to have the same codecode : code \[1..1\]Additional label that are recommended to be used in the URL or the parameter name in a parameters resource for this search parameter. Typically used to provide backwards-compatibility for renamed search parameters and translations into localized languagesaliasCode : code \[0..\*\]The base resource type(s) that this search parameter can be used againstbase : code \[1..\*\] « null (Strength=Required)VersionIndependentResourceTyp...! »The type of value that a search parameter may contain, and how the content is interpretedtype : code \[1..1\] « null (Strength=Required)SearchParamType! » « This element has or is affected by some invariantsC »A FHIRPath expression that returns a set of elements for the search parameterexpression : string \[0..1\] « This element has or is affected by some invariantsC »How the search parameter relates to the set of elements returned by evaluating the expression queryprocessingMode : code \[0..1\] « null (Strength=Required)SearchProcessingModeType! » « This element has or is affected by some invariantsC »FHIRPath expression that defines/sets a complex constraint for when this SearchParameter is applicableconstraint : string \[0..1\]Types of resource (if a resource is referenced)target : code \[0..\*\] « null (Strength=Required)VersionIndependentResourceTyp...! »Whether multiple values are allowed for each time the parameter exists. Values are separated by commas, and the parameter matches if any of the values matchmultipleOr : boolean \[0..1\]Whether multiple parameters are allowed - e.g. more than one parameter with the same name. The search matches if all the parameters matchmultipleAnd : boolean \[0..1\]Comparators supported for the search parametercomparator : code \[0..\*\] « null (Strength=Required)SearchComparator! » « This element has or is affected by some invariantsC »A modifier supported for the search parametermodifier : code \[0..\*\] « null (Strength=Required)SearchModifierCode! »Contains the names of any search parameters which may be chained to the containing search parameter. Chained parameters may be added to search parameters of type reference and specify that resources will only be returned if they contain a reference to a resource which matches the chained parameter value. Values for this field should be drawn from SearchParameter.code for a parameter on the target resource typechain : string \[0..\*\] « This element has or is affected by some invariantsC »ComponentThe definition of the search parameter that describes this partdefinition : canonical \[1..1\] « SearchParameter »A sub-expression that defines how to extract values for this component from the output of the main SearchParameter.expressionexpression : string \[1..1\]Used to define the parts of a composite search parametercomponent\[0..\*\]

**XML Template**

<[**SearchParameter**](searchparameter-definitions.html#SearchParameter "A search parameter that defines a named search item that can be used to search/filter on a resource.") xmlns="http://hl7.org/fhir"> [![doco](help.png)](xml.html "Documentation for this format")
 <!-- from [Resource](resource.html): [id](resource.html#id), [meta](resource.html#meta), [implicitRules](resource.html#implicitRules), and [language](resource.html#language) -->
 <!-- from [DomainResource](domainresource.html): [text](narrative.html#Narrative), [contained](references.html#contained), [extension](extensibility.html), and [modifierExtension](extensibility.html#modifierExtension) -->
 <[**url**](searchparameter-definitions.html#SearchParameter.url "An absolute URI that is used to identify this search parameter when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which an authoritative instance of this search parameter is (or will be) published. This URL can be the target of a canonical reference. It SHALL remain the same when the search parameter is stored on different servers.") value="\[[uri](datatypes.html#uri)\]"/><!-- **1..1** [Canonical identifier for this search parameter, represented as a URI (globally unique)](terminologies.html#unbound) -->
 <[**identifier**](searchparameter-definitions.html#SearchParameter.identifier "A formal identifier that is used to identify this search parameter when it is represented in other formats, or referenced in a specification, model, design or an instance.")\><!-- **0..\*** [Identifier](datatypes.html#Identifier) [Additional identifier for the search parameter (business identifier)](terminologies.html#unbound) --></identifier>
 <[**version**](searchparameter-definitions.html#SearchParameter.version "The identifier that is used to identify this version of the search parameter when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the search parameter author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequence.") value="\[[string](datatypes.html#string)\]"/><!-- **0..1** [Business version of the search parameter](terminologies.html#unbound) -->
 <[**versionAlgorithm\[x\]**](searchparameter-definitions.html#SearchParameter.versionAlgorithm[x] "Indicates the mechanism used to compare versions to determine which is more current.")\><!-- **0..1** [string](datatypes.html#string)|[Coding](datatypes.html#Coding) [How to compare versions](valueset-version-algorithm.html) --></versionAlgorithm\[x\]>
 <[**name**](searchparameter-definitions.html#SearchParameter.name "A natural language name identifying the search parameter. This name should be usable as an identifier for the module by machine processing applications such as code generation.") value="\[[string](datatypes.html#string)\]"/><!-- **[I](conformance-rules.html#constraints "This element has or is affected by some invariants") 1..1** [Name for this search parameter (computer friendly)](terminologies.html#unbound) -->
 <[**title**](searchparameter-definitions.html#SearchParameter.title "A short, descriptive, user-friendly title for the search parameter.") value="\[[string](datatypes.html#string)\]"/><!-- **0..1** [Name for this search parameter (human friendly)](terminologies.html#unbound) -->
 <[**derivedFrom**](searchparameter-definitions.html#SearchParameter.derivedFrom "Where this search parameter is originally defined. If a derivedFrom is provided, then the details in the search parameter must be consistent with the definition from which it is defined. i.e. the parameter should have the same meaning, and (usually) the functionality should be a proper subset of the underlying search parameter.")\><!-- **0..1** [canonical](datatypes.html#canonical)([SearchParameter](searchparameter.html#SearchParameter)) [Original definition for the search parameter](terminologies.html#unbound) --></derivedFrom>
 <[**status**](searchparameter-definitions.html#SearchParameter.status "The status of this search parameter. Enables tracking the life-cycle of the content (this element modifies the meaning of other elements)") value="\[[code](datatypes.html#code)\]"/><!-- **1..1** [draft | active | retired | unknown](valueset-publication-status.html) -->
 <[**experimental**](searchparameter-definitions.html#SearchParameter.experimental "A Boolean value to indicate that this search parameter is authored for testing purposes (or education/evaluation/marketing) and no version of this resource will ever be intended for genuine usage.") value="\[[boolean](datatypes.html#boolean)\]"/><!-- **0..1** [For testing only - never for real usage](terminologies.html#unbound) -->
 <[**date**](searchparameter-definitions.html#SearchParameter.date "The date  (and optionally time) when the search parameter was last significantly changed. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the search parameter changes.") value="\[[dateTime](datatypes.html#dateTime)\]"/><!-- **0..1** [Date last changed](terminologies.html#unbound) -->
 <[**publisher**](searchparameter-definitions.html#SearchParameter.publisher "The name of the organization or individual tresponsible for the release and ongoing maintenance of the search parameter.") value="\[[string](datatypes.html#string)\]"/><!-- **0..1** [Name of the publisher/steward (organization or individual)](terminologies.html#unbound) -->
 <[**contact**](searchparameter-definitions.html#SearchParameter.contact "Contact details to assist a user in finding and communicating with the publisher.")\><!-- **0..\*** [ContactDetail](metadatatypes.html#ContactDetail) [Contact details for the publisher](terminologies.html#unbound) --></contact>
 <[**description**](searchparameter-definitions.html#SearchParameter.description "And how it used.") value="\[[markdown](datatypes.html#markdown)\]"/><!-- **1..1** [Natural language description of the search parameter](terminologies.html#unbound) -->
 <[**useContext**](searchparameter-definitions.html#SearchParameter.useContext "The content was developed with a focus and intent of supporting the contexts that are listed. These contexts may be general categories (gender, age, ...) or may be references to specific programs (insurance plans, studies, ...) and may be used to assist with indexing and searching for appropriate search parameter instances.")\><!-- **0..\*** [UsageContext](metadatatypes.html#UsageContext) [The context that the content is intended to support](terminologies.html#unbound) --></useContext>
 <[**jurisdiction**](searchparameter-definitions.html#SearchParameter.jurisdiction "A legal or geographic region in which the search parameter is intended to be used.")\><!-- **0..\*** [CodeableConcept](datatypes.html#CodeableConcept) [Intended jurisdiction for search parameter (if applicable)](valueset-jurisdiction.html) --></jurisdiction>
 <[**purpose**](searchparameter-definitions.html#SearchParameter.purpose "Explanation of why this search parameter is needed and why it has been designed as it has.") value="\[[markdown](datatypes.html#markdown)\]"/><!-- **0..1** [Why this search parameter is defined](terminologies.html#unbound) -->
 <[**copyright**](searchparameter-definitions.html#SearchParameter.copyright "A copyright statement relating to the search parameter and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the search parameter.") value="\[[markdown](datatypes.html#markdown)\]"/><!-- **0..1** [Use and/or publishing restrictions](terminologies.html#unbound) -->
 <[**copyrightLabel**](searchparameter-definitions.html#SearchParameter.copyrightLabel "A short string (<50 characters), suitable for inclusion in a page footer that identifies the copyright holder, effective period, and optionally whether rights are resctricted. (e.g. 'All rights reserved', 'Some rights reserved').") value="\[[string](datatypes.html#string)\]"/><!-- **0..1** [Copyright holder and year(s)](terminologies.html#unbound) -->
 <[**code**](searchparameter-definitions.html#SearchParameter.code "The label that is recommended to be used in the URL or the parameter name in a parameters resource for this search parameter.  In some cases, servers may need to use a different CapabilityStatement searchParam.name to differentiate between multiple SearchParameters that happen to have the same code.") value="\[[code](datatypes.html#code)\]"/><!-- **1..1** [Recommended name for parameter in search url](terminologies.html#unbound) -->
 <[**aliasCode**](searchparameter-definitions.html#SearchParameter.aliasCode "Additional label that are recommended to be used in the URL or the parameter name in a parameters resource for this search parameter. Typically used to provide backwards-compatibility for renamed search parameters and translations into localized languages.") value="\[[code](datatypes.html#code)\]"/><!-- **0..\*** [Additional recommended names for parameter in search url](terminologies.html#unbound) -->
 <[**base**](searchparameter-definitions.html#SearchParameter.base "The base resource type(s) that this search parameter can be used against.") value="\[[code](datatypes.html#code)\]"/><!-- **1..\*** [The resource type(s) this search parameter applies to](valueset-version-independent-all-resource-types.html) -->
 <[**type**](searchparameter-definitions.html#SearchParameter.type "The type of value that a search parameter may contain, and how the content is interpreted.") value="\[[code](datatypes.html#code)\]"/><!-- **[I](conformance-rules.html#constraints "This element has or is affected by some invariants") 1..1** [number | date | string | token | reference | composite | quantity | uri | special | resource](valueset-search-param-type.html) -->
 <[**expression**](searchparameter-definitions.html#SearchParameter.expression "A FHIRPath expression that returns a set of elements for the search parameter.") value="\[[string](datatypes.html#string)\]"/><!-- **[I](conformance-rules.html#constraints "This element has or is affected by some invariants") 0..1** [FHIRPath expression that extracts the values](terminologies.html#unbound) -->
 <[**processingMode**](searchparameter-definitions.html#SearchParameter.processingMode "How the search parameter relates to the set of elements returned by evaluating the expression query.") value="\[[code](datatypes.html#code)\]"/><!-- **[I](conformance-rules.html#constraints "This element has or is affected by some invariants") 0..1** [normal | phonetic | other](valueset-search-processingmode.html) -->
 <[**constraint**](searchparameter-definitions.html#SearchParameter.constraint "FHIRPath expression that defines/sets a complex constraint for when this SearchParameter is applicable.") value="\[[string](datatypes.html#string)\]"/><!-- **0..1** [FHIRPath expression that constraints the usage of this SearchParamete](terminologies.html#unbound) -->
 <[**target**](searchparameter-definitions.html#SearchParameter.target "Types of resource (if a resource is referenced).") value="\[[code](datatypes.html#code)\]"/><!-- **0..\*** [Types of resource (if a resource reference)](valueset-version-independent-all-resource-types.html) -->
 <[**multipleOr**](searchparameter-definitions.html#SearchParameter.multipleOr "Whether multiple values are allowed for each time the parameter exists. Values are separated by commas, and the parameter matches if any of the values match.") value="\[[boolean](datatypes.html#boolean)\]"/><!-- **0..1** [Allow multiple values per parameter (or)](terminologies.html#unbound) -->
 <[**multipleAnd**](searchparameter-definitions.html#SearchParameter.multipleAnd "Whether multiple parameters are allowed - e.g. more than one parameter with the same name. The search matches if all the parameters match.") value="\[[boolean](datatypes.html#boolean)\]"/><!-- **0..1** [Allow multiple parameters (and)](terminologies.html#unbound) -->
 <[**comparator**](searchparameter-definitions.html#SearchParameter.comparator "Comparators supported for the search parameter.") value="\[[code](datatypes.html#code)\]"/><!-- **[I](conformance-rules.html#constraints "This element has or is affected by some invariants") 0..\*** [eq | ne | gt | lt | ge | le | sa | eb | ap](valueset-search-comparator.html) -->
 <[**modifier**](searchparameter-definitions.html#SearchParameter.modifier "A modifier supported for the search parameter.") value="\[[code](datatypes.html#code)\]"/><!-- **0..\*** [missing | exact | contains | not | text | in | not-in | below | above | type | identifier | of-type | code-text | text-advanced | iterate](valueset-search-modifier-code.html) -->
 <[**chain**](searchparameter-definitions.html#SearchParameter.chain "Contains the names of any search parameters which may be chained to the containing search parameter. Chained parameters may be added to search parameters of type reference and specify that resources will only be returned if they contain a reference to a resource which matches the chained parameter value. Values for this field should be drawn from SearchParameter.code for a parameter on the target resource type.") value="\[[string](datatypes.html#string)\]"/><!-- **[I](conformance-rules.html#constraints "This element has or is affected by some invariants") 0..\*** [Chained names supported](terminologies.html#unbound) -->
 <[**component**](searchparameter-definitions.html#SearchParameter.component "Used to define the parts of a composite search parameter.")\>  <!-- **0..\*** For Composite resources to define the parts -->
  <[**definition**](searchparameter-definitions.html#SearchParameter.component.definition "The definition of the search parameter that describes this part.")\><!-- **1..1** [canonical](datatypes.html#canonical)([SearchParameter](searchparameter.html#SearchParameter)) [Defines how the part works](terminologies.html#unbound) --></definition>
  <[**expression**](searchparameter-definitions.html#SearchParameter.component.expression "A sub-expression that defines how to extract values for this component from the output of the main SearchParameter.expression.") value="\[[string](datatypes.html#string)\]"/><!-- **1..1** [Subexpression relative to main expression](terminologies.html#unbound) -->
 </component>
</SearchParameter>

**JSON Template**

{[![doco](help.png)](json.html "Documentation for this format")
  "resourceType" : "[**SearchParameter**](searchparameter-definitions.html#SearchParameter "A search parameter that defines a named search item that can be used to search/filter on a resource.")",
  // from [Resource](resource.html): [id](resource.html#id), [meta](resource.html#meta), [implicitRules](resource.html#implicitRules), and [language](resource.html#language)
  // from [DomainResource](domainresource.html): [text](narrative.html#Narrative), [contained](references.html#contained), [extension](extensibility.html), and [modifierExtension](extensibility.html#modifierExtension)
  "[url](searchparameter-definitions.html#SearchParameter.url "An absolute URI that is used to identify this search parameter when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which an authoritative instance of this search parameter is (or will be) published. This URL can be the target of a canonical reference. It SHALL remain the same when the search parameter is stored on different servers.")" : "<[uri](datatypes.html#uri)\>", // **R!**  [Canonical identifier for this search parameter, represented as a URI (globally unique)](terminologies.html#unbound)
  "[identifier](searchparameter-definitions.html#SearchParameter.identifier "A formal identifier that is used to identify this search parameter when it is represented in other formats, or referenced in a specification, model, design or an instance.")" : \[{ [Identifier](datatypes.html#Identifier) }\], // [Additional identifier for the search parameter (business identifier)](terminologies.html#unbound)
  "[version](searchparameter-definitions.html#SearchParameter.version "The identifier that is used to identify this version of the search parameter when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the search parameter author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequence.")" : "<[string](datatypes.html#string)\>", // [Business version of the search parameter](terminologies.html#unbound)
  // versionAlgorithm\[x\]: How to compare versions. One of these 2:
  "[versionAlgorithmString](searchparameter-definitions.html#SearchParameter.versionAlgorithmString "Indicates the mechanism used to compare versions to determine which is more current.")" : "<[string](datatypes.html#string)\>",
  "[versionAlgorithmCoding](searchparameter-definitions.html#SearchParameter.versionAlgorithmCoding "Indicates the mechanism used to compare versions to determine which is more current.")" : { [Coding](datatypes.html#Coding) },
  "[name](searchparameter-definitions.html#SearchParameter.name "A natural language name identifying the search parameter. This name should be usable as an identifier for the module by machine processing applications such as code generation.")" : "<[string](datatypes.html#string)\>", // [I](conformance-rules.html#constraints "This element has or is affected by some invariants") **R!**  [Name for this search parameter (computer friendly)](terminologies.html#unbound)
  "[title](searchparameter-definitions.html#SearchParameter.title "A short, descriptive, user-friendly title for the search parameter.")" : "<[string](datatypes.html#string)\>", // [Name for this search parameter (human friendly)](terminologies.html#unbound)
  "[derivedFrom](searchparameter-definitions.html#SearchParameter.derivedFrom "Where this search parameter is originally defined. If a derivedFrom is provided, then the details in the search parameter must be consistent with the definition from which it is defined. i.e. the parameter should have the same meaning, and (usually) the functionality should be a proper subset of the underlying search parameter.")" : "<[canonical](datatypes.html#canonical)([SearchParameter](searchparameter.html#SearchParameter))>", // [Original definition for the search parameter](terminologies.html#unbound)
  "[status](searchparameter-definitions.html#SearchParameter.status "The status of this search parameter. Enables tracking the life-cycle of the content (this element modifies the meaning of other elements)")" : "<[code](datatypes.html#code)\>", // **R!**  [draft | active | retired | unknown](valueset-publication-status.html)
  "[experimental](searchparameter-definitions.html#SearchParameter.experimental "A Boolean value to indicate that this search parameter is authored for testing purposes (or education/evaluation/marketing) and no version of this resource will ever be intended for genuine usage.")" : <[boolean](datatypes.html#boolean)\>, // [For testing only - never for real usage](terminologies.html#unbound)
  "[date](searchparameter-definitions.html#SearchParameter.date "The date  (and optionally time) when the search parameter was last significantly changed. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the search parameter changes.")" : "<[dateTime](datatypes.html#dateTime)\>", // [Date last changed](terminologies.html#unbound)
  "[publisher](searchparameter-definitions.html#SearchParameter.publisher "The name of the organization or individual tresponsible for the release and ongoing maintenance of the search parameter.")" : "<[string](datatypes.html#string)\>", // [Name of the publisher/steward (organization or individual)](terminologies.html#unbound)
  "[contact](searchparameter-definitions.html#SearchParameter.contact "Contact details to assist a user in finding and communicating with the publisher.")" : \[{ [ContactDetail](metadatatypes.html#ContactDetail) }\], // [Contact details for the publisher](terminologies.html#unbound)
  "[description](searchparameter-definitions.html#SearchParameter.description "And how it used.")" : "<[markdown](datatypes.html#markdown)\>", // **R!**  [Natural language description of the search parameter](terminologies.html#unbound)
  "[useContext](searchparameter-definitions.html#SearchParameter.useContext "The content was developed with a focus and intent of supporting the contexts that are listed. These contexts may be general categories (gender, age, ...) or may be references to specific programs (insurance plans, studies, ...) and may be used to assist with indexing and searching for appropriate search parameter instances.")" : \[{ [UsageContext](metadatatypes.html#UsageContext) }\], // [The context that the content is intended to support](terminologies.html#unbound)
  "[jurisdiction](searchparameter-definitions.html#SearchParameter.jurisdiction "A legal or geographic region in which the search parameter is intended to be used.")" : \[{ [CodeableConcept](datatypes.html#CodeableConcept) }\], // [Intended jurisdiction for search parameter (if applicable)](valueset-jurisdiction.html)
  "[purpose](searchparameter-definitions.html#SearchParameter.purpose "Explanation of why this search parameter is needed and why it has been designed as it has.")" : "<[markdown](datatypes.html#markdown)\>", // [Why this search parameter is defined](terminologies.html#unbound)
  "[copyright](searchparameter-definitions.html#SearchParameter.copyright "A copyright statement relating to the search parameter and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the search parameter.")" : "<[markdown](datatypes.html#markdown)\>", // [Use and/or publishing restrictions](terminologies.html#unbound)
  "[copyrightLabel](searchparameter-definitions.html#SearchParameter.copyrightLabel "A short string (<50 characters), suitable for inclusion in a page footer that identifies the copyright holder, effective period, and optionally whether rights are resctricted. (e.g. 'All rights reserved', 'Some rights reserved').")" : "<[string](datatypes.html#string)\>", // [Copyright holder and year(s)](terminologies.html#unbound)
  "[code](searchparameter-definitions.html#SearchParameter.code "The label that is recommended to be used in the URL or the parameter name in a parameters resource for this search parameter.  In some cases, servers may need to use a different CapabilityStatement searchParam.name to differentiate between multiple SearchParameters that happen to have the same code.")" : "<[code](datatypes.html#code)\>", // **R!**  [Recommended name for parameter in search url](terminologies.html#unbound)
  "[aliasCode](searchparameter-definitions.html#SearchParameter.aliasCode "Additional label that are recommended to be used in the URL or the parameter name in a parameters resource for this search parameter. Typically used to provide backwards-compatibility for renamed search parameters and translations into localized languages.")" : \["<[code](datatypes.html#code)\>"\], // [Additional recommended names for parameter in search url](terminologies.html#unbound)
  "[base](searchparameter-definitions.html#SearchParameter.base "The base resource type(s) that this search parameter can be used against.")" : \["<[code](datatypes.html#code)\>"\], // **R!**  [The resource type(s) this search parameter applies to](valueset-version-independent-all-resource-types.html)
  "[type](searchparameter-definitions.html#SearchParameter.type "The type of value that a search parameter may contain, and how the content is interpreted.")" : "<[code](datatypes.html#code)\>", // [I](conformance-rules.html#constraints "This element has or is affected by some invariants") **R!**  [number | date | string | token | reference | composite | quantity | uri | special | resource](valueset-search-param-type.html)
  "[expression](searchparameter-definitions.html#SearchParameter.expression "A FHIRPath expression that returns a set of elements for the search parameter.")" : "<[string](datatypes.html#string)\>", // [I](conformance-rules.html#constraints "This element has or is affected by some invariants") [FHIRPath expression that extracts the values](terminologies.html#unbound)
  "[processingMode](searchparameter-definitions.html#SearchParameter.processingMode "How the search parameter relates to the set of elements returned by evaluating the expression query.")" : "<[code](datatypes.html#code)\>", // [I](conformance-rules.html#constraints "This element has or is affected by some invariants") [normal | phonetic | other](valueset-search-processingmode.html)
  "[constraint](searchparameter-definitions.html#SearchParameter.constraint "FHIRPath expression that defines/sets a complex constraint for when this SearchParameter is applicable.")" : "<[string](datatypes.html#string)\>", // [FHIRPath expression that constraints the usage of this SearchParamete](terminologies.html#unbound)
  "[target](searchparameter-definitions.html#SearchParameter.target "Types of resource (if a resource is referenced).")" : \["<[code](datatypes.html#code)\>"\], // [Types of resource (if a resource reference)](valueset-version-independent-all-resource-types.html)
  "[multipleOr](searchparameter-definitions.html#SearchParameter.multipleOr "Whether multiple values are allowed for each time the parameter exists. Values are separated by commas, and the parameter matches if any of the values match.")" : <[boolean](datatypes.html#boolean)\>, // [Allow multiple values per parameter (or)](terminologies.html#unbound)
  "[multipleAnd](searchparameter-definitions.html#SearchParameter.multipleAnd "Whether multiple parameters are allowed - e.g. more than one parameter with the same name. The search matches if all the parameters match.")" : <[boolean](datatypes.html#boolean)\>, // [Allow multiple parameters (and)](terminologies.html#unbound)
  "[comparator](searchparameter-definitions.html#SearchParameter.comparator "Comparators supported for the search parameter.")" : \["<[code](datatypes.html#code)\>"\], // [I](conformance-rules.html#constraints "This element has or is affected by some invariants") [eq | ne | gt | lt | ge | le | sa | eb | ap](valueset-search-comparator.html)
  "[modifier](searchparameter-definitions.html#SearchParameter.modifier "A modifier supported for the search parameter.")" : \["<[code](datatypes.html#code)\>"\], // [missing | exact | contains | not | text | in | not-in | below | above | type | identifier | of-type | code-text | text-advanced | iterate](valueset-search-modifier-code.html)
  "[chain](searchparameter-definitions.html#SearchParameter.chain "Contains the names of any search parameters which may be chained to the containing search parameter. Chained parameters may be added to search parameters of type reference and specify that resources will only be returned if they contain a reference to a resource which matches the chained parameter value. Values for this field should be drawn from SearchParameter.code for a parameter on the target resource type.")" : \["<[string](datatypes.html#string)\>"\], // [I](conformance-rules.html#constraints "This element has or is affected by some invariants") [Chained names supported](terminologies.html#unbound)
  "[component](searchparameter-definitions.html#SearchParameter.component "Used to define the parts of a composite search parameter.")" : \[{ // [For Composite resources to define the parts](terminologies.html#unbound)
    "[definition](searchparameter-definitions.html#SearchParameter.component.definition "The definition of the search parameter that describes this part.")" : "<[canonical](datatypes.html#canonical)([SearchParameter](searchparameter.html#SearchParameter))>", // **R!**  [Defines how the part works](terminologies.html#unbound)
    "[expression](searchparameter-definitions.html#SearchParameter.component.expression "A sub-expression that defines how to extract values for this component from the output of the main SearchParameter.expression.")" : "<[string](datatypes.html#string)\>" // **R!**  [Subexpression relative to main expression](terminologies.html#unbound)
  }\]
}

**Turtle Template**

@prefix fhir: <http://hl7.org/fhir/> .[![doco](help.png)](rdf.html "Documentation for this format")

\[ a fhir:[**SearchParameter**](searchparameter-definitions.html#SearchParameter "A search parameter that defines a named search item that can be used to search/filter on a resource.");
  fhir:nodeRole fhir:treeRoot; # if this is the parser root

  # from [Resource](resource.html): [.id](resource.html#id), [.meta](resource.html#meta), [.implicitRules](resource.html#implicitRules), and [.language](resource.html#language)
  # from [DomainResource](domainresource.html): [.text](narrative.html#Narrative), [.contained](references.html#contained), [.extension](extensibility.html), and [.modifierExtension](extensibility.html#modifierExtension)
  fhir:[url](searchparameter-definitions.html#SearchParameter.url "An absolute URI that is used to identify this search parameter when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which an authoritative instance of this search parameter is (or will be) published. This URL can be the target of a canonical reference. It SHALL remain the same when the search parameter is stored on different servers.") \[ [uri](datatypes.html#uri) \] ; # 1..1 Canonical identifier for this search parameter, represented as a URI (globally unique)
  fhir:[identifier](searchparameter-definitions.html#SearchParameter.identifier "A formal identifier that is used to identify this search parameter when it is represented in other formats, or referenced in a specification, model, design or an instance.")  ( \[ [Identifier](datatypes.html#Identifier) \] ... ) ; # 0..\* Additional identifier for the search parameter (business identifier)
  fhir:[version](searchparameter-definitions.html#SearchParameter.version "The identifier that is used to identify this version of the search parameter when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the search parameter author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequence.") \[ [string](datatypes.html#string) \] ; # 0..1 Business version of the search parameter
  # [versionAlgorithm\[x\]](searchparameter-definitions.html#SearchParameter.versionAlgorithm[x] "Indicates the mechanism used to compare versions to determine which is more current.") : 0..1 How to compare versions. One of these 2
    fhir:[versionAlgorithm](searchparameter-definitions.html#SearchParameter.versionAlgorithm "Indicates the mechanism used to compare versions to determine which is more current.") \[  a fhir:string ; [string](datatypes.html#string) \]
    fhir:[versionAlgorithm](searchparameter-definitions.html#SearchParameter.versionAlgorithm "Indicates the mechanism used to compare versions to determine which is more current.") \[  a fhir:Coding ; [Coding](datatypes.html#Coding) \]
  fhir:[name](searchparameter-definitions.html#SearchParameter.name "A natural language name identifying the search parameter. This name should be usable as an identifier for the module by machine processing applications such as code generation.") \[ [string](datatypes.html#string) \] ; # 1..1 [I](conformance-rules.html#constraints "This element has or is affected by some invariants") Name for this search parameter (computer friendly)
  fhir:[title](searchparameter-definitions.html#SearchParameter.title "A short, descriptive, user-friendly title for the search parameter.") \[ [string](datatypes.html#string) \] ; # 0..1 Name for this search parameter (human friendly)
  fhir:[derivedFrom](searchparameter-definitions.html#SearchParameter.derivedFrom "Where this search parameter is originally defined. If a derivedFrom is provided, then the details in the search parameter must be consistent with the definition from which it is defined. i.e. the parameter should have the same meaning, and (usually) the functionality should be a proper subset of the underlying search parameter.") \[ [canonical](datatypes.html#canonical)([SearchParameter](searchparameter.html#SearchParameter)) \] ; # 0..1 Original definition for the search parameter
  fhir:[status](searchparameter-definitions.html#SearchParameter.status "The status of this search parameter. Enables tracking the life-cycle of the content (this element modifies the meaning of other elements)") \[ [code](datatypes.html#code) \] ; # 1..1 draft | active | retired | unknown
  fhir:[experimental](searchparameter-definitions.html#SearchParameter.experimental "A Boolean value to indicate that this search parameter is authored for testing purposes (or education/evaluation/marketing) and no version of this resource will ever be intended for genuine usage.") \[ [boolean](datatypes.html#boolean) \] ; # 0..1 For testing only - never for real usage
  fhir:[date](searchparameter-definitions.html#SearchParameter.date "The date  (and optionally time) when the search parameter was last significantly changed. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the search parameter changes.") \[ [dateTime](datatypes.html#dateTime) \] ; # 0..1 Date last changed
  fhir:[publisher](searchparameter-definitions.html#SearchParameter.publisher "The name of the organization or individual tresponsible for the release and ongoing maintenance of the search parameter.") \[ [string](datatypes.html#string) \] ; # 0..1 Name of the publisher/steward (organization or individual)
  fhir:[contact](searchparameter-definitions.html#SearchParameter.contact "Contact details to assist a user in finding and communicating with the publisher.")  ( \[ [ContactDetail](metadatatypes.html#ContactDetail) \] ... ) ; # 0..\* Contact details for the publisher
  fhir:[description](searchparameter-definitions.html#SearchParameter.description "And how it used.") \[ [markdown](datatypes.html#markdown) \] ; # 1..1 Natural language description of the search parameter
  fhir:[useContext](searchparameter-definitions.html#SearchParameter.useContext "The content was developed with a focus and intent of supporting the contexts that are listed. These contexts may be general categories (gender, age, ...) or may be references to specific programs (insurance plans, studies, ...) and may be used to assist with indexing and searching for appropriate search parameter instances.")  ( \[ [UsageContext](metadatatypes.html#UsageContext) \] ... ) ; # 0..\* The context that the content is intended to support
  fhir:[jurisdiction](searchparameter-definitions.html#SearchParameter.jurisdiction "A legal or geographic region in which the search parameter is intended to be used.")  ( \[ [CodeableConcept](datatypes.html#CodeableConcept) \] ... ) ; # 0..\* Intended jurisdiction for search parameter (if applicable)
  fhir:[purpose](searchparameter-definitions.html#SearchParameter.purpose "Explanation of why this search parameter is needed and why it has been designed as it has.") \[ [markdown](datatypes.html#markdown) \] ; # 0..1 Why this search parameter is defined
  fhir:[copyright](searchparameter-definitions.html#SearchParameter.copyright "A copyright statement relating to the search parameter and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the search parameter.") \[ [markdown](datatypes.html#markdown) \] ; # 0..1 Use and/or publishing restrictions
  fhir:[copyrightLabel](searchparameter-definitions.html#SearchParameter.copyrightLabel "A short string (<50 characters), suitable for inclusion in a page footer that identifies the copyright holder, effective period, and optionally whether rights are resctricted. (e.g. 'All rights reserved', 'Some rights reserved').") \[ [string](datatypes.html#string) \] ; # 0..1 Copyright holder and year(s)
  fhir:[code](searchparameter-definitions.html#SearchParameter.code "The label that is recommended to be used in the URL or the parameter name in a parameters resource for this search parameter.  In some cases, servers may need to use a different CapabilityStatement searchParam.name to differentiate between multiple SearchParameters that happen to have the same code.") \[ [code](datatypes.html#code) \] ; # 1..1 Recommended name for parameter in search url
  fhir:[aliasCode](searchparameter-definitions.html#SearchParameter.aliasCode "Additional label that are recommended to be used in the URL or the parameter name in a parameters resource for this search parameter. Typically used to provide backwards-compatibility for renamed search parameters and translations into localized languages.")  ( \[ [code](datatypes.html#code) \] ... ) ; # 0..\* Additional recommended names for parameter in search url
  fhir:[base](searchparameter-definitions.html#SearchParameter.base "The base resource type(s) that this search parameter can be used against.")  ( \[ [code](datatypes.html#code) \] ... ) ; # 1..\* The resource type(s) this search parameter applies to
  fhir:[type](searchparameter-definitions.html#SearchParameter.type "The type of value that a search parameter may contain, and how the content is interpreted.") \[ [code](datatypes.html#code) \] ; # 1..1 [I](conformance-rules.html#constraints "This element has or is affected by some invariants") number | date | string | token | reference | composite | quantity | uri | special | resource
  fhir:[expression](searchparameter-definitions.html#SearchParameter.expression "A FHIRPath expression that returns a set of elements for the search parameter.") \[ [string](datatypes.html#string) \] ; # 0..1 [I](conformance-rules.html#constraints "This element has or is affected by some invariants") FHIRPath expression that extracts the values
  fhir:[processingMode](searchparameter-definitions.html#SearchParameter.processingMode "How the search parameter relates to the set of elements returned by evaluating the expression query.") \[ [code](datatypes.html#code) \] ; # 0..1 [I](conformance-rules.html#constraints "This element has or is affected by some invariants") normal | phonetic | other
  fhir:[constraint](searchparameter-definitions.html#SearchParameter.constraint "FHIRPath expression that defines/sets a complex constraint for when this SearchParameter is applicable.") \[ [string](datatypes.html#string) \] ; # 0..1 FHIRPath expression that constraints the usage of this SearchParamete
  fhir:[target](searchparameter-definitions.html#SearchParameter.target "Types of resource (if a resource is referenced).")  ( \[ [code](datatypes.html#code) \] ... ) ; # 0..\* Types of resource (if a resource reference)
  fhir:[multipleOr](searchparameter-definitions.html#SearchParameter.multipleOr "Whether multiple values are allowed for each time the parameter exists. Values are separated by commas, and the parameter matches if any of the values match.") \[ [boolean](datatypes.html#boolean) \] ; # 0..1 Allow multiple values per parameter (or)
  fhir:[multipleAnd](searchparameter-definitions.html#SearchParameter.multipleAnd "Whether multiple parameters are allowed - e.g. more than one parameter with the same name. The search matches if all the parameters match.") \[ [boolean](datatypes.html#boolean) \] ; # 0..1 Allow multiple parameters (and)
  fhir:[comparator](searchparameter-definitions.html#SearchParameter.comparator "Comparators supported for the search parameter.")  ( \[ [code](datatypes.html#code) \] ... ) ; # 0..\* [I](conformance-rules.html#constraints "This element has or is affected by some invariants") eq | ne | gt | lt | ge | le | sa | eb | ap
  fhir:[modifier](searchparameter-definitions.html#SearchParameter.modifier "A modifier supported for the search parameter.")  ( \[ [code](datatypes.html#code) \] ... ) ; # 0..\* missing | exact | contains | not | text | in | not-in | below | above | type | identifier | of-type | code-text | text-advanced | iterate
  fhir:[chain](searchparameter-definitions.html#SearchParameter.chain "Contains the names of any search parameters which may be chained to the containing search parameter. Chained parameters may be added to search parameters of type reference and specify that resources will only be returned if they contain a reference to a resource which matches the chained parameter value. Values for this field should be drawn from SearchParameter.code for a parameter on the target resource type.")  ( \[ [string](datatypes.html#string) \] ... ) ; # 0..\* [I](conformance-rules.html#constraints "This element has or is affected by some invariants") Chained names supported
  fhir:[component](searchparameter-definitions.html#SearchParameter.component "Used to define the parts of a composite search parameter.") ( \[ # 0..\* For Composite resources to define the parts
    fhir:[definition](searchparameter-definitions.html#SearchParameter.component.definition "The definition of the search parameter that describes this part.") \[ [canonical](datatypes.html#canonical)([SearchParameter](searchparameter.html#SearchParameter)) \] ; # 1..1 Defines how the part works
    fhir:[expression](searchparameter-definitions.html#SearchParameter.component.expression "A sub-expression that defines how to extract values for this component from the output of the main SearchParameter.expression.") \[ [string](datatypes.html#string) \] ; # 1..1 Subexpression relative to main expression
  \] ... ) ;
\]

**Changes from both R4 and R4B**

[SearchParameter](searchparameter.html#SearchParameter)

SearchParameter.identifier

-   Added Element

SearchParameter.versionAlgorithm\[x\]

-   Added Element

SearchParameter.title

-   Added Element

SearchParameter.copyright

-   Added Element

SearchParameter.copyrightLabel

-   Added Element

SearchParameter.aliasCode

-   Added Element

SearchParameter.base

-   Change value set from `http://hl7.org/fhir/ValueSet/resource-types|4.0.0` to [Version Independent Resource Types (All)](valueset-version-independent-all-resource-types.html)
-   Remove code `ClinicalImpression`
-   Add codes `ActorDefinition`, `AdministrableProductDefinition`, `ArtifactAssessment`, `BiologicallyDerivedProductDispense`, `CanonicalResource`, `Citation`, `ClinicalAssessment`, `ClinicalUseDefinition`, `ConditionDefinition`, `DeviceAlert`, `DeviceAssociation`, `DeviceDispense`, `DeviceUsage`, `EncounterHistory`, `FormularyItem`, `GenomicStudy`, `ImagingSelection`, `Ingredient`, `InsuranceProduct`, `InventoryItem`, `InventoryReport`, `ManufacturedItemDefinition`, `MedicinalProductDefinition`, `MetadataResource`, `MolecularDefinition`, `NutritionIntake`, `NutritionProduct`, `PackagedProductDefinition`, `Permission`, `PersonalRelationship`, `RegulatedAuthorization`, `RequestOrchestration`, `Requirements`, `SubscriptionStatus`, `SubscriptionTopic`, `SubstanceDefinition`, `TestPlan`, `Transport`, `BodySite`, `Conformance`, `DataElement`, `DeviceComponent`, `DeviceUseRequest`, `DiagnosticOrder`, `EligibilityRequest`, `EligibilityResponse`, `ExpansionProfile`, `ImagingManifest`, `ImagingObjectSelection`, `MedicationOrder`, `MedicationUsage`, `Order`, `OrderResponse`, `ProcedureRequest`, `ProcessRequest`, `ProcessResponse`, `ReferralRequest`, `Sequence`, `ServiceDefinition`

SearchParameter.type

-   Add code `resource`

SearchParameter.processingMode

-   Renamed from xpathUsage to processingMode
-   Change value set from `http://hl7.org/fhir/ValueSet/search-xpath-usage|4.0.0` to [Search Processing Mode Type](valueset-search-processingmode.html)
-   Remove codes `nearby`, `distance`

SearchParameter.constraint

-   Added Element

SearchParameter.target

-   Change value set from `http://hl7.org/fhir/ValueSet/resource-types|4.0.0` to [Version Independent Resource Types (All)](valueset-version-independent-all-resource-types.html)
-   Remove code `ClinicalImpression`
-   Add codes `ActorDefinition`, `AdministrableProductDefinition`, `ArtifactAssessment`, `BiologicallyDerivedProductDispense`, `CanonicalResource`, `Citation`, `ClinicalAssessment`, `ClinicalUseDefinition`, `ConditionDefinition`, `DeviceAlert`, `DeviceAssociation`, `DeviceDispense`, `DeviceUsage`, `EncounterHistory`, `FormularyItem`, `GenomicStudy`, `ImagingSelection`, `Ingredient`, `InsuranceProduct`, `InventoryItem`, `InventoryReport`, `ManufacturedItemDefinition`, `MedicinalProductDefinition`, `MetadataResource`, `MolecularDefinition`, `NutritionIntake`, `NutritionProduct`, `PackagedProductDefinition`, `Permission`, `PersonalRelationship`, `RegulatedAuthorization`, `RequestOrchestration`, `Requirements`, `SubscriptionStatus`, `SubscriptionTopic`, `SubstanceDefinition`, `TestPlan`, `Transport`, `BodySite`, `Conformance`, `DataElement`, `DeviceComponent`, `DeviceUseRequest`, `DiagnosticOrder`, `EligibilityRequest`, `EligibilityResponse`, `ExpansionProfile`, `ImagingManifest`, `ImagingObjectSelection`, `MedicationOrder`, `MedicationUsage`, `Order`, `OrderResponse`, `ProcedureRequest`, `ProcessRequest`, `ProcessResponse`, `ReferralRequest`, `Sequence`, `ServiceDefinition`

SearchParameter.modifier

-   Remove code `ofType`
-   Add codes `of-type`, `code-text`, `text-advanced`, `iterate`

SearchParameter.xpath

-   Deleted (XPath removed due to lack of use and maintenance)

See the [Full Difference](diff.html) for further information

This analysis is available for R4 as [XML](searchparameter.r4.diff.xml) or [JSON](searchparameter.r4.diff.json) and for R4B as [XML](searchparameter.r4b.diff.xml) or [JSON](searchparameter.r4b.diff.json).

**Structure**

[Name](https://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#table-views "The logical name of the element")

[Flags](https://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#table-views "Information about the use of the element")

[Card.](https://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#table-views "Minimum and Maximum # of times the element can appear in the instance")

[Type](https://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#table-views "Reference to the type of the element")

[Description & Constraints](https://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#table-views "Additional information about the element")[![doco](help16.png)](https://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#table-views "Legend for this format")

![.](tbl_spacer.png)![.](icon_resource.png "Resource") [SearchParameter](searchparameter-definitions.html#SearchParameter "SearchParameter : A search parameter that defines a named search item that can be used to search/filter on a resource.")

[TU](versions.html#std-process "Standards Status = Trial Use")

[DomainResource](domainresource.html)

Search parameter for a resource  
\+ Warning: Name should be usable as an identifier for the module by machine processing applications such as code generation  
\+ Rule: If an expression is present, there SHALL be a processingMode  
\+ Rule: Search parameters can only have chain names when the search parameter type is 'reference'  
\+ Rule: Search parameters comparator can only be used on type 'number', 'date', 'quantity' or 'special'.  
  
Elements defined in Ancestors: [id](resource.html#Resource "The logical id of the resource, as used in the URL for the resource. Once assigned, this value never changes."), [meta](resource.html#Resource "The metadata about the resource. This is content that is maintained by the infrastructure. Changes to the content might not always be associated with version changes to the resource."), [implicitRules](resource.html#Resource "A reference to a set of rules that were followed when the resource was constructed, and which must be understood when processing the content. Often, this is a reference to an implementation guide that defines the special rules along with other profiles etc."), [language](resource.html#Resource "The base language in which the resource is written."), [text](domainresource.html#DomainResource "A human-readable narrative that contains a summary of the resource and can be used to represent the content of the resource to a human. The narrative need not encode all the structured data, but is required to contain sufficient detail to make it \"clinically safe\" for a human to just read the narrative. Resource definitions may define what content should be represented in the narrative to ensure clinical safety."), [contained](domainresource.html#DomainResource "These resources do not have an independent existence apart from the resource that contains them - they cannot be identified independently, nor can they have their own independent transaction scope. This is allowed to be a Parameters resource if and only if it is referenced by a resource that provides context/meaning."), [extension](domainresource.html#DomainResource "May be used to represent additional information that is not part of the basic definition of the resource. To make the use of extensions safe and managable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension."), [modifierExtension](domainresource.html#DomainResource "May be used to represent additional information that is not part of the basic definition of the resource and that modifies the understanding of the element that contains it and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and managable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer is allowed to define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.
Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself).")  
Interfaces Implemented: [CanonicalResource](canonicalresource.html#CanonicalResource "Common Interface declaration for conformance and knowledge artifact resources.")

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [url](searchparameter-definitions.html#SearchParameter.url "SearchParameter.url : An absolute URI that is used to identify this search parameter when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which an authoritative instance of this search parameter is (or will be) published. This URL can be the target of a canonical reference. It SHALL remain the same when the search parameter is stored on different servers.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")[C](conformance-rules.html#constraints "This element has or is affected by some invariants")

1..1

[uri](datatypes.html#uri)

Canonical identifier for this search parameter, represented as a URI (globally unique)  
\+ Warning: URL should not contain | or # - these characters make processing canonical references problematic  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_datatype.gif "Data Type") [identifier](searchparameter-definitions.html#SearchParameter.identifier "SearchParameter.identifier : A formal identifier that is used to identify this search parameter when it is represented in other formats, or referenced in a specification, model, design or an instance.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

0..\*

[Identifier](datatypes.html#Identifier)

Additional identifier for the search parameter (business identifier)  
  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [version](searchparameter-definitions.html#SearchParameter.version "SearchParameter.version : The identifier that is used to identify this version of the search parameter when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the search parameter author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequence.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

0..1

[string](datatypes.html#string)

Business version of the search parameter  

![.](tbl_spacer.png)![.](tbl_vjoin-open.png)![.](icon_choice.gif "Choice of Types") [versionAlgorithm\[x\]](searchparameter-definitions.html#SearchParameter.versionAlgorithm_x_ "SearchParameter.versionAlgorithm[x] : Indicates the mechanism used to compare versions to determine which is more current.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

0..1

How to compare versions  
Binding: [Version Algorithm](valueset-version-algorithm.html) ([Extensible](terminologies.html#extensible "To be conformant, the concept in this element SHALL be from the specified value set if any of the codes within the value set can apply to the concept being communicated.  If the value set does not cover the concept (based on human review), alternate codings (or, data type allowing, text) may be included instead."))  

![.](tbl_spacer.png)![.](tbl_vline.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") versionAlgorithmString

[string](datatypes.html#string)

![.](tbl_spacer.png)![.](tbl_vline.png)![.](tbl_vjoin_end.png)![.](icon_datatype.gif "Data Type") versionAlgorithmCoding

[Coding](datatypes.html#Coding)

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [name](searchparameter-definitions.html#SearchParameter.name "SearchParameter.name : A natural language name identifying the search parameter. This name should be usable as an identifier for the module by machine processing applications such as code generation.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")[C](conformance-rules.html#constraints "This element has or is affected by some invariants")

1..1

[string](datatypes.html#string)

Name for this search parameter (computer friendly)  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [title](searchparameter-definitions.html#SearchParameter.title "SearchParameter.title : A short, descriptive, user-friendly title for the search parameter.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")[T](languages.html#translatable "This element is a candidate for being translated")

0..1

[string](datatypes.html#string)

Name for this search parameter (human friendly)  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_reference.png "Reference to another Resource") [derivedFrom](searchparameter-definitions.html#SearchParameter.derivedFrom "SearchParameter.derivedFrom : Where this search parameter is originally defined. If a derivedFrom is provided, then the details in the search parameter must be consistent with the definition from which it is defined. i.e. the parameter should have the same meaning, and (usually) the functionality should be a proper subset of the underlying search parameter.")

0..1

[canonical](datatypes.html#canonical)([SearchParameter](searchparameter.html))

Original definition for the search parameter  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [status](searchparameter-definitions.html#SearchParameter.status "SearchParameter.status : The status of this search parameter. Enables tracking the life-cycle of the content.")

[?!](conformance-rules.html#isModifier "This element is a modifier element")[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

1..1

[code](datatypes.html#code)

draft | active | retired | unknown  
Binding: [PublicationStatus](valueset-publication-status.html) ([Required](terminologies.html#required "To be conformant, the concept in this element SHALL be from the specified value set."))  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [experimental](searchparameter-definitions.html#SearchParameter.experimental "SearchParameter.experimental : A Boolean value to indicate that this search parameter is authored for testing purposes (or education/evaluation/marketing) and no version of this resource will ever be intended for genuine usage.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

0..1

[boolean](datatypes.html#boolean)

For testing only - never for real usage  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [date](searchparameter-definitions.html#SearchParameter.date "SearchParameter.date : The date  (and optionally time) when the search parameter was last significantly changed. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the search parameter changes.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

0..1

[dateTime](datatypes.html#dateTime)

Date last changed  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [publisher](searchparameter-definitions.html#SearchParameter.publisher "SearchParameter.publisher : The name of the organization or individual tresponsible for the release and ongoing maintenance of the search parameter.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")[T](languages.html#translatable "This element is a candidate for being translated")

0..1

[string](datatypes.html#string)

Name of the publisher/steward (organization or individual)  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_datatype.gif "Data Type") [contact](searchparameter-definitions.html#SearchParameter.contact "SearchParameter.contact : Contact details to assist a user in finding and communicating with the publisher.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

0..\*

[ContactDetail](metadatatypes.html#ContactDetail)

Contact details for the publisher  
  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [description](searchparameter-definitions.html#SearchParameter.description "SearchParameter.description : And how it used.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")[T](languages.html#translatable "This element is a candidate for being translated")

1..1

[markdown](datatypes.html#markdown)

Natural language description of the search parameter  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_datatype.gif "Data Type") [useContext](searchparameter-definitions.html#SearchParameter.useContext "SearchParameter.useContext : The content was developed with a focus and intent of supporting the contexts that are listed. These contexts may be general categories (gender, age, ...) or may be references to specific programs (insurance plans, studies, ...) and may be used to assist with indexing and searching for appropriate search parameter instances.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

0..\*

[UsageContext](metadatatypes.html#UsageContext)

The context that the content is intended to support  
  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_datatype.gif "Data Type") [jurisdiction](searchparameter-definitions.html#SearchParameter.jurisdiction "SearchParameter.jurisdiction : A legal or geographic region in which the search parameter is intended to be used.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")[XD](versions.html#std-process "Standards Status = Deprecated")

0..\*

[CodeableConcept](datatypes.html#CodeableConcept)

Intended jurisdiction for search parameter (if applicable)  
Binding: [Jurisdiction ValueSet](valueset-jurisdiction.html) ([Extensible](terminologies.html#extensible "To be conformant, the concept in this element SHALL be from the specified value set if any of the codes within the value set can apply to the concept being communicated.  If the value set does not cover the concept (based on human review), alternate codings (or, data type allowing, text) may be included instead."))  
  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [purpose](searchparameter-definitions.html#SearchParameter.purpose "SearchParameter.purpose : Explanation of why this search parameter is needed and why it has been designed as it has.")

[T](languages.html#translatable "This element is a candidate for being translated")

0..1

[markdown](datatypes.html#markdown)

Why this search parameter is defined  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [copyright](searchparameter-definitions.html#SearchParameter.copyright "SearchParameter.copyright : A copyright statement relating to the search parameter and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the search parameter.")

[T](languages.html#translatable "This element is a candidate for being translated")

0..1

[markdown](datatypes.html#markdown)

Use and/or publishing restrictions  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [copyrightLabel](searchparameter-definitions.html#SearchParameter.copyrightLabel "SearchParameter.copyrightLabel : A short string (<50 characters), suitable for inclusion in a page footer that identifies the copyright holder, effective period, and optionally whether rights are resctricted. (e.g. 'All rights reserved', 'Some rights reserved').")

[T](languages.html#translatable "This element is a candidate for being translated")

0..1

[string](datatypes.html#string)

Copyright holder and year(s)  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [code](searchparameter-definitions.html#SearchParameter.code "SearchParameter.code : The label that is recommended to be used in the URL or the parameter name in a parameters resource for this search parameter.  In some cases, servers may need to use a different CapabilityStatement searchParam.name to differentiate between multiple SearchParameters that happen to have the same code.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

1..1

[code](datatypes.html#code)

Recommended name for parameter in search url  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [aliasCode](searchparameter-definitions.html#SearchParameter.aliasCode "SearchParameter.aliasCode : Additional label that are recommended to be used in the URL or the parameter name in a parameters resource for this search parameter. Typically used to provide backwards-compatibility for renamed search parameters and translations into localized languages.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

0..\*

[code](datatypes.html#code)

Additional recommended names for parameter in search url  
  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [base](searchparameter-definitions.html#SearchParameter.base "SearchParameter.base : The base resource type(s) that this search parameter can be used against.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")

1..\*

[code](datatypes.html#code)

The resource type(s) this search parameter applies to  
Binding: [Version Independent Resource Types (All)](valueset-version-independent-all-resource-types.html) ([Required](terminologies.html#required "To be conformant, the concept in this element SHALL be from the specified value set."))

**Additional Bindings**

Purpose

[All Resource Types](valueset-all-resource-types.html)

[UI Binding](valueset-additional-binding-purpose.html#additional-binding-purpose-ui "This value set is provided to user look up in a given context")

  
  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [type](searchparameter-definitions.html#SearchParameter.type "SearchParameter.type : The type of value that a search parameter may contain, and how the content is interpreted.")

[Σ](elementdefinition-definitions.html#ElementDefinition.isSummary "This element is included in summaries")[C](conformance-rules.html#constraints "This element has or is affected by some invariants")

1..1

[code](datatypes.html#code)

number | date | string | token | reference | composite | quantity | uri | special | resource  
Binding: [SearchParamType](valueset-search-param-type.html) ([Required](terminologies.html#required "To be conformant, the concept in this element SHALL be from the specified value set."))  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [expression](searchparameter-definitions.html#SearchParameter.expression "SearchParameter.expression : A FHIRPath expression that returns a set of elements for the search parameter.")

[C](conformance-rules.html#constraints "This element has or is affected by some invariants")

0..1

[string](datatypes.html#string)

FHIRPath expression that extracts the values  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [processingMode](searchparameter-definitions.html#SearchParameter.processingMode "SearchParameter.processingMode : How the search parameter relates to the set of elements returned by evaluating the expression query.")

[C](conformance-rules.html#constraints "This element has or is affected by some invariants")

0..1

[code](datatypes.html#code)

normal | phonetic | other  
Binding: [Search Processing Mode Type](valueset-search-processingmode.html) ([Required](terminologies.html#required "To be conformant, the concept in this element SHALL be from the specified value set."))  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [constraint](searchparameter-definitions.html#SearchParameter.constraint "SearchParameter.constraint : FHIRPath expression that defines/sets a complex constraint for when this SearchParameter is applicable.")

0..1

[string](datatypes.html#string)

FHIRPath expression that constraints the usage of this SearchParamete  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [target](searchparameter-definitions.html#SearchParameter.target "SearchParameter.target : Types of resource (if a resource is referenced).")

0..\*

[code](datatypes.html#code)

Types of resource (if a resource reference)  
Binding: [Version Independent Resource Types (All)](valueset-version-independent-all-resource-types.html) ([Required](terminologies.html#required "To be conformant, the concept in this element SHALL be from the specified value set."))

**Additional Bindings**

Purpose

[All Resource Types](valueset-all-resource-types.html)

[UI Binding](valueset-additional-binding-purpose.html#additional-binding-purpose-ui "This value set is provided to user look up in a given context")

  
  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [multipleOr](searchparameter-definitions.html#SearchParameter.multipleOr "SearchParameter.multipleOr : Whether multiple values are allowed for each time the parameter exists. Values are separated by commas, and the parameter matches if any of the values match.")

0..1

[boolean](datatypes.html#boolean)

Allow multiple values per parameter (or)  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [multipleAnd](searchparameter-definitions.html#SearchParameter.multipleAnd "SearchParameter.multipleAnd : Whether multiple parameters are allowed - e.g. more than one parameter with the same name. The search matches if all the parameters match.")

0..1

[boolean](datatypes.html#boolean)

Allow multiple parameters (and)  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [comparator](searchparameter-definitions.html#SearchParameter.comparator "SearchParameter.comparator : Comparators supported for the search parameter.")

[C](conformance-rules.html#constraints "This element has or is affected by some invariants")

0..\*

[code](datatypes.html#code)

eq | ne | gt | lt | ge | le | sa | eb | ap  
Binding: [Search Comparator](valueset-search-comparator.html) ([Required](terminologies.html#required "To be conformant, the concept in this element SHALL be from the specified value set."))  
  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [modifier](searchparameter-definitions.html#SearchParameter.modifier "SearchParameter.modifier : A modifier supported for the search parameter.")

0..\*

[code](datatypes.html#code)

missing | exact | contains | not | text | in | not-in | below | above | type | identifier | of-type | code-text | text-advanced | iterate  
Binding: [Search Modifier Code](valueset-search-modifier-code.html) ([Required](terminologies.html#required "To be conformant, the concept in this element SHALL be from the specified value set."))  
  

![.](tbl_spacer.png)![.](tbl_vjoin.png)![.](icon_primitive.png "Primitive Data Type") [chain](searchparameter-definitions.html#SearchParameter.chain "SearchParameter.chain : Contains the names of any search parameters which may be chained to the containing search parameter. Chained parameters may be added to search parameters of type reference and specify that resources will only be returned if they contain a reference to a resource which matches the chained parameter value. Values for this field should be drawn from SearchParameter.code for a parameter on the target resource type.")

[C](conformance-rules.html#constraints "This element has or is affected by some invariants")

0..\*

[string](datatypes.html#string)

Chained names supported  
  

![.](tbl_spacer.png)![.](tbl_vjoin_end-open.png)![.](icon_element.gif "Element") [component](searchparameter-definitions.html#SearchParameter.component "SearchParameter.component : Used to define the parts of a composite search parameter.")

0..\*

[BackboneElement](types.html#BackBoneElement)

For Composite resources to define the parts  
  

![.](tbl_spacer.png)![.](tbl_blank.png)![.](tbl_vjoin.png)![.](icon_reference.png "Reference to another Resource") [definition](searchparameter-definitions.html#SearchParameter.component.definition "SearchParameter.component.definition : The definition of the search parameter that describes this part.")

1..1

[canonical](datatypes.html#canonical)([SearchParameter](searchparameter.html))

Defines how the part works  

![.](tbl_spacer.png)![.](tbl_blank.png)![.](tbl_vjoin_end.png)![.](icon_primitive.png "Primitive Data Type") [expression](searchparameter-definitions.html#SearchParameter.component.expression "SearchParameter.component.expression : A sub-expression that defines how to extract values for this component from the output of the main SearchParameter.expression.")

1..1

[string](datatypes.html#string)

Subexpression relative to main expression  

  
 [![doco](help16.png) Documentation for this format ![icon](external.png)](https://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#table-views "Legend for this format") 

[See the Extensions](searchparameter-profiles.html#extensions) for this resource

**UML Diagram** ([Legend](formats.html#uml))

SearchParameter (DomainResource) +CanonicalResourceAn absolute URI that is used to identify this search parameter when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which an authoritative instance of this search parameter is (or will be) published. This URL can be the target of a canonical reference. It SHALL remain the same when the search parameter is stored on different serversurl : uri \[1..1\]A formal identifier that is used to identify this search parameter when it is represented in other formats, or referenced in a specification, model, design or an instanceidentifier : Identifier \[0..\*\]The identifier that is used to identify this version of the search parameter when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the search parameter author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequenceversion : string \[0..1\]Indicates the mechanism used to compare versions to determine which is more currentversionAlgorithm\[x\] : DataType \[0..1\] « string|Coding; null (Strength=Extensible) VersionAlgorithm\+ »A natural language name identifying the search parameter. This name should be usable as an identifier for the module by machine processing applications such as code generationname : string \[1..1\] « This element has or is affected by some invariantsC »A short, descriptive, user-friendly title for the search parametertitle : string \[0..1\]Where this search parameter is originally defined. If a derivedFrom is provided, then the details in the search parameter must be consistent with the definition from which it is defined. i.e. the parameter should have the same meaning, and (usually) the functionality should be a proper subset of the underlying search parameterderivedFrom : canonical \[0..1\] « SearchParameter »The status of this search parameter. Enables tracking the life-cycle of the content (this element modifies the meaning of other elements)status : code \[1..1\] « null (Strength=Required)PublicationStatus! »A Boolean value to indicate that this search parameter is authored for testing purposes (or education/evaluation/marketing) and no version of this resource will ever be intended for genuine usageexperimental : boolean \[0..1\]The date (and optionally time) when the search parameter was last significantly changed. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the search parameter changesdate : dateTime \[0..1\]The name of the organization or individual tresponsible for the release and ongoing maintenance of the search parameterpublisher : string \[0..1\]Contact details to assist a user in finding and communicating with the publishercontact : ContactDetail \[0..\*\]And how it useddescription : markdown \[1..1\]The content was developed with a focus and intent of supporting the contexts that are listed. These contexts may be general categories (gender, age, ...) or may be references to specific programs (insurance plans, studies, ...) and may be used to assist with indexing and searching for appropriate search parameter instancesuseContext : UsageContext \[0..\*\]A legal or geographic region in which the search parameter is intended to be usedjurisdiction : CodeableConcept \[0..\*\] « null (Strength=Extensible)JurisdictionValueSet\+ »Explanation of why this search parameter is needed and why it has been designed as it haspurpose : markdown \[0..1\]A copyright statement relating to the search parameter and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the search parametercopyright : markdown \[0..1\]A short string (<50 characters), suitable for inclusion in a page footer that identifies the copyright holder, effective period, and optionally whether rights are resctricted. (e.g. 'All rights reserved', 'Some rights reserved')copyrightLabel : string \[0..1\]The label that is recommended to be used in the URL or the parameter name in a parameters resource for this search parameter. In some cases, servers may need to use a different CapabilityStatement searchParam.name to differentiate between multiple SearchParameters that happen to have the same codecode : code \[1..1\]Additional label that are recommended to be used in the URL or the parameter name in a parameters resource for this search parameter. Typically used to provide backwards-compatibility for renamed search parameters and translations into localized languagesaliasCode : code \[0..\*\]The base resource type(s) that this search parameter can be used againstbase : code \[1..\*\] « null (Strength=Required)VersionIndependentResourceTyp...! »The type of value that a search parameter may contain, and how the content is interpretedtype : code \[1..1\] « null (Strength=Required)SearchParamType! » « This element has or is affected by some invariantsC »A FHIRPath expression that returns a set of elements for the search parameterexpression : string \[0..1\] « This element has or is affected by some invariantsC »How the search parameter relates to the set of elements returned by evaluating the expression queryprocessingMode : code \[0..1\] « null (Strength=Required)SearchProcessingModeType! » « This element has or is affected by some invariantsC »FHIRPath expression that defines/sets a complex constraint for when this SearchParameter is applicableconstraint : string \[0..1\]Types of resource (if a resource is referenced)target : code \[0..\*\] « null (Strength=Required)VersionIndependentResourceTyp...! »Whether multiple values are allowed for each time the parameter exists. Values are separated by commas, and the parameter matches if any of the values matchmultipleOr : boolean \[0..1\]Whether multiple parameters are allowed - e.g. more than one parameter with the same name. The search matches if all the parameters matchmultipleAnd : boolean \[0..1\]Comparators supported for the search parametercomparator : code \[0..\*\] « null (Strength=Required)SearchComparator! » « This element has or is affected by some invariantsC »A modifier supported for the search parametermodifier : code \[0..\*\] « null (Strength=Required)SearchModifierCode! »Contains the names of any search parameters which may be chained to the containing search parameter. Chained parameters may be added to search parameters of type reference and specify that resources will only be returned if they contain a reference to a resource which matches the chained parameter value. Values for this field should be drawn from SearchParameter.code for a parameter on the target resource typechain : string \[0..\*\] « This element has or is affected by some invariantsC »ComponentThe definition of the search parameter that describes this partdefinition : canonical \[1..1\] « SearchParameter »A sub-expression that defines how to extract values for this component from the output of the main SearchParameter.expressionexpression : string \[1..1\]Used to define the parts of a composite search parametercomponent\[0..\*\]

**XML Template**

<[**SearchParameter**](searchparameter-definitions.html#SearchParameter "A search parameter that defines a named search item that can be used to search/filter on a resource.") xmlns="http://hl7.org/fhir"> [![doco](help.png)](xml.html "Documentation for this format")
 <!-- from [Resource](resource.html): [id](resource.html#id), [meta](resource.html#meta), [implicitRules](resource.html#implicitRules), and [language](resource.html#language) -->
 <!-- from [DomainResource](domainresource.html): [text](narrative.html#Narrative), [contained](references.html#contained), [extension](extensibility.html), and [modifierExtension](extensibility.html#modifierExtension) -->
 <[**url**](searchparameter-definitions.html#SearchParameter.url "An absolute URI that is used to identify this search parameter when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which an authoritative instance of this search parameter is (or will be) published. This URL can be the target of a canonical reference. It SHALL remain the same when the search parameter is stored on different servers.") value="\[[uri](datatypes.html#uri)\]"/><!-- **1..1** [Canonical identifier for this search parameter, represented as a URI (globally unique)](terminologies.html#unbound) -->
 <[**identifier**](searchparameter-definitions.html#SearchParameter.identifier "A formal identifier that is used to identify this search parameter when it is represented in other formats, or referenced in a specification, model, design or an instance.")\><!-- **0..\*** [Identifier](datatypes.html#Identifier) [Additional identifier for the search parameter (business identifier)](terminologies.html#unbound) --></identifier>
 <[**version**](searchparameter-definitions.html#SearchParameter.version "The identifier that is used to identify this version of the search parameter when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the search parameter author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequence.") value="\[[string](datatypes.html#string)\]"/><!-- **0..1** [Business version of the search parameter](terminologies.html#unbound) -->
 <[**versionAlgorithm\[x\]**](searchparameter-definitions.html#SearchParameter.versionAlgorithm[x] "Indicates the mechanism used to compare versions to determine which is more current.")\><!-- **0..1** [string](datatypes.html#string)|[Coding](datatypes.html#Coding) [How to compare versions](valueset-version-algorithm.html) --></versionAlgorithm\[x\]>
 <[**name**](searchparameter-definitions.html#SearchParameter.name "A natural language name identifying the search parameter. This name should be usable as an identifier for the module by machine processing applications such as code generation.") value="\[[string](datatypes.html#string)\]"/><!-- **[I](conformance-rules.html#constraints "This element has or is affected by some invariants") 1..1** [Name for this search parameter (computer friendly)](terminologies.html#unbound) -->
 <[**title**](searchparameter-definitions.html#SearchParameter.title "A short, descriptive, user-friendly title for the search parameter.") value="\[[string](datatypes.html#string)\]"/><!-- **0..1** [Name for this search parameter (human friendly)](terminologies.html#unbound) -->
 <[**derivedFrom**](searchparameter-definitions.html#SearchParameter.derivedFrom "Where this search parameter is originally defined. If a derivedFrom is provided, then the details in the search parameter must be consistent with the definition from which it is defined. i.e. the parameter should have the same meaning, and (usually) the functionality should be a proper subset of the underlying search parameter.")\><!-- **0..1** [canonical](datatypes.html#canonical)([SearchParameter](searchparameter.html#SearchParameter)) [Original definition for the search parameter](terminologies.html#unbound) --></derivedFrom>
 <[**status**](searchparameter-definitions.html#SearchParameter.status "The status of this search parameter. Enables tracking the life-cycle of the content (this element modifies the meaning of other elements)") value="\[[code](datatypes.html#code)\]"/><!-- **1..1** [draft | active | retired | unknown](valueset-publication-status.html) -->
 <[**experimental**](searchparameter-definitions.html#SearchParameter.experimental "A Boolean value to indicate that this search parameter is authored for testing purposes (or education/evaluation/marketing) and no version of this resource will ever be intended for genuine usage.") value="\[[boolean](datatypes.html#boolean)\]"/><!-- **0..1** [For testing only - never for real usage](terminologies.html#unbound) -->
 <[**date**](searchparameter-definitions.html#SearchParameter.date "The date  (and optionally time) when the search parameter was last significantly changed. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the search parameter changes.") value="\[[dateTime](datatypes.html#dateTime)\]"/><!-- **0..1** [Date last changed](terminologies.html#unbound) -->
 <[**publisher**](searchparameter-definitions.html#SearchParameter.publisher "The name of the organization or individual tresponsible for the release and ongoing maintenance of the search parameter.") value="\[[string](datatypes.html#string)\]"/><!-- **0..1** [Name of the publisher/steward (organization or individual)](terminologies.html#unbound) -->
 <[**contact**](searchparameter-definitions.html#SearchParameter.contact "Contact details to assist a user in finding and communicating with the publisher.")\><!-- **0..\*** [ContactDetail](metadatatypes.html#ContactDetail) [Contact details for the publisher](terminologies.html#unbound) --></contact>
 <[**description**](searchparameter-definitions.html#SearchParameter.description "And how it used.") value="\[[markdown](datatypes.html#markdown)\]"/><!-- **1..1** [Natural language description of the search parameter](terminologies.html#unbound) -->
 <[**useContext**](searchparameter-definitions.html#SearchParameter.useContext "The content was developed with a focus and intent of supporting the contexts that are listed. These contexts may be general categories (gender, age, ...) or may be references to specific programs (insurance plans, studies, ...) and may be used to assist with indexing and searching for appropriate search parameter instances.")\><!-- **0..\*** [UsageContext](metadatatypes.html#UsageContext) [The context that the content is intended to support](terminologies.html#unbound) --></useContext>
 <[**jurisdiction**](searchparameter-definitions.html#SearchParameter.jurisdiction "A legal or geographic region in which the search parameter is intended to be used.")\><!-- **0..\*** [CodeableConcept](datatypes.html#CodeableConcept) [Intended jurisdiction for search parameter (if applicable)](valueset-jurisdiction.html) --></jurisdiction>
 <[**purpose**](searchparameter-definitions.html#SearchParameter.purpose "Explanation of why this search parameter is needed and why it has been designed as it has.") value="\[[markdown](datatypes.html#markdown)\]"/><!-- **0..1** [Why this search parameter is defined](terminologies.html#unbound) -->
 <[**copyright**](searchparameter-definitions.html#SearchParameter.copyright "A copyright statement relating to the search parameter and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the search parameter.") value="\[[markdown](datatypes.html#markdown)\]"/><!-- **0..1** [Use and/or publishing restrictions](terminologies.html#unbound) -->
 <[**copyrightLabel**](searchparameter-definitions.html#SearchParameter.copyrightLabel "A short string (<50 characters), suitable for inclusion in a page footer that identifies the copyright holder, effective period, and optionally whether rights are resctricted. (e.g. 'All rights reserved', 'Some rights reserved').") value="\[[string](datatypes.html#string)\]"/><!-- **0..1** [Copyright holder and year(s)](terminologies.html#unbound) -->
 <[**code**](searchparameter-definitions.html#SearchParameter.code "The label that is recommended to be used in the URL or the parameter name in a parameters resource for this search parameter.  In some cases, servers may need to use a different CapabilityStatement searchParam.name to differentiate between multiple SearchParameters that happen to have the same code.") value="\[[code](datatypes.html#code)\]"/><!-- **1..1** [Recommended name for parameter in search url](terminologies.html#unbound) -->
 <[**aliasCode**](searchparameter-definitions.html#SearchParameter.aliasCode "Additional label that are recommended to be used in the URL or the parameter name in a parameters resource for this search parameter. Typically used to provide backwards-compatibility for renamed search parameters and translations into localized languages.") value="\[[code](datatypes.html#code)\]"/><!-- **0..\*** [Additional recommended names for parameter in search url](terminologies.html#unbound) -->
 <[**base**](searchparameter-definitions.html#SearchParameter.base "The base resource type(s) that this search parameter can be used against.") value="\[[code](datatypes.html#code)\]"/><!-- **1..\*** [The resource type(s) this search parameter applies to](valueset-version-independent-all-resource-types.html) -->
 <[**type**](searchparameter-definitions.html#SearchParameter.type "The type of value that a search parameter may contain, and how the content is interpreted.") value="\[[code](datatypes.html#code)\]"/><!-- **[I](conformance-rules.html#constraints "This element has or is affected by some invariants") 1..1** [number | date | string | token | reference | composite | quantity | uri | special | resource](valueset-search-param-type.html) -->
 <[**expression**](searchparameter-definitions.html#SearchParameter.expression "A FHIRPath expression that returns a set of elements for the search parameter.") value="\[[string](datatypes.html#string)\]"/><!-- **[I](conformance-rules.html#constraints "This element has or is affected by some invariants") 0..1** [FHIRPath expression that extracts the values](terminologies.html#unbound) -->
 <[**processingMode**](searchparameter-definitions.html#SearchParameter.processingMode "How the search parameter relates to the set of elements returned by evaluating the expression query.") value="\[[code](datatypes.html#code)\]"/><!-- **[I](conformance-rules.html#constraints "This element has or is affected by some invariants") 0..1** [normal | phonetic | other](valueset-search-processingmode.html) -->
 <[**constraint**](searchparameter-definitions.html#SearchParameter.constraint "FHIRPath expression that defines/sets a complex constraint for when this SearchParameter is applicable.") value="\[[string](datatypes.html#string)\]"/><!-- **0..1** [FHIRPath expression that constraints the usage of this SearchParamete](terminologies.html#unbound) -->
 <[**target**](searchparameter-definitions.html#SearchParameter.target "Types of resource (if a resource is referenced).") value="\[[code](datatypes.html#code)\]"/><!-- **0..\*** [Types of resource (if a resource reference)](valueset-version-independent-all-resource-types.html) -->
 <[**multipleOr**](searchparameter-definitions.html#SearchParameter.multipleOr "Whether multiple values are allowed for each time the parameter exists. Values are separated by commas, and the parameter matches if any of the values match.") value="\[[boolean](datatypes.html#boolean)\]"/><!-- **0..1** [Allow multiple values per parameter (or)](terminologies.html#unbound) -->
 <[**multipleAnd**](searchparameter-definitions.html#SearchParameter.multipleAnd "Whether multiple parameters are allowed - e.g. more than one parameter with the same name. The search matches if all the parameters match.") value="\[[boolean](datatypes.html#boolean)\]"/><!-- **0..1** [Allow multiple parameters (and)](terminologies.html#unbound) -->
 <[**comparator**](searchparameter-definitions.html#SearchParameter.comparator "Comparators supported for the search parameter.") value="\[[code](datatypes.html#code)\]"/><!-- **[I](conformance-rules.html#constraints "This element has or is affected by some invariants") 0..\*** [eq | ne | gt | lt | ge | le | sa | eb | ap](valueset-search-comparator.html) -->
 <[**modifier**](searchparameter-definitions.html#SearchParameter.modifier "A modifier supported for the search parameter.") value="\[[code](datatypes.html#code)\]"/><!-- **0..\*** [missing | exact | contains | not | text | in | not-in | below | above | type | identifier | of-type | code-text | text-advanced | iterate](valueset-search-modifier-code.html) -->
 <[**chain**](searchparameter-definitions.html#SearchParameter.chain "Contains the names of any search parameters which may be chained to the containing search parameter. Chained parameters may be added to search parameters of type reference and specify that resources will only be returned if they contain a reference to a resource which matches the chained parameter value. Values for this field should be drawn from SearchParameter.code for a parameter on the target resource type.") value="\[[string](datatypes.html#string)\]"/><!-- **[I](conformance-rules.html#constraints "This element has or is affected by some invariants") 0..\*** [Chained names supported](terminologies.html#unbound) -->
 <[**component**](searchparameter-definitions.html#SearchParameter.component "Used to define the parts of a composite search parameter.")\>  <!-- **0..\*** For Composite resources to define the parts -->
  <[**definition**](searchparameter-definitions.html#SearchParameter.component.definition "The definition of the search parameter that describes this part.")\><!-- **1..1** [canonical](datatypes.html#canonical)([SearchParameter](searchparameter.html#SearchParameter)) [Defines how the part works](terminologies.html#unbound) --></definition>
  <[**expression**](searchparameter-definitions.html#SearchParameter.component.expression "A sub-expression that defines how to extract values for this component from the output of the main SearchParameter.expression.") value="\[[string](datatypes.html#string)\]"/><!-- **1..1** [Subexpression relative to main expression](terminologies.html#unbound) -->
 </component>
</SearchParameter>

**JSON Template**

{[![doco](help.png)](json.html "Documentation for this format")
  "resourceType" : "[**SearchParameter**](searchparameter-definitions.html#SearchParameter "A search parameter that defines a named search item that can be used to search/filter on a resource.")",
  // from [Resource](resource.html): [id](resource.html#id), [meta](resource.html#meta), [implicitRules](resource.html#implicitRules), and [language](resource.html#language)
  // from [DomainResource](domainresource.html): [text](narrative.html#Narrative), [contained](references.html#contained), [extension](extensibility.html), and [modifierExtension](extensibility.html#modifierExtension)
  "[url](searchparameter-definitions.html#SearchParameter.url "An absolute URI that is used to identify this search parameter when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which an authoritative instance of this search parameter is (or will be) published. This URL can be the target of a canonical reference. It SHALL remain the same when the search parameter is stored on different servers.")" : "<[uri](datatypes.html#uri)\>", // **R!**  [Canonical identifier for this search parameter, represented as a URI (globally unique)](terminologies.html#unbound)
  "[identifier](searchparameter-definitions.html#SearchParameter.identifier "A formal identifier that is used to identify this search parameter when it is represented in other formats, or referenced in a specification, model, design or an instance.")" : \[{ [Identifier](datatypes.html#Identifier) }\], // [Additional identifier for the search parameter (business identifier)](terminologies.html#unbound)
  "[version](searchparameter-definitions.html#SearchParameter.version "The identifier that is used to identify this version of the search parameter when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the search parameter author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequence.")" : "<[string](datatypes.html#string)\>", // [Business version of the search parameter](terminologies.html#unbound)
  // versionAlgorithm\[x\]: How to compare versions. One of these 2:
  "[versionAlgorithmString](searchparameter-definitions.html#SearchParameter.versionAlgorithmString "Indicates the mechanism used to compare versions to determine which is more current.")" : "<[string](datatypes.html#string)\>",
  "[versionAlgorithmCoding](searchparameter-definitions.html#SearchParameter.versionAlgorithmCoding "Indicates the mechanism used to compare versions to determine which is more current.")" : { [Coding](datatypes.html#Coding) },
  "[name](searchparameter-definitions.html#SearchParameter.name "A natural language name identifying the search parameter. This name should be usable as an identifier for the module by machine processing applications such as code generation.")" : "<[string](datatypes.html#string)\>", // [I](conformance-rules.html#constraints "This element has or is affected by some invariants") **R!**  [Name for this search parameter (computer friendly)](terminologies.html#unbound)
  "[title](searchparameter-definitions.html#SearchParameter.title "A short, descriptive, user-friendly title for the search parameter.")" : "<[string](datatypes.html#string)\>", // [Name for this search parameter (human friendly)](terminologies.html#unbound)
  "[derivedFrom](searchparameter-definitions.html#SearchParameter.derivedFrom "Where this search parameter is originally defined. If a derivedFrom is provided, then the details in the search parameter must be consistent with the definition from which it is defined. i.e. the parameter should have the same meaning, and (usually) the functionality should be a proper subset of the underlying search parameter.")" : "<[canonical](datatypes.html#canonical)([SearchParameter](searchparameter.html#SearchParameter))>", // [Original definition for the search parameter](terminologies.html#unbound)
  "[status](searchparameter-definitions.html#SearchParameter.status "The status of this search parameter. Enables tracking the life-cycle of the content (this element modifies the meaning of other elements)")" : "<[code](datatypes.html#code)\>", // **R!**  [draft | active | retired | unknown](valueset-publication-status.html)
  "[experimental](searchparameter-definitions.html#SearchParameter.experimental "A Boolean value to indicate that this search parameter is authored for testing purposes (or education/evaluation/marketing) and no version of this resource will ever be intended for genuine usage.")" : <[boolean](datatypes.html#boolean)\>, // [For testing only - never for real usage](terminologies.html#unbound)
  "[date](searchparameter-definitions.html#SearchParameter.date "The date  (and optionally time) when the search parameter was last significantly changed. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the search parameter changes.")" : "<[dateTime](datatypes.html#dateTime)\>", // [Date last changed](terminologies.html#unbound)
  "[publisher](searchparameter-definitions.html#SearchParameter.publisher "The name of the organization or individual tresponsible for the release and ongoing maintenance of the search parameter.")" : "<[string](datatypes.html#string)\>", // [Name of the publisher/steward (organization or individual)](terminologies.html#unbound)
  "[contact](searchparameter-definitions.html#SearchParameter.contact "Contact details to assist a user in finding and communicating with the publisher.")" : \[{ [ContactDetail](metadatatypes.html#ContactDetail) }\], // [Contact details for the publisher](terminologies.html#unbound)
  "[description](searchparameter-definitions.html#SearchParameter.description "And how it used.")" : "<[markdown](datatypes.html#markdown)\>", // **R!**  [Natural language description of the search parameter](terminologies.html#unbound)
  "[useContext](searchparameter-definitions.html#SearchParameter.useContext "The content was developed with a focus and intent of supporting the contexts that are listed. These contexts may be general categories (gender, age, ...) or may be references to specific programs (insurance plans, studies, ...) and may be used to assist with indexing and searching for appropriate search parameter instances.")" : \[{ [UsageContext](metadatatypes.html#UsageContext) }\], // [The context that the content is intended to support](terminologies.html#unbound)
  "[jurisdiction](searchparameter-definitions.html#SearchParameter.jurisdiction "A legal or geographic region in which the search parameter is intended to be used.")" : \[{ [CodeableConcept](datatypes.html#CodeableConcept) }\], // [Intended jurisdiction for search parameter (if applicable)](valueset-jurisdiction.html)
  "[purpose](searchparameter-definitions.html#SearchParameter.purpose "Explanation of why this search parameter is needed and why it has been designed as it has.")" : "<[markdown](datatypes.html#markdown)\>", // [Why this search parameter is defined](terminologies.html#unbound)
  "[copyright](searchparameter-definitions.html#SearchParameter.copyright "A copyright statement relating to the search parameter and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the search parameter.")" : "<[markdown](datatypes.html#markdown)\>", // [Use and/or publishing restrictions](terminologies.html#unbound)
  "[copyrightLabel](searchparameter-definitions.html#SearchParameter.copyrightLabel "A short string (<50 characters), suitable for inclusion in a page footer that identifies the copyright holder, effective period, and optionally whether rights are resctricted. (e.g. 'All rights reserved', 'Some rights reserved').")" : "<[string](datatypes.html#string)\>", // [Copyright holder and year(s)](terminologies.html#unbound)
  "[code](searchparameter-definitions.html#SearchParameter.code "The label that is recommended to be used in the URL or the parameter name in a parameters resource for this search parameter.  In some cases, servers may need to use a different CapabilityStatement searchParam.name to differentiate between multiple SearchParameters that happen to have the same code.")" : "<[code](datatypes.html#code)\>", // **R!**  [Recommended name for parameter in search url](terminologies.html#unbound)
  "[aliasCode](searchparameter-definitions.html#SearchParameter.aliasCode "Additional label that are recommended to be used in the URL or the parameter name in a parameters resource for this search parameter. Typically used to provide backwards-compatibility for renamed search parameters and translations into localized languages.")" : \["<[code](datatypes.html#code)\>"\], // [Additional recommended names for parameter in search url](terminologies.html#unbound)
  "[base](searchparameter-definitions.html#SearchParameter.base "The base resource type(s) that this search parameter can be used against.")" : \["<[code](datatypes.html#code)\>"\], // **R!**  [The resource type(s) this search parameter applies to](valueset-version-independent-all-resource-types.html)
  "[type](searchparameter-definitions.html#SearchParameter.type "The type of value that a search parameter may contain, and how the content is interpreted.")" : "<[code](datatypes.html#code)\>", // [I](conformance-rules.html#constraints "This element has or is affected by some invariants") **R!**  [number | date | string | token | reference | composite | quantity | uri | special | resource](valueset-search-param-type.html)
  "[expression](searchparameter-definitions.html#SearchParameter.expression "A FHIRPath expression that returns a set of elements for the search parameter.")" : "<[string](datatypes.html#string)\>", // [I](conformance-rules.html#constraints "This element has or is affected by some invariants") [FHIRPath expression that extracts the values](terminologies.html#unbound)
  "[processingMode](searchparameter-definitions.html#SearchParameter.processingMode "How the search parameter relates to the set of elements returned by evaluating the expression query.")" : "<[code](datatypes.html#code)\>", // [I](conformance-rules.html#constraints "This element has or is affected by some invariants") [normal | phonetic | other](valueset-search-processingmode.html)
  "[constraint](searchparameter-definitions.html#SearchParameter.constraint "FHIRPath expression that defines/sets a complex constraint for when this SearchParameter is applicable.")" : "<[string](datatypes.html#string)\>", // [FHIRPath expression that constraints the usage of this SearchParamete](terminologies.html#unbound)
  "[target](searchparameter-definitions.html#SearchParameter.target "Types of resource (if a resource is referenced).")" : \["<[code](datatypes.html#code)\>"\], // [Types of resource (if a resource reference)](valueset-version-independent-all-resource-types.html)
  "[multipleOr](searchparameter-definitions.html#SearchParameter.multipleOr "Whether multiple values are allowed for each time the parameter exists. Values are separated by commas, and the parameter matches if any of the values match.")" : <[boolean](datatypes.html#boolean)\>, // [Allow multiple values per parameter (or)](terminologies.html#unbound)
  "[multipleAnd](searchparameter-definitions.html#SearchParameter.multipleAnd "Whether multiple parameters are allowed - e.g. more than one parameter with the same name. The search matches if all the parameters match.")" : <[boolean](datatypes.html#boolean)\>, // [Allow multiple parameters (and)](terminologies.html#unbound)
  "[comparator](searchparameter-definitions.html#SearchParameter.comparator "Comparators supported for the search parameter.")" : \["<[code](datatypes.html#code)\>"\], // [I](conformance-rules.html#constraints "This element has or is affected by some invariants") [eq | ne | gt | lt | ge | le | sa | eb | ap](valueset-search-comparator.html)
  "[modifier](searchparameter-definitions.html#SearchParameter.modifier "A modifier supported for the search parameter.")" : \["<[code](datatypes.html#code)\>"\], // [missing | exact | contains | not | text | in | not-in | below | above | type | identifier | of-type | code-text | text-advanced | iterate](valueset-search-modifier-code.html)
  "[chain](searchparameter-definitions.html#SearchParameter.chain "Contains the names of any search parameters which may be chained to the containing search parameter. Chained parameters may be added to search parameters of type reference and specify that resources will only be returned if they contain a reference to a resource which matches the chained parameter value. Values for this field should be drawn from SearchParameter.code for a parameter on the target resource type.")" : \["<[string](datatypes.html#string)\>"\], // [I](conformance-rules.html#constraints "This element has or is affected by some invariants") [Chained names supported](terminologies.html#unbound)
  "[component](searchparameter-definitions.html#SearchParameter.component "Used to define the parts of a composite search parameter.")" : \[{ // [For Composite resources to define the parts](terminologies.html#unbound)
    "[definition](searchparameter-definitions.html#SearchParameter.component.definition "The definition of the search parameter that describes this part.")" : "<[canonical](datatypes.html#canonical)([SearchParameter](searchparameter.html#SearchParameter))>", // **R!**  [Defines how the part works](terminologies.html#unbound)
    "[expression](searchparameter-definitions.html#SearchParameter.component.expression "A sub-expression that defines how to extract values for this component from the output of the main SearchParameter.expression.")" : "<[string](datatypes.html#string)\>" // **R!**  [Subexpression relative to main expression](terminologies.html#unbound)
  }\]
}

**Turtle Template**

@prefix fhir: <http://hl7.org/fhir/> .[![doco](help.png)](rdf.html "Documentation for this format")

\[ a fhir:[**SearchParameter**](searchparameter-definitions.html#SearchParameter "A search parameter that defines a named search item that can be used to search/filter on a resource.");
  fhir:nodeRole fhir:treeRoot; # if this is the parser root

  # from [Resource](resource.html): [.id](resource.html#id), [.meta](resource.html#meta), [.implicitRules](resource.html#implicitRules), and [.language](resource.html#language)
  # from [DomainResource](domainresource.html): [.text](narrative.html#Narrative), [.contained](references.html#contained), [.extension](extensibility.html), and [.modifierExtension](extensibility.html#modifierExtension)
  fhir:[url](searchparameter-definitions.html#SearchParameter.url "An absolute URI that is used to identify this search parameter when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which an authoritative instance of this search parameter is (or will be) published. This URL can be the target of a canonical reference. It SHALL remain the same when the search parameter is stored on different servers.") \[ [uri](datatypes.html#uri) \] ; # 1..1 Canonical identifier for this search parameter, represented as a URI (globally unique)
  fhir:[identifier](searchparameter-definitions.html#SearchParameter.identifier "A formal identifier that is used to identify this search parameter when it is represented in other formats, or referenced in a specification, model, design or an instance.")  ( \[ [Identifier](datatypes.html#Identifier) \] ... ) ; # 0..\* Additional identifier for the search parameter (business identifier)
  fhir:[version](searchparameter-definitions.html#SearchParameter.version "The identifier that is used to identify this version of the search parameter when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the search parameter author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequence.") \[ [string](datatypes.html#string) \] ; # 0..1 Business version of the search parameter
  # [versionAlgorithm\[x\]](searchparameter-definitions.html#SearchParameter.versionAlgorithm[x] "Indicates the mechanism used to compare versions to determine which is more current.") : 0..1 How to compare versions. One of these 2
    fhir:[versionAlgorithm](searchparameter-definitions.html#SearchParameter.versionAlgorithm "Indicates the mechanism used to compare versions to determine which is more current.") \[  a fhir:string ; [string](datatypes.html#string) \]
    fhir:[versionAlgorithm](searchparameter-definitions.html#SearchParameter.versionAlgorithm "Indicates the mechanism used to compare versions to determine which is more current.") \[  a fhir:Coding ; [Coding](datatypes.html#Coding) \]
  fhir:[name](searchparameter-definitions.html#SearchParameter.name "A natural language name identifying the search parameter. This name should be usable as an identifier for the module by machine processing applications such as code generation.") \[ [string](datatypes.html#string) \] ; # 1..1 [I](conformance-rules.html#constraints "This element has or is affected by some invariants") Name for this search parameter (computer friendly)
  fhir:[title](searchparameter-definitions.html#SearchParameter.title "A short, descriptive, user-friendly title for the search parameter.") \[ [string](datatypes.html#string) \] ; # 0..1 Name for this search parameter (human friendly)
  fhir:[derivedFrom](searchparameter-definitions.html#SearchParameter.derivedFrom "Where this search parameter is originally defined. If a derivedFrom is provided, then the details in the search parameter must be consistent with the definition from which it is defined. i.e. the parameter should have the same meaning, and (usually) the functionality should be a proper subset of the underlying search parameter.") \[ [canonical](datatypes.html#canonical)([SearchParameter](searchparameter.html#SearchParameter)) \] ; # 0..1 Original definition for the search parameter
  fhir:[status](searchparameter-definitions.html#SearchParameter.status "The status of this search parameter. Enables tracking the life-cycle of the content (this element modifies the meaning of other elements)") \[ [code](datatypes.html#code) \] ; # 1..1 draft | active | retired | unknown
  fhir:[experimental](searchparameter-definitions.html#SearchParameter.experimental "A Boolean value to indicate that this search parameter is authored for testing purposes (or education/evaluation/marketing) and no version of this resource will ever be intended for genuine usage.") \[ [boolean](datatypes.html#boolean) \] ; # 0..1 For testing only - never for real usage
  fhir:[date](searchparameter-definitions.html#SearchParameter.date "The date  (and optionally time) when the search parameter was last significantly changed. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the search parameter changes.") \[ [dateTime](datatypes.html#dateTime) \] ; # 0..1 Date last changed
  fhir:[publisher](searchparameter-definitions.html#SearchParameter.publisher "The name of the organization or individual tresponsible for the release and ongoing maintenance of the search parameter.") \[ [string](datatypes.html#string) \] ; # 0..1 Name of the publisher/steward (organization or individual)
  fhir:[contact](searchparameter-definitions.html#SearchParameter.contact "Contact details to assist a user in finding and communicating with the publisher.")  ( \[ [ContactDetail](metadatatypes.html#ContactDetail) \] ... ) ; # 0..\* Contact details for the publisher
  fhir:[description](searchparameter-definitions.html#SearchParameter.description "And how it used.") \[ [markdown](datatypes.html#markdown) \] ; # 1..1 Natural language description of the search parameter
  fhir:[useContext](searchparameter-definitions.html#SearchParameter.useContext "The content was developed with a focus and intent of supporting the contexts that are listed. These contexts may be general categories (gender, age, ...) or may be references to specific programs (insurance plans, studies, ...) and may be used to assist with indexing and searching for appropriate search parameter instances.")  ( \[ [UsageContext](metadatatypes.html#UsageContext) \] ... ) ; # 0..\* The context that the content is intended to support
  fhir:[jurisdiction](searchparameter-definitions.html#SearchParameter.jurisdiction "A legal or geographic region in which the search parameter is intended to be used.")  ( \[ [CodeableConcept](datatypes.html#CodeableConcept) \] ... ) ; # 0..\* Intended jurisdiction for search parameter (if applicable)
  fhir:[purpose](searchparameter-definitions.html#SearchParameter.purpose "Explanation of why this search parameter is needed and why it has been designed as it has.") \[ [markdown](datatypes.html#markdown) \] ; # 0..1 Why this search parameter is defined
  fhir:[copyright](searchparameter-definitions.html#SearchParameter.copyright "A copyright statement relating to the search parameter and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the search parameter.") \[ [markdown](datatypes.html#markdown) \] ; # 0..1 Use and/or publishing restrictions
  fhir:[copyrightLabel](searchparameter-definitions.html#SearchParameter.copyrightLabel "A short string (<50 characters), suitable for inclusion in a page footer that identifies the copyright holder, effective period, and optionally whether rights are resctricted. (e.g. 'All rights reserved', 'Some rights reserved').") \[ [string](datatypes.html#string) \] ; # 0..1 Copyright holder and year(s)
  fhir:[code](searchparameter-definitions.html#SearchParameter.code "The label that is recommended to be used in the URL or the parameter name in a parameters resource for this search parameter.  In some cases, servers may need to use a different CapabilityStatement searchParam.name to differentiate between multiple SearchParameters that happen to have the same code.") \[ [code](datatypes.html#code) \] ; # 1..1 Recommended name for parameter in search url
  fhir:[aliasCode](searchparameter-definitions.html#SearchParameter.aliasCode "Additional label that are recommended to be used in the URL or the parameter name in a parameters resource for this search parameter. Typically used to provide backwards-compatibility for renamed search parameters and translations into localized languages.")  ( \[ [code](datatypes.html#code) \] ... ) ; # 0..\* Additional recommended names for parameter in search url
  fhir:[base](searchparameter-definitions.html#SearchParameter.base "The base resource type(s) that this search parameter can be used against.")  ( \[ [code](datatypes.html#code) \] ... ) ; # 1..\* The resource type(s) this search parameter applies to
  fhir:[type](searchparameter-definitions.html#SearchParameter.type "The type of value that a search parameter may contain, and how the content is interpreted.") \[ [code](datatypes.html#code) \] ; # 1..1 [I](conformance-rules.html#constraints "This element has or is affected by some invariants") number | date | string | token | reference | composite | quantity | uri | special | resource
  fhir:[expression](searchparameter-definitions.html#SearchParameter.expression "A FHIRPath expression that returns a set of elements for the search parameter.") \[ [string](datatypes.html#string) \] ; # 0..1 [I](conformance-rules.html#constraints "This element has or is affected by some invariants") FHIRPath expression that extracts the values
  fhir:[processingMode](searchparameter-definitions.html#SearchParameter.processingMode "How the search parameter relates to the set of elements returned by evaluating the expression query.") \[ [code](datatypes.html#code) \] ; # 0..1 [I](conformance-rules.html#constraints "This element has or is affected by some invariants") normal | phonetic | other
  fhir:[constraint](searchparameter-definitions.html#SearchParameter.constraint "FHIRPath expression that defines/sets a complex constraint for when this SearchParameter is applicable.") \[ [string](datatypes.html#string) \] ; # 0..1 FHIRPath expression that constraints the usage of this SearchParamete
  fhir:[target](searchparameter-definitions.html#SearchParameter.target "Types of resource (if a resource is referenced).")  ( \[ [code](datatypes.html#code) \] ... ) ; # 0..\* Types of resource (if a resource reference)
  fhir:[multipleOr](searchparameter-definitions.html#SearchParameter.multipleOr "Whether multiple values are allowed for each time the parameter exists. Values are separated by commas, and the parameter matches if any of the values match.") \[ [boolean](datatypes.html#boolean) \] ; # 0..1 Allow multiple values per parameter (or)
  fhir:[multipleAnd](searchparameter-definitions.html#SearchParameter.multipleAnd "Whether multiple parameters are allowed - e.g. more than one parameter with the same name. The search matches if all the parameters match.") \[ [boolean](datatypes.html#boolean) \] ; # 0..1 Allow multiple parameters (and)
  fhir:[comparator](searchparameter-definitions.html#SearchParameter.comparator "Comparators supported for the search parameter.")  ( \[ [code](datatypes.html#code) \] ... ) ; # 0..\* [I](conformance-rules.html#constraints "This element has or is affected by some invariants") eq | ne | gt | lt | ge | le | sa | eb | ap
  fhir:[modifier](searchparameter-definitions.html#SearchParameter.modifier "A modifier supported for the search parameter.")  ( \[ [code](datatypes.html#code) \] ... ) ; # 0..\* missing | exact | contains | not | text | in | not-in | below | above | type | identifier | of-type | code-text | text-advanced | iterate
  fhir:[chain](searchparameter-definitions.html#SearchParameter.chain "Contains the names of any search parameters which may be chained to the containing search parameter. Chained parameters may be added to search parameters of type reference and specify that resources will only be returned if they contain a reference to a resource which matches the chained parameter value. Values for this field should be drawn from SearchParameter.code for a parameter on the target resource type.")  ( \[ [string](datatypes.html#string) \] ... ) ; # 0..\* [I](conformance-rules.html#constraints "This element has or is affected by some invariants") Chained names supported
  fhir:[component](searchparameter-definitions.html#SearchParameter.component "Used to define the parts of a composite search parameter.") ( \[ # 0..\* For Composite resources to define the parts
    fhir:[definition](searchparameter-definitions.html#SearchParameter.component.definition "The definition of the search parameter that describes this part.") \[ [canonical](datatypes.html#canonical)([SearchParameter](searchparameter.html#SearchParameter)) \] ; # 1..1 Defines how the part works
    fhir:[expression](searchparameter-definitions.html#SearchParameter.component.expression "A sub-expression that defines how to extract values for this component from the output of the main SearchParameter.expression.") \[ [string](datatypes.html#string) \] ; # 1..1 Subexpression relative to main expression
  \] ... ) ;
\]

**Changes from both R4 and R4B**

[SearchParameter](searchparameter.html#SearchParameter)

SearchParameter.identifier

-   Added Element

SearchParameter.versionAlgorithm\[x\]

-   Added Element

SearchParameter.title

-   Added Element

SearchParameter.copyright

-   Added Element

SearchParameter.copyrightLabel

-   Added Element

SearchParameter.aliasCode

-   Added Element

SearchParameter.base

-   Change value set from `http://hl7.org/fhir/ValueSet/resource-types|4.0.0` to [Version Independent Resource Types (All)](valueset-version-independent-all-resource-types.html)
-   Remove code `ClinicalImpression`
-   Add codes `ActorDefinition`, `AdministrableProductDefinition`, `ArtifactAssessment`, `BiologicallyDerivedProductDispense`, `CanonicalResource`, `Citation`, `ClinicalAssessment`, `ClinicalUseDefinition`, `ConditionDefinition`, `DeviceAlert`, `DeviceAssociation`, `DeviceDispense`, `DeviceUsage`, `EncounterHistory`, `FormularyItem`, `GenomicStudy`, `ImagingSelection`, `Ingredient`, `InsuranceProduct`, `InventoryItem`, `InventoryReport`, `ManufacturedItemDefinition`, `MedicinalProductDefinition`, `MetadataResource`, `MolecularDefinition`, `NutritionIntake`, `NutritionProduct`, `PackagedProductDefinition`, `Permission`, `PersonalRelationship`, `RegulatedAuthorization`, `RequestOrchestration`, `Requirements`, `SubscriptionStatus`, `SubscriptionTopic`, `SubstanceDefinition`, `TestPlan`, `Transport`, `BodySite`, `Conformance`, `DataElement`, `DeviceComponent`, `DeviceUseRequest`, `DiagnosticOrder`, `EligibilityRequest`, `EligibilityResponse`, `ExpansionProfile`, `ImagingManifest`, `ImagingObjectSelection`, `MedicationOrder`, `MedicationUsage`, `Order`, `OrderResponse`, `ProcedureRequest`, `ProcessRequest`, `ProcessResponse`, `ReferralRequest`, `Sequence`, `ServiceDefinition`

SearchParameter.type

-   Add code `resource`

SearchParameter.processingMode

-   Renamed from xpathUsage to processingMode
-   Change value set from `http://hl7.org/fhir/ValueSet/search-xpath-usage|4.0.0` to [Search Processing Mode Type](valueset-search-processingmode.html)
-   Remove codes `nearby`, `distance`

SearchParameter.constraint

-   Added Element

SearchParameter.target

-   Change value set from `http://hl7.org/fhir/ValueSet/resource-types|4.0.0` to [Version Independent Resource Types (All)](valueset-version-independent-all-resource-types.html)
-   Remove code `ClinicalImpression`
-   Add codes `ActorDefinition`, `AdministrableProductDefinition`, `ArtifactAssessment`, `BiologicallyDerivedProductDispense`, `CanonicalResource`, `Citation`, `ClinicalAssessment`, `ClinicalUseDefinition`, `ConditionDefinition`, `DeviceAlert`, `DeviceAssociation`, `DeviceDispense`, `DeviceUsage`, `EncounterHistory`, `FormularyItem`, `GenomicStudy`, `ImagingSelection`, `Ingredient`, `InsuranceProduct`, `InventoryItem`, `InventoryReport`, `ManufacturedItemDefinition`, `MedicinalProductDefinition`, `MetadataResource`, `MolecularDefinition`, `NutritionIntake`, `NutritionProduct`, `PackagedProductDefinition`, `Permission`, `PersonalRelationship`, `RegulatedAuthorization`, `RequestOrchestration`, `Requirements`, `SubscriptionStatus`, `SubscriptionTopic`, `SubstanceDefinition`, `TestPlan`, `Transport`, `BodySite`, `Conformance`, `DataElement`, `DeviceComponent`, `DeviceUseRequest`, `DiagnosticOrder`, `EligibilityRequest`, `EligibilityResponse`, `ExpansionProfile`, `ImagingManifest`, `ImagingObjectSelection`, `MedicationOrder`, `MedicationUsage`, `Order`, `OrderResponse`, `ProcedureRequest`, `ProcessRequest`, `ProcessResponse`, `ReferralRequest`, `Sequence`, `ServiceDefinition`

SearchParameter.modifier

-   Remove code `ofType`
-   Add codes `of-type`, `code-text`, `text-advanced`, `iterate`

SearchParameter.xpath

-   Deleted (XPath removed due to lack of use and maintenance)

See the [Full Difference](diff.html) for further information

This analysis is available for R4 as [XML](searchparameter.r4.diff.xml) or [JSON](searchparameter.r4.diff.json) and for R4B as [XML](searchparameter.r4b.diff.xml) or [JSON](searchparameter.r4b.diff.json).

Additional definitions: Master Definition [XML](searchparameter.profile.xml.html) + [JSON](searchparameter.profile.json.html), [XML](xml.html) [Schema](searchparameter.xsd)/[Schematron](searchparameter.sch) + [JSON](json.html) [Schema](searchparameter.schema.json.html), [ShEx](searchparameter.shex.html) (for [Turtle](rdf.html)) , the [spreadsheet version](searchparameter.xlsx) & the [dependency analysis](searchparameter-dependencies.html)

### 5.6.5.1 Terminology Bindings[](searchparameter.html#tx "link to here")

Path

ValueSet

Type

Documentation

SearchParameter.versionAlgorithm\[x\]

[VersionAlgorithm](valueset-version-algorithm.html)

[Extensible](terminologies.html#extensible)

Indicates the mechanism used to compare versions to determine which is more current.

SearchParameter.status

[PublicationStatus](valueset-publication-status.html)

[Required](terminologies.html#required)

The lifecycle status of an artifact.

SearchParameter.jurisdiction

[JurisdictionValueSet](valueset-jurisdiction.html)

[Extensible](terminologies.html#extensible)

This value set defines a base set of codes for country, country subdivision and region for indicating where a resource is intended to be used.

Note: The codes for countries and country subdivisions are taken from [ISO 3166 ![icon](external.png)](https://www.iso.org/iso-3166-country-codes.html) while the codes for "supra-national" regions are from [UN Standard country or area codes for statistical use (M49) ![icon](external.png)](http://unstats.un.org/unsd/methods/m49/m49.htm) .

SearchParameter.base

[VersionIndependentResourceTypesAll](valueset-version-independent-all-resource-types.html)

[Required](terminologies.html#required)

Current and past FHIR resource types (deleted or renamed), including abstract types

 

[All Resource Types](valueset-all-resource-types.html)

[ui](codesystem-additional-binding-purpose.html#additional-binding-purpose-ui)

SearchParameter.type

[SearchParamType](valueset-search-param-type.html)

[Required](terminologies.html#required)

Data types allowed to be used for search parameters.

SearchParameter.processingMode

[SearchProcessingModeType](valueset-search-processingmode.html)

[Required](terminologies.html#required)

How a search parameter relates to the set of elements returned by evaluating its expression query.

SearchParameter.target

[VersionIndependentResourceTypesAll](valueset-version-independent-all-resource-types.html)

[Required](terminologies.html#required)

Current and past FHIR resource types (deleted or renamed), including abstract types

 

[All Resource Types](valueset-all-resource-types.html)

[ui](codesystem-additional-binding-purpose.html#additional-binding-purpose-ui)

SearchParameter.comparator

[SearchComparator](valueset-search-comparator.html)

[Required](terminologies.html#required)

What Search Comparator Codes are supported in search.

SearchParameter.modifier

[SearchModifierCode](valueset-search-modifier-code.html)

[Required](terminologies.html#required)

A supported modifier for a search parameter.

### 5.6.5.2 Constraints[](searchparameter.html#invs "link to here")

**UniqueKey**

**Level**

**Location**

**Description**

**[Expression](fhirpath.html)**

 **![img](assets/images/test-ok.png) cnl-0**

[Warning](conformance-rules.html#warning)

(base)

Name should be usable as an identifier for the module by machine processing applications such as code generation

name.exists() implies name.matches('^\[A-Z\](\[A-Za-z0-9\_\]){1,254}$')

 **![img](assets/images/test-ok.png) spd-1**

[Rule](conformance-rules.html#rule)

(base)

If an expression is present, there SHALL be a processingMode

expression.empty() or processingMode.exists()

 **![img](assets/images/test-ok.png) cnl-1**

[Warning](conformance-rules.html#warning)

SearchParameter.url

URL should not contain | or # - these characters make processing canonical references problematic

exists() implies matches('^\[^|# \]+$')

 **![img](assets/images/test-ok.png) spd-2**

[Rule](conformance-rules.html#rule)

(base)

Search parameters can only have chain names when the search parameter type is 'reference'

chain.empty() or type = 'reference'

 **![img](assets/images/test-ok.png) spd-3**

[Rule](conformance-rules.html#rule)

(base)

Search parameters comparator can only be used on type 'number', 'date', 'quantity' or 'special'.

comparator.empty() or (type in ('number' | 'date' | 'quantity' | 'special'))

  

## 5.6.6 SearchParameters on Extensions[](searchparameter.html#srch "link to here")

The SearchParameter resource may be used to define searches on extensions. A simple definition defines the code, the base resource the extension can be found in, and a type, and an expression. Assume that the extension is `http://example.org/fhir/StructureDefinition/extension-thumb-length` which has a value that is a quantity, and that is used on patient, then an appropriate SearchParameter would be:

   "code" : "thumb-length",
   "base" : \["Patient"\],
   "type" : "quantity",
   "expression" : "Patient.extension('http://example.org/fhir/StructureDefinition/extension-thumb-length').value"

Servers MAY attempt to process expressions that just select the extension without the `.value`, but this is not required and may be discouraged or deprecated in the future.

Extensions may have multiple types with different search behaviors, so the type can be specifically selected:

   "code" : "thumb-length-code",
   "base" : \["Patient"\],
   "type" : "token",
   "expression" : "Patient.extension('http://example.org/fhir/StructureDefinition/extension-thumb-length').value.ofType(CodeableConcept)"

This example would select coded thumb lengths and index them only for the `thumb-length-code` search parameter. When an extension can have multiple types with incompatible search behavior, the search parameters have to do this. Note that is type casting the extension directly (e.g. `Patient.extension('...').ofType(CodeableConcept)`) will lead to an empty index, since the extension is not a CodeableConcept itself.

When extensions can be used in multiple places, these places are enumerated in the expression:

Patient.extension('http://example.org/fhir/StructureDefinition/extension-thumb-length').value
 | Patient.contact.extension('http://example.org/fhir/StructureDefinition/extension-thumb-length').value
 | Practitioner.extension('http://example.org/fhir/StructureDefinition/extension-thumb-length').value

Notes:

-   If the extension's context specifies multiple resources, they are represented with multiple elements in the `SearchParameter.base` array
-   An expression like `Resource.descendents.extension('extension-url').value` is possible, but this is a low performance option for a server to evaluate, and search parameter expressions are performance sensitive

## 5.6.7 Search Parameters[](searchparameter.html#search "link to here")

Search parameters for this resource. See also the [full list of search parameters for this resource](searchparameter-search.html), and check the [Extensions registry](https://build.fhir.org/ig/HL7/fhir-extensions/extensions-SearchParameter.html#search) for search parameters on extensions related to this resource. The [common parameters](search.html#all) also apply. See [Searching](search.html) for more information about searching in REST, messaging, and services.

**Name**

**Type**

**Description**

**Expression**

**In Common**

[base](searchparameter-search.html#SearchParameter-base)

[token](search.html#token)

The resource type(s) this search parameter applies to

SearchParameter.base

[code](searchparameter-search.html#SearchParameter-code)

[token](search.html#token)

Code used in URL

SearchParameter.code

[component](searchparameter-search.html#SearchParameter-component)

[reference](search.html#reference)

Defines how the part works

SearchParameter.component.definition

[context](searchparameter-search.html#CanonicalResource-context)

[token](search.html#token)

A use context assigned to the search parameter

(SearchParameter.useContext.value.ofType(CodeableConcept))

[30 Resources](searchparameter-registry.html#CanonicalResource-context)

[context-quantity](searchparameter-search.html#CanonicalResource-context-quantity)

[quantity](search.html#quantity)

A quantity- or range-valued use context assigned to the search parameter

(SearchParameter.useContext.value.ofType(Quantity)) | (SearchParameter.useContext.value.ofType(Range))

[30 Resources](searchparameter-registry.html#CanonicalResource-context-quantity)

[context-type](searchparameter-search.html#CanonicalResource-context-type)

[token](search.html#token)

A type of use context assigned to the search parameter

SearchParameter.useContext.code

[30 Resources](searchparameter-registry.html#CanonicalResource-context-type)

[context-type-quantity](searchparameter-search.html#CanonicalResource-context-type-quantity)

[composite](search.html#composite)

A use context type and quantity- or range-based value assigned to the search parameter

On SearchParameter.useContext:  
  context-type: code  
  context-quantity: value.ofType(Quantity) | value.ofType(Range)

[30 Resources](searchparameter-registry.html#CanonicalResource-context-type-quantity)

[context-type-value](searchparameter-search.html#CanonicalResource-context-type-value)

[composite](search.html#composite)

A use context type and value assigned to the search parameter

On SearchParameter.useContext:  
  context-type: code  
  context: value.ofType(CodeableConcept)

[30 Resources](searchparameter-registry.html#CanonicalResource-context-type-value)

[date](searchparameter-search.html#CanonicalResource-date)

[date](search.html#date)

The search parameter publication date

SearchParameter.date

[31 Resources](searchparameter-registry.html#CanonicalResource-date)

[derived-from](searchparameter-search.html#SearchParameter-derived-from)

[reference](search.html#reference)

Original definition for the search parameter

SearchParameter.derivedFrom

[description](searchparameter-search.html#CanonicalResource-description)

[string](search.html#string)

The description of the search parameter

SearchParameter.description

[29 Resources](searchparameter-registry.html#CanonicalResource-description)

[identifier](searchparameter-search.html#CanonicalResource-identifier) [N](versions.html#std-process "Normative Content")

[token](search.html#token)

External identifier for the search parameter

SearchParameter.identifier

[35 Resources](searchparameter-registry.html#CanonicalResource-identifier)

[jurisdiction](searchparameter-search.html#CanonicalResource-jurisdiction)

[token](search.html#token)

Intended jurisdiction for the search parameter

SearchParameter.jurisdiction

[27 Resources](searchparameter-registry.html#CanonicalResource-jurisdiction)

[name](searchparameter-search.html#CanonicalResource-name)

[string](search.html#string)

Computationally friendly name of the search parameter

SearchParameter.name

[28 Resources](searchparameter-registry.html#CanonicalResource-name)

[publisher](searchparameter-search.html#CanonicalResource-publisher)

[string](search.html#string)

Name of the publisher of the search parameter

SearchParameter.publisher

[31 Resources](searchparameter-registry.html#CanonicalResource-publisher)

[status](searchparameter-search.html#CanonicalResource-status)

[token](search.html#token)

The current status of the search parameter

SearchParameter.status

[35 Resources](searchparameter-registry.html#CanonicalResource-status)

[target](searchparameter-search.html#SearchParameter-target)

[token](search.html#token)

Types of resource (if a resource reference)

SearchParameter.target

[type](searchparameter-search.html#SearchParameter-type)

[token](search.html#token)

number | date | string | token | reference | composite | quantity | uri | special

SearchParameter.type

[url](searchparameter-search.html#CanonicalResource-url)

[uri](search.html#uri)

The uri that identifies the search parameter

SearchParameter.url

[35 Resources](searchparameter-registry.html#CanonicalResource-url)

[version](searchparameter-search.html#CanonicalResource-version)

[token](search.html#token)

The business version of the search parameter

SearchParameter.version

[32 Resources](searchparameter-registry.html#CanonicalResource-version)

FHIR ®© HL7.org 2011+. FHIR R6 hl7.fhir.core#6.0.0-ballot2 generated on Wed, Aug 6, 2025 07:14+0000.  
Links: [Search ![icon](external.png)](http://hl7.org/fhir/search.cfm) | [Version History](history.html) | [Contents](toc.html) | [Glossary](help.html) | [QA](qa.html) | [Compare to R5 ![icon](external.png)](https://www5.aptest.com/standards/htmldiff/htmldiff.pl?oldfile=http%3A%2F%2Fhl7.org%2Ffhir%2FR5%2Fsearchparameter.html&newfile=http%3A%2F%2Fbuild.fhir.org%2Fsearchparameter.html) | [![CC0](cc0.png)](license.html) | [Propose a change ![icon](external.png)](https://jira.hl7.org/secure/CreateIssueDetails!init.jspa?pid=10405&issuetype=10600&customfield_11302=FHIR-core&customfield_11808=R5&customfield_10612=http://build.fhir.org/searchparameter.html) 

try { var currentTabIndex = null; if (window.location.hash == '#tt-tree') { currentTabIndex = 0; } else if (window.location.hash == '#tt-uml') { currentTabIndex = 1; } else if (window.location.hash == '#tt-xml') { currentTabIndex = 2; } else if (window.location.hash == '#tt-json') { currentTabIndex = 3; } else if (window.location.hash == '#tt-ttl') { currentTabIndex = 4; } else if (window.location.hash == '#tt-all') { currentTabIndex = 5; } else { currentTabIndex = sessionStorage.getItem('fhir-resource-tab-index'); } } catch(exception) { } if (!currentTabIndex) currentTabIndex = '0'; $( '#tabs' ).tabs({ active: currentTabIndex, activate: function( event, ui ) { var active = $('.selector').tabs('option', 'active'); currentTabIndex = ui.newTab.index(); document.activeElement.blur(); try { sessionStorage.setItem('fhir-resource-tab-index', currentTabIndex); } catch(exception){ } } });