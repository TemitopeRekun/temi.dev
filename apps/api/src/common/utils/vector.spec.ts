import { toVectorLiteral } from "./vector";

describe("toVectorLiteral", () => {
  it("formats finite numbers with fixed 6-decimal precision and a vector cast", () => {
    expect(toVectorLiteral([0.1, 0.2, 1])).toBe(
      "'[0.100000, 0.200000, 1.000000]'::vector",
    );
  });

  it("coerces non-finite values to 0", () => {
    expect(toVectorLiteral([Number.NaN, Infinity, -Infinity, 0.5])).toBe(
      "'[0, 0, 0, 0.500000]'::vector",
    );
  });

  it("handles an empty embedding", () => {
    expect(toVectorLiteral([])).toBe("'[]'::vector");
  });
});
