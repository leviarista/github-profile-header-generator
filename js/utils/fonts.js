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
        let titleFont = getFont(titleFontSelect.value)
        titleFont.load().then(function (loadedFont) {
            document.fonts.add(loadedFont)
            console.log('Font loaded an added');
            title.style.fontFamily = `"${titleFontSelect.value}"`;
        }).catch(function (error) {
            console.log('Failed to load font: ' + error)
        })

        let subTitlefont = getFont(subtitleFontSelect.value)
        subTitlefont.load().then(function (loadedFont) {
            document.fonts.add(loadedFont)
            console.log('Font loaded an added');
            subtitle.style.fontFamily = `"${subtitleFontSelect.value}"`;
        }).catch(function (error) {
            console.log('Failed to load font: ' + error)
        })
    });
}

function getFont(fontName) {
    switch (fontName) {
        case 'Kalam':
            return new FontFace('Kalam', 'url("./fonts/Kalam-Regular.ttf")');
        case 'Poppins':
            return new FontFace('Poppins', 'url("./fonts/Poppins-Regular.ttf")');
        case 'Athiti':
            return new FontFace('Athiti', 'url("./fonts/Athiti-Regular.ttf")');
        case 'MavenPro':
            return new FontFace('MavenPro', 'url("./fonts/MavenPro-Regular.ttf")');
        case 'Ubuntu':
            return new FontFace('Ubuntu', 'url("./fonts/Ubuntu-Regular.ttf")');
        case 'IstokWeb':
            return new FontFace('IstokWeb', 'url("./fonts/IstokWeb-Regular.ttf")');
        case 'Courgette':
            return new FontFace('Courgette', 'url("./fonts/Courgette-Regular.ttf")');
        case 'Quattrocento':
            return new FontFace('Quattrocento', 'url("./fonts/Quattrocento-Regular.ttf")');
        case 'DellaRespira':
            return new FontFace('DellaRespira', 'url("./fonts/DellaRespira-Regular.ttf")');
        case 'Lato':
            return new FontFace('Lato', 'url("./fonts/Lato-Regular.ttf")');
        case 'Martel':
            return new FontFace('Martel', 'url("./fonts/Martel-Regular.ttf")');
        case 'Lancelot':
            return new FontFace('Lancelot', 'url("./fonts/Lancelot-Regular.ttf")');
        case 'Playball':
            return new FontFace('Playball', 'url("./fonts/Playball-Regular.ttf")');
        case 'LifeSavers':
            return new FontFace('LifeSavers', 'url("./fonts/LifeSavers-Regular.ttf")');
        default:
            return new FontFace('Kalam', 'url("./fonts/Kalam-Regular.ttf")');
    }
}

export { setFontValues };