import { describe, expect, test } from "bun:test";
import { FHIRSearchParser } from "../src/parser";
import type { SearchQuery } from "../src/types";

describe("FHIRSearchParser", () => {
  const parser = new FHIRSearchParser();

  describe("Simple searches", () => {
    test("parses simple parameter", () => {
      const result = parser.parse("/Patient?name=John");
      expect(result.query).toBeDefined();
      expect(result.errors).toBeUndefined();

      const query = result.query!;
      expect(query.resource).toBe("Patient");
      expect(query.where).toHaveLength(1);
      expect(query.where![0]).toEqual({
        param: "name",
        operator: "=",
        value: [{ type: "string", value: "John" }],
      });
    });

    test("parses multiple parameters", () => {
      const result = parser.parse("/Patient?name=John&birthdate=2010-01-01");
      const query = result.query!;

      expect(query.where).toHaveLength(2);
      expect(query.where![0]).toEqual({
        param: "name",
        operator: "=",
        value: [{ type: "string", value: "John" }],
      });
      expect(query.where![1]).toEqual({
        param: "birthdate",
        operator: "=",
        value: [{ type: "date", value: "2010-01-01", precision: "day" }],
      });
    });

    test("parses parameter with prefix", () => {
      const result = parser.parse("/Patient?birthdate=ge2010-01-01");
      const query = result.query!;

      expect(query.where![0]).toEqual({
        param: "birthdate",
        operator: ">=",
        value: [{ type: "date", value: "2010-01-01", precision: "day" }],
      });
    });

    test("parses comma-separated values (OR)", () => {
      const result = parser.parse("/Patient?name=John,Jane");
      const query = result.query!;

      expect(query.where![0]).toEqual({
        param: "name",
        operator: "=",
        value: [
          { type: "string", value: "John" },
          { type: "string", value: "Jane" },
        ],
      });
    });
  });

  describe("Token values", () => {
    test("parses token with system and code", () => {
      const result = parser.parse("/Observation?code=http://loinc.org|1234-5");
      const query = result.query!;

      expect(query.where![0]).toEqual({
        param: "code",
        operator: "=",
        value: [
          {
            type: "token",
            system: "http://loinc.org",
            code: "1234-5",
          },
        ],
      });
    });

    test("parses token with only code", () => {
      const result = parser.parse("/Observation?code=1234-5");
      const query = result.query!;

      // Without a system (|), this is treated as a string value
      expect(query.where![0]).toEqual({
        param: "code",
        operator: "=",
        value: [
          {
            type: "string",
            value: "1234-5",
          },
        ],
      });
    });

    test("parses token with empty system", () => {
      const result = parser.parse("/Observation?code=|1234-5");
      const query = result.query!;

      expect(query.where![0]).toEqual({
        param: "code",
        operator: "=",
        value: [
          {
            type: "token",
            system: undefined,
            code: "1234-5",
          },
        ],
      });
    });
  });

  describe("Reference values", () => {
    test("parses reference value", () => {
      const result = parser.parse("/Observation?subject=Patient/123");
      const query = result.query!;

      expect(query.where![0]).toEqual({
        param: "subject",
        operator: "=",
        value: [
          {
            type: "reference",
            resourceType: "Patient",
            id: "123",
          },
        ],
      });
    });
  });

  describe("Modifiers", () => {
    test("parses :exact modifier", () => {
      const result = parser.parse("/Patient?name:exact=John");
      const query = result.query!;

      expect(query.where![0]).toEqual({
        param: "name",
        operator: "exact",
        value: [{ type: "string", value: "John" }],
      });
    });

    test("parses :contains modifier", () => {
      const result = parser.parse("/Patient?name:contains=John");
      const query = result.query!;

      expect(query.where![0]).toEqual({
        param: "name",
        operator: "contains",
        value: [{ type: "string", value: "John" }],
      });
    });

    test("parses :missing modifier", () => {
      const result = parser.parse("/Patient?name:missing=true");
      const query = result.query!;

      expect(query.where![0]).toEqual({
        param: "name",
        operator: "missing",
        value: [{ type: "boolean", value: true }],
      });
    });

    test("parses :missing=false as exists", () => {
      const result = parser.parse("/Patient?name:missing=false");
      const query = result.query!;

      expect(query.where![0]).toEqual({
        param: "name",
        operator: "exists",
        value: [{ type: "boolean", value: false }],
      });
    });
  });

  describe("Chaining", () => {
    test("parses simple chain", () => {
      const result = parser.parse("/Observation?subject.name=John");
      const query = result.query!;

      expect(query.joins).toHaveLength(1);
      expect(query.joins![0]).toEqual({
        resource: "Patient",
        on: {
          type: "reference",
          parameter: "subject",
        },
        where: [
          {
            param: "name",
            operator: "=",
            value: [{ type: "string", value: "John" }],
          },
        ],
      });
    });

    test("parses chain with resource type", () => {
      const result = parser.parse("/Observation?subject:Patient.name=John");
      const query = result.query!;

      expect(query.joins).toHaveLength(1);
      expect(query.joins![0]).toEqual({
        resource: "Patient",
        on: {
          type: "reference",
          parameter: "subject",
        },
        where: [
          {
            param: "name",
            operator: "=",
            value: [{ type: "string", value: "John" }],
          },
        ],
      });
    });

    test("parses deep chain", () => {
      const result = parser.parse("/Encounter?subject.organization.name=Acme");
      const query = result.query!;

      expect(query.joins).toHaveLength(1);
      const join = query.joins![0];
      expect(join?.resource).toBe("Patient");
      expect(join?.on.parameter).toBe("subject");
      expect(join?.join).toHaveLength(1);

      const nestedJoin = join?.join?.[0];
      expect(nestedJoin?.resource).toBe("Organization");
      expect(nestedJoin?.on.parameter).toBe("organization");
      expect(nestedJoin?.where?.[0]).toEqual({
        param: "name",
        operator: "=",
        value: [{ type: "string", value: "Acme" }],
      });
    });
  });

  describe("_has parameter", () => {
    test("parses simple _has", () => {
      const result = parser.parse(
        "/Patient?_has:Observation:patient:code=1234-5",
      );
      const query = result.query!;

      expect(query.joins).toHaveLength(1);
      expect(query.joins![0]).toEqual({
        resource: "Observation",
        on: {
          type: "reverse-reference",
          parameter: "patient",
        },
        where: [
          {
            param: "code",
            operator: "=",
            value: [{ type: "string", value: "1234-5" }],
          },
        ],
      });
    });

    test("parses nested _has", () => {
      const result = parser.parse(
        "/Patient?_has:Observation:patient:_has:DiagnosticReport:result:status=final",
      );
      const query = result.query!;

      expect(query.joins).toHaveLength(1);
      const join = query.joins![0];
      expect(join?.resource).toBe("Observation");
      expect(join?.on.type).toBe("reverse-reference");
      expect(join?.on.parameter).toBe("patient");

      expect(join?.join).toHaveLength(1);
      const nestedJoin = join?.join?.[0];
      expect(nestedJoin?.resource).toBe("DiagnosticReport");
      expect(nestedJoin?.on.type).toBe("reverse-reference");
      expect(nestedJoin?.on.parameter).toBe("result");
    });
  });

  describe("Special parameters", () => {
    test("parses _include", () => {
      const result = parser.parse(
        "/MedicationRequest?_include=MedicationRequest:requester",
      );
      const query = result.query!;

      expect(query.includes).toHaveLength(1);
      expect(query.includes![0]).toEqual({
        direction: "forward",
        source: "MedicationRequest",
        parameter: "requester",
      });
    });

    test("parses _revinclude", () => {
      const result = parser.parse("/Patient?_revinclude=Observation:subject");
      const query = result.query!;

      expect(query.includes).toHaveLength(1);
      expect(query.includes![0]).toEqual({
        direction: "reverse",
        source: "Observation",
        parameter: "subject",
      });
    });

    test("parses _include with target type", () => {
      const result = parser.parse(
        "/Observation?_include=Observation:subject:Patient",
      );
      const query = result.query!;

      expect(query.includes![0]).toEqual({
        direction: "forward",
        source: "Observation",
        parameter: "subject",
        target: "Patient",
      });
    });

    test("parses _sort", () => {
      const result = parser.parse("/Patient?_sort=name,-birthdate");
      const query = result.query!;

      expect(query.sort).toHaveLength(2);
      expect(query.sort![0]).toEqual({
        parameter: "name",
        direction: "asc",
      });
      expect(query.sort![1]).toEqual({
        parameter: "birthdate",
        direction: "desc",
      });
    });

    test("parses _count and _offset", () => {
      const result = parser.parse("/Patient?_count=10&_offset=20");
      const query = result.query!;

      expect(query.count).toBe(10);
      expect(query.offset).toBe(20);
    });

    test("parses _summary", () => {
      const result = parser.parse("/Patient?_summary=true");
      const query = result.query!;

      expect(query.summary).toBe("true");
    });

    test("parses _elements", () => {
      const result = parser.parse("/Patient?_elements=id,name,birthDate");
      const query = result.query!;

      expect(query.elements).toEqual({
        id: true,
        name: true,
        birthDate: true,
      });
    });
  });

  describe("Complex queries", () => {
    test("parses query with multiple features", () => {
      const result = parser.parse(
        "/Observation?code=1234-5&subject:Patient.name=John&" +
          "_include=Observation:subject&_sort=-date&_count=20",
      );
      const query = result.query!;

      expect(query.resource).toBe("Observation");
      expect(query.where).toHaveLength(1);
      expect(query.joins).toHaveLength(1);
      expect(query.includes).toHaveLength(1);
      expect(query.sort).toHaveLength(1);
      expect(query.count).toBe(20);
      //console.log(JSON.stringify(query, null, " "));
    });

    test("parses URL-encoded parameters", () => {
      const result = parser.parse(
        "/Patient?name=John%20Doe&address=123%20Main%20St",
      );
      const query = result.query!;

      expect((query.where![0] as any).value[0]).toEqual({
        type: "string",
        value: "John Doe",
      });
      expect((query.where![1] as any).value[0]).toEqual({
        type: "string",
        value: "123 Main St",
      });
    });
  });

  describe("Error handling", () => {
    test("returns error for missing resource", () => {
      const result = parser.parse("?name=John");
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.message).toContain("No resource type");
    });

    test("returns error for invalid _has", () => {
      const result = parser.parse("/Patient?_has:invalid");
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.message).toContain("Invalid _has structure");
    });
  });

  describe("Date parsing", () => {
    test("parses year precision", () => {
      const result = parser.parse("/Patient?birthdate=2010");
      const query = result.query!;

      expect((query.where![0] as any).value[0]).toEqual({
        type: "date",
        value: "2010",
        precision: "year",
      });
    });

    test("parses month precision", () => {
      const result = parser.parse("/Patient?birthdate=2010-01");
      const query = result.query!;

      expect((query.where![0] as any).value[0]).toEqual({
        type: "date",
        value: "2010-01",
        precision: "month",
      });
    });

    test("parses day precision", () => {
      const result = parser.parse("/Patient?birthdate=2010-01-15");
      const query = result.query!;

      expect((query.where![0] as any).value[0]).toEqual({
        type: "date",
        value: "2010-01-15",
        precision: "day",
      });
    });

    test("parses time precision", () => {
      const result = parser.parse("/Patient?birthdate=2010-01-15T10:30:00");
      const query = result.query!;

      expect((query.where![0] as any).value[0]).toEqual({
        type: "date",
        value: "2010-01-15T10:30:00",
        precision: "time",
      });
    });
  });

  describe("Number parsing", () => {
    test("parses integer", () => {
      const result = parser.parse("/RiskAssessment?probability=50");
      const query = result.query!;

      expect((query.where![0] as any).value[0]).toEqual({
        type: "number",
        value: 50,
      });
    });

    test("parses decimal", () => {
      const result = parser.parse("/RiskAssessment?probability=0.75");
      const query = result.query!;

      expect((query.where![0] as any).value[0]).toEqual({
        type: "number",
        value: 0.75,
      });
    });

    test("parses negative number", () => {
      const result = parser.parse("/Observation?value-quantity=-10.5");
      const query = result.query!;

      expect((query.where![0] as any).value[0]).toEqual({
        type: "number",
        value: -10.5,
      });
    });
  });
});
