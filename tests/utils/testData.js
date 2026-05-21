import { faker } from "@faker-js/faker";

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

const TEXT_ALIGNS = ["flex-start", "center", "flex-end"];

const FONTS = [
  "Red Hat Display",
  "Kalam",
  "Montserrat",
  "Roboto",
  "Open Sans",
  "Lato",
  "Nunito",
  "Poppins",
];

const DECORATIONS = [
  "my-octocat.png",
  "dino-border.png",
  "github-mark.png",
  "code.png",
  "dev-badge.png",
  "none",
];

/**
 * Genera un color hex válido con #.
 */
export function generateHexColor() {
  return faker.color.rgb({ format: "hex", casing: "upper" });
}

/**
 * Genera un color hex sin # (para usar en getPattern).
 */
export function generateHexColorNoHash() {
  return generateHexColor().replace("#", "");
}

/**
 * Genera una opacidad entre 0 y 1 con 2 decimales.
 */
export function generateOpacity() {
  return faker.number.float({ min: 0, max: 1, fractionDigits: 2 });
}

/**
 * Genera un nombre de patrón aleatorio del listado conocido.
 */
export function generatePatternName() {
  return faker.helpers.arrayElement(KNOWN_PATTERNS);
}

/**
 * Genera un nombre de patrón desconocido (para pruebas de caso límite).
 */
export function generateUnknownPatternName() {
  return `unknown-pattern-${faker.string.alphanumeric(8)}`;
}

/**
 * Genera un preset de prueba completo con datos de Faker.
 * @param {object} overrides - Campos que sobreescriben los valores generados.
 */
export function generatePreset(overrides = {}) {
  return {
    background: generateHexColor(),
    padding: faker.number.int({ min: 0, max: 50 }),
    titleColor: generateHexColor(),
    subtitleColor: generateHexColor(),
    borderColor: generateHexColor(),
    borderSize: faker.number.int({ min: 0, max: 20 }),
    borderRadius: faker.number.int({ min: 0, max: 20 }),
    textAlign: faker.helpers.arrayElement(TEXT_ALIGNS),
    decoration: faker.helpers.arrayElement(DECORATIONS),
    decorationSize: faker.number.int({ min: 30, max: 150 }),
    pattern: generatePatternName(),
    patternColor: generateHexColor(),
    patternSize: faker.number.int({ min: 50, max: 400 }),
    patternOpacity: generateOpacity(),
    titleFontSize: faker.number.int({ min: 20, max: 80 }),
    subtitleFontSize: faker.number.int({ min: 12, max: 40 }),
    titleFont: faker.helpers.arrayElement(FONTS),
    subtitleFont: faker.helpers.arrayElement(FONTS),
    previewImage: `${faker.word.noun()}-preview.png`,
    title: faker.person.fullName(),
    subtitle: faker.person.jobTitle(),
    ...overrides,
  };
}

/**
 * Genera un array de presets de prueba.
 * @param {number} count - Cantidad de presets a generar.
 */
export function generatePresets(count = 5) {
  return Array.from({ length: count }, () => generatePreset());
}

/**
 * Genera parámetros de prueba para getPattern.
 */
export function generatePatternTestCase() {
  return {
    pattern: generatePatternName(),
    color: generateHexColorNoHash(),
    opacity: generateOpacity(),
  };
}

/**
 * Genera múltiples casos de prueba para getPattern.
 * @param {number} count - Cantidad de casos a generar.
 */
export function generatePatternTestCases(count = 10) {
  return Array.from({ length: count }, generatePatternTestCase);
}

/**
 * Genera un tema parcial (solo algunos campos) para pruebas de actualización incremental.
 */
export function generatePartialTheme() {
  const fields = [
    { background: generateHexColor() },
    { titleColor: generateHexColor(), subtitleColor: generateHexColor() },
    {
      borderColor: generateHexColor(),
      borderSize: faker.number.int({ min: 0, max: 10 }),
      borderRadius: faker.number.int({ min: 0, max: 20 }),
    },
    { padding: faker.number.int({ min: 10, max: 50 }) },
    { title: faker.person.firstName(), subtitle: faker.person.jobTitle() },
  ];
  return faker.helpers.arrayElement(fields);
}
