# How to contribute

Glad to hear you're interested in contributing to the project!. Thank you so much.  
These are some ways how you can help:

> ℹ️ After cloning the repo, please add `/?devOptions=1` in the URL, so you can see additional options for development mode
> Also the hostname should be either `localhost`or `127.0.0.1`.

#### Issues
You can check the [Issues](https://github.com/rails/rails/issues) section and start working on some of the existing tickets.

#### Bugs
If you find a bug, please [create a new issue](https://github.com/leviarista/github-profile-header-generator/issues/new/choose).

#### Presets
Create more presets/themes:
- Open the browser console.
- Create your theme and copy the printed theme values from the console.
- Click the "miniature" option and save the image, add it to `public/images/theme-previews/`.
- Use the previuos console values to insert a new item on `/js/data/presets.json`.
- Add a property called `"previewImage"` with the name of the miniature image.
  - For example: `"previewImage": "my-theme-preview.png"`
- That's it!

#### Add Background patterns
- Go to `/js/data/patterns.js`, add a new case block with an appropriate name in the `getPattern` function.
- After choosing a new pattern in SVG format, paste the SVG code of the image into the return value.
- Change the `fill` and `fill-opacity` values ​​that the function receives, for example:
  - `fill="#F12AA34"` -> `fill='%23${color}'`
  - `fill-opacity=0.5` -> `fill-opacity='${opacity}'`
- [Optional] Add a predefined size in the getPatternDefaultSize function.
- Create an appropriate thumbnail file and add it to `/public/images/patterns/`.
- Go to `/partials/toolbox/background.html` and add a new button element in the `"patterns-buttons"` div section.

#### Add new decorations
- Place an image on `/public/images/decorations/`.
- Go to `/partials/toolbox/decorations.html` and add a new button element in the `"decorations-buttons"` div section.

#### Ideas or suggestions
- Share them in the [discussions](https://github.com/leviarista/github-profile-header-generator/discussions) section.
