# Changes to CSS Tokenizer

### 2.0.2 (February 13, 2023)

- Relax `isToken` to match artificial tokens that correctly follow the interface.

### 2.0.1 (January 28, 2023)

- Improve `types` declaration in `package.json`

### 2.0.0 (January 19, 2023)

- Simplify `Reader` interface (breaking)
- Change the `ParseError` interface, this is now a subclass of `Error` (breaking)
- Remove the `commentsAreTokens` option as `true` was the only desirable value (breaking)
- Improve performance

### 1.0.0 (November 14, 2022)

- Initial version
