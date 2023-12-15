<!-- Available Variables: -->
<!-- <humanReadableName> PostCSS Your Plugin -->
<!-- <exportName> postcssYourPlugin -->
<!-- <packageName> @csstools/postcss-your-plugin -->
<!-- <packageVersion> 1.0.0 -->
<!-- <packagePath> plugins/postcss-your-plugin -->
<!-- <cssdbId> your-feature -->
<!-- <specUrl> https://www.w3.org/TR/css-color-4/#funcdef-color -->
<!-- <example.css> file contents for examples/example.css -->
<!-- <header> -->
<!-- <usage> usage instructions -->
<!-- <envSupport> -->
<!-- <corsWarning> -->
<!-- <linkList> -->
<!-- <parallelBuildsNotice> -->
<!-- to generate : npm run docs -->

<header>

[<humanReadableName>] lets you style elements relative to other elements in CSS, following the [Selectors Level 4] specification.

To use this feature you need to do two things :
- add the [PostCSS plugin](#usage) that transforms the selector into a class or attribute
- add the [browser polyfill](#browser) that sets the attribute or class on elements in a browser

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<envSupport>

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default the original rules are preserved.

```js
<exportName>({ preserve: false })
```

```pcss
<example.css>

/* becomes */

<example.preserve-false.expect.css>
```

### specificityMatchingName

The `specificityMatchingName` option allows you to change the selector that is used to adjust specificity.
The default value is `does-not-exist`.
If this is an actual class, id or tag name in your code, you will need to set a different option here.

See how `:not` is used to modify [specificity](#specificity).

```js
<exportName>({ specificityMatchingName: 'something-random' })
```

[specificity 1, 2, 0](https://polypane.app/css-specificity-calculator/#selector=.x%3Ahas(%3E%20%23a%3Ahover))

Before :

```css
.x:has(> #a:hover) {
	order: 11;
}
```

After :

[specificity 1, 2, 0](https://polypane.app/css-specificity-calculator/#selector=%5Bcsstools-has-1a-3c-1m-2w-2p-37-14-1q-w-z-2p-1m-2w-33-3a-2t-36-15%5D%3Anot(%23does-not-exist)%3Anot(.does-not-exist))

```css
[csstools-has-1a-3c-1m-2w-2p-37-14-1q-w-z-2p-1m-2w-33-3a-2t-36-15]:not(#does-not-exist):not(.does-not-exist) {
	order: 11;
}
```

## ⚠️ Known shortcomings

### Performance

Determining which elements match a `:has` selector is relatively slow through a polyfill compared to the native feature.

A very large DOM or many and complex `:has` selectors can cause performance issues.  
JavaScript frameworks that rewrite the DOM will be particularly affected by this.

_Any contributions to speedup matching are welcome.  
Please open an issue to discuss proposed changes if you are interested in contributing._

### Specificity

`:has` transforms will result in at least one attribute selector with specificity `0, 1, 0`.<br>
If your selector only has tags we won't be able to match the original specificity.

Before :

[specificity 0, 0, 2](https://polypane.app/css-specificity-calculator/#selector=figure%3Ahas(%3E%20img))

```css
figure:has(> img)
```

After :

[specificity 0, 1, 2](https://polypane.app/css-specificity-calculator/#selector=%5Bcsstools-has-2u-2x-2v-39-36-2t-1m-2w-2p-37-14-1q-w-2x-31-2v-15%5D%3Anot(does-not-exist)%3Anot(does-not-exist))

```css
[csstools-has-2u-2x-2v-39-36-2t-1m-2w-2p-37-14-1q-w-2x-31-2v-15]:not(does-not-exist):not(does-not-exist)
```

### Plugin order

As selectors are encoded, this plugin (or `postcss-preset-env`) must be run after any other plugin that transforms selectors.

If other plugins are used, you need to place these in your config before `postcss-preset-env` or `css-has-pseudo`.

Please let us know if you have issues with plugins that transform selectors.
Then we can investigate and maybe fix these.

## Browser

```js
// initialize cssHasPseudo
import cssHasPseudo from '<packageName>/browser';
cssHasPseudo(document);
```

or

```html
<!-- When using a CDN url you will have to manually update the version number -->
<script src="https://unpkg.com/<packageName>@<packageVersion>/dist/browser-global.js"></script>
<script>cssHasPseudo(document)</script>
```

⚠️ Please use a versioned url, like this : `https://unpkg.com/<packageName>@<packageVersion>/dist/browser-global.js`
Without the version, you might unexpectedly get a new major version of the library with breaking changes.

[<humanReadableName>] works in all major browsers, including
Internet Explorer 11. With a [Mutation Observer polyfill](https://github.com/webmodules/mutation-observer), the script will work
down to Internet Explorer 9.

### Browser Usage

#### hover

The `hover` option determines if `:hover` pseudo-class should be tracked.
This is disabled by default because it is an expensive operation.

```js
cssHasPseudo(document, { hover: true });
```

#### observedAttributes

The `observedAttributes` option determines which html attributes are observed.
If you do any client side modification of non-standard attributes and use these in combination with `:has()` you should add these here.

```js
cssHasPseudo(document, { observedAttributes: ['something-not-standard'] });
```

#### forcePolyfill

The `forcePolyfill` option determines if the polyfill is used even when the browser has native support.
This is needed when you set `preserve: false` in the PostCSS plugin config.

```js
cssHasPseudo(document, { forcePolyfill: true });
```

#### debug

The `debug` option determines if errors are emitted to the console in browser.
By default the polyfill will not emit errors or warnings.

```js
cssHasPseudo(document, { debug: true });
```

### Browser Dependencies

Web API's:

- [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) with support for post CSS 2.1 selectors and `:scope` selectors.

ECMA Script:

- `Array.prototype.filter`
- `Array.prototype.forEach`
- `Array.prototype.indexOf`
- `Array.prototype.join`
- `Array.prototype.map`
- `Array.prototype.splice`
- `RegExp.prototype.exec`
- `String.prototype.match`
- `String.prototype.replace`
- `String.prototype.split`

<corsWarning>

### Using with Next.js

Given that Next.js imports packages both on the browser and on the server, you need to make sure that the package is only imported on the browser.

As outlined in the [Next.js documentation](https://nextjs.org/docs/advanced-features/dynamic-import#with-external-libraries), you need to load the package with a dynamic import:

```jsx
useEffect(async () => {
	const cssHasPseudo = (await import('<packageName>/browser')).default;
	cssHasPseudo(document);
}, []);
```

We recommend you load the polyfill as high up on your Next application as possible, such as your `pages/_app.ts` file.

## How it works

The [<humanReadableName>] clones rules containing `:has()`,
replacing them with an alternative `[csstools-has-]` selector.

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

Next, the [browser script](#browser) adds a `[:has]` attribute to
elements otherwise matching `:has` natively.

```html
<div class="title" [csstools-has-1a-38-2x-38-30-2t-1m-2w-2p-37-14-17-w-34-15]>
	<h1>A title block</h1>
	<p>With an extra paragraph</p>
</div>
```

<linkList>
[Selectors Level 4]: <specUrl>
