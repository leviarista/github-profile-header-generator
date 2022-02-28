let titleInput = document.querySelector('input#title-input');
let titleLocation = document.querySelector('.github-header-image .title');
let subtitleInput = document.querySelector('input#subtitle-input');
let subtitleLocation = document.querySelector('.github-header-image .subtitle');

appendInputsValue();

function appendInputsValue() {
    titleLocation.innerText = titleInput.value || '';
    subtitleLocation.innerText = subtitleInput.value || '';
}

document.querySelectorAll('.toolbox input').forEach(input => {
    input.addEventListener('click', () => input.select());

    input.addEventListener('keyup', (e) => {
        appendInputsValue();
    });
})

// Theme options
document.querySelectorAll('.theme-option').forEach(button => {
    button.addEventListener('click', (e) => {
        console.log(e.target)
    });
})

// Download button
document.querySelector('.download-button').addEventListener('click', () => {
    html2canvas(
        document.querySelector('.github-header-image'),
        {
            scrollX: 0,
            scrollY: 0
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
document.querySelector('.dark-mode-button').addEventListener('click', (e) => {
    let resultBox = document.querySelector('.result-box');
    if (resultBox.className.includes('dark')) {
        resultBox.classList.toggle('light-mode');
    }
});

