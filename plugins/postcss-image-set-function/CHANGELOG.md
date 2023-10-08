# Changes to PostCSS image-set() Function

### 6.0.1

_September 18, 2023_

- Improve performance

### 6.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))

### 5.0.2

_February 8, 2023_

- Reduce the amount of duplicate fallback CSS.

### 5.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 5.0.0

_January 24, 2023_

- Updated: Support for Node v14+ (major).
- Changed: `oninvalid` plugin option to `onInvalid` to match other plugins with similar options (breaking).

### 4.0.7

_July 8, 2022_

- Fix case insensitive matching.

### 4.0.6

_February 5, 2022_

- Improved `es module` and `commonjs` compatibility

### 4.0.5

_January 31, 2022_

- Fix sourcemaps for `image-set()` function

### 4.0.4

_January 2, 2022_

- Removed Sourcemaps from package tarball.
- Moved CLI to CLI Package. See [announcement](https://github.com/csstools/postcss-plugins/discussions/121).

### 4.0.3

_December 13, 2021_

- Changed: now uses `postcss-value-parser` for parsing.
- Updated: documentation
- Added: support for lists of `image-set` functions.
- Fixed: `url` function is now always added around string values in `image-set` functions.

### 4.0.2

_November 19, 2021_

- Updated: `postcss-value-parser` to 6.0.1 (patch)

### 4.0.1

_November 18, 2021_

- Added: Safeguards against postcss-values-parser potentially throwing an error.

### 4.0.0

_September 17, 2021_

- Updated: Support for PostCS 8+ (major).
- Updated: Support for Node 12+ (major).

### 3.0.1

_September 18, 2018_

- Updated: PostCSS Values Parser 2

### 3.0.0

_September 17, 2018_

- Updated: Support for PostCSS 7+
- Updated: Support for Node 6+

### 2.0.0

_May 7, 2018_

- Sort images by DPR and use the lowest as the default

### 1.0.0

_May 2, 2018_

- Initial version
