# PostCSS Font Weights [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/postcss-font-weights.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

```bash
npm install postcss-font-weights --save-dev
```

[PostCSS Font Weights] lets you do this in CSS.

```pcss
h1, h2, h3 {
  font-weight: light;
}

pre {
   font: light 100% monospace;
}

/* becomes */

h1, h2, h3 {
  font-weight: 300;
}

pre {
   font: 300 100% monospace;
}
```

Common font weights are found in the Font Weight Numeric Values section of the
[CSS Fonts Specification](https://www.w3.org/TR/css-fonts-3/#font-weight-numeric-values).

| Common Weight | Numeric Value |
| ------------- | ------------- |
| thin          | 100           |
| extralight    | 200           |
| ultralight    | 200           |
| light         | 300           |
| book          | 400           |
| normal        | 400           |
| regular       | 400           |
| roman         | 400           |
| medium        | 500           |
| semibold      | 600           |
| demibold      | 600           |
| bold          | 700           |
| extrabold     | 800           |
| ultrabold     | 800           |
| black         | 900           |
| heavy         | 900           |

These common font weights are converted to their numeric counterpart.

## Usage

Add [PostCSS Font Weights] to your project:

```bash
npm install postcss postcss-font-weights --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssFontWeights = require('postcss-font-weights');

postcss([
	postcssFontWeights(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Font Weights] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)

## Options

### prefix

The `prefix` option determines the prefix applied to properties being processed
(e.g. `x` for `-x-font-weight`). Wrapping dashes (`-`) are automatically
applied.

### weights

The `weights` option determines additional font weight keywords and numeric
pairs (e.g. `weights: { lite: 300 }` for `font-weight: lite` to become
`font-weight: 300`).

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/postcss-font-weights

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Font Weights]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-font-weights
