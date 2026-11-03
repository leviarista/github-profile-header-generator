/**
 * tests/integration/localStorage.test.js
 * Integration tests for the localStorage logic:
 * saving and retrieving themes, fallbacks, consistency.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Canvas mock before importing banner
const mockToDataURL = vi.fn(() => "data:image/png;base64,MOCK");
const mockDrawImage = vi.fn();
const mockGetContext = vi.fn(() => ({ drawImage: mockDrawImage }));

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: mockGetContext,
  writable: true,
  configurable: true,
});
Object.defineProperty(HTMLCanvasElement.prototype, "toDataURL", {
  value: mockToDataURL,
  writable: true,
  configurable: true,
});

const { updateBanner, getSavedThemeProp } = await import("../../js/banner.js");

// The actual key used in saveTheme and getSavedThemeProp is 'theme'
const STORAGE_KEY = "theme";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── Saving the theme ──────────────────────────────────────────────────────

describe("Saving the theme in localStorage", () => {
  it("saves the theme as serializable JSON", () => {
    updateBanner({ background: "#FF0000" });
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(() => JSON.parse(raw)).not.toThrow();
  });

  it("the saved theme contains the properties passed to updateBanner", () => {
    const theme = {
      background: "#62518d",
      titleColor: "#ffffff",
      subtitleColor: "#fff2b3",
      borderSize: 5,
      borderRadius: 0,
    };
    updateBanner(theme);
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved.background).toBe(theme.background);
    expect(saved.titleColor).toBe(theme.titleColor);
    expect(saved.borderSize).toBe(theme.borderSize);
  });

  it("overwrites the previous theme with the new one", () => {
    updateBanner({ background: "#AAAAAA" });
    updateBanner({ background: "#BBBBBB" });
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved.background).toBe("#BBBBBB");
  });

  it('does not save internal properties such as "ignoreSave"', () => {
    updateBanner({ background: "#CCCCCC", ignoreSave: true });
    // With ignoreSave: true nothing is saved
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("saves nothing when ignoreSave: true is passed", () => {
    updateBanner({ background: "#DDDDDD", ignoreSave: true });
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

// ─── Retrieving properties ────────────────────────────────────────────────

describe("getSavedThemeProp - retrieving properties", () => {
  it("returns the background value saved in localStorage", () => {
    localStorage.setItem("theme", JSON.stringify({ background: "#123456" }));
    expect(getSavedThemeProp("background")).toBe("#123456");
  });

  it("returns the titleColor value saved in localStorage", () => {
    localStorage.setItem("theme", JSON.stringify({ titleColor: "#FF0000" }));
    expect(getSavedThemeProp("titleColor")).toBe("#FF0000");
  });

  it("returns the pattern value saved in localStorage", () => {
    localStorage.setItem("theme", JSON.stringify({ pattern: "bubbles" }));
    expect(getSavedThemeProp("pattern")).toBe("bubbles");
  });

  it("returns undefined for a property that does not exist in the saved theme", () => {
    localStorage.setItem("theme", JSON.stringify({ background: "#000000" }));
    expect(getSavedThemeProp("nonexistentProp")).toBeUndefined();
  });

  it("saves a theme and retrieves it correctly (full cycle)", () => {
    const theme = {
      background: "#5A4B80",
      borderColor: "#FFFFFF",
      borderSize: 3,
      borderRadius: 6,
      titleColor: "#FFFFFF",
      subtitleColor: "#FFD700",
    };
    updateBanner(theme);
    expect(getSavedThemeProp("background")).toBe(theme.background);
    expect(getSavedThemeProp("borderSize")).toBe(theme.borderSize);
    expect(getSavedThemeProp("titleColor")).toBe(theme.titleColor);
  });
});

// ─── Fallbacks ────────────────────────────────────────────────────────────

describe("getSavedThemeProp - fallbacks", () => {
  it("returns null when there is no saved theme", () => {
    expect(getSavedThemeProp("background")).toBeNull();
    expect(getSavedThemeProp("borderSize")).toBeNull();
  });

  it("returns null when localStorage contains invalid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "this-is-not-json");
    expect(getSavedThemeProp("background")).toBeNull();
  });

  it("returns null when the localStorage item is empty", () => {
    localStorage.setItem(STORAGE_KEY, "");
    expect(getSavedThemeProp("background")).toBeNull();
  });

  it("returns null when no property is specified", () => {
    expect(getSavedThemeProp()).toBeNull();
  });
});
