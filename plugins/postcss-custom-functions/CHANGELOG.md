# Changes to PostCSS Custom Functions

### Unreleased (minor)

- Support `@property` rules for local variables, including multi-name preludes and the shorthand form, and hoist registrations out of `@container`, `@scope` and `@starting-style`
- Support local variables and registrations inside conditional rules
- Resolve local variables, `inherit()` and CSS-wide keywords in function arguments, `if()` conditions and `style()` query values
- Support empty `@function` bodies and ignore `!important` declarations in them
- Treat `@function` definitions inside `@container`, `@scope` and `@starting-style` as unconditional, matching browsers
- Keep parameter registrations and values when a local variable shadows a typed parameter or a local `@property` uses the parameter name
- Keep empty `@layer` blocks when removing unused definitions and order `@layer` rules inside `@scope` as global layers
- Preserve cascade order when definitions of the same name are inlined and do not evaluate cycles in inactive conditional rules, unused fallbacks or losing declarations
- Leave calls untouched when a definition can not be transpiled, an argument has an invalid `<declaration-value>`, or a typed parameter in a font-relative property can not be resolved at build time
- Keep functions referenced from `@apply` and `@mixin` preludes
- Support trailing commas, whitespace and empty arguments in dashed-function calls
- Treat `--x:` as an empty default value, reject parameter defaults that mix `{}` blocks with other tokens, and suppress defaults when a CSS-wide keyword can be selected through a `var()` fallback
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
