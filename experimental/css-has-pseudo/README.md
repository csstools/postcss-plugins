# EXPERIMENTAL : CSS Has Pseudo [<img src="http://jonathantneal.github.io/js-logo.svg" alt="" width="90" height="90" align="right">][EXPERIMENTAL CSS Has Pseudo]

[![NPM Version][npm-img]][npm-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

⚠️ Experimental version of [CSS Has Pseudo](https://github.com/csstools/postcss-plugins/tree/main/plugins/css-has-pseudo)

[EXPERIMENTAL CSS Has Pseudo] lets you style elements relative to other elements in CSS,
following the [Selectors Level 4] specification.

[!['Can I use' table](https://caniuse.bitsofco.de/image/css-has.png)](https://caniuse.com/#feat=css-has)

```css
a:has(> img) {
	/* style links that contain an image */
}

h1:has(+ p) {
	/* style level 1 headings that are followed by a paragraph */
}

section:not(:has(h1, h2, h3, h4, h5, h6)) {
	/* style sections that don’t contain any heading elements */
}

body:has(:focus) {
	/* style the body if it contains a focused element */
}
```

Next, use your transformed CSS with this script:

```html
<link rel="stylesheet" href="TRANSFORMED.css">
<script src="https://unpkg.com/@csstools/css-has-pseudo-experimental/dist/browser-global.js"></script>
<script>cssHasPseudo(document)</script>
```

⚠️ Please use a versioned url, like this : `https://unpkg.com/@csstools/css-has-pseudo-experimental@0.1.0/dist/browser-global.js`
Without the version, you might unexpectedly get a new major version of the library with breaking changes.

⚠️ If you were using an older version via a CDN, please update the entire url.
The old URL will no longer work.

That’s it. The script works in most browser versions, including
Internet Explorer 11. With a [Mutation Observer polyfill], the script will work
down to Internet Explorer 9.

See [README BROWSER](README-BROWSER.md) for more information.

## How it works

The [PostCSS plugin](README-POSTCSS.md) clones rules containing `:has`,
replacing them with an alternative `[:has]` selector.

```css
body:has(:focus) {
	background-color: yellow;
}

section:not(:has(h1, h2, h3, h4, h5, h6)) {
	background-color: gray;
}

/* becomes */

[csstools-has-2q-33-2s-3d-1m-2w-2p-37-14-1m-2u-33-2r-39-37-15]:not(does-not-exist) {
	background-color: yellow;
}

body:has(:focus) {
	background-color: yellow;
}

[csstools-has-37-2t-2r-38-2x-33-32-1m-32-33-38-14-1m-2w-2p-37-14-2w-1d-18-w-2w-1e-18-w-2w-1f-18-w-2w-1g-18-w-2w-1h-18-w-2w-1i-15-15]:not(does-not-exist):not(does-not-exist) {
	background-color: gray;
}

section:not(:has(h1, h2, h3, h4, h5, h6)) {
	background-color: gray;
}
```

Next, the [JavaScript library](README-BROWSER.md) adds a `[:has]` attribute to
elements otherwise matching `:has` natively.

```html
<body csstools-has-2q-33-2s-3d-1m-2w-2p-37-14-1m-2u-33-2r-39-37-15>
	<input value="This element is focused">
</body>
```

## PostCSS Preset Env

When you use `postcss-preset-env` you must disable the regular plugin.

The experimental plugin must be added after any other plugin that modifies selectors.

```js
plugins: [
	// other plugins
	postcssPresetEnv({
		features: {
			'css-has-pseudo': false
		}
	}),
	// other plugins
	cssHasPseudoExperimental(), // last
]
```

[discord]: https://discord.gg/bUadyRwkJS
[npm-img]: https://img.shields.io/npm/v/@csstools/css-has-pseudo-experimental.svg
[npm-url]: https://www.npmjs.com/package/@csstools/css-has-pseudo-experimental

[EXPERIMENTAL CSS Has Pseudo]: https://github.com/csstools/postcss-plugins/tree/main/experimental/css-has-pseudo
[Mutation Observer polyfill]: https://github.com/webmodules/mutation-observer
[Selectors Level 4]: https://drafts.csswg.org/selectors-4/#has-pseudo
