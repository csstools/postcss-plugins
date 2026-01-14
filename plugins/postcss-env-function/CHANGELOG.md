# Changes to PostCSS Environment Variables

### 8.0.0

_January 14, 2026_

- Updated: Support for Node `20.19.0` or later (major).
- Removed: `commonjs` API. In supported Node versions `require(esm)` will work without needing to make code changes.

### 7.0.0

_August 3, 2024_

- Updated: Support for Node v18+ (major).

### 6.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))

### 5.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 5.0.0

_January 24, 2023_

- Updated: Support for Node v14+ (major).

### 4.0.6

_March 19, 2022_

- Add deprecation notice for `postcss-env-function`

[see the discussion](https://github.com/csstools/postcss-plugins/discussions/192)

### 4.0.5

_February 5, 2022_

- Improved `es module` and `commonjs` compatibility

### 4.0.4

_January 2, 2022_

- Removed Sourcemaps from package tarball.
- Moved CLI to CLI Package. See [announcement](https://github.com/csstools/postcss-plugins/discussions/121).

### 4.0.3

_December 13, 2021_

- Changed: now uses `postcss-value-parser` for parsing.
- Updated: documentation

### 4.0.2

_November 18, 2021_

- Added: Safeguards against postcss-values-parser potentially throwing an error.

### 4.0.1

_October 28, 2021_

- Updated: Enforcing styling consistency
- Updated: `postcss-values-parser` to 6.0.1 (patch).

### 4.0.0

_September 17, 2021_

- Updated: Support for PostCS 8+ (major).
- Updated: Support for Node 12+ (major).

### 3.0.0

_June 13, 2019_

- Updated: `postcss-values-parser` to 3.2.0 (major)
- Updated: `postcss` to 7.0.27 (patch)
- Updated: Support for Node 10+ (major)

### 2.0.2

_September 20, 2018_

- Updated: Do not break on an empty importFrom object

### 2.0.1

_September 18, 2018_

- Updated: Support for PostCSS Values Parser 2

### 2.0.0

_September 17, 2018_

- Updated: Support for PostCSS 7+
- Updated: Support for Node 6+
- Updated: Changed `variables` option to `importFrom` option

### 1.0.0

_April 28, 2018_

- Initial version
