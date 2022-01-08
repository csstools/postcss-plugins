# PostCSS Is Pseudo [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![CSS Standard Status][css-img]][css-url]
[![Support Chat][git-img]][git-url]

[PostCSS Is Pseudo] lets you use the `:is` pseudo class function, following the
[CSS Selector] specification.

```css
:is(input, button):is(:hover, :focus) {
	order: 1;
}
```

Becomes :

```css
input:hover {
	order: 1;
}
input:focus {
	order: 1;
}
button:hover {
	order: 1;
}
button:focus {
	order: 1;
}
```

## Usage

Add [PostCSS Is Pseudo] to your project:

```bash
npm install @csstools/postcss-is-pseudo --save-dev
```

Use [PostCSS Is Pseudo] as a [PostCSS] plugin:

```js
import postcss from 'postcss';
import postcssIsPseudo from '@csstools/postcss-is-pseudo';

postcss([
  postcssIsPseudo(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Is Pseudo] runs in all Node environments, with special instructions for:

| [Node](INSTALL.md#node) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- |

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is not preserved.

```js
postcss([
  postcssIsPseudo({ preserve: true })
]).process(YOUR_CSS /*, processOptions */);
```

```css
:is(input, button):is(:hover, :focus) {
	order: 1;
}
```

Becomes :

```css
input:hover {
	order: 1;
}
input:focus {
	order: 1;
}
button:hover {
	order: 1;
}
button:focus {
	order: 1;
}
:is(input, button):is(:hover, :focus) {
	order: 1;
}
```

### specificityMatchingName

The `specificityMatchingName` option allows you to change to selector used to adjust specificity.
The default value is `does-not-exist`.
If this is an actual class, id or tag name in your code, you will need to set a different option here.

See how `:not` is used to modify [specificity](#specificity).

```js
postcss([
  postcssIsPseudo({ specificityMatchingName: 'something-random' })
]).process(YOUR_CSS /*, processOptions */);
```

```css
:is(.button, button):hover {
	order: 7;
}
```

Becomes :

```css
.button:hover {
	order: 7;
}

button:not(.something-random):hover {
	order: 7;
}
```

### onComplexSelector

Do not transform complex selectors in `:is` pseudo classes.

```js
postcss([
  postcssIsPseudo({ onComplexSelector: 'skip' })
]).process(YOUR_CSS /*, processOptions */);
```

Warn on complex selectors in `:is` pseudo classes.

```js
postcss([
  postcssIsPseudo({ onComplexSelector: 'warning' })
]).process(YOUR_CSS /*, processOptions */);
```

## ⚠️ Known shortcomings

### Specificity

`:is` takes the specificity of the most specific list item.
We can increase specificity with `:not` selectors, but we can't decrease it.

Converted selectors are ensured to have the same specificity as `:is` for the most important bit.
Less important bits can have higher specificity that `:is`.

Before :

specificity: `[0, 2, 0]`

```css
:is(:hover, :focus):is(.button, button) {
	order: 7;
}
```

After :

```css
/* specificity: [0, 2, 0] */
.button:hover {
	order: 7;
}

/* specificity: [0, 2, 1] */
/* last bit is higher than it should be, but middle bit matches */
button:not(.does-not-exist):hover {
	order: 7;
}

/* specificity: [0, 2, 0] */
.button:focus {
	order: 7;
}

/* specificity: [0, 2, 1] */
/* last bit is higher than it should be, but middle bit matches */
button:not(.does-not-exist):focus {
	order: 7;
}
```

### Complex selectors

Before :


```css
:is(.alpha > .beta) ~ :is(:focus > .beta) {
	order: 2;
}
```

After :

```css
.alpha > .beta ~ :focus > .beta {
	order: 2;
}
```

_this is a different selector than expected as `.beta ~ :focus` matches `.beta` followed by `:focus`._<br>
_avoid these cases._<br>
_writing the selector without `:is()` is advised here_

```css
/* without is */
.alpha:focus > .beta ~ .beta {
	order: 2;
}
```

If you have a specific pattern you can open an issue to discuss it.
We can detect and transform some cases but can't generalize them into a single solution that tackles all of them. 

[css-img]: https://cssdb.org/badge/nesting-rules.svg
[css-url]: https://cssdb.org/#nesting-rules
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/@csstools/postcss-is-pseudo.svg
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-is-pseudo

[CSS Selector]: https://www.w3.org/TR/selectors-4/#matches
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Is Pseudo]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-is-pseudo
