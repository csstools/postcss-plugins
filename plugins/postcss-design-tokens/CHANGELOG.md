# Changes to PostCSS Design Tokens

### Unreleased (patch)

- Updated `@csstools/css-tokenizer` to `2.1.1` (patch)

### 2.0.3 (February 15, 2023)

- Fixed: file watching with PostCSS CLI

### 2.0.2 (January 28, 2023)

- Fix unit conversion

### 2.0.1 (January 28, 2023)

- Improve `types` declaration in `package.json`

### 2.0.0 (January 24, 2023)

- Updated: Support for Node v14+ (major).
- Added support for design tokens in at rules (`@media`, `@supports`, ...)

### 1.2.0 (September 7, 2022)

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

### 1.1.1 (August 23, 2022)

- Prevent stack overflow failures when importing files with format `style-dictionary3` that are not of that format.

### 1.1.0 (August 2, 2022)

- Added `valueFunctionName` option to control the `design-token` function name.
- Added `importAtRuleName` option to control the `design-tokens` at-rule name.

### 1.0.0 (May 23, 2022)

- Initial version
