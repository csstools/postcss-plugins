# Changes to CSS Tokenizer

### 2.2.1

_September 24, 2023_

- Small performance improvements

### 2.2.0

_July 24, 2023_

- Add support for `unicode-range-token`
- Add `signCharacter` to `DimensionToken`, `NumberToken` and `PercentageToken`
- Correctly tokenize negative zero `-0`

### 2.1.1

_April 10, 2023_

- Document `tokenize` helper function

### 2.1.0

_February 21, 2023_

- Add `tokenize` helper function

### 2.0.2

_February 13, 2023_

- Relax `isToken` to match artificial tokens that correctly follow the interface.

### 2.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 2.0.0

_January 19, 2023_

- Simplify `Reader` interface (breaking)
- Change the `ParseError` interface, this is now a subclass of `Error` (breaking)
- Remove the `commentsAreTokens` option as `true` was the only desirable value (breaking)
- Improve performance

### 1.0.0

_November 14, 2022_

- Initial version
