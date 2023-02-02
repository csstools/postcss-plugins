# Changes to PostCSS Progressive Custom Properties

### 2.1.0 (February 2, 2023)

- Group support rules with the same params to reduce the output size.

### 2.0.1 (January 28, 2023)

- Improve `types` declaration in `package.json`

### 2.0.0 (January 24, 2023)

- Updated: Support for Node v14+ (major).

## 1.3.0 (March 7, 2022)

- Add matching rules for `color-mix`
- Fix matching rules for gradient functions
- Reduce matchers size

## 1.2.0 (February 15, 2022)

- More matching rules for [double position gradients](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-double-position-gradients#readme).

## 1.1.0 (February 12, 2022)

- No longer uses custom properties in `@supports` rules.
- Implement AST matching for values and units and generate minimal `@supports` for select features.

## 1.0.0 (February 6, 2022)

Initial release
