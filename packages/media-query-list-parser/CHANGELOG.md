# Changes to Media Query List Parser

### Unreleased (patch)

- Add support for `env()` functions as values in media queries.
- Improve the detection of math function as values in media queries.

### 2.0.2 (March 25, 2023)

- Improve case insensitive string matching.

### 2.0.1 (January 28, 2023)

- Improve `types` declaration in `package.json`

### 2.0.0 (January 19, 2023)

- Refactor `MediaFeatureBoolean` so that it follows the same structure as `MediaFeaturePlain` (breaking)
- Change the `ParseError` interface, this is now a subclass of `Error` (breaking)
- Add `getName` and `getNameToken` to all nodes that have a feature name.
- Add `@custom-media` parsing.

### 1.0.0 (November 14, 2022)

- Initial version
