# Changes to PostCSS Private Rule

### Unreleased (minor)

- Support `@property` rules in `@private` rules, including multi-name prelude lists and the shorthand form.
- Leave `@private` rules with registrations inside `@container` or `@starting-style` unchanged.
- Leave a style rule and its nested style rules unchanged when any of its `@private` rules has a registration that can not be hoisted.
- Remove conditional group rules that only contained a `@private` rule.
- Ignore `!important` declarations and unsupported at-rules in `@private` rules.
- Transpile `@private` rules inside `@container` and `@starting-style` when they do not have registrations.
- Rename private properties in `inherit()` and `var()` inside `@container` preludes.
- Use a separate namespace for generated names so they do not collide with mixin generated names.

### 1.1.1

_October 2, 2026_

- Drop `node:path` and `node:crypto` dependencies

### 1.1.0

_October 1, 2026_

- Fix lookup order of shadowing properties
- Export `Transpiler` which can be used to transpile `@private` rules in other `postcss` plugins (i.e. `postcss-mixins`)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`4.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#402) (patch)

### 1.0.3

_September 25, 2026_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`4.0.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#401) (patch)
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`4.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#402) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`4.0.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#401) (patch)

### 1.0.2

_September 15, 2026_

- Reduce change of collisions between generated property names from different files.

### 1.0.1

_September 6, 2026_

- Only assign new property names to the PostCSS AST when the name actually changed
- Fix private property lookup for nested rules
- Fix lexical scoping

### 1.0.0

_August 30, 2026_

- Initial version
