function getPatternDefaultSize(option) {
    switch (option) {
        case 'jigsaw':
            return 100;
        case 'github':
            return 40;
        case 'endless-constellation':
            return 250;
        case 'floating-cogs':
            return 350;
        case 'bubbles':
            return 200;
        case 'random-shapes':
            return 80;
        case 'lisbon':
            return 80;
        case 'temple':
            return 100;
        case 'topography':
            return 500;
        case 'falling-triangles':
            return 36;
        case 'glamorous':
            return 135;
        case 'i-like-food':
            return 225;
        case 'leaf':
            return 80;
        case 'circuit-board':
            return 304;
        case 'overlapping-circles':
            return 80;
        case 'endless-clouds':
            return 112;
        case 'bathroom-floor':
            return 100;
        case 'squares-in-squares':
            return 100;
        case 'aztec':
            return 45;
        case 'hideout':
            return 40;
        case '4-point-stars':
            return 35;
        case 'moroccan':
            return 70;
        case 'charlie-brown':
            return 20;
        case 'stamp-collection':
            return 55;
        case 'squares':
            return 40;
        case 'graph-paper':
            return 80;
        case 'brick-wall':
            return 40;
        case 'dalmatian-spots':
            return 200;
        default:
            return 100;
    }
}

export { getPatternDefaultSize };
