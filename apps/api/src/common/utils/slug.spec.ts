import { isValidSlug, slugify, SLUG_PATTERN } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates a title", () => {
    expect(slugify("The AI Agent Boom")).toBe("the-ai-agent-boom");
  });

  it("collapses runs of punctuation and whitespace into one hyphen", () => {
    expect(slugify("RLS  in --- plain  English!")).toBe(
      "rls-in-plain-english",
    );
  });

  it("trims leading and trailing separators", () => {
    expect(slugify("  ...Hello World!!  ")).toBe("hello-world");
  });

  it("folds accents to their base letter rather than dropping them", () => {
    // Dropping the mark instead of folding would yield "martnez".
    expect(slugify("Martínez & Company")).toBe("martinez-company");
    expect(slugify("Múltiple Ácentos")).toBe("multiple-acentos");
  });

  it("preserves digits", () => {
    expect(slugify("Next.js 15 Upgrade")).toBe("next-js-15-upgrade");
  });

  it("returns an empty string when nothing usable remains", () => {
    // Callers must treat this as a failure rather than storing it.
    expect(slugify("!!!")).toBe("");
    expect(slugify("")).toBe("");
  });

  it("is idempotent — slugifying a slug returns it unchanged", () => {
    const once = slugify("The AI Agent Boom Just Created a Problem");
    expect(slugify(once)).toBe(once);
  });

  it("produces output that satisfies the validator for real titles", () => {
    const titles = [
      "The AI Agent Boom Just Created a Brand New Security Problem",
      "RLS in Plain English",
      "Barely Scratched the Surface",
      "Simulate Professional Experience",
    ];
    for (const t of titles) {
      expect(isValidSlug(slugify(t))).toBe(true);
    }
  });
});

describe("isValidSlug", () => {
  it("accepts well-formed slugs", () => {
    expect(isValidSlug("rls-in-plain-english")).toBe(true);
    expect(isValidSlug("next-js-15")).toBe(true);
    expect(isValidSlug("a")).toBe(true);
  });

  it("rejects the shapes that break canonical URLs", () => {
    expect(isValidSlug("The AI Agent Boom")).toBe(false); // spaces
    expect(isValidSlug("Rls-In-Plain-English")).toBe(false); // uppercase
    expect(isValidSlug("trailing-")).toBe(false);
    expect(isValidSlug("-leading")).toBe(false);
    expect(isValidSlug("double--hyphen")).toBe(false);
    expect(isValidSlug("under_score")).toBe(false);
    expect(isValidSlug("slash/es")).toBe(false);
    expect(isValidSlug("")).toBe(false);
  });

  it("is anchored, so a valid substring does not pass the whole string", () => {
    // An unanchored pattern would match "ok" inside this and wrongly accept it.
    expect(SLUG_PATTERN.test("NOT ok HERE")).toBe(false);
  });
});
