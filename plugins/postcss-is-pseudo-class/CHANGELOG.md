# Changes to PostCSS Is Pseudo Class

### 5.0.3

_June 11, 2025_

- Fix support for more complex selector patterns. `.a > :is(.b > .c)` -> `.a.b > .c`

### 5.0.2

_June 10, 2025_

- Add support for more complex selector patterns. `.a > :is(.b > .c)` -> `.a.b > .c`

### 5.0.1

_October 23, 2024_

- Make sorting compound selectors forwards compatible with potential future changes in `postcss-selector-parser`
- Updated: `postcss-selector-parser`
- Updated [`@csstools/selector-specificity`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity) to [`5.0.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity/CHANGELOG.md#500) (major)

### 5.0.0

_August 3, 2024_

- Updated: Support for Node v18+ (major).
- Updated [`@csstools/selector-specificity`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity) to [`4.0.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity/CHANGELOG.md#400) (major)

### 4.0.8

_May 13, 2024_

- Updated [`@csstools/selector-specificity`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity) to [`3.1.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity/CHANGELOG.md#311) (patch)

### 4.0.7

_May 11, 2024_

- Updated [`@csstools/selector-specificity`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity) to [`3.1.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity/CHANGELOG.md#310) (minor)

### 4.0.6

_March 31, 2024_

- Updated [`@csstools/selector-specificity`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity) to [`3.0.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity/CHANGELOG.md#303) (patch)

### 4.0.5

_February 19, 2024_

- Updated [`@csstools/selector-specificity`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity) to [`3.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity/CHANGELOG.md#302) (patch)

### 4.0.4

_December 15, 2023_

- Fix type definitions
- Updated [`@csstools/selector-specificity`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity) to [`3.0.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity/CHANGELOG.md#301) (patch)

### 4.0.3

_October 2, 2023_

- Prevent incorrect transforms when `:is()` is wrapped in `:has()`.

### 4.0.2

_September 18, 2023_

- Improve performance

### 4.0.1

_September 2, 2023_

- Fix substitution when selectors have mixed types for compound selectors where one of two parts is a `:is()` pseudo class.

```diff
header:is(.a .b) {}

/* becomes : */

- header.a .b {}
+ .a header.b {}
```

### 4.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))
- Updated [`@csstools/selector-specificity`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity) to [`3.0.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity/CHANGELOG.md#300) (major)

### 3.2.1

_May 19, 2023_

- Fix compound selectors with `*`.

```diff
:is(.a *):is(h1, h2, h3) {}

/* becomes : */

- .a *h1, .a *h2, .a *h3 {}
+ .a h1, .a h2, .a h3 {}
```

### 3.2.0

_April 10, 2023_

- Add support for more complex selector patterns. In particular anything where `:is()` is in the left-most compound selector.

### 3.1.1

_February 8, 2023_

- Reduce the amount of duplicate fallback CSS.

### 3.1.0

_February 2, 2023_

- Fix is pseudo inside a not pseudo (`:not(:is(h1, h2, h3))`)
- Reduce the output size when all selectors are known to be valid

### 3.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 3.0.0

_January 24, 2023_

- Updated: Support for Node v14+ (major).

### 2.0.7

_July 8, 2022_

- Fix case insensitive matching.

### 2.0.6

_June 23, 2022_

- Fix selector order with any pseudo element.
- Fix transforming pseudo elements in `:is()`. Following the specification pseudo elements are invalid and we now transform to a known invalid pseudo element.
- Add `onPseudoElement` plugin option. Set `{ onPseudoElement: 'warning' }` to receive warnings when this plugin encounters an unprocessable pseudo element.

### 2.0.5

_June 4, 2022_

- Update `@csstools/selector-specificity` (major)

### 2.0.4

_May 17, 2022_

- Fix selector order with `:before` and other pseudo elements.

### 2.0.3

_May 11, 2022_

- Use `@csstools/selector-specificity` for specificity calculations.

### 2.0.2

_April 4, 2022_

- Improved : compound selector order with pseudo elements
- Improved : selector specificity calculation.

### 2.0.1

_March 4, 2022_

- Preserve selector order as much as possible. Fixes issues where pseudo elements `::before` were moved.

### 2.0.0

_January 31, 2022_

- Remove `skip` flag in `onComplexSelectors` option.

If a complex selector is encountered that has no known equivalent, it will always be skipped and preserved now.

The previous behavior was to remove `:is()` even if that broke the selector.

### 1.0.1

_January 17, 2022_

- Fix selector order

### 1.0.0

_January 13, 2022_

- initial release
