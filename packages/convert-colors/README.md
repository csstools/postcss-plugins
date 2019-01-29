# Convert Colors [<img src="https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg" alt="Convert Colors" width="90" height="90" align="right">][Convert Colors]

[![NPM Version][npm-img]][npm-url]
[![Linux Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]

[Convert Colors] converts colors between RGB, HEX, HSL, HWB, LAB, LCH, and more.

```js
import convert from '@csstools/convert-colors';

convert.rgb2hsl(100, 100, 100); // [ 0, 0, 100 ]
convert.rgb2hwb(100, 100, 100); // [ 0, 100, 0 ]

convert.hsl2rgb(0, 0, 100); // [ 0, 100, 0 ]
convert.hsl2hwb(0, 0, 100); // [ 0, 100, 0 ]

convert.hwb2rgb(0, 100, 0); // [ 0, 0, 100 ]
convert.hwb2hsl(0, 100, 0); // [ 0, 0, 100 ]

convert.rgb2hue(0, 0, 100); // 240

convert.rgb2contrast([100, 100, 100], [0, 0, 0]); // 21
convert.rgb2ciede2000([100, 100, 100], [0, 0, 0]); // 100
```

## Usage

Add [Convert Colors] to your build tool:

```bash
npm install @csstools/convert-colors --save-dev
```

## Features

Conversions work by taking arguments that represents a color in one color space
and returning an array of that same color in another color space.

[Documentation](https://jonathantneal.github.io/convert-colors/)

[npm-url]: https://www.npmjs.com/package/@csstools/convert-colors
[npm-img]: https://img.shields.io/npm/v/@csstools/convert-colors.svg
[cli-url]: https://travis-ci.org/jonathantneal/convert-colors
[cli-img]: https://img.shields.io/travis/jonathantneal/convert-colors.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/convert-colors
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/convert-colors.svg

[Convert Colors]: https://github.com/jonathantneal/convert-colors
