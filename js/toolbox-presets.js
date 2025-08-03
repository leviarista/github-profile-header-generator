import { getAllThemes, setTheme } from "./helpers/helpers";
import { getMainElements } from "./helpers/elements"

const themes = getAllThemes();
const { toolboxPresets } = getMainElements();

document.addEventListener('DOMContentLoaded', function () {
    if (toolboxPresets) {
        toolboxPresets.querySelectorAll('.theme-button-white')[0].addEventListener('click', (e) => {
            document.querySelector('.tab .tablinks[data-name="main-section"]').click();
        })

        themes.forEach(theme => {
            const div = document.createElement('div');
            div.classList.add('theme-button');
            div.setAttribute('role', 'button')

            const img = document.createElement('img');
            img.src = './images/theme-previews/' + theme.previewImage;
            img.alt = 'Theme image';

            img.addEventListener('click', (e) => {
                setTheme(theme);
            });

            div.appendChild(img);

            toolboxPresets.appendChild(div);
        })
    }
});