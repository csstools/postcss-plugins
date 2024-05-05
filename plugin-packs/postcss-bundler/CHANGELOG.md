# Changes to PostCSS Bundler

### Unreleased (major)

- Updated: Support for Node v18+ (major).

### 1.0.13

_May 4, 2024_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.3.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#231) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.6.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#263) (patch)
- Updated [`@csstools/postcss-rebase-url`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url) to [`1.0.9`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url/CHANGELOG.md#109) (patch)

### 1.0.12

_May 4, 2024_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.3.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#230) (minor)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.6.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#262) (patch)
- Updated [`@csstools/postcss-rebase-url`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url) to [`1.0.8`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url/CHANGELOG.md#108) (patch)

### 1.0.11

_March 13, 2024_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.4`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#224) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.6.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#261) (patch)
- Updated [`@csstools/postcss-rebase-url`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url) to [`1.0.7`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url/CHANGELOG.md#107) (patch)

### 1.0.10

_February 19, 2024_

- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.6.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#260) (minor)
- Updated [`@csstools/postcss-rebase-url`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url) to [`1.0.6`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url/CHANGELOG.md#106) (patch)

### 1.0.9

_December 31, 2023_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#223) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.5.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#250) (minor)
- Updated [`@csstools/postcss-rebase-url`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url) to [`1.0.5`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url/CHANGELOG.md#105) (patch)

### 1.0.8

_December 15, 2023_

- Fix type definitions
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#222) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.4.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#240) (minor)
- Updated [`@csstools/postcss-rebase-url`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url) to [`1.0.4`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url/CHANGELOG.md#104) (patch)

### 1.0.7

_October 31, 2023_

- Fix layer statements that precede `@import` statements which link to external resources

### 1.0.6

_October 5, 2023_

- Ignore urls with url modifiers (e.g. `url("foo.css" some-modifier)`)
- Reduce some complexity in the codebase

### 1.0.5

_October 2, 2023_

- Ignore `@import` statements where `supports` or `layer` conditions precede the `url` value.

### 1.0.4

_September 24, 2023_

- Small performance improvements
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#221) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#232) (patch)
- Updated [`@csstools/postcss-rebase-url`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url) to [`1.0.3`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url/CHANGELOG.md#103) (patch)

### 1.0.3

_September 3, 2023_

- Updated [`@csstools/postcss-rebase-url`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url) to [`1.0.2`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url/CHANGELOG.md#102) (patch)

### 1.0.2

_September 2, 2023_

- Updated [`@csstools/postcss-rebase-url`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url) to [`1.0.1`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url/CHANGELOG.md#101) (patch)

### 1.0.1

_August 28, 2023_

- Fix `dependency` PostCSS message

### 1.0.0

_August 28, 2023_

- Initial major version

### 0.1.0-alpha.6

_August 16, 2023_

- Reduce filesystem access

### 0.1.0-alpha.5

_August 15, 2023_

- Stricter parsing algorithm

### 0.1.0-alpha.4

_August 15, 2023_

- Fix sourcemaps

### 0.1.0-alpha.3

_August 14, 2023_

- Fix the path from which node modules are resolved

### 0.1.0-alpha.2

_August 14, 2023_

- Use the `node_modules:` scheme to reference imports from a `node_modules` package

### 0.1.0-alpha.1

_August 14, 2023_

- Use the `npm:` scheme to reference imports from a `node_modules` package

### 0.1.0-alpha.0

_August 14, 2023_

- Initial version
