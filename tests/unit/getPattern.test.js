/**
 * tests/unit/getPattern.test.js
 * Unit tests for the getPattern function (js/data/patterns.js).
 * Requires no DOM — pure function that generates CSS strings.
 */
import { describe, it, expect } from "vitest";
import { getPattern, getPatternDefaultSize } from "../../js/data/patterns.js";

const KNOWN_PATTERNS = [
  "jigsaw",
  "github",
  "endless-constellation",
  "floating-cogs",
  "bubbles",
  "random-shapes",
  "lisbon",
  "temple",
  "topography",
  "hideout",
  "4-point-stars",
  "moroccan",
  "squares",
  "graph-paper",
  "brick-wall",
  "honeycomb",
  "charlie-brown",
  "subtle-stripes",
];

// ─── Return format ─────────────────────────────────────────────────────────

describe("getPattern - return format", () => {
  it.each(KNOWN_PATTERNS)(
    'pattern "%s" returns a string starting with url(',
    (pattern) => {
      const result = getPattern(pattern, "FFFFFF", 0.25);
      expect(typeof result).toBe("string");
      expect(result).toMatch(/^url\(/);
    },
  );

  it.each(KNOWN_PATTERNS)(
    'pattern "%s" contains encoded inline SVG',
    (pattern) => {
      const result = getPattern(pattern, "FFFFFF", 0.25);
      expect(result).toContain("data:image/svg+xml");
    },
  );

});

// ─── Parameter interpolation ──────────────────────────────────────────────

describe("getPattern - parameter interpolation", () => {
  it("includes the hex color in the generated SVG", () => {
    const result = getPattern("bubbles", "ABC123", 0.5);
    expect(result).toContain("ABC123");
  });

  it("includes the opacity in the generated SVG", () => {
    const result = getPattern("bubbles", "FFFFFF", 0.75);
    expect(result).toContain("0.75");
  });

  it("uses the default opacity 0.25 when not specified", () => {
    const result = getPattern("bubbles", "FFFFFF");
    expect(result).toContain("0.25");
  });

  it("uses the default color FFFFFF when not specified", () => {
    const result = getPattern("bubbles");
    expect(result).toContain("FFFFFF");
  });

  it("different colors produce different SVGs", () => {
    const a = getPattern("bubbles", "FF0000", 0.25);
    const b = getPattern("bubbles", "00FF00", 0.25);
    expect(a).not.toBe(b);
  });

  it("different opacities produce different SVGs", () => {
    const a = getPattern("bubbles", "FFFFFF", 0.1);
    const b = getPattern("bubbles", "FFFFFF", 0.9);
    expect(a).not.toBe(b);
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────

describe("getPattern - edge cases", () => {
  it('returns "none" for an unknown pattern (switch default case)', () => {
    const result = getPattern("nonexistent-pattern", "FFFFFF", 0.5);
    expect(result).toBe("none");
  });

  it("handles opacity 0 without errors", () => {
    expect(() => getPattern("bubbles", "FFFFFF", 0)).not.toThrow();
    const result = getPattern("bubbles", "FFFFFF", 0);
    expect(result).toContain("svg");
  });

  it("handles opacity 1 without errors", () => {
    expect(() => getPattern("bubbles", "FFFFFF", 1)).not.toThrow();
  });

  it("calls with the same parameters produce the same result (determinism)", () => {
    const r1 = getPattern("jigsaw", "AABBCC", 0.3);
    const r2 = getPattern("jigsaw", "AABBCC", 0.3);
    expect(r1).toBe(r2);
  });
});

// ─── getPatternDefaultSize ────────────────────────────────────────────────

describe("getPatternDefaultSize", () => {
  it("returns a positive number for known patterns", () => {
    KNOWN_PATTERNS.forEach((pattern) => {
      const size = getPatternDefaultSize(pattern);
      if (size !== undefined) {
        expect(typeof size).toBe("number");
        expect(size).toBeGreaterThan(0);
      }
    });
  });

  it("bubbles has a default size of 200", () => {
    expect(getPatternDefaultSize("bubbles")).toBe(200);
  });

  it("jigsaw has a default size of 100", () => {
    expect(getPatternDefaultSize("jigsaw")).toBe(100);
  });

  it("returns undefined or a value for unknown patterns", () => {
    const result = getPatternDefaultSize("missing-pattern");
    // Must not throw; may return undefined
    expect(result === undefined || typeof result === "number").toBe(true);
  });
});

// ─── Oracle snapshots ─────────────────────────────────────────────────────

describe("getPattern - visual oracle snapshots", () => {
  it("topography with FFFFFF/0.25 keeps a stable structure (snapshot)", () => {
    const result = getPattern("topography", "FFFFFF", 0.25);
    expect(result).toMatchSnapshot();
  });

  it("bubbles with FFFFFF/0.25 keeps a stable structure (snapshot)", () => {
    const result = getPattern("bubbles", "FFFFFF", 0.25);
    expect(result).toMatchSnapshot();
  });

  it("jigsaw with FFFFFF/0.25 keeps a stable structure (snapshot)", () => {
    const result = getPattern("jigsaw", "FFFFFF", 0.25);
    expect(result).toMatchSnapshot();
  });
});
