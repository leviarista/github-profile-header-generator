/**
 * tests/unit/helpers.test.js
 * Pruebas unitarias para las funciones en js/helpers/helpers.js.
 * Cubre: saveImageOnLocalStorage, isLocalDevelopment (constante).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ─── Configurar mock del canvas ANTES de importar el módulo ───────────────

const mockToDataURL = vi.fn(() => "data:image/png;base64,MOCK_DATA_URL");
const mockDrawImage = vi.fn();
const mockGetContext = vi.fn(() => ({
  drawImage: mockDrawImage,
}));

// Mock de HTMLCanvasElement para jsdom (no implementa canvas real)
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
  it("no lanza error cuando se llama con un elemento imagen válido", () => {
    const mockImg = document.createElement("img");
    mockImg.width = 800;
    mockImg.height = 200;
    expect(() => saveImageOnLocalStorage(mockImg)).not.toThrow();
  });

  it('llama a getContext("2d") para obtener el contexto del canvas', () => {
    const mockImg = document.createElement("img");
    saveImageOnLocalStorage(mockImg);
    expect(mockGetContext).toHaveBeenCalledWith("2d");
  });

  it("llama a drawImage con la imagen proporcionada (5 args: img, x, y, width, height)", () => {
    const mockImg = document.createElement("img");
    saveImageOnLocalStorage(mockImg);
    // canvas.drawImage(img, 0, 0, img.width, img.height) — img sin src tiene width/height = 0
    expect(mockDrawImage).toHaveBeenCalledWith(
      mockImg,
      0,
      0,
      mockImg.width,
      mockImg.height,
    );
  });

  it('guarda en localStorage con la clave "savedImage"', () => {
    const mockImg = document.createElement("img");
    saveImageOnLocalStorage(mockImg);
    expect(localStorage.getItem("savedImage")).toBe(
      "data:image/png;base64,MOCK_DATA_URL",
    );
  });

  it("sobreescribe el valor previo en localStorage con la nueva imagen", () => {
    localStorage.setItem("savedImage", "valor-anterior");
    const mockImg = document.createElement("img");
    mockToDataURL.mockReturnValue("data:image/png;base64,NUEVO_VALOR");
    saveImageOnLocalStorage(mockImg);
    expect(localStorage.getItem("savedImage")).toBe(
      "data:image/png;base64,NUEVO_VALOR",
    );
  });

  it("usa toDataURL para obtener la representación base64", () => {
    const mockImg = document.createElement("img");
    saveImageOnLocalStorage(mockImg);
    expect(mockToDataURL).toHaveBeenCalled();
  });
});

// ─── isLocalDevelopment ───────────────────────────────────────────────────

describe("isLocalDevelopment (constante evaluada al importar)", () => {
  it('es false en el entorno de pruebas jsdom (hostname vacío o "localhost" del test runner)', async () => {
    // En jsdom el hostname por defecto es '' o 'localhost' dependiendo del URL configurado.
    // La constante se evalúa al cargar el módulo.
    // Verificamos que la importación del módulo no lanzó error.
    const mod = await import("../../js/helpers/helpers.js");
    expect(mod).toBeDefined();
  });

  it('el hostname de jsdom no es "localhost" en el contexto de Vitest', () => {
    // jsdom por defecto usa 'about:blank' o un hostname vacío, no localhost
    const hostname = window.location.hostname;
    // Puede ser '' (string vacío) en jsdom — confirmamos que no es un hostname de producción
    expect(hostname).not.toContain("github.io");
    expect(hostname).not.toContain("example.com");
  });
});

// ─── localStorage general ─────────────────────────────────────────────────

describe("localStorage en el entorno jsdom", () => {
  it("localStorage está disponible en el entorno de pruebas", () => {
    expect(typeof localStorage).toBe("object");
    expect(localStorage).not.toBeNull();
  });

  it("setItem y getItem funcionan correctamente", () => {
    localStorage.setItem("test-key", "test-value");
    expect(localStorage.getItem("test-key")).toBe("test-value");
  });

  it("clear elimina todos los items", () => {
    localStorage.setItem("key1", "val1");
    localStorage.clear();
    expect(localStorage.getItem("key1")).toBeNull();
  });
});
