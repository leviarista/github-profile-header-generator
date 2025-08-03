import themes from "../data/themes.json";
import { getMainElements } from "./elements";

const {
    bannerImageContainer,
    bannerImage,
    bannerTitle,
    bannerSubtitle,
    toolbox,
    toolboxDecorations,
    toolboxBackground,
} = getMainElements();

function getAllThemes() {
    return themes
}

function getTheme(index) {
    return themes[index]
}

function getRandomTheme() {
    let random = Math.floor(Math.random() * themes.length);
    return themes[random];
}

function updateBanner({
    background,
    titleColor,
    subtitleColor,
    borderColor,
    borderSize,
    borderRadius,
    textAlign,
    decoration,
    decorationSize,
    pattern,
    patternColor,
    patternOpacity,
    titleFont,
    subtitleFont
}) {
    if (background) bannerImage.style.backgroundColor = background;
    if (titleColor) bannerTitle.style.color = titleColor;
    if (subtitleColor) bannerSubtitle.style.color = subtitleColor;
    if (borderColor || borderSize || borderRadius) {
        bannerImage.style.border = `solid ${borderColor} ${borderSize}px`;
        bannerImage.style.borderRadius = `${borderRadius}px`;
    }
    if (textAlign)
        document.querySelector(`.align-buttons button[data-align-value="${textAlign}"]`).click();
    if (decoration)
        document.querySelector(`.decorations-buttons button[data-decoration-value="${decoration}"]`).click();
    if (decorationSize) { }
    if (pattern) {
        document.querySelector(`.patterns-buttons button[data-pattern-value="${pattern}"]`).click();
    }
    if (patternColor || patternOpacity) {
    }
    if (titleFont || subtitleFont) {
        document.fonts.ready.then(() => {
            bannerTitle.style.fontFamily = `"${titleFont}"`;
            bannerSubtitle.style.fontFamily = `"${subtitleFont}"`;
        });
    }
}

function updateUIOptions({
    background,
    titleColor,
    subtitleColor,
    borderColor,
    borderSize,
    borderRadius,
    textAlign,
    decoration,
    decorationSize,
    pattern,
    patternColor,
    patternOpacity,
    titleFont,
    subtitleFont
}) {
    if (background) {
        const mainTabBgColorSelector = document.querySelector('.color-selectors-container input#main-bg-color-selector');
        const backgroundTabBgColorSelector = document.querySelector('.bg-color-selectors input#background-bg-color-selector');
        mainTabBgColorSelector.value = background;
        backgroundTabBgColorSelector.value = background;
    }
    if (titleColor) {
        const mainTabtitleColorSelector = document.querySelector('.color-selectors-container input#title-color-selector');
        mainTabtitleColorSelector.value = titleColor;
    }
    if (subtitleColor) {
        const mainTabSubtitleColorSelector = document.querySelector('.color-selectors-container input#subtitle-color-selector');
        mainTabSubtitleColorSelector.value = subtitleColor;
    }
    if (borderColor || borderSize || borderRadius) {
        const borderColorSelector = document.querySelector('.bg-color-selectors input#border-color-selector');
        const borderInput = document.querySelector('.border-inputs input#border-input');
        const borderRadiusInput = document.querySelector('.border-inputs input#border-radius-input');
        borderColorSelector.value = borderColor;
        borderInput.value = borderSize;
        borderInput.nextElementSibling.value = borderSize;
        borderRadiusInput.value = borderRadius;
        borderRadiusInput.nextElementSibling.value = borderRadius;
    }
    if (textAlign) { }
    if (decoration) { }
    if (decorationSize) {
        const decorationSizeInput = document.querySelector('.decorations-size-inputs input#decoration-size-input');
        decorationSizeInput.value = decorationSize;
        decorationSizeInput.nextElementSibling.value = decorationSize;
    }
    if (pattern) {

    }
    if (patternColor || patternOpacity) {
        const patternOpacityInput = document.querySelector('.pattern-inputs input#pattern-opacity-input');
        const patternColorSelector = document.querySelector('.pattern-inputs input#pattern-color-selector');
        patternOpacityInput.value = patternOpacity
        patternOpacityInput.nextElementSibling.value = patternOpacity
        patternColorSelector.value = patternColor;
    }
    if (titleFont || subtitleFont) {
        document.querySelector('.font-selectors-container #title-font-selector').value = titleFont ?? 'Red Hat Display';
        document.querySelector('.font-selectors-container #subtitle-font-selector').value = subtitleFont ?? 'Kalam';
    }
}

function setTheme(theme) {
    logTheme(theme);
    updateUIOptions(theme);
    updateBanner(theme);
}

function logTheme(theme) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(theme);
        console.table(theme);
    }
}

export { getAllThemes, getTheme, getRandomTheme, setTheme };