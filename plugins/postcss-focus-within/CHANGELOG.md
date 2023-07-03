# Changes to PostCSS Focus Within

### 8.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))

### 7.0.2

_February 8, 2023_

- Reduce the amount of duplicate fallback CSS.

### 7.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 7.0.0

_January 24, 2023_

- Updated: Support for Node v14+ (major).
- Fix: Do not throw when a selector is invalid, show a warning instead.

### 6.1.1

_August 23, 2022_

- Fix: assign global browser polyfill to `window`, `self` or a blank object.

### 6.1.0

_July 30, 2022_

- Added: `disablePolyfillReadyClass` plugin option to prevent `.js-focus-within` from being added.

### 6.0.0

_July 8, 2022_

- Breaking: Changed generated classes so it prepends `.js-focus-within` to the
generated class so CSS is applied when the polyfill is known to be running.
- Added: Now bundling browser polyfill.

### 5.0.4

_February 5, 2022_

- Improved `es module` and `commonjs` compatibility

### 5.0.3

_January 2, 2022_

- Removed Sourcemaps from package tarball.
- Moved CLI to CLI Package. See [announcement](https://github.com/csstools/postcss-plugins/discussions/121).

### 5.0.2

_December 13, 2021_

- Changed: now uses `postcss-selector-parser` for parsing.
- Updated: documentation

### 5.0.1

_September 22, 2021_

- Added missing `dist` to bundle.
- Added missing `exports` to `package.json`
- Added missing `types` to `package.json`
- Added bundling & testing as prepublish step.

### 5.0.0

_September 17, 2021_

- Updated: Support for PostCS 8+ (major).
- Updated: Support for Node 12+ (major).

### 4.0.0

_April 20, 2020_

- Fixed: Allow `:focus-within` to appear escaped in a selector
- Updated: Support for Node 10+
- Updated: Ownership moved to CSS Tools

### 3.0.0

_September 17, 2018_

- Updated: Support for PostCSS v7+
- Updated: Support for Node v6+

### 2.0.0

_April 7, 2018_

- Changed: default functionality to preserve the original rule
- Added: `preserve` option to preserve the original rule using `:focus-within`

### 1.0.0

_February 17, 2018_

- Initial version
