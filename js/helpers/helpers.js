const isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const isDevOptions = urlParams.get('devOptions');

function saveImageOnLocalStorage(img) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    var dataURL = canvas.toDataURL('image/png');
    localStorage.setItem('savedImage', dataURL);
}

export {
    isLocalDevelopment,
    isDevOptions,
    saveImageOnLocalStorage
};
