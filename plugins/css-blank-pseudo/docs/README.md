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

[<humanReadableName>] lets you style form elements when they are empty, following 
the [Selectors Level 4] specification.

To use this feature you need to do two things :
- add the [PostCSS plugin](#usage) that transforms the selector into a class or attribute
- add the [browser polyfill](#browser) that sets the attribute or class on elements in a browser

```css
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<envSupport>

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is preserved.

```js
<exportName>({ preserve: false })
```

```css
<example.css>

/* becomes */

<example.preserve-false.expect.css>
```

### replaceWith

The `replaceWith` option determines the selector to use when replacing
the `:blank` pseudo. By default is `[blank]`

```js
<exportName>({ replaceWith: '.css-blank' })
```

```css
<example.css>

/* becomes */

<example.preserve-true.expect.css>
```

Note that changing this option implies that it needs to be passed to the
browser polyfill as well.

### disablePolyfillReadyClass

The `disablePolyfillReadyClass` option determines if selectors are prefixed with an indicator class.
This class is only set on your document if the polyfill loads and is needed.

By default this option is `false`.
Set this to `true` to prevent the class from being added.

```js
<exportName>({ disablePolyfillReadyClass: true })
```

```css
<example.css>

/* becomes */

<example.disable-polyfill-ready-class.expect.css>
```

## Browser

```js
import cssBlankPseudoInit from 'css-blank-pseudo/browser';

cssBlankPseudoInit();
```

or

```html
<!-- When using a CDN url you will have to manually update the version number -->
<script src="https://unpkg.com/css-blank-pseudo@<packageVersion>/dist/browser-global.js"></script>
<script>cssBlankPseudoInit()</script>
```

[<humanReadableName>] works in all major browsers, including Safari 6+ and
Internet Explorer 9+ without any additional polyfills.

This plugin conditionally uses `MutationObserver` to ensure recently inserted 
inputs get correct styling upon insertion. If you intend to rely on that 
behaviour for browsers that do not support `MutationObserver`, you have two
options:

1. Polyfill `MutationObserver`. As long as it runs before `cssBlankPseudoInit`,
the polyfill will work.
2. If you don't want to polyfill `MutationObserver` you can also manually fire
a `change` event upon insertion so they're automatically inspected by the
polyfill.

### Browser Usage

#### force

The `force` option determines whether the library runs even if the browser 
supports the selector or not. By default, it won't run if the browser does
support the selector.

```js
cssBlankPseudoInit({ force: true });
```

#### replaceWith

Similar to the option for the PostCSS Plugin, `replaceWith` determines the
attribute or class to apply to an element when it's considered to be `:blank`.

```js
cssBlankPseudoInit({ replaceWith: '.css-blank' });
```

This option should be used if it was changed at PostCSS configuration level.
Please note that using a class, leverages `classList` under the hood which 
might  not be supported on some old browsers such as IE9, so you may need 
to polyfill `classList` in those cases.

### Using with Next.js

Given that Next.js imports packages both on the browser and on the server, you need to make sure that the package is only imported on the browser.

As outlined in the [Next.js documentation](https://nextjs.org/docs/advanced-features/dynamic-import#with-external-libraries), you need to load the package with a dynamic import:

```jsx
useEffect(async () => {
	const cssBlankPseudoInit = (await import('<packageName>/browser')).default;
	cssBlankPseudoInit();
}, []);
```

We recommend you load the polyfill as high up on your Next application as possible, such as your `pages/_app.ts` file.

<linkList>
[Selectors Level 4]: <specUrl>
