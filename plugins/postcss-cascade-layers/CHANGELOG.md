# Changes to PostCSS Cascade Layers

### 1.0.4 (June 23, 2022)

- Fix selector order with any pseudo element. This plugin will no longer re-order selectors.

### 1.0.3 (June 4, 2022)

- Update `@csstools/selector-specificity` (major)

### 1.0.2 (May 20, 2022)

- Use only simple `:not(#\#)` selectors to adjust specificity.

### 1.0.1 (May 17, 2022)

- Process CSS after most other plugins to ensure correct analysis and transformation of sugary CSS.
- Fix selector order with `:before` and other pseudo elements.

### 1.0.0 (May 12, 2022)

- Initial version
