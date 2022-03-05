/* ************** Elements ************** */

var toolbox = document.querySelector('.toolbox');

/* ************** Options ************** */

var selectedTheme = 'github';

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

const imageDecorationContainer = document.querySelector('.img-decoration-container');
const imgDecorationElement = document.createElement('img');
imgDecorationElement.className = 'img-decoration';
imgDecorationElement.src = 'images/octocat.png';
imgDecorationElement.style.position = 'absolute';
imgDecorationElement.style.bottom = 'calc(50% - 50px)';
imgDecorationElement.style.right = 0;
imageDecorationContainer.appendChild(imgDecorationElement)

toolbox.querySelectorAll('.align-buttons button')
    .forEach(button => {
        button.addEventListener('click', (e) => {
            const element = e.target.tagName.toLowerCase() === 'img' ?
                e.target.parentNode :
                e.target;
            const alignValue = element.getAttribute('data-align-value');
            if (selectedTheme === 'github') {
                const imageDecoration = document.querySelector('.img-decoration-container img');
                if (alignValue === 'flex-end') {
                    document.querySelector('.img-decoration-container .img-decoration-2')?.remove();
                    imageDecoration.style.left = 0;
                    imageDecoration.style.right = 'auto';
                } else if (alignValue === 'flex-start') {
                    document.querySelector('.img-decoration-container .img-decoration-2')?.remove();
                    imageDecoration.style.left = 'auto';
                    imageDecoration.style.right = 0;
                } else if (alignValue === 'center') {
                    imageDecoration.style.left = 'auto';
                    imageDecoration.style.right = 0;
                    clonedImageDecoration = imageDecoration.cloneNode(true);
                    clonedImageDecoration.style.left = 0;
                    clonedImageDecoration.style.right = 'auto';
                    clonedImageDecoration.className = 'img-decoration-2';
                    imageDecorationContainer.appendChild(clonedImageDecoration)
                }
            }
        });
    })

/* ************** ************** ************** */
