# Changes to PostCSS Dir Pseudo Class

### 8.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))

### 7.0.2

_February 6, 2023_

- Reduce the amount of duplicate fallback CSS.

### 7.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 7.0.0

_January 24, 2023_

- Updated: Support for Node v14+ (major).
- Added: TypeScript support.

### 6.0.5

_July 8, 2022_

- Fix case insensitive matching.

### 6.0.4

_February 5, 2022_

- Improved `es module` and `commonjs` compatibility

### 6.0.3

_January 12, 2022_

- Fix compatibility with PostCSS `v8.2.x` [#147](https://github.com/csstools/postcss-plugins/issues/147)

This version is not officially supported but some tool providers pinned PostCSS to `v8.2.x`,
making it impossible for end users to have a working setup.

### 6.0.2

_January 2, 2022_

- Removed Sourcemaps from package tarball.
- Moved CLI to CLI Package. See [announcement](https://github.com/csstools/postcss-plugins/discussions/121).

### 6.0.1

_December 13, 2021_

- Updated: documentation

### 6.0.0

_September 17, 2021_

- Updated: Support for PostCS 8+ (major).
- Updated: Support for Node 12+ (major).

### 5.0.0

_September 17, 2018_

- Updated: Support for PostCSS v7+
- Updated: Support for Node v6+
- Updated: `postcss-selector-parser` to v5.0.0-rc.3+ (major)

### 4.0.0

_May 8, 2018_

- Updated: `postcss-selector-parser` to v4.0.0 (major)
- Updated: `postcss` to v6.0.22 (patch)

### 3.0.0

_March 21, 2018_

- Added: `preserve` option to preserve the original `:dir()` rule
- Updated: `postcss-selector-parser` to v3 (major)
- Removed: `browsers` option which is better covered by
  [PostCSS Preset Env](https://github.com/jonathantneal/postcss-preset-env/)

### 2.1.0

_September 19, 2017_

- Fixed: Enforcement of presumed direction, e.g. `html:dir([dir="rtl"])`
- Updated: Browserslist and PostCSS
- Improved: How options are safely called, i.e. `Object(opts)`

### 2.0.0

_July 24, 2017_

- Changed: Method of presumed direction from `:root` to `html:not([dir])`

### 1.1.0

_June 2, 2017_

- Added: Support for browserslist and a 'browsers' option
- Added: Support for a presumed direction via the 'browsers' option

### 1.0.0

_May 30, 2017_

- Initial version
