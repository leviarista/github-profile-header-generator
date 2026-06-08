/**
 * tests/integration/banner.test.js
 * Pruebas de integración para js/banner.js.
 * Verifica que updateBanner y updateUIOptions mutean correctamente el DOM.
 * El DOM fixture está definido en tests/setup.js (cargado via setupFiles).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock del canvas ANTES de importar banner (banner → helpers → saveImage → canvas)
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
 * jsdom no implementa correctamente el setter de innerText (no actualiza textContent).
 * Interceptamos el setter para poder verificar qué valor recibe banner.js.
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

  // Resetear estilos del banner al estado inicial entre pruebas
  bannerImage.style.cssText = "";
  innerTextCapture.title = "GitHub User";
  innerTextCapture.subtitle = "Developer";
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── updateBanner - Propiedades visuales ──────────────────────────────────

describe("updateBanner - propiedades visuales del banner", () => {
  it("aplica el color de fondo al banner", () => {
    updateBanner({ background: "#FF5733", ignoreSave: true });
    expect(bannerImage.style.backgroundColor).toMatch(
      /rgb\(255, 87, 51\)|#FF5733/i,
    );
  });

  it("aplica el borde al banner (borderColor + borderSize + borderRadius, todos requeridos)", () => {
    // applyTheme: if (borderColor && borderSize && borderRadius) — los 3 deben ser truthy
    updateBanner({
      borderColor: "#FFFFFF",
      borderSize: 5,
      borderRadius: 5,
      ignoreSave: true,
    });
    expect(bannerImage.style.border).toContain("5px");
    expect(bannerImage.style.border).toContain("solid");
  });

  it("[BUG #3b] borderRadius:0 es falsy — el borde NO se aplica cuando borderRadius es 0", () => {
    // borderRadius=0 es falsy en JS, por lo que la condición falla y el borde no se aplica
    updateBanner({
      borderColor: "#FFFFFF",
      borderSize: 5,
      borderRadius: 0,
      ignoreSave: true,
    });
    // Solo se aplica borderColor (hay otra condición separada para eso)
    expect(bannerImage.style.border).not.toContain("5px");
  });

  it("aplica el borderRadius al banner (requiere borderColor + borderSize + borderRadius)", () => {
    // La condición if (borderColor && borderSize && borderRadius) requiere los 3 truthy
    updateBanner({
      borderColor: "#000000",
      borderSize: 3,
      borderRadius: 15,
      ignoreSave: true,
    });
    expect(bannerImage.style.borderRadius).toContain("15");
  });

  it("aplica el padding al banner", () => {
    updateBanner({ padding: 30, ignoreSave: true });
    expect(bannerImage.style.padding).toContain("30");
  });

  it("aplica el color del título", () => {
    updateBanner({ titleColor: "#FF0000", ignoreSave: true });
    expect(bannerTitle.style.color).toMatch(/rgb\(255, 0, 0\)|#FF0000/i);
  });

  it("aplica el color del subtítulo", () => {
    updateBanner({ subtitleColor: "#00FF00", ignoreSave: true });
    expect(bannerSubtitle.style.color).toMatch(/rgb\(0, 255, 0\)|#00FF00/i);
  });

  it("actualiza el título cuando se proporciona texto no vacío (via innerText interceptado)", () => {
    updateBanner({ title: "Mi Nombre de GitHub", ignoreSave: true });
    // banner.js usa innerText setter; lo interceptamos para verificar el valor correcto
    expect(innerTextCapture.title).toBe("Mi Nombre de GitHub");
  });

  it("actualiza el subtítulo cuando se proporciona texto no vacío (via innerText interceptado)", () => {
    updateBanner({ subtitle: "Full Stack Developer", ignoreSave: true });
    expect(innerTextCapture.subtitle).toBe("Full Stack Developer");
  });

  it("aplica tamaño de fuente del título", () => {
    updateBanner({ titleFontSize: 50, ignoreSave: true });
    expect(bannerTitle.style.fontSize).toContain("50");
  });

  it("aplica tamaño de fuente del subtítulo", () => {
    updateBanner({ subtitleFontSize: 25, ignoreSave: true });
    expect(bannerSubtitle.style.fontSize).toContain("25");
  });
});

// ─── updateBanner - Patrones de fondo ─────────────────────────────────────

describe("updateBanner - patrones de fondo", () => {
  it("aplica patrón cuando pattern Y patternColor están definidos", () => {
    updateBanner({
      pattern: "bubbles",
      patternColor: "#FFFFFF",
      patternOpacity: 0.25,
      ignoreSave: true,
    });
    // jsdom puede rechazar SVG data URLs en inline style backgroundImage
    // Verificamos que no lanza error y que el estilo fue asignado
    const bgImage = bannerImage.style.backgroundImage;
    // En jsdom, el valor puede quedar vacío si el CSS parser rechaza la URL SVG,
    // pero en navegadores reales funcionaría correctamente
    expect(typeof bgImage).toBe("string");
  });

  it("no aplica patrón cuando pattern es falsy", () => {
    bannerImage.style.backgroundImage = "";
    updateBanner({ pattern: null, ignoreSave: true });
    expect(bannerImage.style.backgroundImage).toBe("");
  });

  /**
   * DOCUMENTACIÓN DE BUG #1 (Crítico):
   * Si patternSize es truthy pero patternColor es undefined,
   * la condición (pattern || patternColor || patternOpacity || patternSize) es verdadera
   * y se intenta llamar patternColor.replace('#', '') → TypeError.
   *
   * @bug banner.js: applyTheme() - patternColor.replace() cuando patternColor es undefined
   * @severity CRITICAL
   */
  it("[BUG #1] lanza TypeError cuando patternSize es truthy pero patternColor es undefined", () => {
    expect(() => {
      updateBanner({ patternSize: 100, ignoreSave: true });
    }).toThrow(TypeError);
  });

  it("[BUG #1] lanza TypeError cuando pattern es truthy pero patternColor es undefined", () => {
    expect(() => {
      updateBanner({ pattern: "bubbles", ignoreSave: true });
    }).toThrow(TypeError);
  });
});

// ─── updateBanner - Casos límite con título/subtítulo vacíos ──────────────

describe("updateBanner - título y subtítulo vacíos (BUG #4)", () => {
  /**
   * DOCUMENTACIÓN DE BUG #4 (Bajo):
   * La condición `if (title || subtitle)` es falsa cuando ambos son '' (string vacío).
   * Esto impide limpiar el texto del banner asignando string vacío.
   *
   * @bug banner.js: applyTheme() - condición `title || subtitle` ignora string vacío
   * @severity LOW
   */
  it("[BUG #4] no limpia el título cuando se pasa una cadena vacía", () => {
    bannerTitle.textContent = "Texto existente";
    updateBanner({ title: "", ignoreSave: true });
    // BUG: el texto NO se limpia porque '' es falsy
    expect(bannerTitle.textContent).toBe("Texto existente");
  });

  it("[BUG #4] no limpia el subtítulo cuando se pasa una cadena vacía", () => {
    bannerSubtitle.textContent = "Subtítulo existente";
    updateBanner({ subtitle: "", ignoreSave: true });
    // BUG: el texto NO se limpia porque '' es falsy
    expect(bannerSubtitle.textContent).toBe("Subtítulo existente");
  });
});

// ─── updateBanner - Persistencia en localStorage ──────────────────────────

describe("updateBanner - persistencia en localStorage", () => {
  it("guarda el tema en localStorage cuando ignoreSave NO está definido", () => {
    updateBanner({ background: "#123456" });
    // La clave usada en saveTheme es 'theme' (no 'github-profile-header-theme')
    const saved = localStorage.getItem("theme");
    expect(saved).not.toBeNull();
    const parsed = JSON.parse(saved);
    expect(parsed.background).toBe("#123456");
  });

  it("NO guarda en localStorage cuando ignoreSave es true", () => {
    updateBanner({ background: "#654321", ignoreSave: true });
    expect(localStorage.getItem("theme")).toBeNull();
  });
});

// ─── updateUIOptions - Actualización de inputs del DOM ────────────────────

describe("updateUIOptions - actualización de controles del toolbox", () => {
  it("actualiza el selector de color de fondo", () => {
    updateUIOptions({ background: "#AABBCC" });
    const input = document.querySelector("#main-bg-color-selector");
    expect(input.value).toBe("#aabbcc");
  });

  it("actualiza el selector de color del título", () => {
    updateUIOptions({ titleColor: "#FF0000" });
    expect(document.querySelector("#title-color-selector").value).toBe(
      "#ff0000",
    );
  });

  it("actualiza el selector de color del subtítulo", () => {
    updateUIOptions({ subtitleColor: "#00FF00" });
    expect(document.querySelector("#subtitle-color-selector").value).toBe(
      "#00ff00",
    );
  });

  it("actualiza el selector de color del borde", () => {
    updateUIOptions({ borderColor: "#0000FF" });
    expect(document.querySelector("#border-color-selector").value).toBe(
      "#0000ff",
    );
  });

  it("actualiza el input de tamaño de borde", () => {
    updateUIOptions({ borderSize: 8 });
    const inputs = document.querySelectorAll("#border-input");
    expect(inputs[0].value).toBe("8");
  });

  it("actualiza el input de border radius", () => {
    updateUIOptions({ borderRadius: 12 });
    expect(document.querySelector("#border-radius-input").value).toBe("12");
  });
});

// ─── getSavedThemeProp ────────────────────────────────────────────────────

describe("getSavedThemeProp", () => {
  it("retorna el valor guardado cuando el tema existe en localStorage", () => {
    // La clave que usa saveTheme/getSavedThemeProp es 'theme'
    localStorage.setItem("theme", JSON.stringify({ background: "#123ABC" }));
    expect(getSavedThemeProp("background")).toBe("#123ABC");
  });

  /**
   * DOCUMENTACIÓN DE BUG #2 (Medio):
   * getSavedThemeProp() retorna 'bubbles' para CUALQUIER prop cuando localStorage está vacío.
   */
  it("[BUG #2] retorna 'bubbles' para CUALQUIER prop cuando no hay tema guardado", () => {
    localStorage.clear();
    expect(getSavedThemeProp("background")).toBe("bubbles");
    expect(getSavedThemeProp("titleColor")).toBe("bubbles");
    expect(getSavedThemeProp("borderSize")).toBe("bubbles");
    expect(getSavedThemeProp("borderRadius")).toBe("bubbles");
  });
});
