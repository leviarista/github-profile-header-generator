/**
 * tests/integration/localStorage.test.js
 * Pruebas de integración para la lógica de localStorage:
 * guardado y recuperación de temas, fallbacks, consistencia.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock del canvas antes de importar banner
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

// La clave real usada en saveTheme y getSavedThemeProp es 'theme'
const STORAGE_KEY = "theme";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── Guardado de tema ──────────────────────────────────────────────────────

describe("Guardado de tema en localStorage", () => {
  it("guarda el tema como JSON serializable", () => {
    updateBanner({ background: "#FF0000" });
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(() => JSON.parse(raw)).not.toThrow();
  });

  it("el tema guardado contiene las propiedades enviadas a updateBanner", () => {
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

  it("sobrescribe el tema anterior con el nuevo", () => {
    updateBanner({ background: "#AAAAAA" });
    updateBanner({ background: "#BBBBBB" });
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved.background).toBe("#BBBBBB");
  });

  it('no guarda propiedades internas como "ignoreSave"', () => {
    updateBanner({ background: "#CCCCCC", ignoreSave: true });
    // Con ignoreSave: true no se guarda nada
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("no guarda nada cuando se pasa ignoreSave: true", () => {
    updateBanner({ background: "#DDDDDD", ignoreSave: true });
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

// ─── Recuperación de propiedades ──────────────────────────────────────────

describe("getSavedThemeProp - recuperación de propiedades", () => {
  it("retorna el valor de background guardado en localStorage", () => {
    localStorage.setItem("theme", JSON.stringify({ background: "#123456" }));
    expect(getSavedThemeProp("background")).toBe("#123456");
  });

  it("retorna el valor de titleColor guardado en localStorage", () => {
    localStorage.setItem("theme", JSON.stringify({ titleColor: "#FF0000" }));
    expect(getSavedThemeProp("titleColor")).toBe("#FF0000");
  });

  it("retorna el valor de pattern guardado en localStorage", () => {
    localStorage.setItem("theme", JSON.stringify({ pattern: "bubbles" }));
    expect(getSavedThemeProp("pattern")).toBe("bubbles");
  });

  it("retorna undefined para una propiedad que no existe en el tema guardado", () => {
    localStorage.setItem("theme", JSON.stringify({ background: "#000000" }));
    expect(getSavedThemeProp("propInexistente")).toBeUndefined();
  });

  it("guarda un tema y lo recupera correctamente (ciclo completo)", () => {
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

// ─── Fallback cuando no hay tema guardado (BUG #2) ─────────────────────────

describe("getSavedThemeProp - comportamiento sin tema guardado", () => {
  /**
   * DOCUMENTACIÓN DE BUG #2 (Medio):
   * getSavedThemeProp() retorna el string 'bubbles' para CUALQUIER propiedad
   * cuando no hay tema guardado en localStorage.
   * Comportamiento esperado correcto: retornar undefined (o el valor por defecto
   * específico de cada prop, no 'bubbles' para todas).
   *
   * @bug banner.js: getSavedThemeProp() - `if(!theme) return 'bubbles';`
   * @severity MEDIUM
   * @impact Los módulos que llaman getSavedThemeProp('borderSize') reciben 'bubbles'
   *         (string) en lugar de un número, lo que puede romper lógica posterior.
   */
  it("[BUG #2] retorna 'bubbles' en vez de undefined para 'background' cuando no hay tema", () => {
    expect(getSavedThemeProp("background")).toBe("bubbles");
    // Comportamiento esperado (correcto) sería: undefined o un default sensato
  });

  it("[BUG #2] retorna 'bubbles' en vez de undefined para 'borderSize' cuando no hay tema", () => {
    expect(getSavedThemeProp("borderSize")).toBe("bubbles");
  });

  it("[BUG #2] retorna 'bubbles' en vez de undefined para 'titleColor' cuando no hay tema", () => {
    expect(getSavedThemeProp("titleColor")).toBe("bubbles");
  });

  it("[BUG #2] retorna 'bubbles' para cualquier propiedad cuando no hay tema guardado", () => {
    const props = [
      "background",
      "titleColor",
      "subtitleColor",
      "borderColor",
      "borderSize",
      "borderRadius",
      "pattern",
      "patternColor",
      "patternSize",
      "patternOpacity",
      "titleFont",
      "subtitleFont",
      "decoration",
      "textAlign",
      "padding",
    ];
    props.forEach((prop) => {
      expect(
        getSavedThemeProp(prop),
        `prop="${prop}" debe retornar 'bubbles' (BUG)`,
      ).toBe("bubbles");
    });
  });
});

// ─── Resistencia a datos malformados en localStorage ─────────────────────

describe("getSavedThemeProp - datos malformados en localStorage", () => {
  /**
   * DOCUMENTACIÓN DE BUG #6 (Bajo):
   * getSavedThemeProp() usa JSON.parse sin try/catch.
   * Si localStorage contiene JSON inválido (por corrupción u otro origen),
   * lanza SyntaxError en lugar de retornar un valor de fallback seguro.
   *
   * @bug banner.js: getSavedThemeProp() — JSON.parse sin try/catch
   * @severity LOW
   */
  it("[BUG #6] lanza SyntaxError cuando localStorage contiene JSON inválido", () => {
    localStorage.setItem(STORAGE_KEY, "esto-no-es-json");
    // Bug: no tiene try/catch — lanza en vez de retornar fallback
    expect(() => getSavedThemeProp("background")).toThrow(SyntaxError);
  });

  it("[BUG #6] lanza SyntaxError cuando el item de localStorage está vacío", () => {
    localStorage.setItem(STORAGE_KEY, "");
    // Bug: JSON.parse('') lanza SyntaxError
    expect(() => getSavedThemeProp("background")).toThrow(SyntaxError);
  });
});
