/* ************** Elements ************** */

let headerImageContainer = document.querySelector('.header-image-container');
let headerImage = document.querySelector('#github-header-image');
let title = headerImage.querySelector('.title');
let subtitle = headerImage.querySelector('.subtitle');

let toolbox = document.querySelector('.toolbox');

/* ************** Fonts ************** */

function listFonts() {
    let { fonts } = document;
    const it = fonts.entries();

    let arr = [];
    let done = false;

    while (!done) {
        const font = it.next();
        if (!font.done) {
            arr.push(font.value[0].family);
        } else {
            done = font.done;
        }
    }

    return [...new Set(arr)];
}

function setFontValues() {
    let titleFontSelect = toolbox.querySelector('.font-selectors-container #title-font-selector');
    let subtitleFontSelect = toolbox.querySelector('.font-selectors-container #subtitle-font-selector');

    document.fonts.ready.then(() => {
        const titleFontName = titleFontSelect.value;
        const titleFontUrl = './fonts/' + getFontUrl(titleFontSelect.value);
        let titleFont = getFont(titleFontSelect.value)
        titleFont.load().then(function (loadedFont) {
            document.fonts.add(loadedFont)
            // injectFontFaceRule(titleFontName, titleFontUrl);

            console.log('Font loaded and added');
            title.style.fontFamily = `"${titleFontSelect.value}"`;
        }).catch(function (error) {
            console.log('Failed to load font: ' + error)
        })

        const subTitleFontName = subtitleFontSelect.value;
        const subTitleFontUrl = './fonts/' + getFontUrl(subtitleFontSelect.value);
        let subTitleFont = getFont(subtitleFontSelect.value)
        subTitleFont.load().then(function (loadedFont) {
            document.fonts.add(loadedFont)
            // injectFontFaceRule(subTitleFontName, subTitleFontUrl);

            console.log('Font loaded and added');
            subtitle.style.fontFamily = `"${subtitleFontSelect.value}"`;
        }).catch(function (error) {
            console.log('Failed to load font: ' + error)
        })
    });
}

function injectFontFaceRule(fontName, fontUrl) {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: '${fontName}';
        src: url('${fontUrl}');
      }
    `;
    document.head.appendChild(style);
}

function getFontUrl(fontName) {
    switch (fontName) {
        case 'Kalam':
            return 'Kalam-Regular.ttf")';
        case 'Poppins':
            return 'Poppins-Regular.ttf';
        case 'Athiti':
            return 'Athiti-Regular.ttf';
        case 'MavenPro':
            return 'MavenPro-Regular.ttf';
        case 'Ubuntu':
            return 'Ubuntu-Regular.ttf';
        case 'IstokWeb':
            return 'IstokWeb-Regular.ttf';
        case 'Courgette':
            return 'Courgette-Regular.ttf';
        case 'Quattrocento':
            return 'Quattrocento-Regular.ttf';
        case 'DellaRespira':
            return 'DellaRespira-Regular.ttf';
        case 'Lato':
            return 'Lato-Regular.ttf';
        case 'Martel':
            return 'Martel-Regular.ttf';
        case 'Lancelot':
            return 'Lancelot-Regular.ttf';
        case 'Playball':
            return 'Playball-Regular.ttf';
        case 'LifeSavers':
            return 'LifeSavers-Regular.ttf';
        default:
            return 'Kalam-Regular.ttf';
    }
}

function getFont(fontName) {
    let newFont = null;
    if (fontName === 'Kalam') {
        newFont = new FontFace('Kalam', 'url("./fonts/Kalam-Regular.ttf")');
        newFont._snapdomSrc = "./fonts/Kalam-Regular.ttf";
    } else if (fontName === 'Poppins') {
        newFont = new FontFace('Poppins', 'url("./fonts/Poppins-Regular.ttf")');
        newFont._snapdomSrc = "./fonts/Poppins-Regular.ttf";
    } else if (fontName === 'Athiti') {
        newFont = new FontFace('Athiti', 'url("./fonts/Athiti-Regular.ttf")');
        newFont._snapdomSrc = "./fonts/Athiti-Regular.ttf";
    } else if (fontName === 'MavenPro') {
        newFont = new FontFace('MavenPro', 'url("./fonts/MavenPro-Regular.ttf")');
        newFont._snapdomSrc = "./fonts/MavenPro-Regular.ttf";
    } else if (fontName === 'Ubuntu') {
        newFont = new FontFace('Ubuntu', 'url("./fonts/Ubuntu-Regular.ttf")');
        newFont._snapdomSrc = "./fonts/Ubuntu-Regular.ttf";
    } else if (fontName === 'IstokWeb') {
        newFont = new FontFace('IstokWeb', 'url("./fonts/IstokWeb-Regular.ttf")');
        newFont._snapdomSrc = "./fonts/IstokWeb-Regular.ttf";
    } else if (fontName === 'Courgette') {
        newFont = new FontFace('Courgette', 'url("./fonts/Courgette-Regular.ttf")');
        newFont._snapdomSrc = "./fonts/Courgette-Regular.ttf";
    } else if (fontName === 'Quattrocento') {
        newFont = new FontFace('Quattrocento', 'url("./fonts/Quattrocento-Regular.ttf")');
        newFont._snapdomSrc = "./fonts/Quattrocento-Regular.ttf";
    } else if (fontName === 'DellaRespira') {
        newFont = new FontFace('DellaRespira', 'url("./fonts/DellaRespira-Regular.ttf")');
        newFont._snapdomSrc = "./fonts/DellaRespira-Regular.ttf";
    } else if (fontName === 'Lato') {
        newFont = new FontFace('Lato', 'url("./fonts/Lato-Regular.ttf")');
        newFont._snapdomSrc = "./fonts/Lato-Regular.ttf";
    } else if (fontName === 'Martel') {
        newFont = new FontFace('Martel', 'url("./fonts/Martel-Regular.ttf")');
        newFont._snapdomSrc = "./fonts/Martel-Regular.ttf";
    } else if (fontName === 'Lancelot') {
        newFont = new FontFace('Lancelot', 'url("./fonts/Lancelot-Regular.ttf")');
        newFont._snapdomSrc = "./fonts/Lancelot-Regular.ttf";
    } else if (fontName === 'Playball') {
        newFont = new FontFace('Playball', 'url("./fonts/Playball-Regular.ttf")');
        newFont._snapdomSrc = "./fonts/Playball-Regular.ttf";
    } else if (fontName === 'LifeSavers') {
        newFont = new FontFace('LifeSavers', 'url("./fonts/LifeSavers-Regular.ttf")');
        newFont._snapdomSrc = "./fonts/LifeSavers-Regular.ttf";
    } else {
        // default case
        newFont = new FontFace('Kalam', 'url("./fonts/Kalam-Regular.ttf")');
        newFont._snapdomSrc = "./fonts/Kalam-Regular.ttf";
    }
    return newFont;
}

export { setFontValues };