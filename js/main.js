import { setFontValues } from './utils/fonts';
import { getRandomTheme } from './utils/themes';

/* ************** Elements ************** */

let headerImageContainer = document.querySelector('.header-image-container');
let headerImage = document.querySelector('#github-header-image');
let title = headerImage.querySelector('.title');
let subtitle = headerImage.querySelector('.subtitle');

let toolbox = document.querySelector('.toolbox');

/* ************** Options ************** */

let selectedTheme = 'github';

// Init
document.querySelector('.toolbox .size-inputs input#width-input').value = headerImageContainer.clientWidth;
let titleFontSelect = toolbox.querySelector('.font-selectors-container #title-font-selector');
let subtitleFontSelect = toolbox.querySelector('.font-selectors-container #subtitle-font-selector');
titleFontSelect.value='Red Hat Display';
subtitleFontSelect.value='Kalam';

// Demo reset after ended
document.querySelector('.how-to-section video.demo').onended = (e) => e.target.currentTime = 0;

/* ************** Header image buttons ************** */

// Download button
document.querySelector('.download-button')
    .addEventListener('click', () => {
        html2canvas(
            document.querySelector('#github-header-image'),
            {
                backgroundColor: null
                // widtH: (headerImage.clientWidth * 2),
                // height: (headerImage.style.height * 2)
            })
            .then(function (canvas) {
                // for testing 
                // document.body.before(canvas);

                let imageURL = canvas.toDataURL("image/png");
                let a = document.createElement("a");
                a.href = imageURL;
                a.download = 'github-header-image';
                a.click();
            });
    })

// Toogle Dark Mode button
document.querySelector('.dark-mode-button')
    .addEventListener('click', (e) => {
        let resultBox = document.querySelector('.result-box');
        const toogleDarkModeButton = document.querySelector('.dark-mode-button');

        resultBox.classList.toggle('light-mode');
        if (resultBox.className.includes('light')) {
            toogleDarkModeButton.innerText = 'Light Mode'
        } else {
            toogleDarkModeButton.innerText = 'Dark Mode'
        }
    });

/* ************** Randomize ************** */

document.querySelector('.randomize-button')
    .addEventListener('click', (e) => {
        const theme = getRandomTheme();

        // Background
        const mainTabBgColorSelector = document.querySelector('.color-selectors-container input#main-bg-color-selector');
        const backgroundTabBgColorSelector = document.querySelector('.bg-color-selectors input#background-bg-color-selector');
        mainTabBgColorSelector.value = theme.background;
        backgroundTabBgColorSelector.value = theme.background;
        headerImage.style.backgroundColor = theme.background;

        // Title
        const mainTabtitleColorSelector = document.querySelector('.color-selectors-container input#title-color-selector');
        mainTabtitleColorSelector.value = theme.title;
        title.style.color = theme.title;

        // Subtitle
        const mainTabSubtitleColorSelector = document.querySelector('.color-selectors-container input#subtitle-color-selector');
        mainTabSubtitleColorSelector.value = theme.subtitle;
        subtitle.style.color = theme.subtitle;

        // Borders
        const borderColorSelector = document.querySelector('.bg-color-selectors input#border-color-selector');
        const borderInput = document.querySelector('.border-inputs input#border-input');
        const borderRadiusInput = document.querySelector('.border-inputs input#border-radius-input');
        borderColorSelector.value = theme.border;
        borderInput.value = theme.borderSize;
        borderInput.nextElementSibling.value = theme.borderSize;
        borderRadiusInput.value = theme.borderRadius;
        borderRadiusInput.nextElementSibling.value = theme.borderRadius;
        headerImage.style.border = `solid ${borderColorSelector.value} ${borderInput.value}px`;
        headerImage.style.borderRadius = `${borderRadiusInput.value}px`;

        // Text Align
        document.querySelector(`.align-buttons button[data-align-value="${theme.textAlign}"]`).click();

        // Decoration
        const decorationSizeInput = document.querySelector('.decorations-size-inputs input#decoration-size-input');
        decorationSizeInput.value = theme.decorationSize;
        decorationSizeInput.nextElementSibling.value = theme.decorationSize;
        document.querySelector(`.decorations-buttons button[data-decoration-value="${theme.decoration}"]`).click();

        // Patterns
        const patternOpacityInput = document.querySelector('.pattern-inputs input#pattern-opacity-input');
        const patternColorSelector = document.querySelector('.pattern-inputs input#pattern-color-selector');
        patternOpacityInput.value = theme.patternOpacity
        patternOpacityInput.nextElementSibling.value = theme.patternOpacity
        patternColorSelector.value = theme.patternColor;
        document.querySelector(`.patterns-buttons button[data-pattern-value="${theme.pattern}"]`).click();

        // Fonts
        document.querySelector('.font-selectors-container #title-font-selector').value = theme.titleFont ?? 'Red Hat Display';
        document.querySelector('.font-selectors-container #subtitle-font-selector').value = theme.subtitleFont ?? 'Kalam';
        setFontValues();

    });

/* ************** ************** ************** */
