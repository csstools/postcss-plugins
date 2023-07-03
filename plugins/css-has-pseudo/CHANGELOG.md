# Changes to CSS Has Pseudo

### 6.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))
- Updated [`@csstools/selector-specificity`](/packages/selector-specificity) to [`3.0.0`](/packages/selector-specificity/CHANGELOG.md#300) (major)

### 5.0.2

_February 6, 2023_

- Reduce the amount of duplicate fallback CSS.

### 5.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 5.0.0

_January 24, 2023_

- Updated: Support for Node v14+ (major).
- Fix: Do not throw when a selector is invalid, show a warning instead.
- Fix: make `:has()` unforgiving. `:has(.foo, :some-invalid-selector)` will no longer match elements that have children with `.foo`.

### 4.0.2

_December 12, 2022_

 - Fix: correctly cleanup style rules when a browser has native support. [backported](https://github.com/csstools/postcss-plugins/pull/752)

### 4.0.1

_August 23, 2022_

- Fix: assign global browser polyfill to `window`, `self` or a blank object.

### 4.0.0

_July 8, 2022_

[Read the full changelog](https://github.com/csstools/postcss-plugins/wiki/PostCSS-Preset-Env-8)

- Breaking: removed old CDN urls
- Added: 'hover' options for browser polyfill
- Added: 'observedAttributes' options for browser polyfill
- Added: 'forcePolyfill' options for browser polyfill
- Added: Rules within `@supports selector(:has(something))` won't be transformed.
- Fix: Use base36 encoding to support all possible selectors.
- Fix: case insensitive matching.

#### How to migrate :

##### Re-build your CSS with the new version of the library.

##### If you use a CDN url, please update it.

```diff
- <script src="https://unpkg.com/css-has-pseudo/browser"></script>
+ <script src="https://unpkg.com/css-has-pseudo/dist/browser-global.js"></script>
```

```diff
- <script src="https://unpkg.com/css-has-pseudo/browser.min"></script>
+ <script src="https://unpkg.com/css-has-pseudo/dist/browser-global.js"></script>
```

### 3.0.4

_February 5, 2022_

- Rebuild of browser polyfills

### 3.0.3

_January 12, 2022_

- Fix compatibility with PostCSS `v8.2.x` [#147](https://github.com/csstools/postcss-plugins/issues/147)

This version is not officially supported but some tool providers pinned PostCSS to `v8.2.x`,
making it impossible for end users to have a working setup.

### 3.0.2

_January 2, 2022_

- Removed Sourcemaps from package tarball.
- Moved CLI to CLI Package. See [announcement](https://github.com/csstools/postcss-plugins/discussions/121).

### 3.0.1

_December 27, 2021_

- Fixed: require/import paths for browser script

### 3.0.0

_December 13, 2021_

- Breaking: require/import paths have changed
- Changed: new polyfill CDN urls.
- Updated: documentation

**Migrating to 3.0.0**

PostCSS plugin :

```diff
- const postcssHasPseudo = require('css-has-pseudo/postcss');
+ const postcssHasPseudo = require('css-has-pseudo');
```

Browser Polyfill :

```diff
- const cssHasPseudo = require('css-has-pseudo');
+ const cssHasPseudo = require('css-has-pseudo/browser');
```

_The old CND url is now deprecated and will be removed in a next major release._
_It will continue to work for now._

```diff
- <script src="https://unpkg.com/css-has-pseudo/browser"></script>
+ <script src="https://unpkg.com/css-has-pseudo/dist/browser-global.js"></script>
```

### 2.0.0

_September 16, 2021_

- Updated: Support for PostCS 8+ (major).
- Updated: Support for Node 12+ (major).

### 1.0.0

_June 10, 2019_

- Updated: `postcss-selector-parser` to 6.0.2 (major)
- Updated: `postcss` to 7.0.16 (patch)
- Updated: Node 8+ compatibility (major)

### 0.10.0

_December 11, 2018_

- Fixed an issue where inaccessible rules would crash the library

### 0.9.0

_November 26, 2018_

- Improved CLI usage

### 0.8.0

_November 26, 2018_

- Fixed an issue where attribute names were not being properly encoded

### 0.7.0

_November 25, 2018_

- Replaced `setImmediate` with `requestAnimationFrame` for future compatibility

### 0.6.0

_November 25, 2018_

- Fixed an issue where nested rules were not supported

### 0.5.0

_November 21, 2018_

- Further optimize script; from 775 bytes to 757 bytes

### 0.4.0

_November 21, 2018_

- Fixed an issue with the browser script not picking up added nodes

### 0.3.0

_November 21, 2018_

- Fixed the misnamed function name for the browser-ready script

### 0.2.0

_November 21, 2018_

- Improved browser compatibility with updated parsers, encoders, and decoders
- Improved performance by walking the DOM less
- Reduced script size by 9%; from 855 bytes to 775 bytes

### 0.1.0

_November 20, 2018_

- Initial version
