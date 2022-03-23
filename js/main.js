/* ************** Elements ************** */

let headerImageContainer = document.querySelector('.header-image-container');
let headerImage = document.querySelector('#github-header-image');
let title = headerImage.querySelector('.title');
let subtitle = headerImage.querySelector('.subtitle');

let toolbox = document.querySelector('.toolbox');

/* ************** Options ************** */

let selectedTheme = 'github';

// Init
document.querySelector('.toolbox .size-inputs input#width-input').value = headerImageContainer.clientWidth;

// Demo reset after ended
document.querySelector('.how-to-section video.demo').onended = (e) => e.target.currentTime = 0;

/* ************** Header image buttons ************** */

// Download button
document.querySelector('.download-button')
    .addEventListener('click', () => {
        html2canvas(
            document.querySelector('#github-header-image'),
            {
                backgroundColor: null
                // widtH: (headerImage.clientWidth * 2),
                // height: (headerImage.style.height * 2)
            })
            .then(function (canvas) {
                // for testing 
                // document.body.before(canvas);

                let imageURL = canvas.toDataURL("image/png");
                let a = document.createElement("a");
                a.href = imageURL;
                a.download = 'github-header-image';
                a.click();
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

/* ************** Randomize ************** */

function getRandomTheme() {
    const themes = [{
        background: '#4078C0', title: '#FFFFFF', subtitle: '#FFFFFF', border: '#FFFFFF', borderSize: 0, borderRadius: 7, textAlign: 'flex-start',
        decoration: 'my-octocat', decorationSize: 77,
        pattern: 'jigsaw', patternColor: '#FFFFFF', patternOpacity: 0.25
    }, {
        background: '#4078C0', title: '#FFFFFF', subtitle: '#05F1FA', border: '#FFFFFF', borderSize: 0, borderRadius: 7, textAlign: 'flex-start',
        decoration: 'octocat', decorationSize: 100,
        pattern: 'floating-cogs', patternColor: '#FFFFFF', patternOpacity: 0.25
    }, {
        background: '#112137', title: '#FFFFFF', subtitle: '#05F1FA', border: '#eeff00', borderSize: 4, borderRadius: 10, textAlign: 'center',
        decoration: 'github-mark', decorationSize: 100,
        pattern: 'i-like-food', patternColor: '#FFFFFF', patternOpacity: 0.25
    }, {
        background: '#000000', title: '#FFFFFF', subtitle: '#c671d9', border: '#FFFFFF', borderSize: 0, borderRadius: 15, textAlign: 'center',
        decoration: 'code', decorationSize: 100,
        pattern: 'endless-constellation', patternColor: '#87d2ff', patternOpacity: 0.7
    }, {
        background: '#ff0066', title: '#FFFFFF', subtitle: '#0f0006', border: '#FFFFFF', borderSize: 0, borderRadius: 15, textAlign: 'flex-end',
        decoration: 'dev-badge', decorationSize: 100,
        pattern: 'temple', patternColor: '#FFFFFF', patternOpacity: 0.25
    }, {
        background: '#FFFFFF', title: '#f7b3ce', subtitle: '#55c1ae', border: '#88aedc', borderSize: 7, borderRadius: 0, textAlign: 'flex-end',
        decoration: 'dev-rainbow', decorationSize: 100,
        pattern: 'bubbles', patternColor: '#f3f095', patternOpacity: 0.7
    }, {
        background: '#207e78', title: '#d0b506', subtitle: '#8fd100', border: '#ffffff', borderSize: 0, borderRadius: 7, textAlign: 'center',
        decoration: 'dev-white', decorationSize: 100,
        pattern: 'i-like-food', patternColor: '#1b96f3', patternOpacity: 0.45
    }, {
        background: '#4078c0', title: '#ffffff', subtitle: '#ffffff', border: '#ffffff', borderSize: 0, borderRadius: 7, textAlign: 'flex-start',
        decoration: 'my-octocat', decorationSize: 100,
        pattern: 'jigsaw', patternColor: '#ffffff', patternOpacity: 0.25
    },
    ]

    let random = Math.floor(Math.random() * themes.length);
    return themes[random];
}

document.querySelector('.randomize-button')
    .addEventListener('click', (e) => {
        const theme = getRandomTheme();

        // Background
        const mainTabBgColorSelector = document.querySelector('.color-selectors-container input#main-bg-color-selector');
        const backgroundTabBgColorSelector = document.querySelector('.bg-color-selectors input#background-bg-color-selector');
        mainTabBgColorSelector.value = theme.background;
        backgroundTabBgColorSelector.value = theme.background;
        headerImage.style.backgroundColor = theme.background;

        // Title
        const mainTabtitleColorSelector = document.querySelector('.color-selectors-container input#title-color-selector');
        mainTabtitleColorSelector.value = theme.title;
        title.style.color = theme.title;

        // Subtitle
        const mainTabSubtitleColorSelector = document.querySelector('.color-selectors-container input#subtitle-color-selector');
        mainTabSubtitleColorSelector.value = theme.subtitle;
        subtitle.style.color = theme.subtitle;

        // Borders
        const borderColorSelector = document.querySelector('.bg-color-selectors input#border-color-selector');
        const borderInput = document.querySelector('.border-inputs input#border-input');
        const borderRadiusInput = document.querySelector('.border-inputs input#border-radius-input');
        borderColorSelector.value = theme.border;
        borderInput.value = theme.borderSize;
        borderInput.nextElementSibling.value = theme.borderSize;
        borderRadiusInput.value = theme.borderRadius;
        borderRadiusInput.nextElementSibling.value = theme.borderRadius;
        headerImage.style.border = `solid ${borderColorSelector.value} ${borderInput.value}px`;
        headerImage.style.borderRadius = `${borderRadiusInput.value}px`;

        // Text Align
        document.querySelector(`.align-buttons button[data-align-value="${theme.textAlign}"]`).click();

        // Decoration
        const decorationSizeInput = document.querySelector('.decorations-size-inputs input#decoration-size-input');
        decorationSizeInput.value = theme.decorationSize;
        decorationSizeInput.nextElementSibling.value = theme.decorationSize;
        document.querySelector(`.decorations-buttons button[data-decoration-value="${theme.decoration}.png"]`).click();

        // Patterns
        const patternOpacityInput = document.querySelector('.pattern-inputs input#pattern-opacity-input');
        const patternColorSelector = document.querySelector('.pattern-inputs input#pattern-color-selector');
        patternOpacityInput.value = theme.patternOpacity
        patternOpacityInput.nextElementSibling.value = theme.patternOpacity
        patternColorSelector.value = theme.patternColor;
        document.querySelector(`.patterns-buttons button[data-pattern-value="${theme.pattern}"]`).click();

    });

/* ************** ************** ************** */
