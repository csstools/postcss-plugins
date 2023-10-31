# Changes to PostCSS Cascade Layers

### 4.0.1

_October 31, 2023_

- Improve performance

### 4.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))
- Updated [`@csstools/selector-specificity`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity) to [`3.0.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity/CHANGELOG.md#300) (major)

### 3.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 3.0.0

_January 24, 2023_

- Run `postcss-cascade-layers` late compared to other PostCSS plugins (breaking)

_This will be the last time we change this after several times back and forth.
We are sticking with this configuration now._

### 2.0.0

_November 14, 2022_

- Run `postcss-cascade-layers` early compared to other PostCSS plugins (breaking)
- Updated: Support for Node v14+ (major).
- Fix: Do not throw when a selector is invalid, show a warning instead.

### 1.1.1

_September 17, 2022_

- Fix pre-defined layer order in nested `@layer` rules.

### 1.1.0

_September 14, 2022_

- Add support for `@scope` and `@container` as parent rules for `@layer`

### 1.0.6

_September 7, 2022_

- Fix broken `@keyframes` in `@layer`.

### 1.0.5

_July 8, 2022_

- Fix case insensitive `@layer` matching (`@LaYeR`).
- Updated `@csstools/selector-specificity` to `2.0.2` (patch)

### 1.0.4

_June 23, 2022_

- Fix selector order with any pseudo element. This plugin will no longer re-order selectors.

### 1.0.3

_June 4, 2022_

- Update `@csstools/selector-specificity` (major)

### 1.0.2

_May 20, 2022_

- Use only simple `:not(#\#)` selectors to adjust specificity.

### 1.0.1

_May 17, 2022_

- Process CSS after most other plugins to ensure correct analysis and transformation of sugary CSS.
- Fix selector order with `:before` and other pseudo elements.

### 1.0.0

_May 12, 2022_

- Initial version
