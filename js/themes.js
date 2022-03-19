/* ************** Elements ************** */

let toolbox = document.querySelector('.toolbox');

/* ************** Options ************** */

let selectedTheme = 'github';

/* ************** Theme options ************** */

document.querySelectorAll('.theme-option')
    .forEach(button => {
        button.addEventListener('click', (e) => {
            console.log(e.target);
            document.querySelectorAll('.theme-option').forEach(button => { button.classList.remove('active'); });
            button.classList.add('active');
        });
        if (button.getAttribute('data-theme') === selectedTheme)
            button.classList.add('active');
    })

// Github theme

let paddingValue = document.querySelector('#paddings-input').value || 25;
let padding = `${paddingValue}px`;

const imageDecorationContainer = document.querySelector('.img-decoration-container');
const imgDecorationElement = document.createElement('img');
imgDecorationElement.className = 'img-decoration';
imgDecorationElement.src = './images/decorations/my-octocat.png';
imgDecorationElement.style.position = 'absolute';
imgDecorationElement.style.bottom = 'calc(50%)';
imgDecorationElement.style.transform = 'translateY(50%)'
imgDecorationElement.style.left = 'auto';
imgDecorationElement.style.right = padding;
imgDecorationElement.style.width = '77px';
imgDecorationElement.alt = 'Header image decoration'
imageDecorationContainer.appendChild(imgDecorationElement)

toolbox.querySelectorAll('.align-buttons button')
    .forEach(button => {
        button.addEventListener('click', (e) => {
            const element = e.target.tagName.toLowerCase() === 'img' ?
                e.target.parentNode :
                e.target;
            const alignValue = element.getAttribute('data-align-value');
            const paddingValue = document.querySelector('#paddings-input').value || 25;
            const padding = `${paddingValue}px`;
            if (selectedTheme === 'github') {
                const imageDecoration = document.querySelector('.img-decoration-container img');
                if (alignValue === 'flex-end') {
                    document.querySelector('.img-decoration-container .img-decoration-2')?.remove();
                    imageDecoration.style.left = padding;
                    imageDecoration.style.right = 'auto';
                } else if (alignValue === 'flex-start') {
                    document.querySelector('.img-decoration-container .img-decoration-2')?.remove();
                    imageDecoration.style.left = 'auto';
                    imageDecoration.style.right = padding;
                } else if (alignValue === 'center') {
                    imageDecoration.style.left = 'auto';
                    imageDecoration.style.right = padding;
                    if (!document.querySelector('.img-decoration-container .img-decoration-2')) {
                        const clonedImageDecoration = imageDecoration.cloneNode(true);
                        clonedImageDecoration.style.left = padding;
                        clonedImageDecoration.style.right = 'auto';
                        clonedImageDecoration.className = 'img-decoration-2';
                        imageDecorationContainer.appendChild(clonedImageDecoration)
                    }
                }
            }
        });
    })

/* ************** ************** ************** */
