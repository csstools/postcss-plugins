# Changes to CSS Color Parser

### 1.4.0

_October 9, 2023_

- Add utility to determine if a color is in the Display P3 gamut.

### 1.3.3

_October 2, 2023_

- Fix interpolation of `hue` when either or both components are `none` and `longer` is the interpolation method.

### 1.3.2

_September 24, 2023_

- Small performance improvements
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#221) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#232) (patch)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`1.1.4`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#114) (patch)

### 1.3.1

_September 2, 2023_

- Fix clipping of values in `hsl`, `hwb` and `rgb` color notations.
- Updated [`@csstools/color-helpers`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers) to [`3.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers/CHANGELOG.md#302) (patch)

### 1.3.0

_August 28, 2023_

- Add a `serializeOKLCH` function.
- Always convert to the target color space, even when the input color is already in that specific color space.
- Correctly apply the hue interpolation method when either angle is missing.
- Updated [`@csstools/color-helpers`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers) to [`3.0.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers/CHANGELOG.md#301) (patch)

### 1.2.3

_July 24, 2023_ 

- Allow number values in `hwb`.
- Fix value calculation for `s`, `l` (`hsl`) and `w`, `b` (`hwb`) components in relative color syntax.
- `a` and `b` components in `lab` and `oklab` are analogous.
- Powerless components are limited to achromatic colors and only affect `hue` unless otherwise specified.
- Fix value normalization.
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#220) (minor)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#231) (patch)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`1.1.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#113) (patch)

### 1.2.2

_July 3, 2023_

- Updated [`@csstools/color-helpers`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers) to [`3.0.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers/CHANGELOG.md#300) (major)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#230) (minor)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`1.1.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#112) (patch)

### 1.2.1

_June 14, 2023_

- Fix value calculation for `hue` components in relative color syntax.

### 1.2.0

_May 19, 2023_

- Add support for relative color syntax.
- Updated `@csstools/color-helpers` to `2.1.0` (minor)

### 1.1.2

_April 10, 2023_

- Updated `@csstools/css-tokenizer` to `2.1.1` (patch)
- Updated `@csstools/css-parser-algorithms` to `2.1.1` (patch)
- Updated `@csstools/css-calc` to `1.1.1` (patch)

### 1.1.1

_April 10, 2023_

- Improve the detection of math function in color notations.

### 1.1.0

_March 28, 2023_

- Add a flag to `serializeP3` and `serializeRGB` to skip gamut mapping.

### 1.0.0

_March 25, 2023_

- Initial version
