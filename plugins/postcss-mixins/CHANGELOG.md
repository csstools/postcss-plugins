# Changes to PostCSS Mixins

### Unreleased (minor)

- Drop `@layer` rules from mixin bodies
- Expand `@apply` and `@contents` rules in `@contents` blocks, fallbacks and nested rules
- Generate hygienic argument and private property names
- Hoist `@property` registrations from `@private` rules out of `@container`, `@scope` and `@starting-style`
- Leave CSS-wide keyword arguments unchanged and resolve CSS-wide keywords in parameter defaults
- Leave rules, mixins and `@apply` rules unchanged when they can not be transpiled completely
- Only trim whitespace from arguments and default values
- Preserve whitespace and comments from mixin bodies
- Support trailing commas, comments, empty arguments, empty defaults and `type(*)` in parameter and argument lists
- Transpile private properties in the applying rule, nested mixins and `@contents` blocks
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`4.0.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#403) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`4.0.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#403) (patch)
- Updated [`@csstools/custom-function-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/custom-function-parser) to [`2.0.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/custom-function-parser/CHANGELOG.md#200) (major)
- Updated [`@csstools/utilities-for-private-properties`](https://github.com/csstools/postcss-plugins/tree/main/packages/utilities-for-private-properties) to [`1.0.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/utilities-for-private-properties/CHANGELOG.md#101) (patch)

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
