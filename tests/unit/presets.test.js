/**
 * tests/unit/presets.test.js
 * Unit tests for the preset handling functions.
 * Covers: getAllPresets, getPreset, getRandomPreset, setPreset (with test doubles).
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import {
  getAllPresets,
  getPreset,
  getRandomPreset,
  setPreset,
} from "../../js/presets.js";

const NUMERIC_FIELDS = [
  "padding",
  "borderSize",
  "borderRadius",
  "decorationSize",
  "patternSize",
  "patternOpacity",
  "titleFontSize",
  "subtitleFontSize",
];
const COLOR_FIELDS = [
  "background",
  "titleColor",
  "subtitleColor",
  "borderColor",
  "patternColor",
];
const HEX_COLOR = /^#[0-9A-Fa-f]{3,8}$/;

function isValidPreset(preset) {
  return (
    NUMERIC_FIELDS.every(
      (f) => preset[f] === undefined || typeof preset[f] === "number",
    ) &&
    COLOR_FIELDS.every(
      (f) => preset[f] === undefined || HEX_COLOR.test(preset[f]),
    )
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── getAllPresets ─────────────────────────────────────────────────────────

describe("getAllPresets", () => {
  it("returns an array", () => {
    const result = getAllPresets();
    expect(Array.isArray(result)).toBe(true);
  });

  it("contains at least 10 presets", () => {
    expect(getAllPresets().length).toBeGreaterThanOrEqual(10);
  });

  it("always returns the same array (stable reference)", () => {
    expect(getAllPresets()).toBe(getAllPresets());
  });

  it('every preset has the "background" property', () => {
    getAllPresets().forEach((preset, i) => {
      expect(preset, `Preset #${i} must have background`).toHaveProperty(
        "background",
      );
    });
  });

  it("all presets have valid hex colors and numeric fields", () => {
    getAllPresets().forEach((preset, i) => {
      expect(isValidPreset(preset), `Preset #${i} is invalid`).toBe(true);
    });
  });

  it("no preset has an empty or null background", () => {
    getAllPresets().forEach((preset, i) => {
      expect(
        preset.background,
        `Preset #${i} has an invalid background`,
      ).toBeTruthy();
    });
  });

  it("textAlign only uses valid values (flex-start | center | flex-end)", () => {
    const validAligns = ["flex-start", "center", "flex-end"];
    getAllPresets()
      .filter((p) => p.textAlign !== undefined)
      .forEach((preset, i) => {
        expect(
          validAligns,
          `Preset #${i} textAlign="${preset.textAlign}" is not valid`,
        ).toContain(preset.textAlign);
      });
  });

  it("patternOpacity is between 0 and 1 when defined", () => {
    getAllPresets()
      .filter((p) => p.patternOpacity !== undefined)
      .forEach((preset, i) => {
        expect(preset.patternOpacity, `Preset #${i}`).toBeGreaterThanOrEqual(0);
        expect(preset.patternOpacity, `Preset #${i}`).toBeLessThanOrEqual(1);
      });
  });
});

// ─── getPreset ────────────────────────────────────────────────────────────

describe("getPreset", () => {
  it("returns the first preset for index 0", () => {
    const all = getAllPresets();
    expect(getPreset(0)).toEqual(all[0]);
  });

  it("returns the second preset for index 1", () => {
    const all = getAllPresets();
    expect(getPreset(1)).toEqual(all[1]);
  });

  it("returns the last preset for the last index", () => {
    const all = getAllPresets();
    const last = all.length - 1;
    expect(getPreset(last)).toEqual(all[last]);
  });

  it("returns undefined for an out-of-range index", () => {
    expect(getPreset(99999)).toBeUndefined();
  });

  it("returns undefined for a negative index", () => {
    expect(getPreset(-1)).toBeUndefined();
  });

  it("the returned preset is valid", () => {
    expect(isValidPreset(getPreset(0))).toBe(true);
  });
});

// ─── getRandomPreset ──────────────────────────────────────────────────────

describe("getRandomPreset", () => {
  it("returns an object that exists in the presets array", () => {
    const result = getRandomPreset();
    expect(getAllPresets()).toContainEqual(result);
  });

  it("uses Math.random to select the index", () => {
    const spy = vi.spyOn(Math, "random").mockReturnValue(0);
    const result = getRandomPreset();
    expect(spy).toHaveBeenCalledOnce();
    expect(result).toEqual(getAllPresets()[0]);
  });

  it("selects the first preset when Math.random returns 0", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getRandomPreset()).toEqual(getAllPresets()[0]);
  });

  it("selects the last preset when Math.random returns almost 1", () => {
    const all = getAllPresets();
    vi.spyOn(Math, "random").mockReturnValue(1 - Number.EPSILON);
    const result = getRandomPreset();
    expect(result).toEqual(all[all.length - 1]);
  });

  it("the returned preset is valid", () => {
    expect(isValidPreset(getRandomPreset())).toBe(true);
  });

  it("repeated calls can return different presets", () => {
    // Checks that it doesn't always return the same one (without mocking Math.random)
    const results = new Set(
      Array.from({ length: 30 }, () => JSON.stringify(getRandomPreset())),
    );
    expect(results.size).toBeGreaterThan(1);
  });
});

// ─── setPreset (test with doubles) ────────────────────────────────────────

describe("setPreset - with test doubles (spies)", () => {
  it("calls updateBanner with the provided preset", async () => {
    // Import the banner module so we can spy on its exports
    const bannerModule = await import("../../js/banner.js");
    const updateBannerSpy = vi
      .spyOn(bannerModule, "updateBanner")
      .mockImplementation(() => {});
    const updateUIOptionsSpy = vi
      .spyOn(bannerModule, "updateUIOptions")
      .mockImplementation(() => {});

    const preset = getAllPresets()[0];
    setPreset(preset, true);

    expect(updateUIOptionsSpy).toHaveBeenCalledWith(preset);
    expect(updateBannerSpy).toHaveBeenCalledWith({
      ...preset,
      ignoreSave: true,
    });
  });
});
