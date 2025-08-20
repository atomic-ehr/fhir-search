import {
  SearchQuery,
  Expression,
  Value,
  Join,
  IncludeExpression,
  SortParam,
  ElementSelection,
  StringValue,
  NumberValue,
  DateValue,
  TokenValue,
  ReferenceValue,
  QuantityValue,
  BooleanValue,
  CompositeValue,
  FHIRToStandardOperators,
  ParseError,
  ParseResult,
  AndExpression,
  OrExpression,
  NotExpression,
  JoinExpression
} from './types';

// Token types for _filter parsing
type TokenType = 
  | 'IDENTIFIER'
  | 'OPERATOR'
  | 'STRING'
  | 'NUMBER'
  | 'DATE'
  | 'LPAREN'
  | 'RPAREN'
  | 'AND'
  | 'OR'
  | 'NOT'
  | 'EOF';

interface Token {
  type: TokenType;
  value: string;
  position: number;
}

// Parameter tokenization result
interface ParamParts {
  base: string;
  modifier?: string;
  chain: string[];
  isHas: boolean;
  hasResourceType?: string;
  hasParam?: string;
}

export class FHIRSearchParser {
  public parse(url: string): SearchQuery {
    try {
      const { resource, queryString } = this.extractUrlParts(url);
      const query: SearchQuery = { resource };
      
      const params = new URLSearchParams(queryString);
      
      const expressions: Expression[] = [];
      for (const [key, value] of params) {
        if (this.isFilterParam(key)) {
          const exprs = this.parseParameter(key, value);
          expressions.push(...exprs);
        } else {
          this.parseSpecialParameter(query, key, value);
        }
      }
      
      if (expressions.length > 0) {
        query.where = expressions.length === 1 
          ? expressions[0] 
          : { type: 'and', expressions };
      }
      
      return query;
    } catch (error) {
      if (error instanceof ParseError) {
        throw error;
      }
      throw new ParseError(
        error instanceof Error ? error.message : 'Unknown parsing error',
        url
      );
    }
  }

  private extractUrlParts(url: string): { resource: string; queryString: string } {
    const urlObj = new URL(url, 'http://example.com');
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    if (pathParts.length === 0) {
      throw new ParseError('No resource type specified in URL', url);
    }
    
    const resource = pathParts[pathParts.length - 1];
    const queryString = urlObj.search.slice(1);
    
    return { resource, queryString };
  }

  private isFilterParam(key: string): boolean {
    return !key.startsWith('_') || 
           key === '_filter' || 
           key.startsWith('_has:') ||
           key === '_id' ||
           key === '_lastUpdated' ||
           key === '_tag' ||
           key === '_profile' ||
           key === '_security' ||
           key === '_text' ||
           key === '_content' ||
           key === '_list' ||
           key === '_query' ||
           key === '_type';
  }

  private parseParameter(key: string, value: string): Expression[] {
    if (key === '_filter') {
      return [this.parseFilterExpression(value)];
    }
    
    const paramParts = this.tokenizeParamName(key);
    
    const valueStrings = value.split(',');
    const expressions = valueStrings.map(vStr => {
      const parsedValues = this.parseValue(vStr, paramParts.modifier);
      const operator = this.determineOperator(paramParts.modifier, vStr);
      
      let expression: Expression = {
        type: operator,
        param: paramParts.base,
        value: parsedValues
      } as Expression;
      
      if (paramParts.chain.length > 0) {
        expression = this.buildChainExpression(paramParts, expression);
      }
      
      if (paramParts.isHas) {
        expression = this.buildHasExpression(paramParts, expression);
      }
      
      return expression;
    });
    
    if (expressions.length > 1) {
      return [{ type: 'or', expressions }];
    }
    
    return expressions;
  }

  private tokenizeParamName(key: string): ParamParts {
    const result: ParamParts = {
      base: '',
      chain: [],
      isHas: false
    };
    
    if (key.startsWith('_has:')) {
      result.isHas = true;
      const hasParts = key.slice(5).split(':');
      if (hasParts.length < 2) {
        throw new ParseError('Invalid _has parameter format', key);
      }
      result.hasResourceType = hasParts[0];
      result.hasParam = hasParts[1];
      result.base = hasParts.slice(2).join(':');
      return result;
    }
    
    // Check for simple dot notation chain (no colon)
    if (key.includes('.') && !key.includes(':')) {
      const dotParts = key.split('.');
      result.base = dotParts[0];
      result.chain = dotParts.slice(1);
      // Default to Patient for subject chains (can be overridden later with metadata)
      result.modifier = ':Patient';
      return result;
    }
    
    const colonIndex = key.indexOf(':');
    if (colonIndex === -1) {
      const modifierMatch = key.match(/^(.+?)(:missing|:exact|:contains|:text|:in|:not-in|:above|:below|:not|:identifier|:of-type)$/);
      if (modifierMatch) {
        result.base = modifierMatch[1];
        result.modifier = modifierMatch[2];
      } else {
        result.base = key;
      }
      return result;
    }
    
    const basePart = key.substring(0, colonIndex);
    const remainingPart = key.substring(colonIndex);
    
    const knownModifiers = [':missing', ':exact', ':contains', ':text', ':in', ':not-in', ':above', ':below', ':not', ':identifier', ':of-type'];
    const matchedModifier = knownModifiers.find(mod => remainingPart === mod);
    
    if (matchedModifier) {
      result.base = basePart;
      result.modifier = matchedModifier;
      return result;
    }
    
    result.base = basePart;
    const chainPart = remainingPart.substring(1);
    
    const chainParts = chainPart.split('.');
    if (chainParts.length > 0 && chainParts[0]) {
      result.modifier = ':' + chainParts[0];
      result.chain = chainParts.slice(1);
    }
    
    return result;
  }

  private parseValue(valueString: string, modifier?: string): Value[] {
    if (!valueString) {
      return [{ type: 'string', value: '' }];
    }
    
    if (modifier === ':missing') {
      const boolValue = valueString === 'true';
      return [{ type: 'boolean', value: boolValue }];
    }
    
    const prefixMatch = valueString.match(/^(eq|ne|gt|lt|ge|le|sa|eb|ap)(.+)$/);
    let cleanValue = valueString;
    
    if (prefixMatch) {
      cleanValue = prefixMatch[2];
    }
    
    if (cleanValue.includes('$')) {
      const parts = cleanValue.split('$');
      return [{
        type: 'composite',
        parts: parts.map(p => this.parseSingleValue(p))
      }];
    }
    
    return [this.parseSingleValue(cleanValue)];
  }

  private parseSingleValue(value: string): Value {
    if (!value) {
      return { type: 'string', value: '' };
    }
    
    // Check for prefixes first and extract them
    const prefixMatch = value.match(/^(eq|ne|gt|lt|ge|le|sa|eb|ap)(.+)$/);
    let cleanValue = value;
    let prefix = '';
    
    if (prefixMatch) {
      prefix = prefixMatch[1];
      cleanValue = prefixMatch[2];
    }
    
    // Token values with pipe separator
    if (cleanValue.includes('|')) {
      const parts = cleanValue.split('|');
      if (parts.length === 2) {
        const [systemOrCode, codeOrDisplay] = parts;
        if (systemOrCode.startsWith('http://') || systemOrCode.startsWith('https://') || systemOrCode.includes('/')) {
          return {
            type: 'token',
            system: systemOrCode,
            code: codeOrDisplay
          };
        } else {
          return {
            type: 'token',
            code: systemOrCode,
            display: codeOrDisplay
          };
        }
      } else if (parts.length === 3) {
        return {
          type: 'token',
          system: parts[0],
          code: parts[1],
          display: parts[2]
        };
      }
    }
    
    // Check for quantity with prefix already extracted
    if (prefix && /^\d+(\.\d+)?$/.test(cleanValue)) {
      const comparatorMap: Record<string, '<' | '<=' | '>=' | '>'> = {
        'gt': '>',
        'lt': '<',
        'ge': '>=',
        'le': '<='
      };
      
      if (comparatorMap[prefix]) {
        return {
          type: 'quantity',
          value: Number(cleanValue),
          comparator: comparatorMap[prefix]
        };
      }
    }
    
    // Standard quantity match (without prefix)
    const quantityMatch = cleanValue.match(/^([<>]?=?)?([\d.]+)(\|(.+?))?(\|(.+?))?$/);
    if (quantityMatch && !isNaN(Number(quantityMatch[2]))) {
      const [, comparator, valueStr, , unit, , system] = quantityMatch;
      const quantity: QuantityValue = {
        type: 'quantity',
        value: Number(valueStr)
      };
      
      if (comparator && comparator !== '=') {
        quantity.comparator = comparator as '<' | '<=' | '>=' | '>';
      }
      if (unit) quantity.unit = unit;
      if (system) quantity.system = system;
      
      return quantity;
    }
    
    // Date values
    const dateRegex = /^\d{4}(-\d{2}(-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?)?)?$/;
    if (dateRegex.test(cleanValue)) {
      let precision: DateValue['precision'] = 'year';
      if (cleanValue.length >= 7) precision = 'month';
      if (cleanValue.length >= 10) precision = 'day';
      if (cleanValue.includes('T')) precision = 'time';
      if (cleanValue.match(/T\d{2}:\d{2}:\d{2}/)) precision = 'second';
      
      return {
        type: 'date',
        value: cleanValue,
        precision: precision
      };
    }
    
    // Reference values
    if (cleanValue.match(/^[A-Za-z]+\/[\w-]+$/)) {
      const [resourceType, id] = cleanValue.split('/');
      return {
        type: 'reference',
        resourceType: resourceType,
        id: id
      };
    }
    
    // Number values
    if (!isNaN(Number(cleanValue))) {
      return { type: 'number', value: Number(cleanValue) };
    }
    
    // Boolean values
    if (cleanValue === 'true' || cleanValue === 'false') {
      return { type: 'boolean', value: cleanValue === 'true' };
    }
    
    // Check if it's a simple code pattern
    // Must have numbers or be very short (likely a code) or have dashes (LOINC pattern)
    if (/^[\w-]+$/.test(cleanValue)) {
      // If it has a dash with numbers, it's likely a code (e.g., "1234-5")
      if (cleanValue.includes('-') && /\d/.test(cleanValue)) {
        return { type: 'token', code: cleanValue };
      }
      // If it's all lowercase and very short, might be a code
      if (cleanValue.length <= 3 && cleanValue === cleanValue.toLowerCase()) {
        return { type: 'token', code: cleanValue };
      }
      // If it starts with a capital letter, it's likely a name
      if (/^[A-Z]/.test(cleanValue)) {
        return { type: 'string', value: cleanValue };
      }
    }
    
    // Default to string
    return { type: 'string', value: cleanValue };
  }

  private determineOperator(modifier: string | undefined, value: string): Expression['type'] {
    if (modifier) {
      const op = FHIRToStandardOperators[modifier];
      if (op) return op as Expression['type'];
    }
    
    const prefixMatch = value.match(/^(eq|ne|gt|lt|ge|le|sa|eb|ap)/);
    if (prefixMatch) {
      const op = FHIRToStandardOperators[prefixMatch[1]];
      if (op) return op as Expression['type'];
    }
    
    return '=';
  }

  private buildChainExpression(paramParts: ParamParts, expression: Expression): JoinExpression {
    if (!paramParts.modifier || !paramParts.modifier.startsWith(':')) {
      return { type: 'join', join: { resource: '', on: { type: 'reference', param: '' } } };
    }
    
    const resourceType = paramParts.modifier.slice(1);
    
    let currentExpression = expression;
    
    for (let i = paramParts.chain.length - 1; i >= 0; i--) {
      const chainParam = paramParts.chain[i];
      
      if (i === paramParts.chain.length - 1) {
        currentExpression = {
          ...expression,
          param: chainParam
        } as Expression;
      } else {
        const nextResourceType = paramParts.chain[i].split(':')[0] || resourceType;
        currentExpression = {
          type: 'join',
          join: {
            resource: nextResourceType,
            on: {
              type: 'reference',
              param: chainParam
            },
            where: currentExpression
          }
        };
      }
    }
    
    return {
      type: 'join',
      join: {
        resource: resourceType,
        on: {
          type: 'reference',
          param: paramParts.base
        },
        where: currentExpression
      }
    };
  }

  private buildHasExpression(paramParts: ParamParts, expression: Expression): JoinExpression {
    if (!paramParts.hasResourceType || !paramParts.hasParam) {
      throw new ParseError('Invalid _has expression', '');
    }
    
    return {
      type: 'join',
      join: {
        resource: paramParts.hasResourceType,
        on: {
          type: 'reverse-reference',
          param: paramParts.hasParam
        },
        where: expression
      }
    };
  }

  private parseSpecialParameter(query: SearchQuery, key: string, value: string): void {
    switch (key) {
      case '_sort':
        query.sort = this.parseSortParam(value);
        break;
      case '_count':
        query.count = parseInt(value, 10);
        break;
      case '_offset':
        query.offset = parseInt(value, 10);
        break;
      case '_summary':
        query.summary = value as 'true' | 'false' | 'count' | 'data';
        break;
      case '_elements':
        query.elements = this.parseElementSelection(value);
        break;
      case '_include':
      case '_revinclude':
        if (!query.includes) query.includes = [];
        query.includes.push(this.parseIncludeParam(key, value));
        break;
      case '_contained':
        query.contained = value as 'true' | 'false' | 'both';
        break;
      case '_containedType':
        query.containedType = value as 'container' | 'contained';
        break;
    }
  }

  private parseSortParam(value: string): SortParam[] {
    return value.split(',').map(param => {
      const direction = param.startsWith('-') ? 'desc' : 'asc';
      const cleanParam = param.startsWith('-') ? param.slice(1) : param;
      return { param: cleanParam, direction };
    });
  }

  private parseElementSelection(value: string): ElementSelection {
    const elements = value.split(',');
    const result: ElementSelection = {};
    
    for (const element of elements) {
      const parts = element.split('.');
      let current = result;
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          current[part] = true;
        } else {
          if (!current[part] || typeof current[part] === 'boolean') {
            current[part] = {};
          }
          current = current[part] as ElementSelection;
        }
      }
    }
    
    return result;
  }

  private parseIncludeParam(key: string, value: string): IncludeExpression {
    const direction = key === '_include' ? 'forward' : 'reverse';
    const parts = value.split(':');
    
    const result: IncludeExpression = { direction };
    
    let currentIndex = 0;
    
    if (parts[currentIndex] === 'iterate' || parts[currentIndex] === 'recurse') {
      if (parts[currentIndex] === 'iterate') result.iterate = true;
      if (parts[currentIndex] === 'recurse') result.recurse = true;
      currentIndex++;
    }
    
    if (parts[currentIndex] === 'logical') {
      result.logical = true;
      currentIndex++;
    }
    
    if (parts[currentIndex]) {
      result.source = parts[currentIndex];
      currentIndex++;
    }
    
    if (parts[currentIndex]) {
      result.param = parts[currentIndex];
      currentIndex++;
    }
    
    if (parts[currentIndex]) {
      result.target = parts[currentIndex];
    }
    
    return result;
  }

  // _filter expression parser with recursive descent
  private parseFilterExpression(filterString: string): Expression {
    const tokens = this.tokenizeFilter(filterString);
    const parser = new FilterExpressionParser(tokens);
    return parser.parse();
  }

  private tokenizeFilter(input: string): Token[] {
    const tokens: Token[] = [];
    let position = 0;
    
    while (position < input.length) {
      if (/\s/.test(input[position])) {
        position++;
        continue;
      }
      
      if (input[position] === '(') {
        tokens.push({ type: 'LPAREN', value: '(', position });
        position++;
        continue;
      }
      
      if (input[position] === ')') {
        tokens.push({ type: 'RPAREN', value: ')', position });
        position++;
        continue;
      }
      
      if (input[position] === '"' || input[position] === "'") {
        const quote = input[position];
        let value = '';
        position++;
        
        while (position < input.length && input[position] !== quote) {
          if (input[position] === '\\' && position + 1 < input.length) {
            position++;
            value += input[position];
          } else {
            value += input[position];
          }
          position++;
        }
        
        if (position >= input.length) {
          throw new ParseError('Unterminated string', input, position);
        }
        
        position++;
        tokens.push({ type: 'STRING', value, position: position - value.length - 2 });
        continue;
      }
      
      const remainingInput = input.slice(position);
      
      const operatorMatch = remainingInput.match(/^(eq|ne|gt|lt|ge|le|co|sw|ew|pr|po|ss|sb|re|in|ni|sa|eb|ap)/);
      if (operatorMatch) {
        tokens.push({ type: 'OPERATOR', value: operatorMatch[1], position });
        position += operatorMatch[1].length;
        continue;
      }
      
      const keywordMatch = remainingInput.match(/^(and|or|not)/i);
      if (keywordMatch) {
        const keyword = keywordMatch[1].toLowerCase();
        tokens.push({ 
          type: keyword.toUpperCase() as 'AND' | 'OR' | 'NOT', 
          value: keyword, 
          position 
        });
        position += keyword.length;
        continue;
      }
      
      const identifierMatch = remainingInput.match(/^[a-zA-Z_][\w\-.]*/);
      if (identifierMatch) {
        tokens.push({ type: 'IDENTIFIER', value: identifierMatch[0], position });
        position += identifierMatch[0].length;
        continue;
      }
      
      const numberMatch = remainingInput.match(/^-?\d+(\.\d+)?/);
      if (numberMatch) {
        tokens.push({ type: 'NUMBER', value: numberMatch[0], position });
        position += numberMatch[0].length;
        continue;
      }
      
      const dateMatch = remainingInput.match(/^\d{4}(-\d{2}(-\d{2}(T\d{2}:\d{2}(:\d{2})?)?)?)?/);
      if (dateMatch) {
        tokens.push({ type: 'DATE', value: dateMatch[0], position });
        position += dateMatch[0].length;
        continue;
      }
      
      throw new ParseError(`Unexpected character: ${input[position]}`, input, position);
    }
    
    tokens.push({ type: 'EOF', value: '', position: input.length });
    return tokens;
  }
}

// Helper class for recursive descent parsing of _filter expressions
class FilterExpressionParser {
  private tokens: Token[];
  private position: number = 0;
  
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }
  
  parse(): Expression {
    const expr = this.parseOr();
    if (this.currentToken().type !== 'EOF') {
      throw new ParseError(
        `Unexpected token after expression: ${this.currentToken().value}`,
        '',
        this.currentToken().position
      );
    }
    return expr;
  }
  
  private parseOr(): Expression {
    let left = this.parseAnd();
    
    while (this.currentToken().type === 'OR') {
      this.consume('OR');
      const right = this.parseAnd();
      
      if (left.type === 'or') {
        (left as OrExpression).expressions.push(right);
      } else {
        left = { type: 'or', expressions: [left, right] };
      }
    }
    
    return left;
  }
  
  private parseAnd(): Expression {
    let left = this.parseNot();
    
    while (this.currentToken().type === 'AND') {
      this.consume('AND');
      const right = this.parseNot();
      
      if (left.type === 'and') {
        (left as AndExpression).expressions.push(right);
      } else {
        left = { type: 'and', expressions: [left, right] };
      }
    }
    
    return left;
  }
  
  private parseNot(): Expression {
    if (this.currentToken().type === 'NOT') {
      this.consume('NOT');
      return { type: 'not', expression: this.parseNot() };
    }
    
    return this.parsePrimary();
  }
  
  private parsePrimary(): Expression {
    if (this.currentToken().type === 'LPAREN') {
      this.consume('LPAREN');
      const expr = this.parseOr();
      this.consume('RPAREN');
      return expr;
    }
    
    if (this.currentToken().type === 'IDENTIFIER') {
      const param = this.consume('IDENTIFIER').value;
      
      if (this.currentToken().type === 'OPERATOR') {
        const opToken = this.consume('OPERATOR');
        const operator = FHIRToStandardOperators[opToken.value] as Expression['type'];
        
        const value = this.parseFilterValue();
        
        return {
          type: operator || '=',
          param: param,
          value: [value]
        } as Expression;
      }
      
      throw new ParseError(
        `Expected operator after parameter ${param}`,
        '',
        this.currentToken().position
      );
    }
    
    throw new ParseError(
      `Unexpected token: ${this.currentToken().value}`,
      '',
      this.currentToken().position
    );
  }
  
  private parseFilterValue(): Value {
    const token = this.currentToken();
    
    if (token.type === 'STRING') {
      const value = this.consume('STRING').value;
      return { type: 'string', value };
    }
    
    if (token.type === 'NUMBER') {
      const value = this.consume('NUMBER').value;
      // Check if it's actually a year (4 digits)
      if (/^\d{4}$/.test(value)) {
        return { type: 'date', value, precision: 'year' };
      }
      return { type: 'number', value: Number(value) };
    }
    
    if (token.type === 'DATE') {
      const value = this.consume('DATE').value;
      let precision: DateValue['precision'] = 'year';
      if (value.length >= 7) precision = 'month';
      if (value.length >= 10) precision = 'day';
      if (value.includes('T')) precision = 'time';
      
      return { type: 'date', value, precision };
    }
    
    if (token.type === 'IDENTIFIER') {
      const value = this.consume('IDENTIFIER').value;
      
      if (value === 'true' || value === 'false') {
        return { type: 'boolean', value: value === 'true' };
      }
      
      if (value.includes('|')) {
        const parts = value.split('|');
        return {
          type: 'token',
          system: parts[0],
          code: parts[1]
        };
      }
      
      return { type: 'string', value };
    }
    
    throw new ParseError(
      `Expected value but got: ${token.value}`,
      '',
      token.position
    );
  }
  
  private currentToken(): Token {
    return this.tokens[this.position];
  }
  
  private consume(type: TokenType): Token {
    const token = this.currentToken();
    if (token.type !== type) {
      throw new ParseError(
        `Expected ${type} but got ${token.type}`,
        '',
        token.position
      );
    }
    this.position++;
    return token;
  }
}

export default FHIRSearchParser;