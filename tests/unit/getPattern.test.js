/**
 * tests/unit/getPattern.test.js
 * Pruebas unitarias para la función getPattern (js/data/patterns.js).
 * No requiere DOM — función pura que genera strings CSS.
 */
import { describe, it, expect } from "vitest";
import { getPattern, getPatternDefaultSize } from "../../js/data/patterns.js";
import { PatternResultSchema } from "../utils/oracle.js";
import {
  generatePatternTestCases,
  generateHexColorNoHash,
  generateOpacity,
  generateUnknownPatternName,
} from "../utils/testData.js";

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
];

// ─── Formato de retorno ────────────────────────────────────────────────────

describe("getPattern - formato de retorno", () => {
  it.each(KNOWN_PATTERNS)(
    'patrón "%s" retorna una cadena que empieza con url(',
    (pattern) => {
      const result = getPattern(pattern, "FFFFFF", 0.25);
      expect(typeof result).toBe("string");
      expect(result).toMatch(/^url\(/);
    },
  );

  it.each(KNOWN_PATTERNS)(
    'patrón "%s" contiene SVG inline codificado',
    (pattern) => {
      const result = getPattern(pattern, "FFFFFF", 0.25);
      expect(result).toContain("data:image/svg+xml");
    },
  );

  it.each(KNOWN_PATTERNS)(
    'patrón "%s" cumple el esquema de oráculo PatternResultSchema',
    (pattern) => {
      const result = getPattern(pattern, "FFFFFF", 0.25);
      const validation = PatternResultSchema.safeParse(result);
      expect(validation.success).toBe(true);
    },
  );
});

// ─── Interpolación de parámetros ──────────────────────────────────────────

describe("getPattern - interpolación de parámetros", () => {
  it("incluye el color hex en el SVG generado", () => {
    const result = getPattern("bubbles", "ABC123", 0.5);
    expect(result).toContain("ABC123");
  });

  it("incluye la opacidad en el SVG generado", () => {
    const result = getPattern("bubbles", "FFFFFF", 0.75);
    expect(result).toContain("0.75");
  });

  it("usa la opacidad por defecto 0.25 si no se especifica", () => {
    const result = getPattern("bubbles", "FFFFFF");
    expect(result).toContain("0.25");
  });

  it("usa el color por defecto FFFFFF si no se especifica", () => {
    const result = getPattern("bubbles");
    expect(result).toContain("FFFFFF");
  });

  it("colores distintos producen SVGs distintos", () => {
    const a = getPattern("bubbles", "FF0000", 0.25);
    const b = getPattern("bubbles", "00FF00", 0.25);
    expect(a).not.toBe(b);
  });

  it("opacidades distintas producen SVGs distintos", () => {
    const a = getPattern("bubbles", "FFFFFF", 0.1);
    const b = getPattern("bubbles", "FFFFFF", 0.9);
    expect(a).not.toBe(b);
  });
});

// ─── Casos límite ─────────────────────────────────────────────────────────

describe("getPattern - casos límite", () => {
  it('retorna "none" para un patrón desconocido (caso default del switch)', () => {
    const result = getPattern("patron-que-no-existe", "FFFFFF", 0.5);
    expect(result).toBe("none");
  });

  it("maneja opacidad 0 sin errores", () => {
    expect(() => getPattern("bubbles", "FFFFFF", 0)).not.toThrow();
    const result = getPattern("bubbles", "FFFFFF", 0);
    expect(result).toContain("svg");
  });

  it("maneja opacidad 1 sin errores", () => {
    expect(() => getPattern("bubbles", "FFFFFF", 1)).not.toThrow();
  });

  it("llamadas con los mismos parámetros producen el mismo resultado (determinismo)", () => {
    const r1 = getPattern("jigsaw", "AABBCC", 0.3);
    const r2 = getPattern("jigsaw", "AABBCC", 0.3);
    expect(r1).toBe(r2);
  });
});

// ─── Pruebas con datos generados por Faker ────────────────────────────────

describe("getPattern - generación de datos con Faker", () => {
  it("todos los casos generados aleatoriamente cumplen el esquema de oráculo", () => {
    const cases = generatePatternTestCases(20);
    cases.forEach(({ pattern, color, opacity }) => {
      const result = getPattern(pattern, color, opacity);
      const validation = PatternResultSchema.safeParse(result);
      expect(
        validation.success,
        `Fallo para patrón="${pattern}" color="${color}" opacidad=${opacity}: ${JSON.stringify(validation.error?.issues)}`,
      ).toBe(true);
    });
  });

  it('patrones desconocidos generados aleatoriamente siempre retornan "none"', () => {
    const unknownPatterns = Array.from(
      { length: 10 },
      generateUnknownPatternName,
    );
    unknownPatterns.forEach((pattern) => {
      const result = getPattern(
        pattern,
        generateHexColorNoHash(),
        generateOpacity(),
      );
      expect(result).toBe("none");
    });
  });
});

// ─── getPatternDefaultSize ────────────────────────────────────────────────

describe("getPatternDefaultSize", () => {
  it("retorna un número positivo para patrones conocidos", () => {
    KNOWN_PATTERNS.forEach((pattern) => {
      const size = getPatternDefaultSize(pattern);
      if (size !== undefined) {
        expect(typeof size).toBe("number");
        expect(size).toBeGreaterThan(0);
      }
    });
  });

  it("bubbles tiene tamaño por defecto 200", () => {
    expect(getPatternDefaultSize("bubbles")).toBe(200);
  });

  it("jigsaw tiene tamaño por defecto 100", () => {
    expect(getPatternDefaultSize("jigsaw")).toBe(100);
  });

  it("retorna undefined o un valor para patrones desconocidos", () => {
    const result = getPatternDefaultSize("patron-inexistente");
    // No debe lanzar error; puede retornar undefined
    expect(result === undefined || typeof result === "number").toBe(true);
  });
});

// ─── Snapshots de oráculos ────────────────────────────────────────────────

describe("getPattern - snapshots de oráculos visuales", () => {
  it("topography con FFFFFF/0.25 mantiene estructura estable (snapshot)", () => {
    const result = getPattern("topography", "FFFFFF", 0.25);
    expect(result).toMatchSnapshot();
  });

  it("bubbles con FFFFFF/0.25 mantiene estructura estable (snapshot)", () => {
    const result = getPattern("bubbles", "FFFFFF", 0.25);
    expect(result).toMatchSnapshot();
  });

  it("jigsaw con FFFFFF/0.25 mantiene estructura estable (snapshot)", () => {
    const result = getPattern("jigsaw", "FFFFFF", 0.25);
    expect(result).toMatchSnapshot();
  });
});
