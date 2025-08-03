import { getMainElements } from './helpers/elements';
import { setFontValues } from './helpers/fonts';

/* ************** Elements ************** */

const {
    bannerImageContainer,
    bannerImage,
    bannerTitle,
    bannerSubtitle,
    toolbox,
} = getMainElements();

/* ************** Info text inputs ************** */

function setInfoValues() {
    let titleInput = toolbox.querySelector('.text-inputs input#title-input');
    let subtitleInput = toolbox.querySelector('.text-inputs input#subtitle-input');

    bannerTitle.innerText = titleInput.value || '';
    bannerSubtitle.innerText = subtitleInput.value || '';
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

    bannerImage.style.backgroundColor = bgColorSelector.value;
    bannerTitle.style.color = titleColorSelector.value;
    bannerSubtitle.style.color = subtitleColorSelector.value;

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
    let paddingValue = `${paddingInput.value}px`;

    bannerImage.style.padding = paddingValue;

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

// Github theme

let paddingValue = document.querySelector('#paddings-input').value || 25;
let padding = `${paddingValue}px`;

const imageDecorationContainer = document.querySelector('.img-decoration-container');
const imgDecorationElement = document.createElement('img');
imgDecorationElement.className = 'img-decoration';
imgDecorationElement.src = './images/decorations/my-octocat.png';
imgDecorationElement.style.position = 'absolute';
imgDecorationElement.style.bottom = 'calc(50%)';
imgDecorationElement.style.transform = 'translateY(50%)'
imgDecorationElement.style.left = 'auto';
imgDecorationElement.style.right = padding;
imgDecorationElement.style.width = '77px';
imgDecorationElement.alt = 'Header image decoration'
imageDecorationContainer.appendChild(imgDecorationElement)

toolbox.querySelectorAll('.align-buttons button')
    .forEach(button => {
        button.addEventListener('click', (e) => {
            const element = e.target.tagName.toLowerCase() === 'img' ?
                e.target.parentNode :
                e.target;
            const alignValue = element.getAttribute('data-align-value');
            bannerImage.style.alignItems = alignValue;

            const paddingValue = document.querySelector('#paddings-input').value || 25;
            const padding = `${paddingValue}px`;
            const imageDecoration = document.querySelector('.img-decoration-container img');
            if (alignValue === 'flex-end') {
                document.querySelector('.img-decoration-container .img-decoration-2')?.remove();
                imageDecoration.style.left = padding;
                imageDecoration.style.right = 'auto';
            } else if (alignValue === 'flex-start') {
                document.querySelector('.img-decoration-container .img-decoration-2')?.remove();
                imageDecoration.style.left = 'auto';
                imageDecoration.style.right = padding;
            } else if (alignValue === 'center') {
                imageDecoration.style.left = 'auto';
                imageDecoration.style.right = padding;
                if (!document.querySelector('.img-decoration-container .img-decoration-2')) {
                    const clonedImageDecoration = imageDecoration.cloneNode(true);
                    clonedImageDecoration.style.left = padding;
                    clonedImageDecoration.style.right = 'auto';
                    clonedImageDecoration.className = 'img-decoration-2';
                    imageDecorationContainer.appendChild(clonedImageDecoration)
                }
            }
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

    bannerTitle.style.fontSize = `${titleFontSizeInput.value}px`;
    bannerSubtitle.style.fontSize = `${subtitleFontSizeInput.value}px`;
}

toolbox.querySelectorAll('.font-size-inputs input')
    .forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.nextElementSibling.value = e.target.value
            setFontSizeValues();
        });
    })

/* ************** ************** ************** */
