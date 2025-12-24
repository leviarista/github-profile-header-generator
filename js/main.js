// Import statements
import { snapdom } from '@zumer/snapdom';
import { getMainElements } from './helpers/elements';
import { isDevOptions, isLocalDevelopment } from './helpers/helpers';
import { getAllPresets, getRandomPreset, setPreset } from './presets';

/* ************** Elements ************** */
const { bannerImageContainer, bannerImage, toolbox } = getMainElements();

/* ************** Options ************** */
const initialTheme = {
    textAlign: "center",
    ...getAllPresets()[15],
    background: "#62518d",
    borderSize: 5,
    decoration: 'dino-border.png',
    subtitleColor: "#FFF2B3",
    titleFont: 'Red Hat Display',
    subtitleFont: 'Kalam'
};

// Init
toolbox.querySelector('.size-inputs input#width-input').value = bannerImageContainer.clientWidth;

document.addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem('theme');
    if (theme) setPreset(JSON.parse(theme), true);
    else setPreset(initialTheme);
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
imgDecorationElement.style.right = '25px';
imgDecorationElement.style.width = '0px';
imgDecorationElement.alt = 'Header image decoration';
imageDecorationContainer.appendChild(imgDecorationElement);

/* ==========================================================
   🆕 FEATURE: Preview Before Download
   ========================================================== */
const previewButton = document.createElement('button');
previewButton.className = 'preview-button';
previewButton.innerHTML = `<img src="./images/icons/preview.svg" width="20" /> Preview`;
document.querySelector('.toolbox-buttons').appendChild(previewButton);

previewButton.addEventListener('click', async () => {
    try {
        const png = await snapdom.toPng(bannerImage, { embedFonts: true, scale: 1 });
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write('<title>Banner Preview</title>');
        previewWindow.document.body.innerHTML = `<img src="${png}" style="max-width:100%;display:block;margin:auto;">`;
    } catch (error) {
        console.error('Preview generation failed:', error);
        showToast('Preview generation failed 😞', 'error');
    }
});

/* ==========================================================
   🆕 FEATURE: Auto-Save Theme Changes
   ========================================================== */
// Every time user updates a setting in toolbox, we auto-save
toolbox.addEventListener('input', () => {
    const theme = localStorage.getItem('theme');
    if (theme) {
        localStorage.setItem('theme', theme);
        showToast('Theme auto-saved ✅', 'success');
    }
});

/* ==========================================================
   🆕 FEATURE: Keyboard Shortcuts
   ========================================================== */
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        document.querySelector('.randomize-button').click();
    }
    if (e.ctrlKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        document.querySelector('.download-button').click();
    }
});

/* ==========================================================
   🆕 FEATURE: Notification Toasts
   ========================================================== */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

// Add basic CSS for toasts dynamically
const style = document.createElement('style');
style.textContent = `
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #333;
  color: white;
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 14px;
  transition: opacity 0.5s;
  z-index: 9999;
}
.toast.success { background: #4CAF50; }
.toast.error { background: #E53935; }
`;
document.head.appendChild(style);

/* ==========================================================
   EXISTING DOWNLOAD FUNCTIONALITY
   ========================================================== */
document.querySelector('.download-button')
    .addEventListener('click', async () => {
        document.querySelector('.download-button img').src = './images/icons/loading.gif';
        try {
            await snapdom.download(bannerImage, {
                embedFonts: true,
                format: 'png',
                filename: 'github-header-banner',
                scale: 2
            });
            document.querySelector('.download-button img').src = './images/icons/download.svg';
            showToast('Banner downloaded successfully 🎉', 'success');
        } catch (error) {
            console.error('Image capture or download failed:', error);
            showToast('Download failed ❌', 'error');
        }
    });

// (Rest of your existing code remains unchanged)
