# PostCSS Debug Logger [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

```bash
npm install @csstools/postcss-debug-logger --save-dev
```

[PostCSS Debug Logger] logs the AST nodes PostCSS is processing.

This is mainly useful to track down infinite loops in PostCSS plugins.

## Usage

Add [PostCSS Debug Logger] to your project:

```bash
npm install postcss @csstools/postcss-debug-logger --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssDebugLogger = require('@csstools/postcss-debug-logger');

postcss([
	postcssDebugLogger(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```



[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-debug-logger

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Debug Logger]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-debug-logger
