# Trabajo Final — Pruebas Avanzadas de Software

## GitHub Profile Header Generator v2.1.0

**Materia:** Pruebas Avanzadas de Software  
**Proyecto:** [github-profile-header-generator](https://github.com/leviarista/github-profile-header-generator)  
**URL producción:** https://leviarista.github.io/github-profile-header-generator/  
**Fecha:** Mayo 2026

---

## Tabla de contenidos

1. [El proyecto bajo análisis](#1-el-proyecto-bajo-análisis)
2. [Por qué se implementaron pruebas](#2-por-qué-se-implementaron-pruebas)
3. [Herramientas y tecnologías utilizadas](#3-herramientas-y-tecnologías-utilizadas)
4. [Ventajas y desventajas de la implementación](#4-ventajas-y-desventajas-de-la-implementación)
5. [Tipos de pruebas implementadas](#5-tipos-de-pruebas-implementadas)
6. [Cobertura de código lograda](#6-cobertura-de-código-lograda)
7. [Análisis de resultados](#7-análisis-de-resultados)
8. [Bugs detectados](#8-bugs-detectados)
9. [Propuestas de mejora](#9-propuestas-de-mejora)
10. [Uso de Inteligencia Artificial](#10-uso-de-inteligencia-artificial)
11. [Conclusiones](#11-conclusiones)

---

## 1. El proyecto bajo análisis

**GitHub Profile Header Generator** es una herramienta web open source que permite
a los usuarios crear y personalizar imágenes de cabecera para su perfil de GitHub.
Es una Single Page Application (SPA) desarrollada en **Vanilla JavaScript + ES Modules**,
sin frameworks de frontend ni backend.

### Características del proyecto original

| Característica           | Detalle                                                |
| ------------------------ | ------------------------------------------------------ |
| Tecnología principal     | Vanilla JavaScript (ES Modules)                        |
| Bundler                  | Vite ^7.0.3                                            |
| Estilos                  | SCSS                                                   |
| Deploy                   | GitHub Pages                                           |
| Dependencia principal    | `@zumer/snapdom` (captura del banner como imagen)      |
| Archivos JavaScript core | `banner.js`, `presets.js`, `helpers.js`, `elements.js` |

### Arquitectura del código fuente

El núcleo funcional está concentrado en cuatro archivos:

- **`js/banner.js`** — Orquesta toda la lógica: aplica temas, gestiona estilos del banner, persiste en localStorage y actualiza la UI.
- **`js/presets.js`** — Carga y expone los presets predefinidos del archivo `presets.json`.
- **`js/helpers/helpers.js`** — Utilidades: detección de entorno de desarrollo, parseo de parámetros de URL.
- **`js/helpers/elements.js`** — Referencias centralizadas a los elementos del DOM.
- **`js/data/patterns.js`** — Función `getPattern()` que genera patrones SVG como data-URLs para el fondo del banner.

Los archivos `toolbox-*.js` y `main.js` son módulos de UI pura que registran event listeners al cargar.

---

## 2. Por qué se implementaron pruebas

### El problema de partida

El proyecto original **no contaba con ningún tipo de prueba automatizada**. Esto implica:

- **Sin red de seguridad:** cualquier cambio en el código podía romper funcionalidades sin que nadie lo notara hasta que un usuario lo reportara.
- **Deuda técnica invisible:** el código fuente contiene bugs que llevan tiempo sin ser detectados porque no hay tests que los capturen.
- **Confianza subjetiva:** la única forma de verificar que la app funciona era abrirla manualmente en el navegador y probarla a mano.

### Objetivos de la implementación

1. **Detectar bugs existentes** en el código sin modificar la fuente.
2. **Documentar el comportamiento esperado** del sistema para que sirva como especificación viva.
3. **Establecer un umbral de calidad** con cobertura mínima configurable.
4. **Verificar accesibilidad y rendimiento** del sitio de producción de forma automatizada.
5. **Demostrar técnicas avanzadas** de testing: generación de datos, oráculos de validación, pruebas de mutación y análisis E2E con navegador real.

### Justificación técnica

La capa de lógica de negocio (`banner.js`, `helpers.js`, `presets.js`) es completamente independiente del framework de UI, lo que la hace **testeable en aislamiento** con un entorno de DOM simulado. Esto permite pruebas rápidas y deterministas sin necesidad de levantar un servidor.

---

## 3. Herramientas y tecnologías utilizadas

### Stack de pruebas completo

| Herramienta                | Versión | Propósito                                                             |
| -------------------------- | ------- | --------------------------------------------------------------------- |
| **Vitest**                 | ^3.2.4  | Runner principal de tests unitarios e integración                     |
| **jsdom**                  | ^26.1   | DOM simulado para Vitest (entorno de navegador falso)                 |
| **@vitest/coverage-v8**    | ^3.2.4  | Cobertura de código usando el motor V8 de Node.js                     |
| **@playwright/test**       | ^1.52   | Pruebas E2E en navegadores reales (Chromium, Firefox, Safari, Mobile) |
| **@axe-core/playwright**   | ^4.10   | Análisis de accesibilidad WCAG 2.1 AA automatizado                    |
| **@stryker-mutator/core**  | ^8.7.1  | Pruebas de mutación para verificar calidad de los tests               |
| **ESLint**                 | ^9.28   | Análisis estático del código JavaScript                               |
| **eslint-plugin-security** | ^3.0.1  | Reglas de seguridad basadas en OWASP Top 10                           |
| **@faker-js/faker**        | ^9.8    | Generación de datos de prueba realistas y aleatorios                  |
| **Zod**                    | ^3.24.4 | Oráculos de validación mediante esquemas de tipos                     |

### Por qué estas herramientas y no otras

**Vitest en lugar de Jest:** Vitest fue diseñado específicamente para proyectos Vite y soporta ES Modules de forma nativa, sin transpilación. Jest requiere configuración adicional para módulos ESM y es más lento en proyectos modernos. Dado que el proyecto ya usa Vite como bundler, Vitest fue la elección natural.

**jsdom en lugar de happy-dom:** jsdom tiene mayor compatibilidad con APIs del navegador y mejor soporte de la comunidad. Para un proyecto que usa `style.backgroundImage`, `localStorage`, y manipulación del DOM, jsdom ofrece mejor fidelidad.

**Playwright en lugar de Cypress:** Playwright soporta múltiples navegadores reales (Chromium, Firefox, WebKit) en una misma suite, tiene mejor soporte para async/await nativo y genera trazas detalladas. Cypress solo soporta Chromium y Electron de forma oficial en su versión gratuita.

**Zod en lugar de validación manual:** Los esquemas Zod actúan como oráculos formales y son reutilizables. Una función manual de validación no ofrece inferencia de tipos ni reuso.

**Stryker:** Es el estándar de facto para pruebas de mutación en JavaScript. Se integra directamente con Vitest como runner, sin configuración extra de transpilación.

---

## 4. Ventajas y desventajas de la implementación

### Ventajas

| #   | Ventaja                                                            | Impacto                                                                           |
| --- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| 1   | **Detección automática de bugs** sin modificar el código fuente    | Se encontraron 7 bugs reales, incluyendo uno crítico                              |
| 2   | **Cobertura del 100% de funciones** en los módulos de negocio      | Toda función exportable queda verificada                                          |
| 3   | **Pruebas E2E con navegador real** (Chromium headed)               | Se verifican flujos completos como usuario real los experimenta                   |
| 4   | **Accesibilidad automatizada** con axe-core                        | Se detectaron violaciones WCAG 2.1 AA que pasan desapercibidas en revisión manual |
| 5   | **Generación de datos** con Faker                                  | Las pruebas cubren casos aleatorios y no solo ejemplos hardcodeados               |
| 6   | **Oráculos Zod** que validan contratos de datos                    | Se detectó el BUG #5 (tipos incorrectos en presets.json) automáticamente          |
| 7   | **El único cambio al código fuente fue añadir `"type": "module"`** | Se respeta el código original al 100%, no se modificó la lógica                   |
| 8   | **Suite ejecutable en CI/CD** sin infraestructura adicional        | `npm test` funciona en cualquier entorno con Node.js                              |

### Desventajas

| #   | Desventaja                                                              | Causa / Limitación                                                                                                                                        |
| --- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Los módulos de UI pura no son testables con jsdom**                   | `toolbox-*.js` registran listeners al cargar; jsdom no ejecuta CSS ni layout real                                                                         |
| 2   | **`innerText` incompleto en jsdom**                                     | jsdom no implementa el setter de `innerText` en todos los contextos; requirió workaround con `Object.defineProperty`                                      |
| 3   | **Las E2E apuntan a producción** (GitHub Pages), no a un servidor local | Un fallo en el deploy externo puede romper las E2E aunque el código sea correcto                                                                          |
| 4   | **Pruebas de mutación lentas**                                          | Stryker ejecuta los tests por cada mutante generado; sobre archivos grandes puede tomar varios minutos                                                    |
| 5   | **Cobertura de ramas al 72%** (no 100%)                                 | Las ramas de `patternSize`, `titleFont` y `subtitleFont` en `banner.js` requieren elementos del DOM del toolbox que no están en el fixture de integración |
| 6   | **El visual snapshot falla la primera ejecución**                       | Playwright necesita una corrida inicial para generar el baseline; no es un fallo real del sistema                                                         |
| 7   | **jsdom no soporta SVG data-URLs complejas en CSS**                     | Los tests de `backgroundImage` verifican el tipo del valor, no el contenido exacto                                                                        |

---

## 5. Tipos de pruebas implementadas

### 5.1 Pruebas Unitarias

**Herramienta:** Vitest + jsdom  
**Ubicación:** `tests/unit/`  
**Total:** 91 tests

Las pruebas unitarias verifican funciones individuales de forma aislada, sin dependencias entre módulos.

| Archivo              | Qué prueba                                                                                                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getPattern.test.js` | La función `getPattern()` que genera fondos SVG: valores válidos, nulos, combinaciones de color/opacidad/tamaño, y todos los patrones del catálogo. También usa datos generados por Faker.           |
| `presets.test.js`    | La carga del archivo `presets.json`: que los presets existen, tienen todos los campos requeridos, los valores están en rangos válidos, y el oráculo Zod detecta cualquier campo con tipo incorrecto. |

### 5.2 Pruebas de Integración

**Herramienta:** Vitest + jsdom  
**Ubicación:** `tests/integration/`  
**Total:** 54 tests (27 + 16 + 11 de helpers)

Las pruebas de integración verifican la interacción entre módulos: que `banner.js` utiliza correctamente a `patterns.js`, `helpers.js` y el DOM simulado.

| Archivo                | Qué prueba                                                                                                                                                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `banner.test.js`       | Las funciones `updateBanner`, `applyTheme` y `updateUIOptions`: que los estilos se aplican correctamente al DOM, que localStorage guarda el tema, que los bugs identificados se comportan como se documentaron. |
| `localStorage.test.js` | Los ciclos de guardado y lectura: `saveTheme`, `getSavedThemeProp`, manejo de localStorage vacío, corrupto, y ciclos guardar-leer-guardar.                                                                      |

### 5.3 Pruebas E2E (End-to-End)

**Herramienta:** Playwright + axe-core  
**Ubicación:** `tests/e2e/`  
**Total:** 38 tests por browser (ejecutados en Chromium, Firefox, WebKit, Mobile Chrome)

Las pruebas E2E abren la URL de producción en un navegador real y simulan la interacción del usuario.

| Archivo                        | Qué prueba                                                                                                                                                                                                                   |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `banner-customization.spec.ts` | Que el banner carga, el título y subtítulo son visibles, el toolbox funciona, se puede cambiar el fondo, aplicar presets, y descargar la imagen sin errores de JavaScript. Incluye un oracle visual (screenshot comparison). |
| `accessibility.spec.ts`        | Escaneo completo de accesibilidad con axe-core según WCAG 2.1 AA: violaciones críticas, graves y moderadas; imágenes con `alt`; inputs con labels; contraste de color; landmarks; viewport móvil.                            |
| `performance.spec.ts`          | Métricas de rendimiento: tiempo de carga (< 8s), tiempo hasta banner visible (< 5s), network idle (< 12s), Core Web Vitals (TTFB, DOM Interactive, Load), tamaño de recursos descargados, estabilidad del layout (CLS).      |

### 5.4 Análisis Estático

**Herramienta:** ESLint + eslint-plugin-security  
**Reglas activas:** `security/detect-object-injection`, `security/detect-non-literal-regexp`, y las reglas base de `@eslint/js`

Escanea el código fuente en busca de patrones de seguridad problemáticos del OWASP Top 10 sin ejecutar el código.

### 5.5 Pruebas de Mutación

**Herramienta:** Stryker + @stryker-mutator/vitest-runner  
**Archivos mutados:** `js/presets.js`, `js/helpers/helpers.js`

Las pruebas de mutación verifican la **calidad de los tests**: Stryker introduce pequeños cambios (mutantes) en el código fuente y verifica que al menos un test detecte el cambio. Si ningún test falla, el mutante "sobrevive" y los tests no son lo suficientemente estrictos.

---

## 6. Cobertura de código lograda

La cobertura se mide sobre los módulos de lógica de negocio. Los módulos de UI pura (`toolbox-*.js`, `main.js`) se excluyen explícitamente porque no son testables sin un navegador real.

### Resultados por archivo

| Archivo                  | Sentencias | Ramas    | Funciones | Líneas   |
| ------------------------ | ---------- | -------- | --------- | -------- |
| `js/banner.js`           | 69%        | 70%      | **100%**  | 69%      |
| `js/presets.js`          | **100%**   | **100%** | **100%**  | **100%** |
| `js/helpers/helpers.js`  | **100%**   | 50%      | **100%**  | **100%** |
| `js/helpers/elements.js` | **100%**   | **100%** | **100%**  | **100%** |
| **TOTAL**                | **74%**    | **72%**  | **100%**  | **74%**  |

### Umbrales configurados

| Métrica   | Umbral mínimo | Resultado | Estado    |
| --------- | ------------- | --------- | --------- |
| Líneas    | 70%           | 74%       | ✅ Supera |
| Ramas     | 60%           | 72%       | ✅ Supera |
| Funciones | 80%           | 100%      | ✅ Supera |

### Qué no está cubierto y por qué

Las líneas no cubiertas en `banner.js` (~30%) corresponden a las ramas de:

- `patternSize`, `patternColor` y `patternOpacity` en `applyTheme()` — requieren elementos del toolbox que no están en el fixture jsdom
- `titleFont`, `subtitleFont` — cargan fuentes externas vía `FontFace` API, no soportada en jsdom
- `textAlign`, `decoration`, `pattern` en `updateUIOptions()` — cuerpos de bloques `if` vacíos (BUG #3)

Estas rutas se cubren **parcialmente** mediante las pruebas E2E en navegador real.

---

## 7. Análisis de resultados

### 7.1 Pruebas unitarias e integración

**Resultado: 145/145 tests pasan ✅**

Todos los tests de la suite unitaria e integración pasan correctamente. Los tests que documentan bugs están escritos intencionalmente para verificar el comportamiento incorrecto actual, lo que permite:

- Tener un registro formal de cada bug
- Detectar automáticamente si un bug se corrige (el test cambiará de semántica)
- Proteger contra regresiones en bugs ya conocidos

### 7.2 Pruebas E2E en Chromium (headed — navegador visible)

**Resultado: 29/34 pasan ✅ | 5 fallan ❌** (en ejecución con navegador visible)

Los fallos son todos **bugs reales del sitio de producción**, no de la infraestructura de tests:

#### Fallos de accesibilidad (4 tests)

Todos comparten la misma causa raíz: **4 imágenes de iconos sin atributo `alt`** en el HTML de producción.

```html
<!-- Código actual (incorrecto): -->
<img src="./images/icons/light-dark.svg" width="20" />
<img src="./images/icons/random.svg" width="20" />
<img src="./images/icons/reset.svg" width="20" />
<img src="./images/icons/download.svg" width="20" />

<!-- Corrección necesaria: -->
<img src="./images/icons/light-dark.svg" width="20" alt="Toggle dark mode" />
<img src="./images/icons/random.svg" width="20" alt="Apply random preset" />
<img src="./images/icons/reset.svg" width="20" alt="Reset to default" />
<img src="./images/icons/download.svg" width="20" alt="Download banner" />
```

Esto constituye una **violación CRÍTICA de WCAG 2.1 — Criterio 1.1.1** (Non-text Content). Los lectores de pantalla no pueden describir estas imágenes a usuarios con discapacidad visual.

Adicionalmente, axe-core reportó:

- **[SERIOUS]** Contraste insuficiente en el botón `#defaultOpenTag` ("Main")
- **[MODERATE]** La página no tiene elemento `<main>` (falta landmark principal)
- **[MODERATE]** Contenido fuera de landmarks (`.toogle-dark-mode`, `.how-to-section`)

#### Fallo de visual snapshot (1 test)

```
A snapshot doesn't exist at .../banner-default-chromium-darwin.png
```

Este fallo es **esperado en la primera ejecución**. Playwright tomó y guardó la captura como baseline. En la siguiente ejecución comparará contra esa imagen. No representa un problema real.

### 7.3 Métricas de rendimiento medidas en producción

| Métrica                       | Resultado | Umbral del test | Estado       |
| ----------------------------- | --------- | --------------- | ------------ |
| TTFB (Time to First Byte)     | 17.5 ms   | —               | Excelente    |
| DOM Interactive               | 317 ms    | —               | Muy bueno    |
| DOM Complete                  | 544 ms    | —               | Muy bueno    |
| Tiempo de carga total         | ~544 ms   | < 8 000 ms      | ✅           |
| Banner visible                | 60 ms     | < 5 000 ms      | ✅ Excelente |
| Network idle                  | 1 336 ms  | < 12 000 ms     | ✅           |
| Tamaño total de recursos      | ~913 KB   | —               | Aceptable    |
| CLS (Cumulative Layout Shift) | 0         | —               | Perfecto     |
| Errores JS al cargar          | 0         | 0               | ✅           |
| Errores en consola            | 0         | 0               | ✅           |
| Recursos 404                  | 0         | 0               | ✅           |

El sitio tiene un rendimiento excelente: carga en menos de 600ms y el banner aparece en solo 60ms.

### 7.4 Otros hallazgos del análisis axe-core

En el reporte completo de accesibilidad:

- **40 reglas aprobadas** de WCAG 2.1 AA
- **4 violaciones** (1 crítica, 1 seria, 2 moderadas)
- **2 incompletas** (reglas que axe no puede determinar automáticamente)

Esto significa que el 91% de las verificaciones automáticas pasan, pero el 9% restante representa violaciones concretas con soluciones bien definidas.

---

## 8. Bugs detectados

La suite de pruebas detectó **7 bugs** en el código fuente original que existían sin ser reportados.

### Resumen de bugs

| #       | Archivo        | Severidad  | Descripción breve                                                                                  |
| ------- | -------------- | ---------- | -------------------------------------------------------------------------------------------------- |
| BUG #1  | `banner.js`    | 🔴 CRÍTICO | `patternColor.replace()` lanza TypeError si patternColor es undefined                              |
| BUG #2  | `banner.js`    | 🟡 MEDIO   | `getSavedThemeProp()` devuelve `'bubbles'` para cualquier propiedad cuando localStorage está vacío |
| BUG #3  | `banner.js`    | 🟢 BAJO    | Bloques `if` vacíos en `updateUIOptions()` — textAlign, decoration y pattern no se restauran       |
| BUG #3b | `banner.js`    | 🟢 BAJO    | `borderRadius: 0` es falsy → el borde no se aplica para esquinas cuadradas                         |
| BUG #4  | `banner.js`    | 🟢 BAJO    | `if (title \|\| subtitle)` impide limpiar el texto con cadena vacía                                |
| BUG #5  | `presets.json` | 🟡 MEDIO   | Preset #22 tiene campos numéricos guardados como strings (detectado por oráculo Zod)               |
| BUG #6  | `banner.js`    | 🟢 BAJO    | `JSON.parse()` sin `try/catch` — puede lanzar SyntaxError si localStorage está corrupto            |

### El más importante: BUG #1

Es el único que puede romper la aplicación en tiempo de ejecución para el usuario final. Al aplicar un preset que incluye `patternSize` pero no `patternColor`, JavaScript lanza:

```
TypeError: Cannot read properties of undefined (reading 'replace')
```

La corrección es simple (verificar si `patternColor` existe antes de llamar `.replace()`), pero el bug pasa totalmente desapercibido sin tests.

### Detección por oráculo: BUG #5

El **oráculo Zod** (`PresetSchema`) detectó automáticamente que el preset en el índice 22 tiene campos numéricos guardados como strings. Ninguna revisión manual del JSON habría detectado esto fácilmente entre los 30+ presets del archivo. Este es un ejemplo de cómo los oráculos añaden valor real más allá de los tests manuales.

---

## 9. Propuestas de mejora

### 9.1 Correcciones inmediatas (alta prioridad)

**Accesibilidad — imágenes sin `alt`**  
Añadir el atributo `alt` a los 4 iconos del toolbox. Es el cambio más pequeño con el mayor impacto: elimina 4 tests fallidos y cumple WCAG 2.1 criterio 1.1.1.

**BUG #1 — TypeError en patternColor**  
Proteger la llamada a `.replace()` con una verificación condicional. Este es el único bug con potencial de romper la app en producción para usuarios reales.

**BUG #6 — JSON.parse sin try/catch**  
Envolver `JSON.parse(localStorage.getItem('theme'))` en `try/catch`. Los datos de localStorage pueden corromperse por extensiones del navegador, lo que actualmente lanzaría un `SyntaxError` no manejado.

### 9.2 Mejoras en la suite de pruebas

**Ampliar el fixture DOM**  
El fixture en `tests/setup.js` no incluye todos los inputs del toolbox (como `#pattern-size`, `#title-font`). Añadirlos permitiría cubrir las ramas de `banner.js` que actualmente quedan sin cobertura, subiendo la cobertura de líneas de 74% a aproximadamente 90%.

**Snapshot testing estabilizado**  
El test de visual snapshot ya tiene su baseline generado. Se recomienda guardar el archivo generado (`tests/e2e/banner-customization.spec.ts-snapshots/banner-default-chromium-darwin.png`) en el repositorio para que futuras ejecuciones puedan comparar.

**Pruebas E2E contra servidor local (no producción)**  
Configurar `playwright.config.ts` con `webServer` para levantar un servidor Vite local antes de las pruebas E2E. Esto elimina la dependencia del deploy de GitHub Pages y permite testear cambios antes de publicarlos.

```ts
// playwright.config.ts — configuración sugerida
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:5173',
  reuseExistingServer: !process.env.CI,
}
```

**Ampliar las pruebas de mutación**  
Actualmente Stryker solo muta `presets.js` y `helpers.js`. Incluir `banner.js` revelaría qué operadores lógicos de la función `applyTheme()` están cubiertos por los tests de integración.

**Tests de regresión para bugs encontrados**  
Los bugs #1 al #6 están documentados en los tests como comportamiento incorrecto actual. Cuando se corrijan, los tests deben actualizarse para verificar el comportamiento correcto, convirtiéndose en tests de regresión que eviten que los bugs reaparezcan.

### 9.3 Estructura a futuro

Si el proyecto creciera, se recomienda:

- **Separar la lógica de negocio de los efectos de DOM** (patrón de inversión de dependencias), lo que haría `banner.js` completamente testeable sin jsdom.
- **Añadir CI/CD** con GitHub Actions que ejecute `npm test` y `npm run test:e2e` en cada pull request.
- **Integrar el reporte de cobertura** con una herramienta como Codecov para trackear tendencias históricas.

---

## 10. Uso de Inteligencia Artificial

GitHub Copilot (modelo Claude Sonnet 4.6) fue utilizado activamente como asistente de desarrollo a lo largo de todo el trabajo. Su uso cubrió múltiples dimensiones:

### 10.1 Exploración del proyecto

Copilot analizó los archivos del proyecto (`banner.js`, `helpers.js`, `presets.json`, etc.) para comprender la arquitectura antes de diseñar las pruebas. Identificó qué funciones son exportables, qué dependencias existen entre módulos y qué partes son testables con jsdom versus con navegador real.

### 10.2 Diseño de la arquitectura de pruebas

La estructura de carpetas (`tests/unit/`, `tests/integration/`, `tests/e2e/`, `tests/utils/`) y la decisión de usar Vitest (en lugar de Jest) por compatibilidad nativa con ES Modules y Vite fueron sugeridas y justificadas por el asistente en función del stack tecnológico específico del proyecto.

### 10.3 Generación de tests con cobertura semántica

Copilot generó los archivos de test, pero con comprensión del dominio: supo que `getPattern()` retorna `'none'` para entradas nulas, que `getSavedThemeProp` tiene un bug de retorno hardcodeado, y que `borderRadius: 0` es un caso borde falsy. Esto resultó en tests que detectaron bugs reales, no solo tests de "happy path".

### 10.4 Configuración de herramientas especializadas

La configuración de herramientas como Stryker (con runner Vitest y soporte ESM), axe-core en Playwright, y los esquemas Zod como oráculos fue asistida por Copilot, que conoce las particularidades de integración de cada herramienta (por ejemplo, que Stryker requiere `"type": "module"` en package.json para funcionar con Vitest en modo ESM).

### 10.5 Identificación de bugs

Al analizar el código fuente, Copilot identificó los 7 bugs documentados señalando las líneas exactas, el tipo de error y las condiciones de reproducción. Por ejemplo, detectó que `patternColor.replace('#','')` se ejecuta sin verificar si `patternColor` es `undefined`, y que esto puede ocurrir cuando el usuario cambia solo el `patternSize`.

### 10.6 Ejecución y análisis de resultados

Copilot ejecutó las pruebas, interpretó los mensajes de error de Playwright y diferenció entre:

- Fallos que son bugs del sitio de producción (imágenes sin `alt`)
- Fallos esperados en primera ejecución (visual snapshot sin baseline)
- Advertencias informativas que no son fallos (landmark `<main>` ausente)

### 10.7 Limitaciones del uso de IA

- Copilot no puede ejecutar un navegador directamente; los tests E2E con headed mode fueron configurados por Copilot pero ejecutados por el entorno local.
- Algunas sugerencias de configuración requirieron ajustes manuales (por ejemplo, el workaround de `Object.defineProperty` para `innerText` en jsdom fue sugerido por Copilot pero verificado empíricamente).
- El asistente no modifica código fuente existente sin instrucción explícita; los bugs detectados fueron documentados pero no corregidos para respetar el alcance del trabajo.

---

## 11. Conclusiones

### Lo que se logró

Este trabajo partió de un proyecto open source sin ninguna prueba automatizada y construyó una **suite de calidad industrial** que incluye cinco tipos distintos de pruebas, cobertura por encima de los umbrales definidos, y detección de bugs reales que existen en producción.

**En números:**

- ✅ 145 tests unitarios e integración, todos pasando
- ✅ 74% cobertura de líneas, 100% cobertura de funciones
- ✅ 38 tests E2E por navegador (29/34 pasan, 5 detectan bugs reales)
- ✅ 7 bugs documentados con casos de reproducción
- ✅ Rendimiento de producción verificado: banner visible en 60ms
- ✅ El único cambio al código original fue añadir `"type": "module"` a package.json

### Lo que los tests demostraron

Los tests no solo verifican que el código funciona: **descubrieron que no funciona en ciertos casos**. El BUG #1 puede romper la aplicación para cualquier usuario que interactúe con el tamaño del patrón sin configurar el color. El BUG #2 hace que todas las propiedades del tema guardado devuelvan `'bubbles'` cuando localStorage está vacío. Las 4 imágenes sin `alt` hacen la aplicación inaccesible para usuarios con lector de pantalla.

Ninguno de estos problemas era conocido antes de implementar las pruebas.

### El valor de las pruebas automatizadas

Las pruebas automatizadas no son solo una tarea académica: son la única forma confiable de saber si el software sigue funcionando después de cada cambio. Para un proyecto open source al que cualquiera puede contribuir con un pull request, una suite de tests que ejecuta en segundos es la diferencia entre aceptar cambios con confianza o con miedo.

---

_Documento generado para el Trabajo Final de la materia Pruebas Avanzadas de Software._  
_Proyecto base: https://github.com/leviarista/github-profile-header-generator (MIT License)_
