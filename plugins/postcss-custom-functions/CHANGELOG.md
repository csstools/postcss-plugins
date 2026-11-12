# Changes to PostCSS Custom Functions

### Unreleased (minor)

- Support empty `@function` bodies.
- Ignore `!important` declarations in `@function` bodies.
- Support `@property` rules for local variables, including multi-name prelude lists and the shorthand form.
- Resolve CSS-wide keywords in function arguments.
- Keep parameter values when a local `@property` rule uses the parameter name.
- Support local variables and registrations inside conditional rules.
- Substitute local variables and `inherit()` inside `if()` conditions.
- Suppress parameter defaults when a CSS-wide keyword can be selected through a `var()` fallback.
- Ignore dashed-function arguments that contain `!important`.
- Ignore typed parameters in font-relative properties when arguments can not be resolved at build time.

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
