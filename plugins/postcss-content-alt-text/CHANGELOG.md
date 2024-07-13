# Changes to PostCSS Content Alt Text

### Unreleased (patch)

- Add specific handling of `content: ">" / "";` as this pattern is used in the same way as `<img alt="">`, i.e. to represent an item that does not need a text alternative.

### 1.0.0

_July 7, 2024_

- Initial version
- Updated [`@csstools/postcss-progressive-custom-properties`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties) to [`3.3.0`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties/CHANGELOG.md#330) (minor)
