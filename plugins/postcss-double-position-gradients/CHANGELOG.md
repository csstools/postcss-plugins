# Changes to PostCSS Double Position Gradients

### 5.0.2

_October 9, 2023_

- Updated [`@csstools/postcss-progressive-custom-properties`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties) to [`3.0.2`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties/CHANGELOG.md#302) (patch)

### 5.0.1

_September 18, 2023_

- Improve performance
- Updated [`@csstools/postcss-progressive-custom-properties`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties) to [`3.0.1`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties/CHANGELOG.md#301) (patch)

### 5.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))
- Updated [`@csstools/postcss-progressive-custom-properties`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties) to [`3.0.0`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties/CHANGELOG.md#300) (major)

### 4.0.4

_June 1, 2023_

- Updated `@csstools/postcss-progressive-custom-properties` to `2.3.0` (minor)

### 4.0.3

_May 19, 2023_

- Updated `@csstools/postcss-progressive-custom-properties` to `2.2.0` (minor)

### 4.0.2

_February 8, 2023_

- Reduce the amount of duplicate fallback CSS.

### 4.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 4.0.0

_January 24, 2023_

- Updated: Support for Node v14+ (major).

### 3.1.2

_July 8, 2022_

- Fix case insensitive matching.

### 3.1.1

_March 7, 2022_

- Add TypeScript support
- Fix color functions.
- Fix `at` keyword with `at 20px 20px` being interpreted as a double position color stop.

### 3.1.0

_February 15, 2022_

- Ignore values in relevant `@supports` rules.
- Support double position gradients in Custom Properties.

```css
@supports (order: linear-gradient(90deg, black 25% 50%, blue 50% 75%)) {
	.support {
		/* is not processed */
		order: linear-gradient(90deg, black 25% 50%, blue 50% 75%);
	}
}
```

### 3.0.5

_February 5, 2022_

- Improved `es module` and `commonjs` compatibility

### 3.0.4

_January 2, 2022_

- Removed Sourcemaps from package tarball.
- Moved CLI to CLI Package. See [announcement](https://github.com/csstools/postcss-plugins/discussions/121).

### 3.0.3

_December 14, 2021_

- Fixed: infinite loop in complex gradients.

### 3.0.2

_December 13, 2021_

- Changed: now uses `postcss-value-parser` for parsing.
- Updated: documentation

### 3.0.1

_November 18, 2021_

- Added: Safeguards against postcss-values-parser potentially throwing an error.

- Fixed: Issue with some gradients creating an infinite loop.

- Updated: `postcss-value-parser` to 6.0.1 (patch)
- Updated: `eslint` to 8.2.0 (major)
- Updated: `postcss` to 8.3.11 (patch)

- Removed: yarn.lock is no longer version controlled

### 3.0.0

_September 17, 2021_

- Updated: Support for PostCS 8+ (major).
- Updated: Support for Node 12+ (major).

### 2.0.0

_April 25, 2020_

- Updated: `postcss` to 7.0.27 (patch)
- Updated: `postcss-value-parser` to 3.2.1 (major)
- Updated: Support for Node 10+ (major)

### 1.0.0

_October 28, 2018_

- Initial version
