# Changes to CSS Has Pseudo

### 0.3.0 (February 24, 2022)

- Use base36 encoding to fix support for upper case characters in selectors.

### 0.2.1 (February 6, 2022)

- Do not leak visitedness via `:has` pseudo-class.

### 0.2.0 (January 12, 2022)

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

### 0.1.2 (January 7, 2022)

- Improved : selector specificity calculation

### 0.1.1 (January 5, 2022)

- Added : support for id and tag selector specificity.
- Changed : hover tracking now also uses `leave` events for correct style re-calcs.

### 0.1.0 (January 4, 2022)

Tracking initial implementation of `:has()` pseudo-class in Safari Technology Preview.
This is a breaking change and affects both the generated CSS and the client side polyfill.

- Added : 'hover' options for browser polyfill
- Added : 'observedAttributes' options for browser polyfill
- Added : 'forcePolyfill' options for browser polyfill
- Changed : selector encoding (this requires you to re-run your build steps for your CSS)

Improved support for :

- hover styles through the 'hover' option. (`label:has(~ input:hover)`)
- more complex selectors. (`figure:has(> figcaption) img`)
