# PostCSS Rebase URL [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

`npm install @csstools/postcss-rebase-url --save-dev`

[PostCSS Rebase URL] rebases `url()` functions when transforming CSS.

When bundling CSS, the location of the final stylesheet file will be different than the individual source files.  
[PostCSS Rebase URL] rewrites the contents of `url()` functions so that relative paths continue to work.

Instead of manually mapping where the files will be in the final output you can use this plugin  
and simply use the relative paths to each source file.

_If you need something with more knobs and dials, please checkout [`postcss-url`](https://www.npmjs.com/package/postcss-url)_

```pcss
/* when used with a bundler like `postcss-import` */

/* test/examples/example.css */
@import url("imports/basic.css");

/* test/examples/imports/basic.css */
.foo {
	background: url('../../images/green.png');
}

/* becomes */

/* test/examples/example.expect.css */
.foo {
	background: url("../images/green.png");
}
```

## Usage

Add [PostCSS Rebase URL] to your project:

```bash
npm install postcss @csstools/postcss-rebase-url --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssRebaseURL = require('@csstools/postcss-rebase-url');

postcss([
	postcssRebaseURL(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```



[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-rebase-url

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Rebase URL]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url
