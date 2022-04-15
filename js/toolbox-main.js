import { setFontValues } from './utils/fonts';

/* ************** Elements ************** */

let headerImageContainer = document.querySelector('.header-image-container');
let headerImage = document.querySelector('#github-header-image');
let title = headerImage.querySelector('.title');
let subtitle = headerImage.querySelector('.subtitle');

let toolbox = document.querySelector('.toolbox');

/* ************** Info text inputs ************** */

function setInfoValues() {
    let titleInput = toolbox.querySelector('.text-inputs input#title-input');
    let subtitleInput = toolbox.querySelector('.text-inputs input#subtitle-input');

    title.innerText = titleInput.value || '';
    subtitle.innerText = subtitleInput.value || '';
}

toolbox.querySelectorAll('.text-inputs input')
    .forEach(input => {
        input.addEventListener('click', () => input.select());

        input.addEventListener('keyup', (e) => {
            setInfoValues();
        });
    })

/* ************** Color selectors ************** */

function setColorValues() {
    let bgColorSelector = toolbox.querySelector('.color-selectors-container input#main-bg-color-selector');
    let titleColorSelector = toolbox.querySelector('.color-selectors-container input#title-color-selector');
    let subtitleColorSelector = toolbox.querySelector('.color-selectors-container input#subtitle-color-selector');

    headerImage.style.backgroundColor = bgColorSelector.value;
    title.style.color = titleColorSelector.value;
    subtitle.style.color = subtitleColorSelector.value;

    let backgroundTabBgColorSelector = document.querySelector('.bg-color-selectors input#background-bg-color-selector');
    backgroundTabBgColorSelector.value = bgColorSelector.value;
}

toolbox.querySelectorAll('.color-selectors-container input')
    .forEach(input => {
        input.addEventListener('input', (e) => {
            setColorValues();
        });
    })

/* ************** Size inputs ************** */

function setSizeValues() {
    let widthInput = toolbox.querySelector('.size-inputs input#width-input');
    let heightInput = toolbox.querySelector('.size-inputs input#height-input');

    if (Number(widthInput.value) > headerImageContainer.clientWidth) {
        headerImage.style.zoom = headerImageContainer.clientWidth / widthInput.value;
    } else {
        headerImage.style.zoom = 1;
    }
    headerImage.style.width = `${widthInput.value}px`;
    headerImage.style.height = `${heightInput.value}px`;
}

function setPaddingValues() {
    let paddingInput = toolbox.querySelector('.size-inputs input#paddings-input');
    let paddingValue = `${paddingInput.value}px`;

    headerImage.style.padding = paddingValue;

    document.querySelectorAll('.img-decoration-container img')
        .forEach(decoration => {
            if (decoration.style.left === 'auto') {
                decoration.style.right = paddingValue;
            } else {
                decoration.style.left = paddingValue;
            }
        });
}

toolbox.querySelectorAll('.size-inputs input')
    .forEach(input => {
        if (input.type === 'text') {
            input.addEventListener('click', () => input.select());

            input.addEventListener('keyup', (e) => {
                setSizeValues();
            });
        } else {
            input.addEventListener('input', (e) => {
                e.target.nextElementSibling.value = e.target.value
                setPaddingValues();
            });
        }
    })

/* ************** Align buttons ************** */

function setAlignValues(alignValue) {
    headerImage.style.alignItems = alignValue;
}

toolbox.querySelectorAll('.align-buttons button')
    .forEach(button => {
        button.addEventListener('click', (e) => {
            const element = e.target.tagName.toLowerCase() === 'img' ?
                e.target.parentNode :
                e.target;
            const alignValue = element.getAttribute('data-align-value');
            setAlignValues(alignValue);
        });
    })

/* ************** Font Selectors ************** */

toolbox.querySelectorAll('.font-selectors-container')
    .forEach(button => {
        button.addEventListener('change', (e) => {
            setFontValues();
        });
    })

/* ************** Font Size inputs ************** */

function setFontSizeValues() {
    let titleFontSizeInput = toolbox.querySelector('.font-size-inputs input#title-font-size-input');
    let subtitleFontSizeInput = toolbox.querySelector('.font-size-inputs input#sutitle-font-size-input');

    title.style.fontSize = `${titleFontSizeInput.value}px`;
    subtitle.style.fontSize = `${subtitleFontSizeInput.value}px`;
}

toolbox.querySelectorAll('.font-size-inputs input')
    .forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.nextElementSibling.value = e.target.value
            setFontSizeValues();
        });
    })

/* ************** ************** ************** */
