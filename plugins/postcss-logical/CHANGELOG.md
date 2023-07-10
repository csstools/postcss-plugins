# Changes to PostCSS Logical Properties

### 7.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))

### 6.2.0

_May 19, 2023_

- Added: Support for logical properties in `transition`

### 6.1.0

_February 15, 2023_

- Adding support for `max-block-size`, `min-block-size`, `max-inline-size` and `min-inline-size`.

### 6.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 6.0.0

_January 24, 2023_

- Updated: Support for Node v14+ (major).
- Added: TypeScript support.
- Added: Support for `block-size`, `inline-size` and `caption-side`.
- Removed: Support for the `logical` keyword within `margin`, `padding`, `border-width`, `border-style`, `border-color` properties. (major)
- Removed support for `preserve` option. Changes are no longer preserved (major).
- Removed support for transforming `float`, `clear` and `resize` properties. (major)
- Updated: The plugin now requires block and inline direction to be configured (uses `top-to-bottom` and `left-to-right` respectively) and no longer introduces `:dir` (major).

### 5.0.4

_February 5, 2022_

- Improved `es module` and `commonjs` compatibility

### 5.0.3

_January 12, 2022_

- Fix compatibility with PostCSS `v8.2.x` [#147](https://github.com/csstools/postcss-plugins/issues/147)

This version is not officially supported but some tool providers pinned PostCSS to `v8.2.x`,
making it impossible for end users to have a working setup.

### 5.0.2

_January 2, 2022_

- Removed Sourcemaps from package tarball.
- Moved CLI to CLI Package. See [announcement](https://github.com/csstools/postcss-plugins/discussions/121).
- Updated examples in README.

### 5.0.1

_December 13, 2021_

- Updated: documentation

### 5.0.0

_September 17, 2021_

- Updated: Support for PostCS 8+ (major).
- Updated: Support for Node 12+ (major).

### 4.0.2

_June 10, 2019_

- Fixed: Restored transforms for `max-block-size`, `max-inline-size`,
	`min-block-size`, and `min-inline-size`.

### 4.0.1

_June 10, 2019_

- Fixed: An issue with `block-size` and `inline-size` being miscalculated.

### 4.0.0

_June 5, 2019_

- Added: Logical border-radius properties, which include
	`border-end-end-radius`, `border-end-start-radius`, `border-start-end-radius`,
	and `border-start-start-radius`.
- Removed: All unknown logical properties, which include `border-end`,
	`border-end-color`, `border-end-style`, `border-end-width`, `border-start`,
	`border-start-color`, `border-start-style`, `border-start-width`, `inset-end`,
	`inset-start`, `margin-end`, `margin-start`, `padding-end`, `padding-start`
	and `border` with `logical`.
- Updated: `transition` and `transition-property` to support the changes.
- Updated: `postcss` to 7.0.16 (patch)
- Updated: Node 8+ compatibility (major)

### 3.0.0

_September 20, 2018_

- Added: Support for logical properties within `transition` and
	`transition-property`.
- Changed: Physical rule fallbacks are written as full selectors rather than
	as nesting selectors.

### 2.0.0

_September 17, 2018_

- Updated: Support for PostCSS v7+
- Updated: Support for Node v6+

### 1.1.1

_March 21, 2017_

- Fix `dir` option to allow falsey value

### 1.1.0

_March 20, 2017_

- Add `preserve` option to preserve logical properties and values

### 1.0.2

_Aug 15, 2017_

- Improve flow-relative clear support

### 1.0.1

_Aug 13, 2017_

- Improve flow-relative border support

### 1.0.0

_Aug 8, 2017_

- Initial version
