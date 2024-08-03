# Changes to PostCSS Selector Not

### 8.0.0

_August 3, 2024_

- Updated: Support for Node v18+ (major).

### 7.0.2

_February 19, 2024_

- Fix type definitions

### 7.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 7.0.0

_January 24, 2023_

- Updated: Support for Node v14+ (major).
- Fix: Do not throw when a selector is invalid, show a warning instead.

### 6.0.1

_July 8, 2022_

- Fixed: Case insensitive `:not` matching.

### 6.0.0

_June 3, 2022_

- Fixed: default export ([#409](https://github.com/csstools/postcss-plugins/issues/409))
- Fixed: doesn't consider attribute selectors (https://github.com/postcss/postcss-selector-not/issues/23)
- Fixed: unexpected results when `:not` is not a pseudo class function (https://github.com/postcss/postcss-selector-not/issues/28)

### 5.0.0

_January 31, 2021_

- Added: Support for PostCSS v8.

### 4.0.1

_December 18, 2020_

- Fixed: error when attribute selector containing :not (https://github.com/postcss/postcss-selector-not/pull/17)

### 4.0.0

_September 17, 2017_

- Added: compatibility with postcss v7.x
- Added: compatibility with node v6.x

### 3.0.1

_May 11, 2015_

- Fixed: incorrect export (https://github.com/postcss/postcss-selector-not/issues/8)

### 3.0.0

_May 11, 2017_

- Added: compatibility with postcss v6.x

### 2.0.0

_August 25, 2015_

- Removed: compatibility with postcss v4.x
- Added: compatibility with postcss v5.x

### 1.2.1

_June 16, 2015_

- Fixed: selector was updated as an array, which is wrong.

### 1.2.0

_June 16, 2015_

- Fixed: spec has been previously misinterpreted and now transform correctly
`:not()` level 4 to collapsed level 3
(https://github.com/postcss/postcss-selector-not/issues/1)
- Removed: `lineBreak` option (useless now)

### 1.1.0

_June 13, 2015_

- Added: `lineBreak` option

### 1.0.2

_June 13, 2015_

- Fixed: support of pseudo classes that use parenthesis

### 1.0.1

_April 30, 2015_

- Fixed: the module now works in non babel environments

### 1.0.0

_April 30, 2015_

✨ First release
