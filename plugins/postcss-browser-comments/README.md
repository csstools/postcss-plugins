# PostCSS Browser Comments [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

`npm install postcss-browser-comments --save-dev`

[PostCSS Browser Comments] lets you keep only the CSS you need based on
comments and your [browserslist](https://github.com/browserslist/browserslist).


```pcss
/**
 * Prevent adjustments of font size after orientation changes in IE and iOS.
 */

html {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}

/* becomes */


```

The comment and rule above would be removed with the following browserslist:

```yml
last 2 chrome versions
```

The rule below would be more carefully altered:

```pcss
/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}

/* with a `last 2 firefox versions` browserslist becomes */

/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
}
```

## Usage

Add [PostCSS Browser Comments] to your project:

```bash
npm install postcss postcss-browser-comments --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssBrowserComments = require('postcss-browser-comments');

postcss([
	postcssBrowserComments(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```



## Options

### browsers

The `browsers` option overrides of the project’s browserslist.

```js
postcssBrowserComments({ browsers: 'last 2 versions' })
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/postcss-browser-comments

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Browser Comments]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-browser-comments
