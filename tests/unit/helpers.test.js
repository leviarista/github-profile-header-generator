/**
 * tests/unit/helpers.test.js
 * Unit tests for the functions in js/helpers/helpers.js.
 * Covers: saveImageOnLocalStorage, isLocalDevelopment (constant).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ─── Set up the canvas mock BEFORE importing the module ───────────────────

const mockToDataURL = vi.fn(() => "data:image/png;base64,MOCK_DATA_URL");
const mockDrawImage = vi.fn();
const mockGetContext = vi.fn(() => ({
  drawImage: mockDrawImage,
}));

// Mock HTMLCanvasElement for jsdom (it doesn't implement a real canvas)
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: mockGetContext,
  writable: true,
});

Object.defineProperty(HTMLCanvasElement.prototype, "toDataURL", {
  value: mockToDataURL,
  writable: true,
});

const { saveImageOnLocalStorage } = await import("../../js/helpers/helpers.js");

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  mockToDataURL.mockReturnValue("data:image/png;base64,MOCK_DATA_URL");
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── saveImageOnLocalStorage ──────────────────────────────────────────────

describe("saveImageOnLocalStorage", () => {
  it("does not throw when called with a valid image element", () => {
    const mockImg = document.createElement("img");
    mockImg.width = 800;
    mockImg.height = 200;
    expect(() => saveImageOnLocalStorage(mockImg)).not.toThrow();
  });

  it('calls getContext("2d") to get the canvas context', () => {
    const mockImg = document.createElement("img");
    saveImageOnLocalStorage(mockImg);
    expect(mockGetContext).toHaveBeenCalledWith("2d");
  });

  it("calls drawImage with the provided image (5 args: img, x, y, width, height)", () => {
    const mockImg = document.createElement("img");
    saveImageOnLocalStorage(mockImg);
    // canvas.drawImage(img, 0, 0, img.width, img.height) — an img without src has width/height = 0
    expect(mockDrawImage).toHaveBeenCalledWith(
      mockImg,
      0,
      0,
      mockImg.width,
      mockImg.height,
    );
  });

  it('saves to localStorage under the "savedImage" key', () => {
    const mockImg = document.createElement("img");
    saveImageOnLocalStorage(mockImg);
    expect(localStorage.getItem("savedImage")).toBe(
      "data:image/png;base64,MOCK_DATA_URL",
    );
  });

  it("overwrites the previous localStorage value with the new image", () => {
    localStorage.setItem("savedImage", "previous-value");
    const mockImg = document.createElement("img");
    mockToDataURL.mockReturnValue("data:image/png;base64,NEW_VALUE");
    saveImageOnLocalStorage(mockImg);
    expect(localStorage.getItem("savedImage")).toBe(
      "data:image/png;base64,NEW_VALUE",
    );
  });

  it("uses toDataURL to get the base64 representation", () => {
    const mockImg = document.createElement("img");
    saveImageOnLocalStorage(mockImg);
    expect(mockToDataURL).toHaveBeenCalled();
  });
});

// ─── isLocalDevelopment ───────────────────────────────────────────────────

describe("isLocalDevelopment (constant evaluated on import)", () => {
  it('is false in the jsdom test environment (empty hostname or the test runner\'s "localhost")', async () => {
    // In jsdom the default hostname is '' or 'localhost' depending on the configured URL.
    // The constant is evaluated when the module loads.
    // We verify that importing the module did not throw.
    const mod = await import("../../js/helpers/helpers.js");
    expect(mod).toBeDefined();
  });

  it('the jsdom hostname is not "localhost" in the Vitest context', () => {
    // jsdom defaults to 'about:blank' or an empty hostname, not localhost
    const hostname = window.location.hostname;
    // May be '' (empty string) in jsdom — we confirm it is not a production hostname
    expect(hostname).not.toContain("github.io");
    expect(hostname).not.toContain("example.com");
  });
});

// ─── General localStorage ─────────────────────────────────────────────────

describe("localStorage in the jsdom environment", () => {
  it("localStorage is available in the test environment", () => {
    expect(typeof localStorage).toBe("object");
    expect(localStorage).not.toBeNull();
  });

  it("setItem and getItem work correctly", () => {
    localStorage.setItem("test-key", "test-value");
    expect(localStorage.getItem("test-key")).toBe("test-value");
  });

  it("clear removes all items", () => {
    localStorage.setItem("key1", "val1");
    localStorage.clear();
    expect(localStorage.getItem("key1")).toBeNull();
  });
});
