# Changes to PostCSS Mixins

### Unreleased (minor)

- Drop `@layer` rules from mixin bodies
- Generate hygienic argument and private property names so they can not collide with author names
- Leave `@apply` rules with a CSS-wide keyword argument unchanged and resolve CSS-wide keywords in parameter defaults
- Leave mixins and their `@apply` rules unchanged when they can not be transpiled, and keep definitions that are still referenced by an `@apply` rule
- Preserve author whitespace and comments when declarations are copied out of a mixin
- Resolve references in nested mixins and in `@contents` blocks and fallbacks
- Support `@property` rules in `@private` rules and hoist registrations out of `@container`, `@scope` and `@starting-style`, while keeping `@media` and `@supports` conditions
- Support trailing commas, comments, empty arguments, `--x:` defaults and `type(*)` in parameter and argument lists
- Transpile private properties in the applying rule and in `@contents` blocks, and rename them in `transition` and `transition-property`

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
