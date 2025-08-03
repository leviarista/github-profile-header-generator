import { getMainElements } from "./helpers/elements";

const {
    toolboxDecorations,
} = getMainElements();

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
    } else {
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

/* ************** Upload decoration ************** */

toolboxDecorations.querySelector('#decoration-upload-input')
    .addEventListener('change', () => {
        const file = toolboxDecorations.querySelector('#decoration-upload-input').files[0];

        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            const decoration = document.querySelector('.img-decoration');
            decoration.src = this.result;
            const otherDecoration = document.querySelector('.img-decoration-2');
            if (otherDecoration) otherDecoration.src = this.result;
        }
    })

/* ************** ************** ************** */
