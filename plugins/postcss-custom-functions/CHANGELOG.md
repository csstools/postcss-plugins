# Changes to PostCSS Custom Functions

### Unreleased (patch)

- Drop `node:path` and `node:crypto` dependencies

### 1.0.0

_October 1, 2026_

- Initial version
- Definitions without conditional rules or a cascade layer are inlined into the calling rule instead of emitting extra rules
- bound the total number of generated declarations to prevent exponential expansion from exhausting memory or CPU
- warn instead of aborting the build when the cascade layer order can not be collected
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`4.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#402) (patch)
- Updated [`@csstools/cascade-layer-name-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/cascade-layer-name-parser) to [`3.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/cascade-layer-name-parser/CHANGELOG.md#302) (patch)
