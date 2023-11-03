# Changes to PostCSS Color Functional Notation

### 6.0.2

_October 9, 2023_

- Updated [`@csstools/postcss-progressive-custom-properties`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties) to [`3.0.2`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties/CHANGELOG.md#302) (patch)

### 6.0.1

_September 18, 2023_

- Improve performance
- Updated [`@csstools/postcss-progressive-custom-properties`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties) to [`3.0.1`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties/CHANGELOG.md#301) (patch)

### 6.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))
- Updated [`@csstools/postcss-progressive-custom-properties`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties) to [`3.0.0`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties/CHANGELOG.md#300) (major)

### 5.1.0

_June 1, 2023_

- Added `@csstools/postcss-progressive-custom-properties` for improved support of custom properties.
- Updated `@csstools/postcss-progressive-custom-properties` to `2.3.0` (minor)

### 5.0.2

_February 6, 2023_

- Reduce the amount of duplicate fallback CSS.

### 5.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 5.0.0

_January 24, 2023_

- Updated: Support for Node v14+ (major).

### 4.2.4

_July 8, 2022_

- Fix case insensitive matching.

### 4.2.3

_May 19, 2022_

- Handle modern channel values in legacy notation (comma separated)

```css
.color {
  color: rgba(0, 255, 0, 50%);
}

/* becomes */

.color {
  color: rgba(0, 255, 0, 0.5);
}
```

### 4.2.2

_February 5, 2022_

- Improved `es module` and `commonjs` compatibility

### 4.2.1

_January 2, 2022_

- Removed Sourcemaps from package tarball.
- Moved CLI to CLI Package. See [announcement](https://github.com/csstools/postcss-plugins/discussions/121).

### 4.2.0

_December 27, 2021_

- Added: support for Alpha value as the fourth argument in comma separated values notation.

### 4.1.0

_December 15, 2021_

- Added: support for Alpha value as a CSS variable in `rgb()` and `rgba()`.

### 4.0.2

_December 13, 2021_

- Changed: now uses `postcss-value-parser` for parsing.
- Updated: documentation
- Added: support for CSS variables with `preserve: true` option.

### 4.0.1

_November 18, 2021_

- Added: Safeguards against postcss-values-parser potentially throwing an error.
- Updated: postcss-value-parser to 6.0.1 (patch)

### 4.0.0

_September 17, 2021_

- Updated: Support for PostCS 8+ (major).
- Updated: Support for Node 12+ (major).

### 3.0.2

_April 25, 2020_

- Updated: Publish

### 3.0.1

_April 25, 2020_

- Updated: Using `walkType` to evade walker bug in `postcss-values-parser`

### 3.0.0

_April 25, 2020_

- Updated: Support for Node 10+
- Updated: `postcss` to 7.0.27 (patch)
- Updated: `postcss-values-parser` to 3.2.0 (minor)

### 2.0.1

_September 18, 2018_

- Updated: PostCSS Values Parser 2 (patch for this project)

### 2.0.0

_September 17, 2018_

- Updated: Support for PostCSS v7+
- Updated: Support for Node 6+

### 1.0.2

_July 13, 2018_

- Fixed: Poorly detected hsl() and rgb() now resolve correctly

### 1.0.1

_May 11, 2018_

- Fixed: A non-percentage 0 works alongside other percentages

### 1.0.0

_May 7, 2018_

- Initial version
