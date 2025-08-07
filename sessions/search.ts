import { textSpanEnd } from "typescript";

export interface OperatorSearchExpression {
  param: string;
  operator: string;
  value: any[];
}

export interface AndExpression {
  type: "and";
  expressions: OperatorSearchExpression[];
}

export interface OrExpression {
  type: "or";
  expressions: OperatorSearchExpression[];
}

export type Expression =
  | OperatorSearchExpression
  | AndExpression
  | OrExpression;

export interface ChainExpression {
  parameter: string;
  where: Expression[];
  has?: HasExpression[];
}

export interface HasExpression {
  parameter: string;
  where: Expression[];
  has?: HasExpression[];
}

export interface SearchOptions {
  resource: string;
  chain?: ChainExpression[];
  has?: HasExpression[];
  where?: Expression[];
}

let search: SearchOptions = {
  resource: "Patient",
  where: {
    type: "operator",
    operator: "=",
    parameter: "name",
    value: "John Doe",
  },
};

let search2: SearchOptions = {
  resource: "Patient",
  where: {
    type: "and",
    expressions: [
      {
        type: "operator",
        operator: "=",
        parameter: "name",
        value: "John Doe",
      },
      {
        type: "operator",
        operator: "lt",
        parameter: "age",
        value: 30,
      },
    ],
  },
};

let searchById: SearchOptions = {
  resource: "Patient",
  where: [
    {
      param: "id",
      operator: "=",
      value: ["123", "456"],
    },
  ],
};

let chainedSearch: SearchOptions = {
  resource: "Patient",
  where: [
    {
      param: "name",
      operator: "=",
      value: ["John Doe"],
    },
    {
      param: "age",
      operator: "lt",
      value: [30],
    },
    {
      param: "age",
      operator: "gt",
      value: [20],
    },
  ],
};

let chainedSearch2: SearchOptions = {
  resource: "Encounter",
  chain: [
    {
      parameter: "patient",
      where: [
        {
          param: "name",
          operator: "eq",
          value: ["John Doe", "Jane Doe"],
        },
      ],
    },
  ],
};

let hasSearch: SearchOptions = {
  resource: "Patient",
  has: [
    {
      parameter: "patient",
      where: [
        {
          param: "code",
          operator: "eq",
          value: ["12345"],
        },
        {
          type: "or",
          expressions: [
            {
              param: "subject",
              operator: "eq",
              value: ["pt-1"],
            },
            {
              param: "code",
              operator: "subsume",
              value: ["Loinc|1234-2"],
            },
          ],
        },
      ],
    },
  ],
};
