# Changes to PostCSS Custom Functions

### Unreleased (minor)

- Support `@property` rules for local variables, including multi-name preludes and the shorthand form, and hoist registrations out of `@container`, `@scope` and `@starting-style`
- Support conditional rules, local variables, `inherit()` and CSS-wide keywords in function bodies, arguments, `if()` conditions and `style()` query values
- Treat `@function` definitions inside `@container`, `@scope` and `@starting-style` as unconditional, matching browsers
- Support empty bodies, ignore `!important` declarations, and support trailing commas, whitespace, empty arguments, `--x:` defaults and `{}` blocks
- Preserve cascade and layer order, keep empty `@layer` blocks and functions referenced from `@apply` and `@mixin` preludes
- Leave calls untouched when a definition, keyword result, argument, `attr()` capture or font-relative typed parameter can not be transpiled
- Use `@csstools/generate-idents`, `@csstools/utilities-for-property-registrations` and `@csstools/custom-function-parser` for shared implementation

### 1.0.1

_October 2, 2026_

- Drop `node:path` and `node:crypto` dependencies

### 1.0.0

_October 1, 2026_

- Initial version
- Definitions without conditional rules or a cascade layer are inlined into the calling rule instead of emitting extra rules
- bound the total number of generated declarations to prevent exponential expansion from exhausting memory or CPU
- warn instead of aborting the build when the cascade layer order can not be collected
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`4.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#402) (patch)
- Updated [`@csstools/cascade-layer-name-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/cascade-layer-name-parser) to [`3.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/cascade-layer-name-parser/CHANGELOG.md#302) (patch)
