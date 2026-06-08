/**
 * tests/setup.js
 * Prepara el DOM mínimo necesario para que banner.js y los módulos
 * del toolbox puedan ser importados sin errores en el entorno jsdom.
 * Se ejecuta ANTES de cada archivo de test (setupFiles en vitest.config.js).
 */

document.body.innerHTML = `
  <div class="header-image-container">
    <div id="github-header-image" class="header-image" style="">
      <h1 class="title">GitHub User</h1>
      <p class="subtitle">Developer</p>
      <div class="img-decoration-container">
        <img
          class="img-decoration"
          alt="Header image decoration"
          style="position:absolute;bottom:calc(50%);transform:translateY(50%);left:auto;right:25px;width:0px;"
        />
      </div>
    </div>
  </div>

  <div class="toolbox">
    <div class="size-inputs">
      <input id="width-input" type="number" value="800" />
    </div>
    <div class="text-inputs">
      <input id="title-input" type="text" value="GitHub User" />
      <input id="subtitle-input" type="text" value="Developer" />
    </div>
    <div class="color-selectors-container">
      <input id="main-bg-color-selector" type="color" value="#62518d" />
      <input id="title-color-selector" type="color" value="#ffffff" />
      <input id="subtitle-color-selector" type="color" value="#fff2b3" />
    </div>
    <div class="font-selectors-container">
      <select id="title-font-selector"><option value="Red Hat Display">Red Hat Display</option></select>
      <select id="subtitle-font-selector"><option value="Kalam">Kalam</option></select>
    </div>
    <div class="font-size-inputs">
      <input id="title-font-size-input" type="range" value="40" min="10" max="100" />
      <input type="number" value="40" />
      <input id="subtitle-font-size-input" type="range" value="20" min="10" max="80" />
      <input type="number" value="20" />
    </div>
  </div>

  <div class="toolbox-background">
    <div class="bg-color-selectors">
      <input id="background-bg-color-selector" type="color" value="#62518d" />
      <input id="border-color-selector" type="color" value="#ffffff" />
    </div>
    <div class="border-inputs">
      <input id="border-input" type="range" value="5" min="0" max="20" />
      <input type="number" value="5" />
      <input id="border-radius-input" type="range" value="0" min="0" max="50" />
      <input type="number" value="0" />
    </div>
    <div class="pattern-inputs">
      <input id="pattern-opacity-input" type="range" value="0.25" min="0" max="1" step="0.01" />
      <input type="number" value="0.25" />
      <input id="pattern-size-input" type="range" value="100" min="10" max="500" />
      <input type="number" value="100" />
      <input id="pattern-color-selector" type="color" value="#ffffff" />
    </div>
  </div>

  <div class="toolbox-decorations">
    <div class="decorations-size-inputs">
      <input id="decoration-size-input" type="range" value="77" min="10" max="300" />
      <input type="number" value="77" />
    </div>
    <div class="decorations-buttons"></div>
    <input id="decoration-upload-input" type="file" />
  </div>

  <div class="toolbox-presets"></div>

  <div class="tab">
    <button class="tablinks" data-name="main-section">Main</button>
    <button class="tablinks" data-name="background-section">Background</button>
    <button class="tablinks" data-name="decorations-section">Decorations</button>
    <button class="tablinks" data-name="presets-section">Presets</button>
  </div>

  <div class="paddings-inputs">
    <input id="paddings-input" type="range" value="25" min="0" max="100" />
    <input type="number" value="25" />
  </div>

  <button class="download-button">
    <img src="./images/icons/download.svg" alt="Download" />
  </button>

  <section class="how-to-section">
    <video class="demo"></video>
  </section>
`;
