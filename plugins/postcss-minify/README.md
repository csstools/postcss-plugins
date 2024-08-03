# PostCSS Minify [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

`npm install @csstools/postcss-minify --save-dev`

[PostCSS Minify] is a very basic CSS minifier.

It guarantees two things :
- browsers can not tell the difference between the original and the minified CSS
- lawyers can not tell the difference between the original and the minified CSS

Compared to other minifiers, [PostCSS Minify] is purely focused on correctness and fidelity.  
[PostCSS Minify] only collapses whitespace and comments while preserving those comments that are important for legal compliance.

[PostCSS Minify] is not a CSS optimizer, it does not try to reduce the size of the CSS file by altering the CSS itself.

```pcss
/*
 * License : MIT-0
 * legal text is preserved
 */

/*
 * Copyright: CSSTools Authors
 * legal text is preserved
 */

/*! an important comment */

:root {
	--mainColor: #12345678;
}

body {
	color: var(--mainColor);
	font-family: system-ui;
}

a {
	color: rgb(0 0 100% / 90%);

	&:hover {
		color: rebeccapurple;
	}

	> span {
		color: color-mix(in oklch, cyan, green 25%);
	}
}

:is(input, button):is(:hover, :focus) {
	color: oklch(40% 0.268735435 34.568626);
}
```

becomes :

```pcss
/*
 * License : MIT-0
 * legal text is preserved
 *//*
 * Copyright: CSSTools Authors
 * legal text is preserved
 *//*! an important comment */:root{--mainColor: #12345678;}body{color:var(--mainColor);font-family:system-ui}a{color:rgb(0 0 100% / 90%);&:hover{color:rebeccapurple}> span{color:color-mix(in oklch, cyan, green 25%)}}:is(input, button):is(:hover, :focus){color:oklch(40% 0.268735435 34.568626)}
```

## Usage

Add [PostCSS Minify] to your project:

```bash
npm install postcss @csstools/postcss-minify --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssMinify = require('@csstools/postcss-minify');

postcss([
	postcssMinify(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```



[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-minify

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Minify]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-minify
