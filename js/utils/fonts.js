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
        title.style.fontFamily = `"${titleFontSelect.value}"`;
        subtitle.style.fontFamily = `"${subtitleFontSelect.value}"`;
    });
}

export { setFontValues };