import { FHIRToStandardOperators } from './types';
import type {
  SearchQuery,
  Expression,
  SearchExpression,
  Join,
  IncludeExpression,
  SortParam,
  Value,
  Operator,
  ParseError,
  ParseResult,
  TokenValue,
  DateValue,
  QuantityValue,
  ReferenceValue,
  CompositeValue,
} from './types';

interface ParameterStructure {
  type: 'simple' | 'chain' | 'has' | 'modifier';
  name: string;
  modifier?: string;
  chain?: string[];
  has?: {
    resourceType: string;
    parameter: string;
    rest?: string;
  };
}

interface ParseContext {
  resource: string;
  where: Expression[];
  joins: Join[];
  includes: IncludeExpression[];
  sort: SortParam[];
  summary?: 'true' | 'false' | 'count' | 'data';
  elements?: string[];
  count?: number;
  offset?: number;
  contained?: 'true' | 'false' | 'both';
  containedType?: 'container' | 'contained';
  errors: ParseError[];
}

export class FHIRSearchParser {
  parse(url: string): ParseResult {
    try {
      const query = this.parseUrl(url);
      return { query };
    } catch (error) {
      return {
        errors: [{
          message: error instanceof Error ? error.message : 'Unknown parse error',
        }]
      };
    }
  }

  private parseUrl(url: string): SearchQuery {
    // Extract resource and query string
    const urlParts = url.split('?');
    const firstPart = urlParts[0] || '';
    const pathParts = firstPart.split('/').filter(p => p);
    const resource = pathParts.length > 0 ? (pathParts[pathParts.length - 1] || '') : '';
    const queryString = urlParts[1] || '';

    if (!resource) {
      throw new Error('No resource type found in URL');
    }

    // Initialize parse context
    const context: ParseContext = {
      resource,
      where: [],
      joins: [],
      includes: [],
      sort: [],
      errors: []
    };

    // Parse query parameters
    if (queryString) {
      const params = new URLSearchParams(queryString);
      for (const [key, value] of params) {
        this.processParameter(context, key, value);
      }
    }

    // If there were errors during parsing, throw them
    if (context.errors.length > 0) {
      const firstError = context.errors[0];
      throw new Error(firstError?.message || 'Parse error');
    }

    // Build final AST
    return this.buildAST(context);
  }

  private processParameter(context: ParseContext, key: string, value: string) {
    // Handle special parameters (but not _has which needs special parsing)
    if (key.startsWith('_') && !key.startsWith('_has:')) {
      this.processSpecialParameter(context, key, value);
      return;
    }

    // Parse parameter structure
    const paramStruct = this.parseParameterStructure(key);

    switch (paramStruct.type) {
      case 'has':
        this.processHas(context, paramStruct, value);
        break;
      case 'chain':
        this.processChain(context, paramStruct, value);
        break;
      case 'modifier':
      case 'simple':
        this.processSimple(context, paramStruct, value);
        break;
    }
  }

  private parseParameterStructure(key: string): ParameterStructure {
    // Check for _has
    if (key.startsWith('_has:')) {
      return this.parseHasStructure(key);
    }

    // Check for chains (dots)
    const dotIndex = key.indexOf('.');
    if (dotIndex > 0) {
      return this.parseChainStructure(key);
    }

    // Check for modifiers (colons)
    const colonIndex = key.indexOf(':');
    if (colonIndex > 0 && colonIndex < key.length - 1) {
      return {
        type: 'modifier',
        name: key.substring(0, colonIndex),
        modifier: key.substring(colonIndex)
      };
    }

    // Simple parameter
    return {
      type: 'simple',
      name: key
    };
  }

  private parseHasStructure(key: string): ParameterStructure {
    // _has:ResourceType:parameter:rest
    const parts = key.substring(5).split(':'); // Remove '_has:' prefix
    if (parts.length < 2) {
      // Return a structure that will trigger error handling
      return {
        type: 'has',
        name: key,
        has: undefined
      };
    }

    return {
      type: 'has',
      name: '_has',
      has: {
        resourceType: parts[0] || '',
        parameter: parts[1] || '',
        rest: parts.slice(2).join(':') || undefined
      }
    };
  }

  private parseChainStructure(key: string): ParameterStructure {
    // parameter:Type.chain.chain or parameter.chain.chain
    const colonIndex = key.indexOf(':');
    let baseName: string;
    let resourceType: string | undefined;
    let chainPath: string;

    if (colonIndex > 0 && colonIndex < key.indexOf('.')) {
      // Has resource type constraint
      baseName = key.substring(0, colonIndex);
      const afterColon = key.substring(colonIndex + 1);
      const dotIndex = afterColon.indexOf('.');
      if (dotIndex > 0) {
        resourceType = afterColon.substring(0, dotIndex);
        chainPath = afterColon.substring(dotIndex + 1);
      } else {
        resourceType = afterColon;
        chainPath = '';
      }
    } else {
      // No resource type constraint
      const dotIndex = key.indexOf('.');
      baseName = key.substring(0, dotIndex);
      chainPath = key.substring(dotIndex + 1);
    }

    return {
      type: 'chain',
      name: baseName,
      modifier: resourceType ? `:${resourceType}` : undefined,
      chain: chainPath ? chainPath.split('.') : []
    };
  }

  private processSpecialParameter(context: ParseContext, key: string, value: string) {
    switch (key) {
      case '_include':
      case '_revinclude':
        this.processInclude(context, key, value);
        break;
      case '_sort':
        this.processSort(context, value);
        break;
      case '_count':
        context.count = parseInt(value, 10);
        break;
      case '_offset':
        context.offset = parseInt(value, 10);
        break;
      case '_summary':
        context.summary = value as 'true' | 'false' | 'count' | 'data';
        break;
      case '_elements':
        context.elements = value.split(',').map(e => e.trim());
        break;
      case '_contained':
        context.contained = value as 'true' | 'false' | 'both';
        break;
      case '_containedType':
        context.containedType = value as 'container' | 'contained';
        break;
      default:
        // Handle other special parameters or ignore
        break;
    }
  }

  private processInclude(context: ParseContext, key: string, value: string) {
    // Format: Resource:parameter or Resource:parameter:TargetType
    const parts = value.split(':');
    const include: IncludeExpression = {
      direction: key === '_include' ? 'forward' : 'reverse',
      source: parts[0],
      parameter: parts[1] || '*'
    };

    if (parts[2]) {
      include.target = parts[2];
    }

    // Check for :iterate modifier
    if (value.includes(':iterate')) {
      include.iterate = true;
    }

    context.includes.push(include);
  }

  private processSort(context: ParseContext, value: string) {
    // Can be comma-separated list
    const sortParams = value.split(',');
    for (const param of sortParams) {
      const trimmed = param.trim();
      if (trimmed.startsWith('-')) {
        context.sort.push({
          parameter: trimmed.substring(1),
          direction: 'desc'
        });
      } else {
        context.sort.push({
          parameter: trimmed,
          direction: 'asc'
        });
      }
    }
  }

  private processSimple(context: ParseContext, paramStruct: ParameterStructure, value: string) {
    const { name, modifier } = paramStruct;
    const operator = this.extractOperator(modifier, value);
    const values = this.parseValue(value, operator);

    const expression: Expression = {
      param: name,
      operator,
      value: values
    } as SearchExpression;

    context.where.push(expression);
  }

  private processChain(context: ParseContext, paramStruct: ParameterStructure, value: string) {
    if (!paramStruct.chain || paramStruct.chain.length === 0) {
      // Simple reference without deep chain
      this.processSimple(context, paramStruct, value);
      return;
    }

    // Build nested join structure
    const join = this.buildChainJoin(paramStruct, value);
    context.joins.push(join);
  }

  private buildChainJoin(paramStruct: ParameterStructure, value: string): Join {
    const { name, modifier, chain } = paramStruct;
    
    // Extract resource type from modifier (e.g., ":Patient")
    const resourceType = modifier?.substring(1) || this.inferResourceType(name);

    // Build the join
    const join: Join = {
      resource: resourceType,
      on: {
        type: 'reference',
        parameter: name
      }
    };

    // Process chain recursively
    if (chain && chain.length > 0) {
      const [nextParam, ...restChain] = chain;
      if (!nextParam) return join;
      
      if (restChain.length > 0) {
        // More chaining needed
        join.join = [this.buildNestedChain(nextParam, restChain, value)];
      } else {
        // Final parameter in chain
        const operator = this.extractOperator(undefined, value);
        const values = this.parseValue(value, operator);
        join.where = [{
          param: nextParam,
          operator,
          value: values
        } as SearchExpression];
      }
    }

    return join;
  }

  private buildNestedChain(param: string, chain: string[], value: string): Join {
    const resourceType = this.inferResourceType(param);
    
    const join: Join = {
      resource: resourceType,
      on: {
        type: 'reference',
        parameter: param
      }
    };

    if (chain.length > 1) {
      const [nextParam, ...restChain] = chain;
      if (!nextParam) return join;
      join.join = [this.buildNestedChain(nextParam, restChain, value)];
    } else {
      // Final parameter
      const operator = this.extractOperator(undefined, value);
      const values = this.parseValue(value, operator);
      join.where = [{
        param: chain[0],
        operator,
        value: values
      } as SearchExpression];
    }

    return join;
  }

  private processHas(context: ParseContext, paramStruct: ParameterStructure, value: string) {
    if (!paramStruct.has) {
      context.errors.push({
        message: 'Invalid _has structure',
        parameter: paramStruct.name
      });
      return;
    }

    const { resourceType, parameter, rest } = paramStruct.has;

    // Check if there's nested _has
    if (rest && rest.startsWith('_has:')) {
      // Nested _has - need to parse recursively
      const nestedHas = this.parseHasStructure(rest);
      const join = this.buildHasJoin(resourceType, parameter, nestedHas, value);
      context.joins.push(join);
    } else if (rest) {
      // Simple _has with parameter and value
      const paramName = rest;
      const operator = this.extractOperator(undefined, value);
      const values = this.parseValue(value, operator);

      const join: Join = {
        resource: resourceType,
        on: {
          type: 'reverse-reference',
          parameter: parameter
        },
        where: [{
          param: paramName,
          operator,
          value: values
        } as SearchExpression]
      };

      context.joins.push(join);
    } else {
      // No parameter specified after _has:Resource:reference
      context.errors.push({
        message: 'Missing parameter in _has',
        parameter: paramStruct.name,
        value: value
      });
    }
  }

  private buildHasJoin(resourceType: string, parameter: string, nestedHas: ParameterStructure, value: string): Join {
    const join: Join = {
      resource: resourceType,
      on: {
        type: 'reverse-reference',
        parameter: parameter
      }
    };

    if (nestedHas.has) {
      // Check if the rest is another _has
      if (nestedHas.has.rest && nestedHas.has.rest.startsWith('_has:')) {
        // Parse the nested _has
        const deeperHas = this.parseHasStructure(nestedHas.has.rest);
        join.join = [this.buildHasJoin(
          nestedHas.has.resourceType,
          nestedHas.has.parameter,
          deeperHas,
          value
        )];
      } else {
        // Final level with parameter and value
        const operator = this.extractOperator(undefined, value);
        const values = this.parseValue(value, operator);
        
        join.join = [{
          resource: nestedHas.has.resourceType,
          on: {
            type: 'reverse-reference',
            parameter: nestedHas.has.parameter
          },
          where: nestedHas.has.rest ? [{
            param: nestedHas.has.rest,
            operator,
            value: values
          } as SearchExpression] : []
        }];
      }
    }

    return join;
  }

  private extractOperator(modifier: string | undefined, value: string): Operator {
    // Check for :missing modifier first (special case)
    if (modifier === ':missing') {
      return value === 'true' ? 'missing' : 'exists';
    }

    // Check for modifier-based operators
    if (modifier) {
      const mapped = FHIRToStandardOperators[modifier];
      if (mapped) return mapped;
    }

    // Check for prefix-based operators (for dates and numbers)
    const prefixMatch = value.match(/^(eq|ne|gt|lt|ge|le|sa|eb|ap)(.+)$/);
    if (prefixMatch && prefixMatch[1]) {
      const mapped = FHIRToStandardOperators[prefixMatch[1]];
      if (mapped) return mapped;
    }

    // Default to equals
    return '=';
  }

  private parseValue(rawValue: string, operator: Operator): Value[] {
    // Remove prefix if present
    let value = rawValue;
    const prefixMatch = rawValue.match(/^(eq|ne|gt|lt|ge|le|sa|eb|ap)(.+)$/);
    if (prefixMatch && prefixMatch[2]) {
      value = prefixMatch[2];
    }

    // Handle comma-separated values (OR semantics)
    const values = value.split(',').map(v => v.trim());
    return values.map(v => this.parseSingleValue(v));
  }

  private parseSingleValue(value: string): Value {
    // Check for boolean
    if (value === 'true' || value === 'false') {
      return { type: 'boolean', value: value === 'true' };
    }

    // Check for token (system|code)
    if (value.includes('|')) {
      return this.parseToken(value);
    }

    // Check for reference (ResourceType/id)
    if (value.match(/^[A-Z][a-zA-Z]+\/[a-zA-Z0-9-]+$/)) {
      return this.parseReference(value);
    }

    // Check for date (stricter pattern to avoid matching things like 1234-5)
    if (value.match(/^\d{4}(-\d{2}(-\d{2}(T\d{2}:\d{2}(:\d{2})?)?)?)?$/)) {
      return this.parseDate(value);
    }

    // Check for number
    if (value.match(/^-?\d+(\.\d+)?$/)) {
      return { type: 'number', value: parseFloat(value) };
    }

    // Default to string (not token)
    // Tokens should only be created when we have explicit token syntax (|)
    return { type: 'string', value };
  }

  private parseToken(value: string): TokenValue {
    const parts = value.split('|');
    if (parts.length === 2) {
      return {
        type: 'token',
        system: parts[0] || undefined,
        code: parts[1] || ''
      };
    }
    return {
      type: 'token',
      code: value
    };
  }

  private parseReference(value: string): ReferenceValue {
    const parts = value.split('/');
    return {
      type: 'reference',
      resourceType: parts[0] || '',
      id: parts[1] || ''
    };
  }

  private parseDate(value: string): DateValue {
    let precision: DateValue['precision'] = 'day';
    
    if (value.length === 4) {
      precision = 'year';
    } else if (value.length === 7) {
      precision = 'month';
    } else if (value.includes('T')) {
      precision = value.includes('.') ? 'second' : 'time';
    }

    return {
      type: 'date',
      value,
      precision
    };
  }

  private inferResourceType(parameter: string): string {
    // Simple inference based on common parameter names
    // In real implementation, this would use SearchParameter definitions
    const commonMappings: { [key: string]: string } = {
      'patient': 'Patient',
      'subject': 'Patient',
      'encounter': 'Encounter',
      'practitioner': 'Practitioner',
      'organization': 'Organization',
      'location': 'Location'
    };

    return commonMappings[parameter.toLowerCase()] || 'Resource';
  }

  private buildAST(context: ParseContext): SearchQuery {
    const query: SearchQuery = {
      resource: context.resource
    };

    // Add non-empty arrays and values
    if (context.where.length > 0) {
      query.where = context.where;
    }
    if (context.joins.length > 0) {
      query.joins = context.joins;
    }
    if (context.includes.length > 0) {
      query.includes = context.includes;
    }
    if (context.sort.length > 0) {
      query.sort = context.sort;
    }
    if (context.summary !== undefined) {
      query.summary = context.summary;
    }
    if (context.elements !== undefined) {
      // Convert to nested structure
      query.elements = this.buildElementSelection(context.elements);
    }
    if (context.count !== undefined) {
      query.count = context.count;
    }
    if (context.offset !== undefined) {
      query.offset = context.offset;
    }
    if (context.contained !== undefined) {
      query.contained = context.contained;
    }
    if (context.containedType !== undefined) {
      query.containedType = context.containedType;
    }

    return query;
  }

  private buildElementSelection(elements: string[]): Record<string, boolean | any> {
    const selection: Record<string, boolean | any> = {};
    
    for (const element of elements) {
      // Handle Resource.field format
      if (element.includes('.')) {
        const parts = element.split('.');
        const [resource, ...fields] = parts;
        // For now, just mark as true
        // In full implementation, would build nested structure
        selection[element] = true;
      } else {
        selection[element] = true;
      }
    }

    return selection;
  }
}