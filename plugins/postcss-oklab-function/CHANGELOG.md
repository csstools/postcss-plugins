# Changes to PostCSS OKLab Function

### 3.0.7

_October 9, 2023_

- Updated [`@csstools/css-color-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser) to [`1.4.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser/CHANGELOG.md#140) (minor)
- Updated [`@csstools/postcss-progressive-custom-properties`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties) to [`3.0.2`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties/CHANGELOG.md#302) (patch)

### 3.0.6

_October 2, 2023_

- Updated [`@csstools/css-color-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser) to [`1.3.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser/CHANGELOG.md#133) (patch)

### 3.0.5

_September 24, 2023_

- Small performance improvements
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#221) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#232) (patch)
- Updated [`@csstools/css-color-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser) to [`1.3.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser/CHANGELOG.md#132) (patch)

### 3.0.4

_September 18, 2023_

- Updated [`@csstools/postcss-progressive-custom-properties`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties) to [`3.0.1`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties/CHANGELOG.md#301) (patch)

### 3.0.3

_September 2, 2023_

- Updated [`@csstools/css-color-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser) to [`1.3.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser/CHANGELOG.md#131) (patch)

### 3.0.2

_August 28, 2023_

- Updated [`@csstools/css-color-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser) to [`1.3.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser/CHANGELOG.md#130) (minor)

### 3.0.1

_July 24, 2023_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#220) (minor)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#231) (patch)

### 3.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#230) (minor)
- Updated [`@csstools/postcss-progressive-custom-properties`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties) to [`3.0.0`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties/CHANGELOG.md#300) (major)
- Updated [`@csstools/css-color-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser) to [`1.2.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser/CHANGELOG.md#122) (patch)

### 2.2.3

_June 1, 2023_

- Updated `@csstools/postcss-progressive-custom-properties` to `2.3.0` (minor)


### 2.2.2

_May 19, 2023_

- Ignore relative color syntax
- Updated `@csstools/postcss-progressive-custom-properties` to `2.2.0` (minor)
- Updated `@csstools/css-color-parser` to `1.2.0` (minor)



### 2.2.1

_April 10, 2023_

- Updated `@csstools/css-tokenizer` to `2.1.1` (patch)
- Updated `@csstools/css-parser-algorithms` to `2.1.1` (patch)
- Updated `@csstools/css-color-parser` to `1.1.2` (patch)

### 2.2.0

_March 25, 2023_

- Add `@csstools/css-color-parser` dependency for all color value transformations.
- Add support for `calc` expressions in color components.
- Skip `color(display-p3 0 0 0)` fallbacks when the color is already in the `srgb` gamut.

### 2.1.0

_February 6, 2023_

- Add: `@csstools/color-helpers` dependency for all color value transformations.

### 2.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 2.0.0

_January 24, 2023_

- Updated: Support for Node v14+ (major).

### 1.1.1

_July 8, 2022_

- Fix case insensitive matching.

### 1.1.0

_April 4, 2022_

- Allow percentage and number units in more color components.

```css
.percentages {
	color-1: oklab(40% 0.309% 0.975%);
	color-2: oklch(40% 31.718385875% 34.568626);

	/* becomes */

	color-1: rgb(73, 71, 69);
	color-1: color(display-p3 0.28515 0.27983 0.27246);
	color-2: rgb(126, 37, 15);
	color-2: color(display-p3 0.45368 0.16978 0.09411);
}

.numbers {
	color-1: oklab(0.40 0.001236 0.0039);
	color-2: oklch(0.40 0.1268735435 34.568626);

	/* becomes */

	color-1: rgb(73, 71, 69);
	color-1: color(display-p3 0.28515 0.27983 0.27246);
	color-2: rgb(126, 37, 15);
	color-2: color(display-p3 0.45368 0.16978 0.09411);
}
```

### 1.0.2

_March 8, 2022_

- Fix gamut mapping giving overly unsaturated colors.
- Implement powerless color components in gamut mapping.

### 1.0.1

_February 12, 2022_

- Updated `@csstools/postcss-progressive-custom-properties` to `1.1.0`.

### 1.0.0

_February 11, 2022_

- Initial version
