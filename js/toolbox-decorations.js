import { updateBanner } from "./banner";
import { getMainElements } from "./helpers/elements";
import { saveImageOnLocalStorage } from "./helpers/helpers";

/* ************** Elements ************** */

const {
    toolboxDecorations,
} = getMainElements();

/* ************** Decorations inputs ************** */

function setDecorationSize() {
    let selectedDecorationSize = toolboxDecorations.querySelector('.decorations-size-inputs input#decoration-size-input').value;

    updateBanner({
        decorationSize: selectedDecorationSize,
    });
}

toolboxDecorations.querySelectorAll('.decorations-size-inputs input[type="range"]')
    .forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.nextElementSibling.value = e.target.value
            setDecorationSize();
        });
    })

/* ************** Decorations ************** */

toolboxDecorations.querySelectorAll('.decorations-buttons button')
    .forEach(button => {
        button.addEventListener('click', (e) => {
            const element = e.target.tagName.toLowerCase() === 'img' ?
                e.target.parentNode :
                e.target;
            const decorationValue = element.getAttribute('data-decoration-value');
            updateBanner({
                decoration: decorationValue,
                decorationLocal: false
            });
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
            updateBanner({
                decoration: this.result,
                decorationLocal: true
            });

            const decoration = document.querySelector('.img-decoration');
            saveImageOnLocalStorage(decoration);
        }
    })

/* ************** ************** ************** */
