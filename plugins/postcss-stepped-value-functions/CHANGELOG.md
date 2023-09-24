# Changes to PostCSS Stepped Value Functions

### 3.0.2

_September 24, 2023_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#221) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#232) (patch)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`1.1.4`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#114) (patch)

### 3.0.1

_July 24, 2023_

- Use the latest utilities from `@csstools/css-tokenizer` to reduce the bundle size.
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#220) (minor)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#231) (patch)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`1.1.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#113) (patch)

### 3.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#230) (minor)
- Updated [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) to [`1.1.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc/CHANGELOG.md#112) (patch)

### 2.1.1

_April 10, 2023_

- Updated `@csstools/css-tokenizer` to `2.1.1` (patch)
- Updated `@csstools/css-parser-algorithms` to `2.1.1` (patch)
- Updated `@csstools/css-calc` to `1.1.1` (patch)

### 2.1.0

_February 21, 2023_

- Removed: warnings on `var()` or otherwise unconvertible values (doesn't affect the output, non-breaking)
- Added: `@csstools/css-calc`
- Added: unit conversions (`mod(735ms, 0.1s)`)

### 2.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 2.0.0

_January 24, 2023_

- Updated: Support for Node v14+ (major).

### 1.0.1

_July 8, 2022_

- Fix case insensitive matching.

### 1.0.0

_May 2, 2022_

- Initial version
