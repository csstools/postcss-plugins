# Changes to PostCSS Mixins

### Unreleased (minor)

- Support `@property` rules in `@private` rules, including multi-name prelude lists and the shorthand form.
- Leave `@private` rules with registrations inside `@container` or `@starting-style` unchanged.
- Support trailing commas and empty arguments in `@apply` and `@mixin` parameter lists.
- Trim whitespace from `@apply` arguments.
- Treat an empty default value (`--x:`) as a default value.
- Drop `@layer` rules from mixin bodies.
- Resolve `inherit` parameter defaults in the calling context.
- Ignore mixin parameters and arguments with invalid `<declaration-value>` values.
- Ignore `--` as a parameter name.
- Use a separate namespace for generated names so they do not collide with private rule generated names.

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
