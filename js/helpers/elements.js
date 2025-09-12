function getMainElements() {
    const bannerImageContainer = document.querySelector('.header-image-container');
    const bannerImage = document.querySelector('#github-header-image');
    const bannerTitle = bannerImage.querySelector('.title');
    const bannerSubtitle = bannerImage.querySelector('.subtitle');

    const toolbox = document.querySelector('.toolbox');
    const toolboxBackground = document.querySelector('.toolbox-background');
    const toolboxDecorations = document.querySelector('.toolbox-decorations');
    const toolboxPresets = document.querySelector('.toolbox-presets');

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