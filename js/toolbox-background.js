import { getBackgroundSvg } from './data/patterns';

/* ************** Elements ************** */

let bannerImageContainer = document.querySelector('.header-image-container');
let bannerImage = document.querySelector('#github-header-image');
let title = bannerImage.querySelector('.title');
let subtitle = bannerImage.querySelector('.subtitle');

let toolboxBackground = document.querySelector('.toolbox-background');

// init
let selectedPattern = 'bubbles';
let selectedPatternOpacity = 0.15;
let selectedPatternColor = 'FFF';
let selectedPatternSize = '200px';
setPatternBackground();

/* ************** Set theme button ************** */

// document.querySelector('.log-theme-button').addEventListener('click', () => {
//     let obj = `   {background: '${document.querySelector('.color-selectors-container input#main-bg-color-selector').value}', title: '${document.querySelector('.color-selectors-container input#title-color-selector').value}', subtitle: '${document.querySelector('.color-selectors-container input#subtitle-color-selector').value}', border: '${document.querySelector('.bg-color-selectors input#border-color-selector').value}', borderSize: ${document.querySelector('.border-inputs input#border-input').value}, borderRadius: ${document.querySelector('.border-inputs input#border-radius-input').value}, textAlign: '${bannerImage.style.alignItems}', decoration: '${document.querySelector('.img-decoration-container img').src.split('/').pop().replace('.png', '')}.png', decorationSize: ${document.querySelector('.decorations-size-inputs input#decoration-size-input').value}, pattern: '${selectedPattern}', patternColor: '${document.querySelector('.pattern-inputs input#pattern-color-selector').value}', patternOpacity: ${document.querySelector('.pattern-inputs input#pattern-opacity-input').value}, titleFont: '${document.querySelector('.font-selectors-container #title-font-selector').value}', subtitleFont: '${document.querySelector('.font-selectors-container #subtitle-font-selector').value}'},    `;
//     console.log(JSON.stringify(obj).replaceAll('\"', '\''))
// })

/* ************** Color selectors ************** */

function setBgColorValues() {
    let bgColorSelector = toolboxBackground.querySelector('.bg-color-selectors input#background-bg-color-selector');
    let borderColorSelector = toolboxBackground.querySelector('.bg-color-selectors input#border-color-selector');

    bannerImage.style.backgroundColor = bgColorSelector.value;
    bannerImage.style.borderColor = borderColorSelector.value;

    let mainTabBgColorSelector = document.querySelector('.color-selectors-container input#main-bg-color-selector');
    mainTabBgColorSelector.value = bgColorSelector.value;
}

toolboxBackground.querySelectorAll('.bg-color-selectors input')
    .forEach(input => {
        input.addEventListener('input', (e) => {
            setBgColorValues();
        });
    })

/* ************** Border Inputs ************** */

function setBorderValues() {
    let borderInput = toolboxBackground.querySelector('.border-inputs input#border-input');
    let borderRadiusInput = toolboxBackground.querySelector('.border-inputs input#border-radius-input');
    let borderColorSelector = toolboxBackground.querySelector('.bg-color-selectors input#border-color-selector');

    bannerImage.style.border = `solid ${borderColorSelector.value} ${borderInput.value}px`;
    bannerImage.style.borderRadius = `${borderRadiusInput.value}px`;
}

toolboxBackground.querySelectorAll('.border-inputs input')
    .forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.nextElementSibling.value = e.target.value
            setBorderValues();
        });
    })

/* ************** Pattern inputs ************** */

function setPatternValues() {
    selectedPatternOpacity = toolboxBackground.querySelector('.pattern-inputs input#pattern-opacity-input').value;
    selectedPatternSize = toolboxBackground.querySelector('.pattern-inputs input#pattern-size-input').value;
}

toolboxBackground.querySelectorAll('.pattern-inputs input[type="range"]')
    .forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.nextElementSibling.value = e.target.value
            setPatternValues();
            setPatternBackground();
        });
    })

toolboxBackground.querySelectorAll('.pattern-inputs input[type="color"]')
    .forEach(input => {
        input.addEventListener('input', (e) => {
            setPatternBackground();
        });
    })

/* ************** Patterns ************** */

function setPatternBackground() {
    const patternColor = toolboxBackground.querySelector('.pattern-inputs input#pattern-color-selector').value;
    selectedPatternColor = patternColor.replace('#', '');

    bannerImage.style.backgroundImage = getBackgroundSvg(selectedPattern, selectedPatternColor, selectedPatternOpacity);
    bannerImage.style.backgroundSize = `${selectedPatternSize}px`;
}

toolboxBackground.querySelectorAll('.patterns-buttons button')
    .forEach(button => {
        button.addEventListener('click', (e) => {
            const element = e.target.tagName.toLowerCase() === 'img' ?
                e.target.parentNode :
                e.target;
            const patternValue = element.getAttribute('data-pattern-value');
            selectedPattern = patternValue;
            setPatternDefaultSize(patternValue);
            setPatternValues();
            setPatternBackground();
        });
    })

function setPatternDefaultSize(patternValue) {
    switch (patternValue) {
        case 'jigsaw':
            selectedPatternSize = 100;
            break;
        case 'github':
            selectedPatternSize = 40;
            break;
        case 'endless-constellation':
            selectedPatternSize = 250;
            break;
        case 'floating-cogs':
            selectedPatternSize = 350;
            break;
        case 'bubbles':
            selectedPatternSize = 200;
            break;
        case 'random-shapes':
            selectedPatternSize = 80;
            break;
        case 'lisbon':
            selectedPatternSize = 80;
            break;
        case 'temple':
            selectedPatternSize = 100;
            break;
        case 'topography':
            selectedPatternSize = 500;
            break;
        case 'falling-triangles':
            selectedPatternSize = 36;
            break;
        case 'glamorous':
            selectedPatternSize = 135;
            break;
        case 'i-like-food':
            selectedPatternSize = 225;
            break;
        case 'leaf':
            selectedPatternSize = 80;
            break;
        case 'circuit-board':
            selectedPatternSize = 304;
            break;
        case 'overlapping-circles':
            selectedPatternSize = 80;
            break;
        case 'endless-clouds':
            selectedPatternSize = 112;
            break;
        default:
            selectedPatternSize = 100;
            break;
    }
    toolboxBackground.querySelector('.pattern-inputs #pattern-size-input').value = selectedPatternSize;
    toolboxBackground.querySelector('.pattern-inputs #pattern-size-input').nextElementSibling.innerHTML = selectedPatternSize;
}

/* ************** ************** ************** */