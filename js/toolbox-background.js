import { getPatternDefaultSize } from './data/patterns';
import { updateBanner } from './helpers/helpers';
import { getMainElements } from './helpers/elements';

/* ************** Elements ************** */

const {
    toolboxBackground,
} = getMainElements();

// init
let selectedPattern = 'bubbles';
let selectedPatternOpacity = 0.15;
let selectedPatternColor = 'FFF';
let selectedPatternSize = 200;
setPatternBackground();

/* ************** Color selectors ************** */

function setBgColorValues() {
    let bgColorSelector = toolboxBackground.querySelector('.bg-color-selectors input#background-bg-color-selector');
    let borderColorSelector = toolboxBackground.querySelector('.bg-color-selectors input#border-color-selector');

    updateBanner({
        background: bgColorSelector.value,
        borderColor: borderColorSelector.value,
    })

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

    updateBanner({
        borderColor: borderColorSelector.value,
        borderSize: borderInput.value,
        borderRadius: borderRadiusInput.value
    });
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
    const selectedPatternColor = toolboxBackground.querySelector('.pattern-inputs input#pattern-color-selector').value;

    updateBanner({
        pattern: selectedPattern,
        patternColor: selectedPatternColor,
        patternOpacity: selectedPatternOpacity,
        patternSize: selectedPatternSize
    });
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
    selectedPatternSize = getPatternDefaultSize(patternValue);
    toolboxBackground.querySelector('.pattern-inputs #pattern-size-input').value = selectedPatternSize;
    toolboxBackground.querySelector('.pattern-inputs #pattern-size-input').nextElementSibling.innerHTML = selectedPatternSize;
}

/* ************** ************** ************** */