// NOTE: This is a test file for a parser that is yet to be implemented.
// These tests are based on the final AST design in sessions/search-parser.md
// and will be used to guide the implementation (TDD).

import { FHIRSearchParser } from "../src/parser";
import { SearchQuery } from "../src/types";

describe("FHIRSearchParser", () => {
  let parser: FHIRSearchParser;

  beforeAll(() => {
    parser = new FHIRSearchParser();
  });

  describe("Simple Parameters", () => {
    it("should parse a single parameter", () => {
      const url = "/Patient?name=John";
      const expected: SearchQuery = {
        resource: "Patient",
        where: {
          type: "=",
          param: "name",
          value: [{ type: "string", value: "John" }],
        },
      };
      expect(parser.parse(url)).toEqual(expected);
    });

    it("should parse multiple ANDed parameters", () => {
      const url = "/Patient?name=John&birthdate=ge2010-01-01";
      const expected: SearchQuery = {
        resource: "Patient",
        where: {
          type: "and",
          expressions: [
            {
              type: "=",
              param: "name",
              value: [{ type: "string", value: "John" }],
            },
            {
              type: ">=",
              param: "birthdate",
              value: [{ type: "date", value: "2010-01-01", precision: "day" }],
            },
          ],
        },
      };
      expect(parser.parse(url)).toEqual(expected);
    });

    it("should parse comma-separated OR values", () => {
      const url = "/Patient?name=John,Peter";
      const expected: SearchQuery = {
        resource: "Patient",
        where: {
          type: "or",
          expressions: [
            {
              type: "=",
              param: "name",
              value: [{ type: "string", value: "John" }],
            },
            {
              type: "=",
              param: "name",
              value: [{ type: "string", value: "Peter" }],
            },
          ],
        },
      };
      expect(parser.parse(url)).toEqual(expected);
    });
  });

  describe("Chained and Reverse-Chained Parameters", () => {
    it("should parse a simple chained parameter", () => {
      const url = "/Observation?subject.name=Peter";
      const expected: SearchQuery = {
        resource: "Observation",
        where: {
          type: "join",
          join: {
            resource: "Patient", // Assuming default, would be enriched later
            on: { type: "reference", param: "subject" },
            where: {
              type: "=",
              param: "name",
              value: [{ type: "string", value: "Peter" }],
            },
          },
        },
      };
      expect(parser.parse(url)).toEqual(expected);
    });

    it("should parse a simple _has parameter", () => {
      const url = "/Patient?_has:Observation:patient:code=1234-5";
      const expected: SearchQuery = {
        resource: "Patient",
        where: {
          type: "join",
          join: {
            resource: "Observation",
            on: { type: "reverse-reference", param: "patient" },
            where: {
              type: "=",
              param: "code",
              value: [{ type: "token", code: "1234-5" }],
            },
          },
        },
      };
      expect(parser.parse(url)).toEqual(expected);
    });

    it("should AND a simple param with a chained param", () => {
      const url = "/Observation?code=abc&subject.name=Peter";
      const expected: SearchQuery = {
        resource: "Observation",
        where: {
          type: "and",
          expressions: [
            {
              type: "=",
              param: "code",
              value: [{ type: "token", code: "abc" }],
            },
            {
              type: "join",
              join: {
                resource: "Patient",
                on: { type: "reference", param: "subject" },
                where: {
                  type: "=",
                  param: "name",
                  value: [{ type: "string", value: "Peter" }],
                },
              },
            },
          ],
        },
      };
      expect(parser.parse(url)).toEqual(expected);
    });
  });

  describe("Composite Parameters", () => {
    it("should parse a composite parameter", () => {
      const url =
        "/Observation?code-value-quantity=http://loinc.org|1234-5$gt150";
      const expected: SearchQuery = {
        resource: "Observation",
        where: {
          type: "=",
          param: "code-value-quantity",
          value: [
            {
              type: "composite",
              parts: [
                { type: "token", system: "http://loinc.org", code: "1234-5" },
                { type: "quantity", value: 150, comparator: ">" },
              ],
            },
          ],
        },
      };
      expect(parser.parse(url)).toEqual(expected);
    });
  });

  describe("_filter Parameter", () => {
    it("should parse a simple _filter expression", () => {
      const url = "/Patient?_filter=name co 'smith'";
      const expected: SearchQuery = {
        resource: "Patient",
        where: {
          type: "contains",
          param: "name",
          value: [{ type: "string", value: "smith" }],
        },
      };
      expect(parser.parse(url)).toEqual(expected);
    });

    it("should parse a complex _filter expression with logic", () => {
      const url =
        "/Patient?_filter=(name co 'smith' or name co 'jones') and birthdate gt 2000";
      const expected: SearchQuery = {
        resource: "Patient",
        where: {
          type: "and",
          expressions: [
            {
              type: "or",
              expressions: [
                {
                  type: "contains",
                  param: "name",
                  value: [{ type: "string", value: "smith" }],
                },
                {
                  type: "contains",
                  param: "name",
                  value: [{ type: "string", value: "jones" }],
                },
              ],
            },
            {
              type: ">",
              param: "birthdate",
              value: [{ type: "date", value: "2000", precision: "year" }],
            },
          ],
        },
      };
      expect(parser.parse(url)).toEqual(expected);
    });

    it("should AND a _filter expression with a standard parameter", () => {
      const url = "/Patient?active=true&_filter=name co 'smith'";
      const expected: SearchQuery = {
        resource: "Patient",
        where: {
          type: "and",
          expressions: [
            {
              type: "=",
              param: "active",
              value: [{ type: "boolean", value: true }],
            },
            {
              type: "contains",
              param: "name",
              value: [{ type: "string", value: "smith" }],
            },
          ],
        },
      };
      expect(parser.parse(url)).toEqual(expected);
    });
  });

  describe("Special Parameters", () => {
    it("should parse _include parameters into a flat list", () => {
      const url =
        "/Observation?_include=Observation:subject&_include=Patient:organization";
      const expected: SearchQuery = {
        resource: "Observation",
        includes: [
          {
            direction: "forward",
            source: "Observation",
            param: "subject",
          },
          {
            direction: "forward",
            source: "Patient",
            param: "organization",
          },
        ],
      };
      expect(parser.parse(url)).toEqual(expected);
    });

    it("should parse _revinclude parameters", () => {
      const url = "/Patient?_revinclude=Observation:subject";
      const expected: SearchQuery = {
        resource: "Patient",
        includes: [
          {
            direction: "reverse",
            source: "Observation",
            param: "subject",
          },
        ],
      };
      expect(parser.parse(url)).toEqual(expected);
    });

    it("should parse _sort parameters", () => {
      const url = "/Patient?_sort=birthdate,-name";
      const expected: SearchQuery = {
        resource: "Patient",
        sort: [
          { param: "birthdate", direction: "asc" },
          { param: "name", direction: "desc" },
        ],
      };
      expect(parser.parse(url)).toEqual(expected);
    });
  });
});
