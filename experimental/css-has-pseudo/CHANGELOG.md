# Changes to CSS Has Pseudo

### 0.6.1

_December 15, 2023_

- Fix type definitions

### 0.6.0

_July 8, 2022_

- `@csstools/css-has-pseudo-experimental` is no longer supported. Please use `css-has-pseudo` instead.
All issues have been resolved in the main plugin and the experimental plugin is no longer maintained.

> [!CAUTION]
> This experimental plugin no longer has any effect on the output of your CSS.

### 0.5.2

_June 4, 2022_

- Update `@csstools/selector-specificity` (major)

### 0.5.1

_April 29, 2022_

- Use `@csstools/selector-specificity` for specificity calculations.
- Update `querySelector(:has())` polyfill, ensuring temporary html attributes are correctly removed.
- Improve documentation

### 0.5.0

_April 24, 2022_

- Rules within `@supports` selector check for `:has` won't be transformed. This respects stylesheet author of making the selector conditional:

```pcss
@supports selector(:has(:focus)) {
	/* Won't be transformed */
	:has(:focus) {}
}
```

### 0.4.0

_April 5, 2022_

- Update `querySelector(:has())` polyfill, disallowing nested `:has` (`:has(.foo, :has(.bar))`)

### 0.3.1

_April 4, 2022_

- Improving selector specificity calculation.

### 0.3.0

_February 24, 2022_

- Use base36 encoding to fix support for upper case characters in selectors.

### 0.2.1

_February 6, 2022_

- Do not leak visitedness via `:has` pseudo-class.

### 0.2.0

_January 12, 2022_

- Added : documentation and tests for CORS.
- Added : documentation for selector specificity.
- Added : typescript support.
- Changed : `doesNotExistName` plugin option has been renamed to `specificityMatchingName`.
- Updated : documentation for plugin and polyfill options.
- Removed : old locations of the browser polyfill in the published package.

```diff
postcss([
-   cssHasPseudoExperimental({ doesNotExistName: 'something-random' })
+   cssHasPseudoExperimental({ specificityMatchingName: 'something-random' })
]).process(YOUR_CSS /*, processOptions */);
```

### 0.1.2

_January 7, 2022_

- Improved : selector specificity calculation

### 0.1.1

_January 5, 2022_

- Added : support for id and tag selector specificity.
- Changed : hover tracking now also uses `leave` events for correct style re-calcs.

### 0.1.0

_January 4, 2022_

Tracking initial implementation of `:has()` pseudo-class in Safari Technology Preview.
This is a breaking change and affects both the generated CSS and the client side polyfill.

- Added : 'hover' options for browser polyfill
- Added : 'observedAttributes' options for browser polyfill
- Added : 'forcePolyfill' options for browser polyfill
- Changed : selector encoding (this requires you to re-run your build steps for your CSS)

Improved support for :

- hover styles through the 'hover' option. (`label:has(~ input:hover)`)
- more complex selectors. (`figure:has(> figcaption) img`)
