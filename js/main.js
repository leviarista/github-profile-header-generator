import { setFontValues } from './utils/fonts';
import { getRandomTheme } from './utils/themes';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import domtoimage from 'dom-to-image';

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
titleFontSelect.value = 'Red Hat Display';
subtitleFontSelect.value = 'Kalam';

// Demo reset after ended
document.querySelector('.how-to-section video.demo').onended = (e) => e.target.currentTime = 0;

/* ************** Header image buttons ************** */

// Download button
// document.querySelector('.download-button')
//     .addEventListener('click', () => {
//         html2canvas(
//             document.querySelector('#github-header-image'),
//             {
//                 // removeContainer: true,
//                 // backgroundColor: null,
//                 letterRendering: true,
//                 // logging: true,
//                 // useCORS: true,
//                 foreignObjectRendering: false,
//                 // onclone: (document, element) => {
//                 //     // const title = element.querySelector('.title').style.letterSpacing = '0.10rem';
//                 //     const title = element.querySelector('.title')
//                 //     if (getComputedStyle(title).getPropertyValue("font-family") === 'Ubuntu') {
//                 //         title.style.letterSpacing = '1px';
//                 //     }
//                 //     if (getComputedStyle(title).getPropertyValue("font-family") === 'Martel') {
//                 //         title.style.letterSpacing = '2px';
//                 //     }
//                 //     if (getComputedStyle(title).getPropertyValue("font-family") === 'MavenPro') {
//                 //         title.style.letterSpacing = '0.2rem';
//                 //     }
//                 //     // title.style.letterSpacing = '2px';
//                 //     // console.log("🚀 ~ title:", title)
//                 //     // const title = element.querySelector('.subtitle').style.style.letterSpacing = '5px';
//                 // }
//                 // widtH: (headerImage.clientWidth * 2),
//                 // height: (headerImage.style.height * 2)
//             })
//             .then(function (canvas) {
//                 // for testing 
//                 const container = document.querySelector('.header-image-container')

//                 const prevImage = container.children[1];
//                 if (prevImage) container.removeChild(prevImage);

//                 container.appendChild(canvas);

//                 // let imageURL = canvas.toDataURL("image/png");
//                 // let a = document.createElement("a");
//                 // a.href = imageURL;
//                 // a.download = 'github-header-image';
//                 // a.click();
//             });
//     })

// document.querySelector('.download-button')
//     .addEventListener('click', () => {
//         htmlToImage
//             .toPng(document.querySelector('#github-header-image'))
//             .then((dataUrl) => {
//                 const img = new Image();
//                 img.src = dataUrl;
//                 img.width = 900
//                 document.querySelector('.header-image-container').appendChild(img);
//             })
//             .catch((err) => {
//                 console.error('oops, something went wrong!', err);
//             });
//     })

document.querySelector('.download-button')
    .addEventListener('click', async () => {
        document.querySelector('.download-button img').src = './images/icons/loading.gif'

        try {
            const el = document.querySelector('#github-header-image');

            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Running on localhost! Appending image instead of downloading ...');
                const png = await snapdom.toPng(el, { embedFonts: true });
                const container = document.querySelector('.header-image-container')

                const prevImage = container.children[1];
                if (prevImage) container.removeChild(prevImage);

                container.appendChild(png);
            } else {
                await snapdom.download(el, {
                    embedFonts: true,
                    format: 'png',
                    filename: 'github-header-banner',
                    scale: 2
                });
            }
            document.querySelector('.download-button img').src = './images/icons/download.svg'
        } catch (error) {
            console.error('Image capture or download failed:', error);
        }
    })

// document.addEventListener("DOMContentLoaded", (event) => {
//     const displayButton = document.querySelector('.display-button');

//     if (displayButton && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
//         displayButton.style.display = "block"; // or "flex", "grid", etc.
//         console.log('Running on localhost! display appending image option  ...');

//         document.querySelector('.display-button')
//             .addEventListener('click', async () => {
//                 const el = document.querySelector('#github-header-image');
//                 const png = await snapdom.toPng(el, { embedFonts: true });
//                 const container = document.querySelector('.header-image-container')

//                 const prevImage = container.children[1];
//                 if (prevImage) container.removeChild(prevImage);

//                 container.appendChild(png);
//             })
//     }

// });


// document.querySelector('.download-button')
//     .addEventListener('click', () => {
//         var node = document.getElementById('github-header-image');

//         domtoimage.toPng(node)
//             .then(function (dataUrl) {
//                 console.log("🚀 ~ dataUrl:", dataUrl)
//                 var img = new Image();
//                 img.src = dataUrl;
//                 document.querySelector('.header-image-container').appendChild(img);
//             })
//             .catch(function (error) {
//                 console.error('oops, something went wrong!', error);
//             });
//     })

// Toogle Dark Mode button
document.querySelector('.dark-mode-button')
    .addEventListener('click', (e) => {
        let resultBox = document.querySelector('.result-box');
        const toogleDarkModeButton = document.querySelector('.dark-mode-button');
        const toogleRandomizeButton = document.querySelector('.randomize-button');
        const toogleDownloadButton = document.querySelector('.download-button');

        const size = 20;

        resultBox.classList.toggle('light-mode');
        if (resultBox.className.includes('light')) {
            toogleDarkModeButton.innerHTML = `<img src="./images/icons/light-dark-black.svg" width="${size}" />GH Light`
            toogleRandomizeButton.innerHTML = `<img src="./images/icons/random-black.svg" width="${size}" />Random`
            toogleDownloadButton.innerHTML = `<img src="./images/icons/download.svg" width="${size}" />Download`
        } else {
            toogleDarkModeButton.innerHTML = `<img src="./images/icons/light-dark.svg" width="${size}" />GH Dark`
            toogleRandomizeButton.innerHTML = `<img src="./images/icons/random.svg" width="${size}" />Random`
            toogleDownloadButton.innerHTML = `<img src="./images/icons/download.svg" width="${size}" />Download`
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
