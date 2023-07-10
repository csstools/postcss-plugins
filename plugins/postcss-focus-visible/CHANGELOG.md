# Changes to PostCSS Focus Visible

### 9.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))

### 8.0.2

_February 8, 2023_

- Reduce the amount of duplicate fallback CSS.

### 8.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 8.0.0

_January 24, 2023_

- Updated: Support for Node v14+ (major).
- Fix: Do not throw when a selector is invalid, show a warning instead.

### 7.1.0

_July 30, 2022_

- Added: `disablePolyfillReadyClass` plugin option to prevent `.js-focus-visible` from being added.

### 7.0.0

_July 8, 2022_

- Breaking: Changed generated classes so it prepends `.js-focus-visible` to the 
generated class so CSS is applied when the polyfill is known to be running.

### 6.0.4

_February 5, 2022_

- Improved `es module` and `commonjs` compatibility

### 6.0.3

_January 2, 2022_

- Removed Sourcemaps from package tarball.
- Moved CLI to CLI Package. See [announcement](https://github.com/csstools/postcss-plugins/discussions/121).

### 6.0.2

_December 13, 2021_

- Changed: now uses `postcss-selector-parser` for parsing.
- Updated: documentation

### 6.0.1

_September 22, 2021_

- Added missing `dist` to bundle.
- Added missing `exports` to `package.json`
- Added missing `types` to `package.json`
- Added bundling & testing as prepublish step.

### 6.0.0

_September 17, 2021_

- Updated: Support for PostCS 8+ (major).
- Updated: Support for Node 12+ (major).

### 5.0.0

_April 14, 2020_

- Updated: `:focus-visible` can appear escaped in a selector
- Updated: Support for Node v10+

### 4.0.0

_September 17, 2018_

- Updated: Support for PostCSS v7+
- Updated: Support for Node v6+

### 3.0.0

_April 7, 2018_

- Changed: default functionality to preserve the original rule
- Added: `preserve` option to preserve the original rule using `:focus-visible`

### 2.0.0

_February 17, 2018_

- Changed `:focus-ring` to `:focus-visible` per the specification
- Removed `assignTo` export option

### 1.0.0

_May 22, 2017_

- Initial version
