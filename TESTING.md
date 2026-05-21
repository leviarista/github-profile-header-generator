# Testing — GitHub Profile Header Generator

Documentación completa del plan de pruebas, cobertura y bugs detectados para el
proyecto `github-profile-header-generator` v2.1.0.

---

## Tabla de contenidos

1. [Stack de pruebas](#1-stack-de-pruebas)
2. [Estructura de archivos](#2-estructura-de-archivos)
3. [Cómo ejecutar las pruebas](#3-cómo-ejecutar-las-pruebas)
4. [Resultados de cobertura](#4-resultados-de-cobertura)
5. [Bugs encontrados](#5-bugs-encontrados)
6. [Generación de datos de prueba y oráculos](#6-generación-de-datos-de-prueba-y-oráculos)
7. [Pruebas E2E (Playwright)](#7-pruebas-e2e-playwright)
8. [Análisis estático (ESLint)](#8-análisis-estático-eslint)
9. [Pruebas de mutación (Stryker)](#9-pruebas-de-mutación-stryker)
10. [Limitaciones conocidas del entorno](#10-limitaciones-conocidas-del-entorno)

---

## 1. Stack de pruebas

| Herramienta                                                                          | Versión | Propósito                               |
| ------------------------------------------------------------------------------------ | ------- | --------------------------------------- |
| [Vitest](https://vitest.dev/)                                                        | ^3.2    | Runner de tests unitarios e integración |
| [jsdom](https://github.com/jsdom/jsdom)                                              | ^26.1   | Simulación de DOM para Vitest           |
| [@vitest/coverage-v8](https://vitest.dev/guide/coverage)                             | ^3.2    | Cobertura de código (V8 provider)       |
| [@playwright/test](https://playwright.dev/)                                          | ^1.52   | Pruebas E2E en navegadores reales       |
| [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm)                    | ^4.10   | Accesibilidad automática (E2E)          |
| [@stryker-mutator/core](https://stryker-mutator.io/)                                 | ^8.7    | Pruebas de mutación                     |
| [ESLint](https://eslint.org/)                                                        | ^9.28   | Análisis estático                       |
| [eslint-plugin-security](https://github.com/eslint-community/eslint-plugin-security) | —       | Reglas de seguridad OWASP               |
| [@faker-js/faker](https://fakerjs.dev/)                                              | ^9.8    | Generación de datos de prueba           |
| [Zod](https://zod.dev/)                                                              | ^3.24   | Oráculos / validación de esquemas       |

---

## 2. Estructura de archivos

```
tests/
├── setup.js                        # Fixture DOM completo para Vitest+jsdom
├── utils/
│   ├── oracle.js                   # Oráculos Zod: PresetSchema, ThemeSchema, etc.
│   └── testData.js                 # Generadores Faker: colores, presets, patrones
├── unit/
│   ├── getPattern.test.js          # 70 tests — función getPattern() y variantes
│   └── presets.test.js             # 21 tests — carga y validación de presets.json
├── integration/
│   ├── banner.test.js              # 27 tests — updateBanner, applyTheme, updateUIOptions
│   └── localStorage.test.js       # 16 tests — saveTheme, getSavedThemeProp, ciclos
└── e2e/
    ├── banner-customization.spec.ts  # Flujos de personalización de banner
    ├── accessibility.spec.ts         # Accesibilidad con axe-core
    └── performance.spec.ts           # Métricas de rendimiento (CLS, LCP, FCP)

.github/prompts/
└── playwright-qa-engineer.prompt.md  # Skill de Copilot para pruebas E2E

vitest.config.js        # Configuración Vitest + cobertura
playwright.config.ts    # Configuración Playwright (4 browsers, URL de producción)
stryker.config.mjs      # Configuración Stryker (runner: vitest)
eslint.config.js        # Configuración ESLint con eslint-plugin-security
```

---

## 3. Cómo ejecutar las pruebas

```bash
# Instalar todas las dependencias (incluye devDependencies de prueba)
npm install

# ── Pruebas unitarias e integración ──────────────────────────────────────────
npm test                # Ejecutar una vez y ver resultados
npm run test:watch      # Modo observador (re-ejecuta al guardar)
npm run test:coverage   # Ejecutar con reporte de cobertura HTML + texto

# ── Pruebas E2E (requiere navegadores instalados) ────────────────────────────
npx playwright install  # Instalar browsers (solo la primera vez)
npm run test:e2e        # Ejecutar E2E en todos los browsers configurados
npm run test:e2e:ui     # Abrir interfaz visual de Playwright
npm run test:e2e:report # Abrir reporte HTML de última ejecución E2E

# ── Análisis estático ────────────────────────────────────────────────────────
npm run lint            # ESLint con reglas de seguridad

# ── Pruebas de mutación ──────────────────────────────────────────────────────
npm run test:mutation   # Stryker sobre js/presets.js y js/helpers/helpers.js
```

---

## 4. Resultados de cobertura

Cobertura sobre archivos con lógica de negocio testeable
(los módulos de UI pura —`main.js`, `toolbox-*.js`— se excluyen porque
requieren interacción real con el navegador y se cubren con E2E).

| Archivo                  | Sentencias | Ramas    | Funciones | Líneas   |
| ------------------------ | ---------- | -------- | --------- | -------- |
| `js/banner.js`           | 69%        | 70%      | **100%**  | 69%      |
| `js/presets.js`          | **100%**   | **100%** | **100%**  | **100%** |
| `js/helpers/helpers.js`  | **100%**   | 50%      | **100%**  | **100%** |
| `js/helpers/elements.js` | **100%**   | **100%** | **100%**  | **100%** |
| **Total**                | **74%**    | **72%**  | **100%**  | **74%**  |

**Umbrales configurados** (en `vitest.config.js`): líneas ≥ 70%, ramas ≥ 60%, funciones ≥ 80%.

Líneas no cubiertas en `banner.js`: ramas de `updateUIOptions` para `patternSize`,
`patternColor/patternOpacity` y `titleFont/subtitleFont` (líneas ~220–249).
Estas ramas requieren elementos del DOM de la toolbox que no están en el fixture de tests
unitarios/integración.

---

## 5. Bugs encontrados

Los tests de esta suite **documentan y detectan** los siguientes bugs en el
código fuente. Los tests que los documentan pasan intencionalmente verificando
el comportamiento incorrecto actual y están marcados con `[BUG #N]`.

---

### BUG #1 — `TypeError` al aplicar patrón sin `patternColor` (CRÍTICO)

| Campo            | Detalle                                 |
| ---------------- | --------------------------------------- |
| **Archivo**      | `js/banner.js` — función `applyTheme()` |
| **Línea aprox.** | 110                                     |
| **Severidad**    | 🔴 CRÍTICO                              |

**Descripción:**  
La condición `if (pattern || patternColor || patternOpacity || patternSize)` activa
el bloque cuando cualquiera de los cuatro es truthy. Dentro del bloque se llama
incondicionalmente a `patternColor.replace('#', '')`, lo que lanza un `TypeError`
si `patternColor` es `undefined` (p.ej., cuando solo se actualiza `patternSize`).

```js
// Reproducción del bug:
updateBanner({ patternSize: 20 });
// → TypeError: Cannot read properties of undefined (reading 'replace')
```

**Corrección sugerida:**

```js
bannerImage.style.backgroundImage = getPattern(
  pattern,
  patternColor ? patternColor.replace("#", "") : "",
  patternOpacity,
);
```

---

### BUG #2 — `getSavedThemeProp` devuelve `'bubbles'` para cualquier propiedad (MEDIO)

| Campo            | Detalle                                        |
| ---------------- | ---------------------------------------------- |
| **Archivo**      | `js/banner.js` — función `getSavedThemeProp()` |
| **Línea aprox.** | 258                                            |
| **Severidad**    | 🟡 MEDIO                                       |

**Descripción:**  
Cuando no existe un tema guardado en localStorage, la función retorna la cadena
hardcodeada `'bubbles'` para **cualquier** propiedad solicitada, incluyendo
`borderSize`, `titleColor`, `borderRadius`, etc.

```js
// Comportamiento actual (con localStorage vacío):
getSavedThemeProp("borderSize"); // → 'bubbles'  ❌
getSavedThemeProp("titleColor"); // → 'bubbles'  ❌
getSavedThemeProp("background"); // → 'bubbles'  ❌ (esperado: null o undefined)
```

**Corrección sugerida:**

```js
if (!theme) return null; // o retornar un mapa de defaults por propiedad
```

---

### BUG #3 — `updateUIOptions` no actualiza `textAlign`, `decoration` ni `pattern` (BAJO)

| Campo            | Detalle                                      |
| ---------------- | -------------------------------------------- |
| **Archivo**      | `js/banner.js` — función `updateUIOptions()` |
| **Línea aprox.** | 187–205                                      |
| **Severidad**    | 🟢 BAJO                                      |

**Descripción:**  
Los bloques `if (textAlign)`, `if (decoration)` y `if (pattern)` están vacíos
en `updateUIOptions`. Cuando se restaura un tema guardado, los controles del
toolbox para alineación de texto, decoración y patrón no se actualizan visualmente.

---

### BUG #3b — `borderRadius: 0` impide aplicar el borde (BAJO)

| Campo            | Detalle                                 |
| ---------------- | --------------------------------------- |
| **Archivo**      | `js/banner.js` — función `applyTheme()` |
| **Línea aprox.** | 96                                      |
| **Severidad**    | 🟢 BAJO                                 |

**Descripción:**  
La condición `if (borderColor && borderSize && borderRadius)` falla cuando
`borderRadius` es `0` (borde sin redondeo), porque `0` es falsy en JavaScript.
Resultado: un tema con `borderRadius: 0` (esquinas cuadradas) nunca aplica
el borde completo.

```js
applyTheme({ borderColor: "#000", borderSize: 2, borderRadius: 0 });
// → bannerImage.style.border === ''  ❌  (borde no aplicado)
```

**Corrección sugerida:**

```js
if (borderColor && borderSize && borderRadius !== undefined && borderRadius !== null) { ... }
```

---

### BUG #4 — Título/subtítulo vacío no puede limpiarse (BAJO)

| Campo            | Detalle                                 |
| ---------------- | --------------------------------------- |
| **Archivo**      | `js/banner.js` — función `applyTheme()` |
| **Línea aprox.** | 129                                     |
| **Severidad**    | 🟢 BAJO                                 |

**Descripción:**  
La condición `if (title || subtitle)` impide limpiar el título o subtítulo
enviando una cadena vacía (`''`), ya que `''` es falsy.

```js
updateBanner({ title: "" });
// → bannerTitle.innerText sin cambios  ❌
```

**Corrección sugerida:**

```js
if (title !== undefined || subtitle !== undefined) { ... }
```

---

### BUG #5 — Preset #22 tiene campos numéricos como strings (DATOS — MEDIO)

| Campo            | Detalle                            |
| ---------------- | ---------------------------------- |
| **Archivo**      | `js/data/presets.json` — índice 22 |
| **Línea aprox.** | ~230                               |
| **Severidad**    | 🟡 MEDIO                           |

**Descripción:**  
El preset en el índice 22 tiene los campos `decorationSize`, `titleFontSize` y
`subtitleFontSize` como strings en lugar de números. Esto puede causar errores
al usarlos en cálculos o interpolaciones:

```json
// Incorrecto (preset #22):
"decorationSize": "77",
"titleFontSize": "44",
"subtitleFontSize": "18"

// Correcto (resto de presets):
"decorationSize": 77,
"titleFontSize": 44,
"subtitleFontSize": 18
```

**Detectado por:** Oráculo `PresetSchema` (Zod) en `tests/unit/presets.test.js`.

---

### BUG #6 — `getSavedThemeProp` sin `try/catch` en `JSON.parse` (BAJO)

| Campo            | Detalle                                        |
| ---------------- | ---------------------------------------------- |
| **Archivo**      | `js/banner.js` — función `getSavedThemeProp()` |
| **Línea aprox.** | 257                                            |
| **Severidad**    | 🟢 BAJO                                        |

**Descripción:**  
`JSON.parse(localStorage.getItem('theme'))` se ejecuta sin bloque `try/catch`.
Si el contenido de localStorage está corrupto o fue modificado por un script
externo, la aplicación lanzará un `SyntaxError` no manejado.

**Corrección sugerida:**

```js
function getSavedThemeProp(prop) {
  if (!prop) return null;
  try {
    const theme = JSON.parse(localStorage.getItem("theme"));
    if (!theme) return null;
    return theme[prop];
  } catch {
    return null;
  }
}
```

---

## 6. Generación de datos de prueba y oráculos

### Generadores de datos (`tests/utils/testData.js`)

Utilizan **@faker-js/faker** para crear datos realistas y reproducibles:

| Función                      | Descripción                          |
| ---------------------------- | ------------------------------------ |
| `generateHexColor()`         | Color hexadecimal aleatorio          |
| `generatePatternName()`      | Nombre de patrón válido del catálogo |
| `generatePreset()`           | Preset completo con todos los campos |
| `generatePresets(n)`         | Lista de `n` presets aleatorios      |
| `generatePatternTestCases()` | Casos de prueba para `getPattern()`  |
| `generatePartialTheme()`     | Tema parcial con campos aleatorios   |

### Oráculos (`tests/utils/oracle.js`)

Utilizan **Zod** para validar contratos de datos:

| Esquema                       | Valida                                           |
| ----------------------------- | ------------------------------------------------ |
| `PresetSchema`                | Estructura completa de un preset (tipos, rangos) |
| `ThemeSchema`                 | Estructura de un tema guardado en localStorage   |
| `PatternResultSchema`         | Resultado de `getPattern()` (string o 'none')    |
| `validateAllPresets(presets)` | Valida todos los presets y devuelve errores      |

El oráculo detectó **BUG #5** automáticamente al validar todos los presets contra
el esquema esperado.

---

## 7. Pruebas E2E (Playwright)

Las pruebas E2E se ejecutan contra la URL de producción:  
**`https://leviarista.github.io/github-profile-header-generator/`**

### Configuración (`playwright.config.ts`)

- **Browsers**: Chromium, Firefox, WebKit (Safari), Mobile Chrome
- **Timeout**: 30 000 ms por prueba
- **Reintentos**: 2 en CI, 0 en local

### Suites E2E

| Archivo                        | Descripción                                                                  |
| ------------------------------ | ---------------------------------------------------------------------------- |
| `banner-customization.spec.ts` | Carga de la app, cambio de colores, selección de presets, descarga de imagen |
| `accessibility.spec.ts`        | Escaneo de accesibilidad con axe-core en todas las secciones                 |
| `performance.spec.ts`          | CLS, LCP, FCP usando Performance Observer nativo                             |

### Ejecutar E2E

```bash
npx playwright install          # Solo la primera vez
npm run test:e2e                 # Todos los browsers
npm run test:e2e -- --project=chromium  # Solo Chromium
npm run test:e2e:ui              # Interfaz visual interactiva
npm run test:e2e:report          # Abrir último reporte HTML
```

---

## 8. Análisis estático (ESLint)

```bash
npm run lint
```

Configuración en `eslint.config.js`:

- Base: `@eslint/js` recommended
- Plugin: `eslint-plugin-security` (reglas OWASP para JS)
- Reglas clave: `security/detect-object-injection`, `security/detect-non-literal-regexp`

---

## 9. Pruebas de mutación (Stryker)

```bash
npm run test:mutation
```

Configuración en `stryker.config.mjs`:

- **Runner**: Vitest
- **Mutantes en**: `js/presets.js`, `js/helpers/helpers.js`
- **Reporter**: HTML + texto

Las pruebas de mutación verifican que los tests unitarios sean capaces de detectar
cambios incorrectos en la lógica (operadores lógicos, valores de retorno, condiciones).

---

## 10. Limitaciones conocidas del entorno

### jsdom — `innerText` setter

jsdom no implementa completamente el setter de `element.innerText` en todos los
contextos. En consecuencia:

- Los tests que verifican cambios en `innerText` usan `Object.defineProperty` para
  interceptar el setter y capturar el valor asignado.
- En un navegador real, `bannerTitle.innerText = 'value'` funciona correctamente.

### jsdom — `backgroundImage` con SVG data URLs

jsdom puede rechazar URLs SVG complejas asignadas a `element.style.backgroundImage`
a través del parser CSS interno. Los tests relacionados verifican el tipo del valor
retornado (`typeof string`) en lugar del contenido exacto.

### Módulos de UI pura (toolbox)

Los archivos `js/main.js`, `js/toolbox-*.js` y similares inicializan listeners de
eventos directamente al cargar el módulo. No son testables en jsdom sin refactorizar
para inyección de dependencias. Se cubren exclusivamente mediante pruebas E2E.

---

## Resumen ejecutivo

| Métrica                              | Resultado                                 |
| ------------------------------------ | ----------------------------------------- |
| Tests unitarios + integración        | **145 / 145 pasan** ✅                    |
| Cobertura de líneas                  | **74%** (umbral: 70%) ✅                  |
| Cobertura de funciones               | **100%** (umbral: 80%) ✅                 |
| Bugs detectados                      | **7 bugs** (1 crítico, 2 medios, 4 bajos) |
| Bugs en datos detectados por oráculo | **1** (BUG #5, presets.json)              |
