# [@csstools/stylelint-no-invalid-at-import-rules-when-bundling](https://www.npmjs.com/package/@csstools/stylelint-no-invalid-at-import-rules-when-bundling)

[![version](https://img.shields.io/npm/v/@csstools/stylelint-no-invalid-at-import-rules-when-bundling.svg)](https://www.npmjs.com/package/@csstools/stylelint-no-invalid-at-import-rules-when-bundling)

Ensure that your `@import` statements are compatible with CSS bundlers

```css
/* valid */
@import 'foo.css';

/* invalid */
@import 'foo.css?bar=1';
```

## Usage

`npm install --save-dev @csstools/stylelint-no-invalid-at-import-rules-when-bundling`

```js
// stylelint.config.js
module.exports = {
	plugins: [
		"@csstools/stylelint-no-invalid-at-import-rules-when-bundling",
	],
	rules: {
		"@csstools/stylelint-no-invalid-at-import-rules-when-bundling": true,
	},
}
```
