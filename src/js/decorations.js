/* ************** Elements ************** */

let headerImageContainer = document.querySelector('.header-image-container');
let headerImage = document.querySelector('#github-header-image');
let title = headerImage.querySelector('.title');
let subtitle = headerImage.querySelector('.subtitle');

let toolboxDecorations = document.querySelector('.toolbox-decorations');

/* ************** Decorations inputs ************** */

function setDecorationSize() {
    let selectedDecorationSize = toolboxDecorations.querySelector('.decorations-size-inputs input#decoration-size-input').value;

    const imageDecoration = document.querySelector('.img-decoration-container .img-decoration');
    imageDecoration.style.width = `${selectedDecorationSize}px`;

    const otherImageDecoration = document.querySelector('.img-decoration-container .img-decoration-2');
    if (otherImageDecoration) {
        otherImageDecoration.style.width = `${selectedDecorationSize}px`;
    }
}

toolboxDecorations.querySelectorAll('.decorations-size-inputs input[type="range"]')
    .forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.nextElementSibling.value = e.target.value
            setDecorationSize();
        });
    })

/* ************** Decorations ************** */

function setDecoration(decorationValue) {
    const imageDecoration = document.querySelector('.img-decoration-container .img-decoration');
    const otherImageDecoration = document.querySelector('.img-decoration-container .img-decoration-2');

    if (decorationValue === 'none') {
        imageDecoration.style.display = 'none';
        if (otherImageDecoration) {
            otherImageDecoration.style.display = 'none';
        }
    }
    else {
        imageDecoration.style.display = 'block';
        imageDecoration.src = `images/decorations/${decorationValue}`;
        if (otherImageDecoration) {
            otherImageDecoration.style.display = 'block';
            otherImageDecoration.src = `images/decorations/${decorationValue}`;
            }
    }
}

toolboxDecorations.querySelectorAll('.decorations-buttons button')
    .forEach(button => {
        button.addEventListener('click', (e) => {
            const element = e.target.tagName.toLowerCase() === 'img' ?
                e.target.parentNode :
                e.target;
            const decorationValue = element.getAttribute('data-decoration-value');
            setDecoration(decorationValue);
            setDecorationSize();
        });
    })

/* ************** ************** ************** */
