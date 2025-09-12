import { getPattern } from './data/patterns';
import { getMainElements } from "./helpers/elements";
import { isLocalDevelopment } from './helpers/helpers';

const {
    bannerImage,
    bannerTitle,
    bannerSubtitle,
    toolbox,
    toolboxDecorations,
    toolboxBackground,
} = getMainElements();

function updateBanner(theme) {
    console.table(theme);
    console.log('•ᴗ• Updating Banner ...');
    applyTheme(theme);
    if (!theme.ignoreSave) saveTheme(theme);
}

function applyTheme({
    padding,
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
    patternSize,
    titleFont,
    subtitleFont,
    titleFontSize,
    subtitleFontSize,
    title,
    subtitle,
    decorationLocal = false
}) {
    if (padding) {
        let paddingValue = `${padding}px`;
        bannerImage.style.padding = paddingValue;

        document.querySelectorAll('.img-decoration-container img')
            .forEach(dec => {
                if (dec.style.left === 'auto')
                    dec.style.right = paddingValue;
                else
                    dec.style.left = paddingValue;
            });
    }
    if (background) bannerImage.style.backgroundColor = background;
    if (titleColor) bannerTitle.style.color = titleColor;
    if (subtitleColor) bannerSubtitle.style.color = subtitleColor;
    if (borderColor && borderSize && borderRadius) {
        bannerImage.style.border = `solid ${borderColor} ${borderSize}px`;
        bannerImage.style.borderRadius = `${borderRadius}px`;
    }
    if (borderColor) bannerImage.style.borderColor = borderColor;
    if (textAlign) {
        bannerImage.style.alignItems = textAlign;

        // const paddingValue = document.querySelector('#paddings-input').value || 25;
        const paddingValue = padding || 25;
        const paddingPx = `${paddingValue}px`;
        const imageDecoration = document.querySelector('.img-decoration-container img');
        if (textAlign === 'flex-end') {
            document.querySelector('.img-decoration-container .img-decoration-2')?.remove();
            imageDecoration.style.left = paddingPx;
            imageDecoration.style.right = 'auto';
        } else if (textAlign === 'flex-start') {
            document.querySelector('.img-decoration-container .img-decoration-2')?.remove();
            imageDecoration.style.left = 'auto';
            imageDecoration.style.right = paddingPx;
        } else if (textAlign === 'center') {
            imageDecoration.style.left = 'auto';
            imageDecoration.style.right = paddingPx;
            if (!document.querySelector('.img-decoration-container .img-decoration-2')) {
                const clonedImageDecoration = imageDecoration.cloneNode(true);
                clonedImageDecoration.style.left = paddingPx;
                clonedImageDecoration.style.right = 'auto';
                clonedImageDecoration.className = 'img-decoration-2';
                const imageDecorationContainer = document.querySelector('.img-decoration-container');
                imageDecorationContainer.appendChild(clonedImageDecoration)
            }
        }
    }
    if (decoration) {
        const imageDecoration = bannerImage.querySelector('.img-decoration-container .img-decoration');
        const otherImageDecoration = bannerImage.querySelector('.img-decoration-container .img-decoration-2');

        if (decoration === 'none') {
            imageDecoration.style.display = 'none';
            if (otherImageDecoration)
                otherImageDecoration.style.display = 'none';
        } else {
            let imageSrc = decorationLocal ? decoration : `images/decorations/${decoration}`;

            imageDecoration.style.display = 'block';
            imageDecoration.src = imageSrc;
            if (otherImageDecoration) {
                otherImageDecoration.style.display = 'block';
                otherImageDecoration.src = imageSrc;
            }
        }
    }
    if (decorationSize) {
        const imageDecoration = bannerImage.querySelector('.img-decoration-container .img-decoration');
        const otherImageDecoration = bannerImage.querySelector('.img-decoration-container .img-decoration-2');

        imageDecoration.style.width = `${decorationSize}px`;
        if (otherImageDecoration)
            otherImageDecoration.style.width = `${decorationSize}px`;
    }
    if (pattern || patternColor || patternOpacity || patternSize) {
        bannerImage.style.backgroundImage = getPattern(pattern, patternColor.replace('#', ''), patternOpacity);
        bannerImage.style.backgroundSize = `${patternSize}px`;
    }
    if (titleFont && subtitleFont) {
        // document.fonts.ready.then(() => {
        bannerTitle.style.fontFamily = `"${titleFont}"`;
        bannerSubtitle.style.fontFamily = `"${subtitleFont}"`;
        // });
    }
    if (titleFontSize || subtitleFontSize) {
        bannerTitle.style.fontSize = `${titleFontSize}px`;
        bannerSubtitle.style.fontSize = `${subtitleFontSize}px`;
    }
    if (title || subtitle) {
        bannerTitle.innerText = title || '';
        bannerSubtitle.innerText = subtitle || '';
    }
}

function saveTheme(theme) {
    console.log('•ᴗ• Saving theme ...')
    // if (!theme.persistText) {
    //     delete theme['title'];
    //     delete theme['subtitle'];
    // }
    const oldTheme = JSON.parse(localStorage.getItem('theme'));
    let newTheme;
    if (oldTheme) {
        newTheme = { ...oldTheme, ...theme };
    } else {
        newTheme = theme;
    }
    localStorage.setItem('theme', JSON.stringify(newTheme));

    if (isLocalDevelopment) {
        // console.log(theme);
        console.table(newTheme);
    }
}

function updateUIOptions({
    padding = 25,
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
    patternSize,
    patternOpacity,
    titleFont,
    subtitleFont,
    titleFontSize = 40,
    subtitleFontSize = 20,
    title,
    subtitle
}) {
    console.log('•ᴗ• Updating UI Options ...')

    if (padding) {
        const paddingInput = document.querySelector('#paddings-input');
        paddingInput.value = padding;
        paddingInput.nextElementSibling.value = padding;
    }
    if (background) {
        const mainTabBgColorSelector = document.querySelector('.color-selectors-container input#main-bg-color-selector');
        const backgroundTabBgColorSelector = document.querySelector('.bg-color-selectors input#background-bg-color-selector');
        mainTabBgColorSelector.value = background;
        backgroundTabBgColorSelector.value = background;
    }
    if (titleColor) {
        const mainTabtitleColorSelector = toolbox.querySelector('.color-selectors-container input#title-color-selector');
        mainTabtitleColorSelector.value = titleColor;
    }
    if (subtitleColor) {
        const mainTabSubtitleColorSelector = toolbox.querySelector('.color-selectors-container input#subtitle-color-selector');
        mainTabSubtitleColorSelector.value = subtitleColor;
    }
    if (borderColor || borderSize || borderRadius) {
        const borderColorSelector = toolboxBackground.querySelector('.bg-color-selectors input#border-color-selector');
        const borderInput = toolboxBackground.querySelector('.border-inputs input#border-input');
        const borderRadiusInput = toolboxBackground.querySelector('.border-inputs input#border-radius-input');
        borderColorSelector.value = borderColor;
        borderInput.value = borderSize;
        borderInput.nextElementSibling.value = borderSize;
        borderRadiusInput.value = borderRadius;
        borderRadiusInput.nextElementSibling.value = borderRadius;
    }
    if (textAlign) { }
    if (decoration) { }
    if (decorationSize) {
        const decorationSizeInput = toolboxDecorations.querySelector('.decorations-size-inputs input#decoration-size-input');
        decorationSizeInput.value = decorationSize;
        decorationSizeInput.nextElementSibling.value = decorationSize;
    }
    if (pattern) { }
    if (patternSize) {
        const patternSizeInput = toolboxBackground.querySelector('.pattern-inputs input#pattern-size-input');
        patternSizeInput.value = patternSize;
        patternSizeInput.nextElementSibling.value = patternSize;

    }
    if (patternColor || patternOpacity) {
        const patternOpacityInput = toolboxBackground.querySelector('.pattern-inputs input#pattern-opacity-input');
        const patternColorSelector = toolboxBackground.querySelector('.pattern-inputs input#pattern-color-selector');
        patternOpacityInput.value = patternOpacity
        patternOpacityInput.nextElementSibling.value = patternOpacity
        patternColorSelector.value = patternColor;
    }
    if (titleFont || subtitleFont) {
        toolbox.querySelector('.font-selectors-container #title-font-selector').value = titleFont ?? 'Red Hat Display';
        toolbox.querySelector('.font-selectors-container #subtitle-font-selector').value = subtitleFont ?? 'Kalam';
    }
    if (titleFontSize || subtitleFontSize) {
        const titleFontSizeInput = toolbox.querySelector('.font-size-inputs input#title-font-size-input');
        titleFontSizeInput.value = titleFontSize;
        titleFontSizeInput.nextElementSibling.value = titleFontSize;

        const subtitleFontSizeInput = toolbox.querySelector('.font-size-inputs input#subtitle-font-size-input');
        subtitleFontSizeInput.value = subtitleFontSize;
        subtitleFontSizeInput.nextElementSibling.value = subtitleFontSize;
    }
    if (title || subtitle) {
        toolbox.querySelector('.text-inputs input#title-input').value = title;
        toolbox.querySelector('.text-inputs input#subtitle-input').value = subtitle;
    }
}

function getSavedThemeProp(prop) {
    if (!prop) return '';
    const theme = JSON.parse(localStorage.getItem('theme'));
    return theme[prop];
}

export {
    updateBanner,
    updateUIOptions,
    getSavedThemeProp
};
