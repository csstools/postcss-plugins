# Changes to PostCSS Custom Functions

### 1.1.0

_November 17, 2026_

- Hoist `@property` registrations out of `@container`, `@scope` and `@starting-style`, and treat definitions there as unconditional
- Keep empty `@layer` blocks and order `@layer` rules inside `@scope` as global layers
- Keep functions referenced from `@apply` and `@mixin` preludes
- Keep parameter registrations and values when a local variable shadows a typed parameter
- Leave calls untouched when a definition can not be transpiled or an argument is invalid
- Preserve cascade order when inlining duplicate definitions and skip cycles in inactive conditionals
- Resolve local variables, `inherit()` and CSS-wide keywords in arguments, `if()` conditions and `style()` queries
- Support empty `@function` bodies, ignore `!important` declarations and allow locals and registrations in conditional rules
- Support trailing commas, whitespace and empty arguments in dashed-function calls
- Treat `--x:` as an empty default and reject defaults that mix `{}` blocks with other tokens
- Use `@csstools/generate-idents`, `@csstools/utilities-for-property-registrations` and `@csstools/custom-function-parser` internally
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`4.0.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#403) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`4.0.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#403) (patch)
- Updated [`@csstools/cascade-layer-name-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/cascade-layer-name-parser) to [`3.0.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/cascade-layer-name-parser/CHANGELOG.md#303) (patch)
- Updated [`@csstools/custom-function-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/custom-function-parser) to [`2.0.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/custom-function-parser/CHANGELOG.md#200) (major)

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
