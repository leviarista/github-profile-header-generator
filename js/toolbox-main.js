import { updateBanner } from './banner';
import { getMainElements } from './helpers/elements';

/* ************** Elements ************** */

const {
    bannerImageContainer,
    bannerImage,
    toolbox,
} = getMainElements();

/* ************** Info text inputs ************** */

toolbox.querySelectorAll('.text-inputs input')
    .forEach(input => {
        input.addEventListener('click', () => input.select());

        input.addEventListener('keyup', (e) => {
            let titleInput = toolbox.querySelector('.text-inputs input#title-input');
            let subtitleInput = toolbox.querySelector('.text-inputs input#subtitle-input');

            updateBanner({
                title: titleInput.value,
                subtitle: subtitleInput.value
            });
        });
    })

/* ************** Color selectors ************** */

function setColorValues() {
    let bgColorSelector = toolbox.querySelector('.color-selectors-container input#main-bg-color-selector');
    let titleColorSelector = toolbox.querySelector('.color-selectors-container input#title-color-selector');
    let subtitleColorSelector = toolbox.querySelector('.color-selectors-container input#subtitle-color-selector');

    updateBanner({
        background: bgColorSelector.value,
        titleColor: titleColorSelector.value,
        subtitleColor: subtitleColorSelector.value,
    });

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

    if (Number(widthInput.value) > bannerImageContainer.clientWidth) {
        bannerImage.style.zoom = bannerImageContainer.clientWidth / widthInput.value;
    } else {
        bannerImage.style.zoom = 1;
    }
    bannerImage.style.width = `${widthInput.value}px`;
    bannerImage.style.height = `${heightInput.value}px`;
}

function setPaddingValues() {
    let paddingInput = toolbox.querySelector('.size-inputs input#paddings-input');

    updateBanner({ padding: paddingInput.value });
}

toolbox.querySelectorAll('.size-inputs input')
    .forEach(input => {
        if (['width-input', 'height-input'].includes(input.id)) {
            input.addEventListener('click', () => input.select());

            input.addEventListener('keyup', (e) => {
                setSizeValues();
            });
        } else if (input.id = 'paddings-input') {
            input.addEventListener('input', (e) => {
                e.target.nextElementSibling.value = e.target.value
                setPaddingValues();
            });
        }
    })

/* ************** Align buttons ************** */

toolbox.querySelectorAll('.align-buttons button')
    .forEach(button => {
        button.addEventListener('click', (e) => {
            const element = e.target.tagName.toLowerCase() === 'img' ?
                e.target.parentNode :
                e.target;
            const alignValue = element.getAttribute('data-align-value');

            updateBanner({
                textAlign: alignValue
            });

        });
    })

/* ************** Font Selectors ************** */

toolbox.querySelectorAll('.font-selectors-container')
    .forEach(button => {
        button.addEventListener('change', (e) => {
            let titleFontSelect = toolbox.querySelector('.font-selectors-container #title-font-selector');
            let subtitleFontSelect = toolbox.querySelector('.font-selectors-container #subtitle-font-selector');

            updateBanner({
                titleFont: titleFontSelect.value,
                subtitleFont: subtitleFontSelect.value,
            });
        });
    })

/* ************** Font Size inputs ************** */

function setFontSizeValues() {
    let titleFontSizeInput = toolbox.querySelector('.font-size-inputs input#title-font-size-input');
    let subtitleFontSizeInput = toolbox.querySelector('.font-size-inputs input#subtitle-font-size-input');

    updateBanner({
        titleFontSize: titleFontSizeInput.value,
        subtitleFontSize: subtitleFontSizeInput.value,
    });
}

toolbox.querySelectorAll('.font-size-inputs input')
    .forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.nextElementSibling.value = e.target.value
            setFontSizeValues();
        });
    })

/* ************** ************** ************** */
