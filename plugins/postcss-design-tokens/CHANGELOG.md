# Changes to PostCSS Design Tokens

### Unreleased (major)

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))

### 2.0.4

_April 10, 2023_

- Updated `@csstools/css-tokenizer` to `2.1.1` (patch)
- Updated `@csstools/css-parser-algorithms` to `2.1.1` (patch)

### 2.0.3

_February 15, 2023_

- Fixed: file watching with PostCSS CLI

### 2.0.2

_January 28, 2023_

- Fix unit conversion

### 2.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 2.0.0

_January 24, 2023_

- Updated: Support for Node v14+ (major).
- Added support for design tokens in at rules (`@media`, `@supports`, ...)

### 1.2.0

_September 7, 2022_

- Added support for design token file imports from npm packages.
- Added support for arbitrary unit assignment to unit-less design tokens.

npm package : `@your-org/your-tokens`

```json
{
	"font-size": 0.2
}
```

```css
@design-tokens url(node_modules://@your-org/your-tokens/tokens.json) format('style-dictionary3');

.example {
	font-size: design-token('font-size' to vh);

	/* becomes */
	font-size: 0.2vh;
}
```

### 1.1.1

_August 23, 2022_

- Prevent stack overflow failures when importing files with format `style-dictionary3` that are not of that format.

### 1.1.0

_August 2, 2022_

- Added `valueFunctionName` option to control the `design-token` function name.
- Added `importAtRuleName` option to control the `design-tokens` at-rule name.

### 1.0.0

_May 23, 2022_

- Initial version
