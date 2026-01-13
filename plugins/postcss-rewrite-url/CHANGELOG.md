# Changes to PostCSS Rewrite URL

### Unreleased (major)

- Updated: Support for Node `20.19.0` or later (major).
- Removed: `commonjs` API. In supported Node versions `require(esm)` will work without needing to make code changes.

### 2.1.1

_May 27, 2025_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`3.0.4`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#304) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`3.0.5`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#305) (patch)

### 2.1.0

_November 30, 2024_

- Add support for rewriting url modifiers (e.g. `rewrite-url('foo.png' --foo)` -> `rewrite-url('foo.png#foo')`)
- Document the syntax definition for `rewrite-url()`

### 2.0.4

_November 1, 2024_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`3.0.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#303) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`3.0.4`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#304) (patch)

### 2.0.3

_October 23, 2024_

- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`3.0.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#303) (patch)

### 2.0.2

_October 10, 2024_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`3.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#302) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`3.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#302) (patch)

### 2.0.1

_August 18, 2024_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`3.0.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#301) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`3.0.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#301) (patch)

### 2.0.0

_August 3, 2024_

- Updated: Support for Node v18+ (major).
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`3.0.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#300) (major)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`3.0.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#300) (major)

### 1.1.4

_July 6, 2024_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.4.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#241) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.7.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#271) (patch)

### 1.1.3

_June 29, 2024_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.3.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#232) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.7.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#270) (minor)

### 1.1.2

_May 4, 2024_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.3.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#231) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.6.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#263) (patch)

### 1.1.1

_May 4, 2024_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.3.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#230) (minor)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.6.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#262) (patch)

### 1.1.0

_March 19, 2024_

- Add support for early transforms in the `Once` hook. This allows you to transform `rewrite-url()` values before any other plugin runs.

### 1.0.0

_March 17, 2024_

- Initial version
