# Changes to Media Query List Parser

### 2.1.2

_July 3, 2023_

- Updated [`@csstools/css-parser-algorithms`](/packages/css-parser-algorithms) to [`2.3.0`](/packages/css-parser-algorithms/CHANGELOG.md#230) (minor)

### 2.1.1

_June 21, 2023_

- Fix parsing of `(width == 100px)`. This was erroneously parsed as a range query and will now instead be a general enclosed node.

### 2.1.0

_June 1, 2023_

- Fix `walk` for `MediaFeatureValue` with complex component values.
- Add `state` to `walk` methods.

This makes it possible pass down information from a parent structure to children.  
e.g. you can set `entry.state.inInPrintQuery = true` for `print and (min-width: 30cm)`.

### 2.0.4

_April 10, 2023_

- Updated `@csstools/css-tokenizer` to `2.1.1` (patch)
- Updated `@csstools/css-parser-algorithms` to `2.1.1` (patch)

### 2.0.3

_April 10, 2023_

- Add support for `env()` functions as values in media queries.
- Improve the detection of math function as values in media queries.

### 2.0.2

_March 25, 2023_

- Improve case insensitive string matching.

### 2.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 2.0.0

_January 19, 2023_

- Refactor `MediaFeatureBoolean` so that it follows the same structure as `MediaFeaturePlain` (breaking)
- Change the `ParseError` interface, this is now a subclass of `Error` (breaking)
- Add `getName` and `getNameToken` to all nodes that have a feature name.
- Add `@custom-media` parsing.

### 1.0.0

_November 14, 2022_

- Initial version
