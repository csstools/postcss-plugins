# Changes to CSS Color Parser

### Unreleased (major)

- Updated: Support for Node `20.19.0` or later (major).
- Removed: `commonjs` API. In supported Node versions `require(esm)` will work without needing to make code changes.

### 3.1.0

_August 22, 2025_

- Add support for `display-p3-linear` in `color(display-p3-linear 0.3081 0.014 0.0567)`
- Add support for `display-p3-linear` in `color-mix(in display-p3-linear, red, blue)`
- Add support for omitting the color space in `color-mix(red, blue)`
- Add support for `alpha(from red / 0.5)`
- Updated [`@csstools/color-helpers`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers) to [`5.1.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers/CHANGELOG.md#510) (minor)

### 3.0.10

_May 27, 2025_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`3.0.4`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#304) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`3.0.5`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#305) (patch)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`2.1.4`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#214) (patch)

### 3.0.9

_April 19, 2025_

- Drop the `max` keyword for `contrast-color( <color> )`
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`2.1.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#213) (patch)

### 3.0.8

_February 23, 2025_

- Use `Number.isNaN` instead of `NaN` for consistency.
- Updated [`@csstools/color-helpers`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers) to [`5.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers/CHANGELOG.md#502) (patch)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`2.1.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#212) (patch)

### 3.0.7

_December 27, 2024_

- Fix precision of negative numbers.
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`2.1.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#211) (patch)

### 3.0.6

_November 11, 2024_

- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`2.1.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#210) (minor)

### 3.0.5

_November 1, 2024_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`3.0.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#303) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`3.0.4`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#304) (patch)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`2.0.4`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#204) (patch)

### 3.0.4

_October 23, 2024_

- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`3.0.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#303) (patch)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`2.0.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#203) (patch)

### 3.0.3

_October 10, 2024_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`3.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#302) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`3.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#302) (patch)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`2.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#202) (patch)

### 3.0.2

_August 18, 2024_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`3.0.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#301) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`3.0.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#301) (patch)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`2.0.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#201) (patch)

### 3.0.1

_August 14, 2024_

- Updated [`@csstools/color-helpers`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers) to [`5.0.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers/CHANGELOG.md#501) (patch)

### 3.0.0

_August 3, 2024_

- Updated: Support for Node v18+ (major).
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`3.0.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#300) (major)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`3.0.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#300) (major)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`2.0.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#200) (major)

### 2.0.5

_July 13, 2024_

- fix `serializeP3` when `gamutMapping` is `false`

### 2.0.4

_July 6, 2024_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.4.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#241) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.7.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#271) (patch)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`1.2.4`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#124) (patch)

### 2.0.3

_June 29, 2024_

- Updated [`@csstools/color-helpers`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers) to [`4.2.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers/CHANGELOG.md#421) (patch)
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.3.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#232) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.7.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#270) (minor)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`1.2.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#123) (patch)

### 2.0.2

_May 4, 2024_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.3.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#231) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.6.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#263) (patch)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`1.2.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#122) (patch)

### 2.0.1

_May 4, 2024_

- Improve handling of `NaN` and `Infinity` in color functions.
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.3.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#230) (minor)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.6.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#262) (patch)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`1.2.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#121) (patch)

### 2.0.0

_April 21, 2024_

- Switch to the ray-tracing gamut mapping algorithm. This is a minimally invasive change when generating fallback colors for CSS but breaking if you relied on the exact output of the previous gamut mapping algorithm.
- Fix `none` keyword conversion in relative color syntax origin values. (again)
- Updated [`@csstools/color-helpers`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers) to [`4.2.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers/CHANGELOG.md#420) (minor)

### 1.6.3

_March 31, 2024_

- Fix missing rectangular color spaces for interpolation in `color-mix()`.
- Fix `none` keyword conversion in relative color syntax origin values.
- Updated [`@csstools/color-helpers`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers) to [`4.1.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers/CHANGELOG.md#410) (minor)

### 1.6.2

_March 16, 2024_

- Fix powerless components for `lch` and `oklch` with `none` chroma.

### 1.6.1

_March 16, 2024_

- Fix powerless components for `hsl` with `none` saturation.

### 1.6.0

_March 13, 2024_

- Add support for `contrast-color( <color> max )`
- Allow relative color syntax in `rgba` and `hsla` color notations.
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.4`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#224) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.6.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#261) (patch)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`1.2.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#120) (minor)

### 1.5.2

_February 19, 2024_

- Clamp negative saturation to zero in modern `hsl`
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.6.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#260) (minor)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`1.1.7`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#117) (patch)

### 1.5.1

_December 31, 2023_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#223) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.5.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#250) (minor)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`1.1.6`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#116) (patch)

### 1.5.0

_December 15, 2023_

- Add the `Experimental` syntax flag, to be used in future features.
- Add a `serializeHSL` function.
- Fix type definitions
- Improve JS Doc comments
- Updated [`@csstools/color-helpers`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers) to [`4.0.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers/CHANGELOG.md#400) (major)
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#222) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.4.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#240) (minor)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`1.1.5`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#115) (patch)

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
