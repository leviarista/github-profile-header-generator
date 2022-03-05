/* ************** Elements ************** */

var headerImageContainer = document.querySelector('.header-image-container');
var headerImage = document.querySelector('#github-header-image');
var title = headerImage.querySelector('.title');
var subtitle = headerImage.querySelector('.subtitle');

var toolboxBackground = document.querySelector('.toolbox-background');

/* ************** Options ************** */

var selectedTheme = 'github';

/* ************** Color selectors ************** */

function setBgColorValues() {
    let bgColorSelector = toolboxBackground.querySelector('.bg-color-selectors input#bg-color-selector');

    headerImage.style.backgroundColor = bgColorSelector.value;
}

toolboxBackground.querySelectorAll('.bg-color-selectors input')
    .forEach(input => {
        input.addEventListener('input', (e) => {
            setBgColorValues();
        });
    })