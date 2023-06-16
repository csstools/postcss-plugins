# [@csstools/stylelint-no-at-nest-rule](https://www.npmjs.com/package/@csstools/stylelint-no-at-nest-rule)

[![version](https://img.shields.io/npm/v/@csstools/stylelint-no-at-nest-rule.svg)](https://www.npmjs.com/package/@csstools/stylelint-no-at-nest-rule)

Prevent usage of `@nest` in CSS.

```css
/* valid */
.element {
	article & {}
}

/* invalid */
.element {
	@nest article & {}
}
```

The CSS Nesting specification has changed and `@nest` is no longer required and has been removed from the specification.  
Since it will never be valid CSS in browsers it is important to migrate away from it.

**Valid CSS :**

```css
.element {
	article {}

	article & {}
}
```

**Invalid CSS :**

```css
.foo {
	@nest article {}

	@nest article & {}
}
```

## Usage

`npm install --save-dev @csstools/stylelint-no-at-nest-rule`

```js
// stylelint.config.js
module.exports = {
	plugins: [
		"@csstools/stylelint-no-at-nest-rule",
	],
	rules: {
		"@csstools/stylelint-no-at-nest-rule": true,
	},
}
```
