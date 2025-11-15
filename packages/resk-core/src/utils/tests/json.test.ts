import { JsonHelper } from "@/utils/json";

describe("JsonHelper.isJSON", () => {
  test("returns true for object/array JSON strings", () => {
    expect(JsonHelper.isJSON('{"a":1}')).toBe(true);
    expect(JsonHelper.isJSON("[1,2,3]")).toBe(true);
    expect(JsonHelper.isJSON('  { "x": [1,2] }  ')).toBe(true);
  });

  test("returns false for primitive JSON values or invalid JSON", () => {
    expect(JsonHelper.isJSON("123")).toBe(false);
    expect(JsonHelper.isJSON('"a string"')).toBe(false);
    expect(JsonHelper.isJSON("true")).toBe(false);
    expect(JsonHelper.isJSON("null")).toBe(false);
    expect(JsonHelper.isJSON("")).toBe(false);
    expect(JsonHelper.isJSON(undefined)).toBe(false);
    expect(JsonHelper.isJSON('{ "a": 1, }')).toBe(false); // trailing comma invalid
  });
});

describe("JsonHelper.parse", () => {
  test("parses object/array JSON strings", () => {
    expect(JsonHelper.parse('{"foo": "bar"}')).toEqual({ foo: "bar" });
    expect(JsonHelper.parse("[1,2]")).toEqual([1, 2]);
  });

  test("does not try to parse primitives", () => {
    expect(JsonHelper.parse("123")).toBe("123");
    expect(JsonHelper.parse('"abc"')).toBe('"abc"');
    expect(JsonHelper.parse("true")).toBe("true");
  });
});
