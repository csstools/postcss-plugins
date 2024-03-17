# Changes to CSS Parser Algorithms

### 2.6.1

_March 13, 2024_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.4`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#224) (patch)

### 2.6.0

_February 19, 2024_

- Add support for multiple replacement values in `replaceComponentValues`

### 2.5.0

_December 31, 2023_

- Add a `forEach` and `walk` function.
- Improve documentation.
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#223) (patch)

### 2.4.0

_December 15, 2023_

- Fix type definitions
- Only `walk` child nodes if they are still part of the current AST tree [#1202](https://github.com/csstools/postcss-plugins/issues/1202)
- Make `walk` methods safe for mutations [#1204](https://github.com/csstools/postcss-plugins/issues/1204)
- Add a `forEach` method to `FunctionNode` and `SimpleBlockNode`
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#222) (patch)

### 2.3.2

_September 24, 2023_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#221) (patch)

### 2.3.1

_July 24, 2023_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#220) (minor)

### 2.3.0

_July 3, 2023_

- Add `sourceIndices` helper function.

This makes it easier to get the start and end indices of a node in the source string.  
This function accepts any node that can be converted into an array of tokens.

### 2.2.0

_June 1, 2023_

- Add `state` to `walk` methods.

This makes it possible pass down information from a parent structure to children.  
e.g. you can set `entry.state.isInCalcExpression = true` for `calc((10 + 5) / 2)` when walking the `FunctionNode` for `calc`.

### 2.1.1

_April 10, 2023_

- Updated `@csstools/css-tokenizer` to `2.1.1` (patch)

### 2.1.0

_March 25, 2023_

- Add `replaceComponentValues` utility function.
- Add `stringify` utility function.

### 2.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 2.0.0

_January 19, 2023_

- Fix: Removes `UnclosedFunctionNode` and `UnclosedSimpleBlockNode`. (breaking)
- Change the `ParseError` interface, this is now a subclass of `Error` (breaking)
- Change `nameTokenValue` in `FunctionNode` to `getName` (breaking)
- Fix: Do not discard empty items in comma separated lists.

### 1.0.0

_November 14, 2022_

- Initial version
