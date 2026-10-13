import { snapdom } from '@zumer/snapdom';
import { getMainElements } from './helpers/elements';
import { isDevOptions, isLocalDevelopment } from './helpers/helpers';
import { getAllPresets, getRandomPreset, setPreset } from './presets';

/* ************** Elements ************** */

const {
    bannerImageContainer,
    bannerImage,
    toolbox,
} = getMainElements();

/* ************** Options ************** */

function getInitialTheme() {
    const isDark = localStorage.getItem('darkMode') !== '0';
    return {
        textAlign: "center",
        ...getAllPresets()[15],
        background: isDark ? "#62518d" : "#4a6fa5",
        borderSize: 5,
        decoration: 'dino-border.png',
        subtitleColor: isDark ? "#FFF2B3" : "#FFF2B3",
        titleFont: 'Red Hat Display',
        subtitleFont: 'Kalam'
    };
}

const initialTheme = getInitialTheme();

// Init
toolbox.querySelector('.size-inputs input#width-input').value = bannerImageContainer.clientWidth;

document.addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem('theme');
    if (theme)
        setPreset(JSON.parse(theme), true);
    else
        setPreset(initialTheme);
});

// Demo reset after ended
document.querySelector('.how-to-section video.demo').onended = (e) => e.target.currentTime = 0;

// Decoration setup
const imageDecorationContainer = document.querySelector('.img-decoration-container');
const imgDecorationElement = document.createElement('img');
imgDecorationElement.className = 'img-decoration';
imgDecorationElement.style.position = 'absolute';
imgDecorationElement.style.bottom = 'calc(50%)';
imgDecorationElement.style.transform = 'translateY(50%)';
imgDecorationElement.style.left = 'auto';
imgDecorationElement.style.right = '25px';
imgDecorationElement.style.width = '0px';
imgDecorationElement.alt = 'Header image decoration'
imageDecorationContainer.appendChild(imgDecorationElement)

/* ************** Header image options ************** */

// Download button
document.querySelector('.download-button')
    .addEventListener('click', async () => {
        document.querySelector('.download-button img').src = './images/icons/loading.gif'

        try {
            await snapdom.download(
                bannerImage,
                {
                    embedFonts: true,
                    format: 'png',
                    filename: 'github-header-banner',
                    scale: 2
                });
            document.querySelector('.download-button img').src = './images/icons/download.svg'
            showToast('Banner downloaded successfully', 'success');
        } catch (error) {
            console.error('Image capture or download failed:', error);
            showToast('Download failed', 'error');
        }
    })

// For local development
document.addEventListener("DOMContentLoaded", (event) => {
    const displayButton = document.querySelector('.display-button');
    const miniatureButton = document.querySelector('.miniature-button');
    const testFontsTab = document.querySelector('.tablinks[data-name="test-fonts-section"]');

    if (isLocalDevelopment && isDevOptions == 1) {
        const el = document.querySelector('#github-header-image');
        const container = document.querySelector('.header-image-container')

        if (displayButton) {
            displayButton.style.display = "block";

            displayButton.addEventListener('click', async () => {
                const png = await snapdom.toPng(el, { embedFonts: true });

                const prevImage = container.children[1];
                if (prevImage) container.removeChild(prevImage);

                container.appendChild(png);
                document.querySelector('.toolbox-container .toolbox-tools').style.height = 'calc(100vh - 230px - 3rem - 35px - 1rem - 230px)'
            })
        }
        if (miniatureButton) {
            miniatureButton.style.display = "block";

            miniatureButton.addEventListener('click', async () => {
                const png = await snapdom.toPng(el, { embedFonts: true, scale: 0.25 });

                const prevImage = container.children[1];
                if (prevImage) container.removeChild(prevImage);

                container.appendChild(png);
                document.querySelector('.toolbox-container .toolbox-tools').style.height = 'calc(100vh - 230px - 3rem - 35px - 1rem - 46px)'
            })
        }
        if (testFontsTab) {
            // testFontsTab.style.display = "block"
        }
    }
});

// Randomize
document.querySelector('.randomize-button')
    .addEventListener('click', (e) => {
        const theme = getRandomPreset();
        setPreset(theme);
    });

document.querySelector('.reset-button')
    .addEventListener('click', (e) => {
        const darkMode = localStorage.getItem('darkMode');
        localStorage.clear();
        localStorage.setItem('darkMode', darkMode);
        setPreset(initialTheme);
    });

/* ************** Tabs ************** */

function openTab(e, name) {
    let i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(name).style.display = "block";
    e.currentTarget.className += " active";
}

document.querySelectorAll('.tab .tablinks')
    .forEach(button => {
        button.addEventListener('click', (e) => {
            const name = e.currentTarget.getAttribute('data-name');
            localStorage.setItem('openTab', name)
            openTab(e, name);
        });
    })

// Saved tab 
document.addEventListener("DOMContentLoaded", (event) => {
    const openTab = localStorage.getItem('openTab');
    if (openTab) {
        document.querySelector(`[data-name="${openTab}"]`).click();
    } else {
        document.getElementById("defaultOpenTag").click();
    }
});

/* ************** App Dark Mode (UI theme) ************** */

function applyTheme(isDark) {
    localStorage.setItem('darkMode', isDark ? "1" : "0");
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");

    document.querySelector('#light-mode-btn').classList.toggle('selected', !isDark);
    document.querySelector('#dark-mode-btn').classList.toggle('selected', isDark);
}

document.addEventListener("DOMContentLoaded", () => {
    const localDarkMode = localStorage.getItem('darkMode');
    const isDark = localDarkMode === "1";

    document.querySelector('#light-mode-btn').classList.toggle('selected', !isDark);
    document.querySelector('#dark-mode-btn').classList.toggle('selected', isDark);

    document.querySelector('#light-mode-btn').onclick = () => applyTheme(false);
    document.querySelector('#dark-mode-btn').onclick = () => applyTheme(true);
});

/* ************** Notification Toasts ************** */

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
