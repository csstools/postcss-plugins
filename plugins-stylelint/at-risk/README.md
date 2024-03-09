# [@csstools/stylelint-at-risk](https://www.npmjs.com/package/@csstools/stylelint-at-risk)

[![version](https://img.shields.io/npm/v/@csstools/stylelint-at-risk.svg)](https://www.npmjs.com/package/@csstools/stylelint-at-risk)

Warn when features are used that are at risk of being removed or changed.

- [Re-ordering of declarations after other nested rules or at-rules](https://github.com/w3c/csswg-drafts/issues/8738)

_This rule will be updated with similar warnings if and when they are needed._

## Why?

Sometimes a web feature doesn't ship quite right and should be changed.  
While at the same time it is very important not to break existing web content.  
This plugin aims to warn you when you are using a CSS feature that is at risk of being removed or changed.  

Reducing the number of occurrences in the wild makes it more likely that the needed change can be made.

## Usage

`npm install --save-dev @csstools/stylelint-at-risk`

```js
// stylelint.config.js
module.exports = {
	plugins: [
		"@csstools/stylelint-at-risk",
	],
	rules: {
		"@csstools/stylelint-at-risk": true,
	},
}
```
