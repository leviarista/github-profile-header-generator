import { getMainElements } from "./elements";

const {
    bannerTitle,
    bannerSubtitle,
    toolbox,
} = getMainElements();

function setFontValues() {
    let titleFontSelect = toolbox.querySelector('.font-selectors-container #title-font-selector');
    let subtitleFontSelect = toolbox.querySelector('.font-selectors-container #subtitle-font-selector');

    document.fonts.ready.then(() => {
        bannerTitle.style.fontFamily = `"${titleFontSelect.value}"`;
        bannerSubtitle.style.fontFamily = `"${subtitleFontSelect.value}"`;
    });
}

export { setFontValues };