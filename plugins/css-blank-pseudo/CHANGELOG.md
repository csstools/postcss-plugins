# Changes to CSS Blank Pseudo

### 6.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))

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
- Updated: Export and document the plugin options types.

### 4.1.1

_August 23, 2022_

- Fix: assign global browser polyfill to `window`, `self` or a blank object.

### 4.1.0

_July 30, 2022_

- Added: `disablePolyfillReadyClass` plugin option to prevent `.js-blank-pseudo` from being added.

### 4.0.0

_July 8, 2022_

- Updated: The polyfill now only attaches a single listener to the body so it's
more efficient and also does less work at the MutationObserver handler.
- Breaking: removed old CDN urls
- Breaking: removed old CLI
- Fix case insensitive matching.

#### How to migrate:

- If you use a CDN url, please update it.
- Re-build your CSS with the new version of the library.

```diff
- <script src="https://unpkg.com/css-blank-pseudo/browser"></script>
- <script src="https://unpkg.com/css-blank-pseudo/browser.min"></script>
+ <script src="https://unpkg.com/css-blank-pseudo/dist/browser-global.js"></script>
```

```diff
- cssBlankPseudo(document)
+ cssBlankPseudoInit()
```

```diff
- cssBlankPseudo({
-  attr: false,
-  className: 'blank'
- })
+ cssBlankPseudoInit({
+  replaceWith: '.blank'
+ })
```

### 3.0.3

_February 5, 2022_

- Rebuild of browser polyfills

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
- Changed: Supports Node 12+ (major).
- Updated: documentation

**Migrating to 3.0.0**

PostCSS plugin :

```diff
- const postcssBlankPseudo = require('css-blank-pseudo/postcss');
+ const postcssBlankPseudo = require('css-blank-pseudo');
```

Browser Polyfill :

```diff
- const cssBlankPseudo = require('css-blank-pseudo');
+ const cssBlankPseudo = require('css-blank-pseudo/browser');
```

_The old CND url is now deprecated and will be removed in a next major release._
_It will continue to work for now._

```diff
- <script src="https://unpkg.com/css-blank-pseudo/browser"></script>
+ <script src="https://unpkg.com/css-blank-pseudo/dist/browser-global.js"></script>
```

Browser Polyfill IE :

_The polyfill for IE is now the same as the general polyfill_

```diff
- const cssBlankPseudo = require('css-blank-pseudo');
+ const cssBlankPseudo = require('css-blank-pseudo/browser');
```

_The old CND url is now deprecated and will be removed in a next major release._
_It will continue to work for now._

```diff
- <script src="https://unpkg.com/css-blank-pseudo/browser-legacy"></script>
+ <script src="https://unpkg.com/css-blank-pseudo/dist/browser-global.js"></script>
```

### 2.0.0

_September 16, 2021_

- Changed: Supports PostCSS 8.3+ (major).
- Changed: Supports Node 10+ (major).

### 1.0.0

_June 10, 2019_

- Updated: `postcss` to 7.0.16 (patch)
- Updated: Node 8+ compatibility (major)

### 0.1.4

_November 17, 2018_

- Update documentation

### 0.1.3

_November 17, 2018_

- Improve CLI usage

### 0.1.2

_November 17, 2018_

- Provide a version specifically for Internet Explorer 11

### 0.1.1

_November 17, 2018_

- Update documentation

### 0.1.0

_November 17, 2018_

- Initial version
