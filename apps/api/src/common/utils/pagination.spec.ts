import { applyCursorPage } from "./pagination";

describe("applyCursorPage", () => {
  it("returns no nextCursor when rows fit within the page", () => {
    const rows = [{ id: "a" }, { id: "b" }];
    const res = applyCursorPage(rows, 5);
    expect(res.items).toHaveLength(2);
    expect(res.nextCursor).toBeUndefined();
  });

  it("drops the lookahead row and sets nextCursor to the LAST RETURNED row", () => {
    // take=2, fetched take+1=3. The boundary row "c" must NOT become the
    // cursor — with skip:1 it would be skipped on the next page and lost.
    const rows = [{ id: "a" }, { id: "b" }, { id: "c" }];
    const res = applyCursorPage(rows, 2);
    expect(res.items.map((r) => r.id)).toEqual(["a", "b"]);
    expect(res.nextCursor).toBe("b");
  });

  it("handles exactly take+1 with a single page of one", () => {
    const rows = [{ id: "only" }, { id: "extra" }];
    const res = applyCursorPage(rows, 1);
    expect(res.items.map((r) => r.id)).toEqual(["only"]);
    expect(res.nextCursor).toBe("only");
  });
});
