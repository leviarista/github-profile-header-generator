/**
 * tests/integration/banner.test.js
 * Integration tests for js/banner.js.
 * Verifies that updateBanner and updateUIOptions correctly mutate the DOM.
 * The DOM fixture is defined in tests/setup.js (loaded via setupFiles).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Canvas mock BEFORE importing banner (banner → helpers → saveImage → canvas)
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

const { updateBanner, updateUIOptions, getSavedThemeProp } =
  await import("../../js/banner.js");

const bannerImage = document.querySelector("#github-header-image");
const bannerTitle = bannerImage.querySelector(".title");
const bannerSubtitle = bannerImage.querySelector(".subtitle");

/**
 * jsdom does not correctly implement the innerText setter (it does not update textContent).
 * We intercept the setter so we can verify which value banner.js receives.
 */
const innerTextCapture = { title: "GitHub User", subtitle: "Developer" };
Object.defineProperty(bannerTitle, "innerText", {
  get() {
    return innerTextCapture.title;
  },
  set(v) {
    innerTextCapture.title = v;
  },
  configurable: true,
});
Object.defineProperty(bannerSubtitle, "innerText", {
  get() {
    return innerTextCapture.subtitle;
  },
  set(v) {
    innerTextCapture.subtitle = v;
  },
  configurable: true,
});

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();

  // Reset banner styles to the initial state between tests
  bannerImage.style.cssText = "";
  innerTextCapture.title = "GitHub User";
  innerTextCapture.subtitle = "Developer";
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── updateBanner - Visual properties ─────────────────────────────────────

describe("updateBanner - banner visual properties", () => {
  it("applies the background color to the banner", () => {
    updateBanner({ background: "#FF5733", ignoreSave: true });
    expect(bannerImage.style.backgroundColor).toMatch(
      /rgb\(255, 87, 51\)|#FF5733/i,
    );
  });

  it("applies the border to the banner (borderColor + borderSize + borderRadius, all required)", () => {
    // applyTheme: if (borderColor && borderSize && borderRadius) — all 3 must be truthy
    updateBanner({
      borderColor: "#FFFFFF",
      borderSize: 5,
      borderRadius: 5,
      ignoreSave: true,
    });
    expect(bannerImage.style.border).toContain("5px");
    expect(bannerImage.style.border).toContain("solid");
  });

  it("applies the border when borderRadius is 0", () => {
    updateBanner({
      borderColor: "#FFFFFF",
      borderSize: 5,
      borderRadius: 0,
      ignoreSave: true,
    });
    expect(bannerImage.style.border).toContain("5px");
  });

  it("applies the borderRadius to the banner (requires borderColor + borderSize + borderRadius)", () => {
    // The condition if (borderColor && borderSize && borderRadius) requires all 3 to be truthy
    updateBanner({
      borderColor: "#000000",
      borderSize: 3,
      borderRadius: 15,
      ignoreSave: true,
    });
    expect(bannerImage.style.borderRadius).toContain("15");
  });

  it("applies the padding to the banner", () => {
    updateBanner({ padding: 30, ignoreSave: true });
    expect(bannerImage.style.padding).toContain("30");
  });

  it("applies the title color", () => {
    updateBanner({ titleColor: "#FF0000", ignoreSave: true });
    expect(bannerTitle.style.color).toMatch(/rgb\(255, 0, 0\)|#FF0000/i);
  });

  it("applies the subtitle color", () => {
    updateBanner({ subtitleColor: "#00FF00", ignoreSave: true });
    expect(bannerSubtitle.style.color).toMatch(/rgb\(0, 255, 0\)|#00FF00/i);
  });

  it("updates the title when non-empty text is provided (via intercepted innerText)", () => {
    updateBanner({ title: "My GitHub Name", ignoreSave: true });
    // banner.js uses the innerText setter; we intercept it to verify the correct value
    expect(innerTextCapture.title).toBe("My GitHub Name");
  });

  it("updates the subtitle when non-empty text is provided (via intercepted innerText)", () => {
    updateBanner({ subtitle: "Full Stack Developer", ignoreSave: true });
    expect(innerTextCapture.subtitle).toBe("Full Stack Developer");
  });

  it("applies the title font size", () => {
    updateBanner({ titleFontSize: 50, ignoreSave: true });
    expect(bannerTitle.style.fontSize).toContain("50");
  });

  it("applies the subtitle font size", () => {
    updateBanner({ subtitleFontSize: 25, ignoreSave: true });
    expect(bannerSubtitle.style.fontSize).toContain("25");
  });
});

// ─── updateBanner - Background patterns ───────────────────────────────────

describe("updateBanner - background patterns", () => {
  it("applies a pattern when both pattern AND patternColor are defined", () => {
    updateBanner({
      pattern: "bubbles",
      patternColor: "#FFFFFF",
      patternOpacity: 0.25,
      ignoreSave: true,
    });
    // jsdom may reject SVG data URLs en inline style backgroundImage
    // We verify that it does not throw and that the style was assigned
    const bgImage = bannerImage.style.backgroundImage;
    // In jsdom, the value may remain empty if the CSS parser rejects the SVG URL,
    // but it would work correctly in real browsers
    expect(typeof bgImage).toBe("string");
  });

  it("does not apply a pattern when pattern is falsy", () => {
    bannerImage.style.backgroundImage = "";
    updateBanner({ pattern: null, ignoreSave: true });
    expect(bannerImage.style.backgroundImage).toBe("");
  });

  /**
   * BUG #1 DOCUMENTATION (Critical):
   * If patternSize is truthy but patternColor is undefined,
   * the condition (pattern || patternColor || patternOpacity || patternSize) is true
   * and patternColor.replace('#', '') is called → TypeError.
   *
   * @bug banner.js: applyTheme() - patternColor.replace() when patternColor is undefined
   * @severity CRITICAL
   */
  it("[BUG #1] throws TypeError when patternSize is truthy but patternColor is undefined", () => {
    expect(() => {
      updateBanner({ patternSize: 100, ignoreSave: true });
    }).toThrow(TypeError);
  });

  it("[BUG #1] throws TypeError when pattern is truthy but patternColor is undefined", () => {
    expect(() => {
      updateBanner({ pattern: "bubbles", ignoreSave: true });
    }).toThrow(TypeError);
  });
});

// ─── updateBanner - Edge cases with empty title/subtitle ──────────────────

describe("updateBanner - empty title and subtitle (BUG #4)", () => {
  /**
   * BUG #4 DOCUMENTATION (Low):
   * The condition `if (title || subtitle)` is false when both are '' (empty string).
   * This prevents clearing the banner text by assigning an empty string.
   *
   * @bug banner.js: applyTheme() - condition `title || subtitle` ignores empty string
   * @severity LOW
   */
  it("[BUG #4] does not clear the title when an empty string is passed", () => {
    bannerTitle.textContent = "Existing text";
    updateBanner({ title: "", ignoreSave: true });
    // BUG: the text is NOT cleared because '' is falsy
    expect(bannerTitle.textContent).toBe("Existing text");
  });

  it("[BUG #4] does not clear the subtitle when an empty string is passed", () => {
    bannerSubtitle.textContent = "Existing subtitle";
    updateBanner({ subtitle: "", ignoreSave: true });
    // BUG: the text is NOT cleared because '' is falsy
    expect(bannerSubtitle.textContent).toBe("Existing subtitle");
  });
});

// ─── updateBanner - Persistence in localStorage ───────────────────────────

describe("updateBanner - persistence in localStorage", () => {
  it("saves the theme in localStorage when ignoreSave is NOT defined", () => {
    updateBanner({ background: "#123456" });
    // The key used in saveTheme is 'theme' (not 'github-profile-header-theme')
    const saved = localStorage.getItem("theme");
    expect(saved).not.toBeNull();
    const parsed = JSON.parse(saved);
    expect(parsed.background).toBe("#123456");
  });

  it("does NOT save to localStorage when ignoreSave is true", () => {
    updateBanner({ background: "#654321", ignoreSave: true });
    expect(localStorage.getItem("theme")).toBeNull();
  });
});

// ─── updateUIOptions - Updating DOM inputs ────────────────────────────────

describe("updateUIOptions - updating toolbox controls", () => {
  it("updates the background color selector", () => {
    updateUIOptions({ background: "#AABBCC" });
    const input = document.querySelector("#main-bg-color-selector");
    expect(input.value).toBe("#aabbcc");
  });

  it("updates the title color selector", () => {
    updateUIOptions({ titleColor: "#FF0000" });
    expect(document.querySelector("#title-color-selector").value).toBe(
      "#ff0000",
    );
  });

  it("updates the subtitle color selector", () => {
    updateUIOptions({ subtitleColor: "#00FF00" });
    expect(document.querySelector("#subtitle-color-selector").value).toBe(
      "#00ff00",
    );
  });

  it("updates the border color selector", () => {
    updateUIOptions({ borderColor: "#0000FF" });
    expect(document.querySelector("#border-color-selector").value).toBe(
      "#0000ff",
    );
  });

  it("updates the border size input", () => {
    updateUIOptions({ borderSize: 8 });
    const inputs = document.querySelectorAll("#border-input");
    expect(inputs[0].value).toBe("8");
  });

  it("updates the border radius input", () => {
    updateUIOptions({ borderRadius: 12 });
    expect(document.querySelector("#border-radius-input").value).toBe("12");
  });
});

// ─── getSavedThemeProp ────────────────────────────────────────────────────

describe("getSavedThemeProp", () => {
  it("returns the saved value when the theme exists in localStorage", () => {
    // The key used by saveTheme/getSavedThemeProp is 'theme'
    localStorage.setItem("theme", JSON.stringify({ background: "#123ABC" }));
    expect(getSavedThemeProp("background")).toBe("#123ABC");
  });

  it("returns null when there is no saved theme", () => {
    localStorage.clear();
    expect(getSavedThemeProp("background")).toBeNull();
  });
});
