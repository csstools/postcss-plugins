# Changes to PostCSS Lab Function

### 6.0.7

_October 9, 2023_

- Updated [`@csstools/css-color-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser) to [`1.4.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser/CHANGELOG.md#140) (minor)
- Updated [`@csstools/postcss-progressive-custom-properties`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties) to [`3.0.2`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties/CHANGELOG.md#302) (patch)

### 6.0.6

_October 2, 2023_

- Updated [`@csstools/css-color-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser) to [`1.3.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser/CHANGELOG.md#133) (patch)

### 6.0.5

_September 24, 2023_

- Small performance improvements
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#221) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#232) (patch)
- Updated [`@csstools/css-color-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser) to [`1.3.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser/CHANGELOG.md#132) (patch)

### 6.0.4

_September 18, 2023_

- Updated [`@csstools/postcss-progressive-custom-properties`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties) to [`3.0.1`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties/CHANGELOG.md#301) (patch)

### 6.0.3

_September 2, 2023_

- Updated [`@csstools/css-color-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser) to [`1.3.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser/CHANGELOG.md#131) (patch)

### 6.0.2

_August 28, 2023_

- Updated [`@csstools/css-color-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser) to [`1.3.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser/CHANGELOG.md#130) (minor)

### 6.0.1

_July 24, 2023_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#220) (minor)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#231) (patch)

### 6.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#230) (minor)
- Updated [`@csstools/postcss-progressive-custom-properties`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties) to [`3.0.0`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties/CHANGELOG.md#300) (major)
- Updated [`@csstools/css-color-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser) to [`1.2.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser/CHANGELOG.md#122) (patch)

### 5.2.3

_June 1, 2023_

- Updated `@csstools/postcss-progressive-custom-properties` to `2.3.0` (minor)

### 5.2.2

_May 19, 2023_

- Ignore relative color syntax
- Updated `@csstools/postcss-progressive-custom-properties` to `2.2.0` (minor)
- Updated `@csstools/css-color-parser` to `1.2.0` (minor)

### 5.2.1

_April 10, 2023_

- Updated `@csstools/css-tokenizer` to `2.1.1` (patch)
- Updated `@csstools/css-parser-algorithms` to `2.1.1` (patch)
- Updated `@csstools/css-color-parser` to `1.1.2` (patch)

### 5.2.0

_March 25, 2023_

- Add `@csstools/css-color-parser` dependency for all color value transformations.
- Add support for `calc` expressions in color components.
- Skip `color(display-p3 0 0 0)` fallbacks when the color is already in the `srgb` gamut.

### 5.1.0

_February 6, 2023_

- Add: `@csstools/color-helpers` dependency for all color value transformations.

### 5.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 5.0.0

_January 24, 2023_

- Updated: Support for Node v14+ (major).

### 4.2.1

_July 8, 2022_

- Fix case insensitive matching.

### 4.2.0

_April 4, 2022_

- Allow percentage and number units in more color components.

```css
.percentages {
	color-1: lab(40% 35% 30%);
	color-2: lch(40% 50% 39);

	/* becomes */

	color-1: rgb(163, 57, 35);
	color-1: color(display-p3 0.59266 0.25309 0.17075);
	color-2: rgb(181, 30, 19);
	color-2: color(display-p3 0.65205 0.18193 0.12753);
}

.numbers {
	color-1: lab(40 35 30);
	color-2: lch(40 50 39);

	/* becomes */

	color-1: rgb(152, 68, 47);
	color-1: color(display-p3 0.55453 0.28432 0.20788);
	color-2: rgb(157, 63, 45);
	color-2: color(display-p3 0.57072 0.27138 0.20109);
}
```

### 4.1.2

_March 8, 2022_

- Fix gamut mapping giving overly unsaturated colors.
- Implement powerless color components in gamut mapping.

### 4.1.1

_February 15, 2022_

- Fix plugin name

### 4.1.0

_February 12, 2022_

- Add gamut mapping for out of gamut colors.
- Add conversion to `display-p3` as a wider gamut fallback.

[Read more about out of gamut colors](https://github.com/csstools/postcss-plugins/blob/main/plugins/postcss-lab-function/README.md#out-of-gamut-colors)

[Read more about `color(display-p3 0 0 0)`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color())

```css
.color-lab {
	color: lab(40% 56.6 39);
}

/* with a display-p3 fallback : */
.color {
	color: rgb(179, 35, 35);
	color: color(display-p3 0.64331 0.19245 0.16771);
}
```

### 4.0.4

_February 5, 2022_

- Improved `es module` and `commonjs` compatibility

### 4.0.3

_January 2, 2022_

- Removed Sourcemaps from package tarball.
- Moved CLI to CLI Package. See [announcement](https://github.com/csstools/postcss-plugins/discussions/121).

### 4.0.2

_December 13, 2021_

- Changed: now uses `postcss-value-parser` for parsing.
- Updated: documentation
- Added: support for CSS variables with `preserve: true` option.
- Fixed: Hue values with units in `lch` functions are now correctly handled.
- Fixed: Rounding of values to match current browser behavior.

### 4.0.1

_November 18, 2021_

- Added: Safeguards against postcss-values-parser potentially throwing an error.
- Updated: postcss-value-parser to 6.0.1 (patch)

### 4.0.0

_September 17, 2021_

- Updated: Support for PostCS 8+ (major).
- Updated: Support for Node 12+ (major).

### 3.1.2

_April 25, 2020_

- Updated: Publish

### 3.1.1

_April 25, 2020_

- Updated: Using `walkType` to evade walker bug in `postcss-values-parser`

### 3.1.0

_April 25, 2020_

- Updated: `postcss-values-parser` to 3.2.0 (minor).

### 3.0.1

_April 12, 2020_

- Updated: Ownership moved to CSSTools.

### 3.0.0

_April 12, 2020_

- Updated: `postcss-values-parser` to 3.1.1 (major).
- Updated: Node support to 10.0.0 (major).
- Updated: Feature to use new percentage syntax.
- Removed: Support for the removed `gray()` function.

### 2.0.1

_September 18, 2018_

- Updated: PostCSS Values Parser 2.0.0

### 2.0.0

_September 17, 2018_

- Updated: Support for PostCSS 7+
- Updated: Support for Node 6+

### 1.1.0

_July 24, 2018_

- Added: Support for `gray(a / b)` as `lab(a 0 0 / b)`

### 1.0.1

_May 11, 2018_

- Fixed: Values beyond the acceptable 0-255 RGB range

### 1.0.0

_May 11, 2018_

- Initial version
