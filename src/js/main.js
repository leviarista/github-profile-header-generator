/* ************** Elements ************** */

var headerImageContainer = document.querySelector('.header-image-container');
var headerImage = document.querySelector('#github-header-image');
var title = headerImage.querySelector('.title');
var subtitle = headerImage.querySelector('.subtitle');

var toolbox = document.querySelector('.toolbox');

/* ************** Options ************** */

var selectedTheme = 'github';

// Init
document.querySelector('.toolbox .size-inputs input#width-input').value = headerImageContainer.clientWidth;

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


/* ************** Font Selectors ************** */

function setFontValues() {
    let titleFontSelect = toolbox.querySelector('.font-selectors-container #title-font-selector');
    let subtitleFontSelect = toolbox.querySelector('.font-selectors-container #subtitle-font-selector');

    if (!document.fonts.check(`14px ${titleFontSelect.value}`)) {
        let font = getFont(titleFontSelect.value)
        font.load().then(function (loadedFont) {
            document.fonts.add(loadedFont)
            console.log('Font loaded an added');
            title.style.fontFamily = `"${titleFontSelect.value}"`;
        }).catch(function (error) {
            console.log('Failed to load font: ' + error)
        })
    } else {
        title.style.fontFamily = `"${titleFontSelect.value}"`;
    }

    if (!document.fonts.check(`14px ${subtitleFontSelect.value}`)) {
        let font = getFont(subtitleFontSelect.value)
        font.load().then(function (loadedFont) {
            document.fonts.add(loadedFont)
            console.log('Font loaded an added');
            subtitle.style.fontFamily = `"${subtitleFontSelect.value}"`;
        }).catch(function (error) {
            console.log('Failed to load font: ' + error)
        })
    } else {
        subtitle.style.fontFamily = `"${subtitleFontSelect.value}"`;
    }
}

function getFont(fontName) {
    switch (fontName) {
        case 'Kalam':
            return new FontFace('Kalam', 'url("/fonts/Kalam-Regular.ttf")');
        default:
            return new FontFace('Kalam', 'url("/fonts/Kalam-Regular.ttf")');
    }
}

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

    title.style.fontSize = titleFontSizeInput.value;
    subtitle.style.fontSize = subtitleFontSizeInput.value;
}

toolbox.querySelectorAll('.font-size-inputs input')
    .forEach(input => {
        input.addEventListener('click', () => input.select());

        input.addEventListener('keyup', (e) => {
            setFontSizeValues();
        });
    })

/* ************** ************** ************** */
