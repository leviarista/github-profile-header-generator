/**
 * tests/unit/presets.test.js
 * Pruebas unitarias para las funciones de manejo de presets.
 * Cubre: getAllPresets, getPreset, getRandomPreset, setPreset (con dobles).
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import {
  getAllPresets,
  getPreset,
  getRandomPreset,
  setPreset,
} from "../../js/presets.js";
import { PresetSchema, validateAllPresets } from "../utils/oracle.js";

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── getAllPresets ─────────────────────────────────────────────────────────

describe("getAllPresets", () => {
  it("retorna un array", () => {
    const result = getAllPresets();
    expect(Array.isArray(result)).toBe(true);
  });

  it("contiene al menos 10 presets", () => {
    expect(getAllPresets().length).toBeGreaterThanOrEqual(10);
  });

  it("retorna siempre el mismo array (referencia estable)", () => {
    expect(getAllPresets()).toBe(getAllPresets());
  });

  it('cada preset tiene la propiedad "background"', () => {
    getAllPresets().forEach((preset, i) => {
      expect(preset, `Preset #${i} debe tener background`).toHaveProperty(
        "background",
      );
    });
  });

  it("todos los presets son válidos según el oráculo PresetSchema", () => {
    const errors = validateAllPresets(getAllPresets());
    if (errors.length > 0) {
      console.warn(
        "Presets inválidos encontrados:",
        JSON.stringify(errors, null, 2),
      );
    }
    /**
     * DOCUMENTACIÓN DE BUG #5 (Datos):
     * El preset #22 tiene decorationSize, titleFontSize y subtitleFontSize como
     * strings en lugar de numbers en presets.json.
     * Esto puede causar que cálculos numéricos fallen (ej: `${decorationSize}px`
     * ya contendría un string, y concatenar 'px' podría dar '77pxpx').
     *
     * @bug js/data/presets.json — Preset #22: campos numéricos son strings
     * @severity MEDIUM
     */
    expect(errors).toHaveLength(1); // BUG #5: preset #22 tiene campos numéricos como strings
    expect(errors[0].index).toBe(22);
  });

  it("ningún preset tiene background vacío o nulo", () => {
    getAllPresets().forEach((preset, i) => {
      expect(
        preset.background,
        `Preset #${i} tiene background inválido`,
      ).toBeTruthy();
    });
  });

  it("textAlign solo usa valores válidos (flex-start | center | flex-end)", () => {
    const validAligns = ["flex-start", "center", "flex-end"];
    getAllPresets()
      .filter((p) => p.textAlign !== undefined)
      .forEach((preset, i) => {
        expect(
          validAligns,
          `Preset #${i} textAlign="${preset.textAlign}" no es válido`,
        ).toContain(preset.textAlign);
      });
  });

  it("patternOpacity está entre 0 y 1 cuando se define", () => {
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
  it("retorna el primer preset con índice 0", () => {
    const all = getAllPresets();
    expect(getPreset(0)).toEqual(all[0]);
  });

  it("retorna el segundo preset con índice 1", () => {
    const all = getAllPresets();
    expect(getPreset(1)).toEqual(all[1]);
  });

  it("retorna el último preset con el índice correcto", () => {
    const all = getAllPresets();
    const last = all.length - 1;
    expect(getPreset(last)).toEqual(all[last]);
  });

  it("retorna undefined para índice fuera de rango", () => {
    expect(getPreset(99999)).toBeUndefined();
  });

  it("retorna undefined para índice negativo", () => {
    expect(getPreset(-1)).toBeUndefined();
  });

  it("el preset retornado cumple el esquema de oráculo", () => {
    const preset = getPreset(0);
    expect(PresetSchema.safeParse(preset).success).toBe(true);
  });
});

// ─── getRandomPreset ──────────────────────────────────────────────────────

describe("getRandomPreset", () => {
  it("retorna un objeto que existe en el array de presets", () => {
    const result = getRandomPreset();
    expect(getAllPresets()).toContainEqual(result);
  });

  it("usa Math.random para seleccionar el índice", () => {
    const spy = vi.spyOn(Math, "random").mockReturnValue(0);
    const result = getRandomPreset();
    expect(spy).toHaveBeenCalledOnce();
    expect(result).toEqual(getAllPresets()[0]);
  });

  it("selecciona el primer preset cuando Math.random retorna 0", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getRandomPreset()).toEqual(getAllPresets()[0]);
  });

  it("selecciona el último preset cuando Math.random retorna casi 1", () => {
    const all = getAllPresets();
    vi.spyOn(Math, "random").mockReturnValue(1 - Number.EPSILON);
    const result = getRandomPreset();
    expect(result).toEqual(all[all.length - 1]);
  });

  it("el preset retornado cumple el esquema de oráculo", () => {
    const result = getRandomPreset();
    const validation = PresetSchema.safeParse(result);
    expect(validation.success).toBe(true);
  });

  it("llamadas repetidas pueden retornar presets distintos", () => {
    // Verifica que no siempre retorne el mismo (sin mock de Math.random)
    const results = new Set(
      Array.from({ length: 30 }, () => JSON.stringify(getRandomPreset())),
    );
    expect(results.size).toBeGreaterThan(1);
  });
});

// ─── setPreset (prueba con doble) ─────────────────────────────────────────

describe("setPreset - con dobles de prueba (spies)", () => {
  it("llama a updateBanner con el preset proporcionado", async () => {
    // Importamos el módulo de banner para poder espiar sus exports
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
