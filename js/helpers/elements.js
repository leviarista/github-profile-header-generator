function getMainElements() {
    let bannerImageContainer = document.querySelector('.header-image-container');
    let bannerImage = document.querySelector('#github-header-image');
    let bannerTitle = bannerImage.querySelector('.title');
    let bannerSubtitle = bannerImage.querySelector('.subtitle');

    let toolbox = document.querySelector('.toolbox');
    let toolboxBackground = document.querySelector('.toolbox-background');
    let toolboxDecorations = document.querySelector('.toolbox-decorations');
    let toolboxPresets = document.querySelector('.toolbox-presets');

    return {
        bannerImageContainer,
        bannerImage,
        bannerTitle,
        bannerSubtitle,
        toolbox,
        toolboxDecorations,
        toolboxBackground,
        toolboxPresets
    }
}

export { getMainElements };