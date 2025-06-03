# Changes to CSS Tokenizer

### 3.0.4

_May 27, 2025_

- align serializers with CSSOM

### 3.0.3

_October 25, 2024_

- Fix input preprocessing

### 3.0.2

_October 10, 2024_

- `isTokenNumeric` and `isTokenWhiteSpaceOrComment` now accept `null` and `undefined` as input, in parallel with other type predicates.

### 3.0.1

_August 18, 2024_

- Updated the return type of `nextToken()` to indicate that it always returns a value.

### 3.0.0

_August 3, 2024_

- Updated: Support for Node v18+ (major).
- Improve performance.

### 2.4.1

_July 5, 2024_

- Remove `astNode` that was erroneously added to the `ParseError` base class.

### 2.4.0

_July 5, 2024_

- Expose `ParseErrorMessage`, the list of known parser error messages object to facilitate detection of specific cases
- Add a specific `ParseErrorWithToken` subclass. This contains the associated token.

### 2.3.3

_July 3, 2024_

- Fix tokenization of `string-token` containing a backslash followed by CRLF

### 2.3.2

_June 29, 2024_

- Optimize `cloneTokens`

### 2.3.1

_May 4, 2024_

- Fix escaping for the last code point in an ident sequence.

### 2.3.0

_May 4, 2024_

- Add `mutateUnit` helper function
- Add type guard helpers

### 2.2.4

_March 13, 2024_

- Correctly tokenize negative zero `-0` (for real this time)

### 2.2.3

_December 31, 2023_

- Improve documentation.

### 2.2.2

_December 15, 2023_

- Fix type definitions

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
