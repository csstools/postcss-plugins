# Changes to CSS Has Pseudo

### Unreleased

Tracking initial implementation of `:has()` pseudo-class in Safari Technology Preview.
This is a breaking change and affects both the generated CSS and the client side polyfill.

- Added : 'hover' options for browser polyfill
- Added : 'observedAttributes' options for browser polyfill
- Added : 'forcePolyfill' options for browser polyfill
- Changed : selector encoding (this requires you to re-run your build steps for your CSS)

Improved support for :

- hover styles through the 'hover' option. (`label:has(~ input:hover)`)
- more complex selectors. (`figure:has(> figcaption) img`)
