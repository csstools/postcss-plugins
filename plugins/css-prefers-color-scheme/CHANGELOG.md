# Changes to Prefers Color Scheme

### 6.0.0

- Changed: require/import/polyfill paths.
- Updated: documentation
- Fixed: `CSSRuleList` edits skipping rules as this is a live list.
- Fixed: complex `@media` queries not working.

### 5.0.0 (September 17, 2021)

- Updated: Support for PostCS 8+ (major).
- Updated: Support for Node 12+ (major).

### 4.0.0 (May 24, 2019)

- Updated: `postcss` to 7.0.16 (patch)
- Updated: Node 8+ compatibility (major)

### 3.1.1 (November 10, 2018)

- Updated: Project organization. No functional changes.

### 3.1.0 (November 10, 2018)

- Include CLI tool for transforming CSS without any installation
- Update documentation

### 3.0.0 (November 4, 2018)

- Preserve `prefers-color-scheme` queries by default for non-JS environments
- Remove `prefers-color-scheme` queries on the frontend for JS environments

### 2.0.0 (November 3, 2018)

- The client library now returns an object with various features, including:
  - `scheme` to get or set the preferred color scheme
  - `hasNativeSupport` to report whether `prefers-color-scheme` is supported
  - `onChange` to listen for when the preferred color scheme changes
  - `removeListener` to destroy the native `prefers-color-scheme` listener

### 1.0.0 (September 24, 2018)

- Initial version
