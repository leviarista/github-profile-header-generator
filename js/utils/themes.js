function getRandomTheme() {
    const themes = [{
        background: '#4078C0', title: '#FFFFFF', subtitle: '#FFFFFF',
        border: '#FFFFFF', borderSize: 0, borderRadius: 7, textAlign: 'flex-start',
        decoration: 'my-octocat.png', decorationSize: 77,
        pattern: 'jigsaw', patternColor: '#FFFFFF', patternOpacity: 0.25
    }, {
        background: '#4078C0', title: '#FFFFFF', subtitle: '#05F1FA',
        border: '#FFFFFF', borderSize: 0, borderRadius: 7, textAlign: 'flex-start',
        decoration: 'octocat.png', decorationSize: 100,
        pattern: 'floating-cogs', patternColor: '#FFFFFF', patternOpacity: 0.25
    }, {
        background: '#112137', title: '#FFFFFF', subtitle: '#05F1FA',
        border: '#eeff00', borderSize: 4, borderRadius: 10, textAlign: 'center',
        decoration: 'github-mark.png', decorationSize: 100,
        pattern: 'i-like-food', patternColor: '#FFFFFF', patternOpacity: 0.25
    }, {
        background: '#000000', title: '#FFFFFF', subtitle: '#c671d9',
        border: '#FFFFFF', borderSize: 0, borderRadius: 15, textAlign: 'center',
        decoration: 'code.png', decorationSize: 100,
        pattern: 'endless-constellation', patternColor: '#87d2ff', patternOpacity: 0.7
    }, {
        background: '#ff0066', title: '#FFFFFF', subtitle: '#0f0006',
        border: '#FFFFFF', borderSize: 0, borderRadius: 15, textAlign: 'flex-end',
        decoration: 'dev-badge.png', decorationSize: 100,
        pattern: 'temple', patternColor: '#FFFFFF', patternOpacity: 0.25
    }, {
        background: '#FFFFFF', title: '#f7b3ce', subtitle: '#55c1ae',
        border: '#88aedc', borderSize: 7, borderRadius: 0, textAlign: 'flex-end',
        decoration: 'dev-rainbow.png', decorationSize: 100,
        pattern: 'bubbles', patternColor: '#f3f095', patternOpacity: 0.7
    }, {
        background: '#207e78', title: '#d0b506', subtitle: '#8fd100',
        border: '#ffffff', borderSize: 0, borderRadius: 7, textAlign: 'center',
        decoration: 'dev-white.png', decorationSize: 100,
        pattern: 'i-like-food', patternColor: '#1b96f3', patternOpacity: 0.45
    }, {
        background: '#4078c0', title: '#ffffff', subtitle: '#ffffff',
        border: '#ffffff', borderSize: 0, borderRadius: 7, textAlign: 'flex-start',
        decoration: 'my-octocat.png', decorationSize: 100,
        pattern: 'jigsaw', patternColor: '#ffffff', patternOpacity: 0.25
    }, {
        background: '#000000', title: '#4cfca7', subtitle: '#0ad6ff',
        border: '#ffffff', borderSize: 0, borderRadius: 25, textAlign: 'flex-end',
        decoration: 'dev-white.png', decorationSize: 145,
        pattern: 'overlapping-circles', patternColor: '#ffffff', patternOpacity: 0.3
    }, {
        background: '#9340bf', title: '#fbff00', subtitle: '#ffffff',
        border: '#ffffff', borderSize: 0, borderRadius: 7, textAlign: 'center',
        decoration: 'none', decorationSize: 100,
        pattern: 'jigsaw', patternColor: '#ffffff', patternOpacity: 0.25,
        titleFont: 'LifeSavers', subtitleFont: 'DellaRespira'
    }, {
        background: '#012d4e', title: '#5affb7', subtitle: '#00d6bd',
        border: '#ffffff', borderSize: 0, borderRadius: 200, textAlign: 'flex-end',
        decoration: 'binary-code.png', decorationSize: 122,
        pattern: 'circuit-board', patternColor: '#94ffdb', patternOpacity: 0.3,
        titleFont: 'Ubuntu', subtitleFont: 'Courier New'
    }, {
        background: '#002a52', title: '#ffffff', subtitle: '#ffffff',
        border: '#b4b701', borderSize: 3, borderRadius: 0, textAlign: 'center',
        decoration: 'coding.png', decorationSize: 91,
        pattern: 'lisbon', patternColor: '#bbff00', patternOpacity: 0.5,
        titleFont: 'DellaRespira', subtitleFont: 'Courgette'
    }, {
        background: '#96349d', title: '#ffffff', subtitle: '#bef3fe',
        border: '#ffffff', borderSize: 0, borderRadius: 7, textAlign: 'center',
        decoration: 'rocket.png', decorationSize: 95,
        pattern: 'endless-clouds', patternColor: '#ffffff', patternOpacity: 0.25,
        titleFont: 'MavenPro', subtitleFont: 'Quattrocento'
    }, {
        background: '#6cbf40', title: '#ffffff', subtitle: '#e7eb00',
        border: '#ffffff', borderSize: 0, borderRadius: 11, textAlign: 'flex-end',
        decoration: 'idea.png', decorationSize: 80,
        pattern: 'leaf', patternColor: '#ffffff', patternOpacity: 0.25,
        titleFont: 'DellaRespira', subtitleFont: 'DellaRespira'
    }, {
        background: '#252646', title: '#fdbf00', subtitle: '#64e1dc',
        border: '#ffffff', borderSize: 0, borderRadius: 15, textAlign: 'flex-end',
        decoration: 'coding-screen.png', decorationSize: 116,
        pattern: 'github', patternColor: '#ffffff', patternOpacity: 0.1,
        titleFont: 'Tahoma', subtitleFont: 'Courgette'
    }, {
        background: '#001061', title: '#ffffff', subtitle: '#ffffff',
        border: '#ffffff', borderSize: 0, borderRadius: 0, textAlign: 'center',
        decoration: 'apple.png', decorationSize: 59,
        pattern: 'endless-constellation', patternColor: '#ffffff', patternOpacity: 0.5,
        titleFont: 'MavenPro', subtitleFont: 'MavenPro'
    }, {
        background: '#b83700', title: '#ffd500', subtitle: '#41d7e1',
        border: '#ffffff', borderSize: 0, borderRadius: 15, textAlign: 'flex-start',
        decoration: 'idea.png', decorationSize: 100,
        pattern: 'falling-triangles', patternColor: '#fff700', patternOpacity: 0.15,
        titleFont: 'Ubuntu', subtitleFont: 'Trebuchet MS'
    }, {
        background: '#4099bf', title: '#ffffff', subtitle: '#ffc6b1',
        border: '#ffffff', borderSize: 5, borderRadius: 7, textAlign: 'flex-start',
        decoration: 'my-octocat.png', decorationSize: 100,
        pattern: 'bubbles', patternColor: '#ffffff', patternOpacity: 0.25, titleFont: 'Ubuntu', subtitleFont: 'Courgette'
    }, {
        background: '#eeb25d', title: '#ffffff', subtitle: '#000000',
        border: '#ffffff', borderSize: 5, borderRadius: 37, textAlign: 'center',
        decoration: 'octocat.png', decorationSize: 69,
        pattern: 'bubbles', patternColor: '#ffffff', patternOpacity: 0.25,
        titleFont: 'DellaRespira', subtitleFont: 'LifeSavers'
    }, {
        background: '#000000', title: '#ffffff', subtitle: '#ffffff',
        border: '#299900', borderSize: 2, borderRadius: 0, textAlign: 'flex-start',
        decoration: 'github-mark.png', decorationSize: 60,
        pattern: 'i-like-food', patternColor: '#27eb00', patternOpacity: 0.35,
        titleFont: 'MavenPro', subtitleFont: 'MavenPro'
    }, {
        background: '#000000', title: '#ffffff', subtitle: '#00c732',
        border: '#ffffff', borderSize: 0, borderRadius: 0, textAlign: 'flex-end',
        decoration: 'coding.png', decorationSize: 100,
        pattern: 'circuit-board', patternColor: '#00ff6e', patternOpacity: 0.4,
        titleFont: 'Courier New', subtitleFont: 'Courier New'
    }, {
        background: '#37cd8c', title: '#d5fe06', subtitle: '#85ffd0',
        border: '#ffffff', borderSize: 0, borderRadius: 7, textAlign: 'flex-start',
        decoration: 'github-mark.png', decorationSize: 64,
        pattern: 'temple', patternColor: '#ffffff', patternOpacity: 0.25,
        titleFont: 'Lancelot', subtitleFont: 'Athiti'
    },
    ]

    let random = Math.floor(Math.random() * themes.length);
    return themes[random];
}

export { getRandomTheme };