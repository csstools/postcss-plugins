# Changes to PostCSS Mixins

### Unreleased (minor)

- Support `@property` rules in `@private` rules, including multi-name preludes and the shorthand form, and hoist registrations out of `@container`, `@scope` and `@starting-style` while keeping `@media` and `@supports` conditions
- Rename private property names in `transition` and `transition-property`
- Resolve references in nested mixins, `@contents` fallback blocks and contents blocks inside mixin bodies
- Support trailing commas, whitespace, empty arguments, `--x:` defaults, `type(*)` and `inherit` in parameter lists, and reject `{}` blocks mixed with other tokens
- Ignore invalid `<declaration-value>` values and `--` parameter names, and leave mixins untouched when a name has several definitions or one that can not be transpiled
- Drop `@layer` rules from mixin bodies
- Use `@csstools/utilities-for-private-properties` and `@csstools/custom-function-parser` for shared implementation and a separate namespace for generated names

### 1.1.0

_October 1, 2026_

- `@contents` rule
- nested mixins
- untyped mixin arguments
- hygienic renaming of mixin arguments and private custom properties
- bound the total number of generated nodes to prevent exponential expansion from exhausting memory or CPU
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`4.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#402) (patch)

### 1.0.1

_September 25, 2026_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`4.0.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#401) (patch)
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`4.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#402) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`4.0.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#401) (patch)

### 1.0.0

_January 14, 2026_

- Initial version
