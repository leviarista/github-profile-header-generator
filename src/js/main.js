let headerImageContainer = document.querySelector('.header-image-container');
const headerImage = document.querySelector('#github-header-image');
// console.log(headerImage.clientWidth)
const title = headerImage.querySelector('.title');
const subtitle = headerImage.querySelector('.subtitle');

const toolbox = document.querySelector('.toolbox');


// Init

document.querySelector('.toolbox .size-inputs input#width-input').value = headerImageContainer.clientWidth;
// setInfoValues;
// setColorValues;

/* ************** Theme options ************** */

document.querySelectorAll('.theme-option')
    .forEach(button => {
        button.addEventListener('click', (e) => {
            console.log(e.target)
        });
    })

/* ************** Header image buttons ************** */

// Download button
document.querySelector('.download-button')
    .addEventListener('click', () => {
        html2canvas(
            document.querySelector('#github-header-image'),
            {
                // widtH: (headerImage.clientWidth * 2),
                // height: (headerImage.style.height * 2)
            })
            .then(function (canvas) {
                document.body.before(canvas);
                // var imageURL = canvas.toDataURL("image/png");
                // let a = document.createElement("a");
                // a.href = imageURL;
                // a.download = 'github-header-image';
                // a.click();
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
    let bgColorSelector = toolbox.querySelector('.color-selectors-container input#bg-color-selector');
    let titleColorSelector = toolbox.querySelector('.color-selectors-container input#title-color-selector');
    let subtitleColorSelector = toolbox.querySelector('.color-selectors-container input#subtitle-color-selector');

    headerImage.style.background = bgColorSelector.value;
    title.style.color = titleColorSelector.value;
    subtitle.style.color = subtitleColorSelector.value;
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
    let paddingsInput = toolbox.querySelector('.size-inputs input#paddings-input');

    if (Number(widthInput.value) > headerImageContainer.clientWidth) {
        headerImage.style.zoom = headerImageContainer.clientWidth / widthInput.value;
    } else {
        headerImage.style.zoom = 1;
    }
    headerImage.style.width = widthInput.value;
    headerImage.style.height = heightInput.value;
    headerImage.style.padding = paddingsInput.value;
}

toolbox.querySelectorAll('.size-inputs input')
    .forEach(input => {
        input.addEventListener('click', () => input.select());

        input.addEventListener('keyup', (e) => {
            setSizeValues();
        });
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






/* ************** ************** ************** */
