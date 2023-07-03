# Changes to Prefers Color Scheme

### 9.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))

### 8.0.2

_February 6, 2023_

- Reduce the amount of duplicate fallback CSS.

### 8.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 8.0.0

_January 24, 2023_

- Updated: Support for Node v14+ (major).

### 7.0.1

_August 23, 2022_

- Fix: assign global browser polyfill to `window`, `self` or a blank object.

### 7.0.0

_July 8, 2022_

[Read the full changelog](https://github.com/csstools/postcss-plugins/wiki/PostCSS-Preset-Env-8)

- Breaking: removed old CDN urls
- Breaking: remove `color-depth` queries fallback
- Breaking: remove 'no-preference' support as this was dropped from the spec
- Breaking: remove old global object
- Fix: case insensitive matching.

#### How to migrate :

##### Re-build your CSS with the new version of the library.

##### If you use a CDN url, please update it.

```diff
- <script src="https://unpkg.com/css-prefers-color-scheme/browser"></script>
+ <script src="https://unpkg.com/css-prefers-color-scheme/dist/browser-global.js"></script>
```

```diff
- <script src="https://unpkg.com/css-prefers-color-scheme/browser.min"></script>
+ <script src="https://unpkg.com/css-prefers-color-scheme/dist/browser-global.js"></script>
```

##### Use `prefersColorSchemeInit` to initialize the polyfill in the browser.

```diff
- initPrefersColorScheme()
+ prefersColorSchemeInit()
```

##### Remove `@media (prefer-color-scheme: no-preference)` from your CSS.

`@media (prefers-color-scheme: no-preference)` was removed from the specification and should be equivalent to not having any media query.

```diff
- @media (prefers-color-scheme: no-preference) {
- 	.some-selector {
- 		/* your styles ... */
- 	}
- }
+ .some-selector {
+ 	/* your styles ... */
+ }
```

### 6.0.3

_January 31, 2022_

- Fix `preserve: false` option.

### 6.0.2

_January 2, 2022_

- Removed Sourcemaps from package tarball.
- Moved CLI to CLI Package. See [announcement](https://github.com/csstools/postcss-plugins/discussions/121).

### 6.0.1

_December 27, 2021_

- Fixed: require/import paths for browser script

### 6.0.0

_December 13, 2021_

- Breaking: require/import paths have changed
- Changed: new polyfill CDN urls.
- Updated: documentation
- Fixed: `CSSRuleList` edits skipping rules as this is a live list.
- Fixed: complex `@media` queries not working.

**Migrating to 6.0.0**

PostCSS plugin :

```diff
- const postcssPrefersColorScheme = require('css-prefers-color-scheme/postcss');
+ const postcssPrefersColorScheme = require('css-prefers-color-scheme');
```

Browser Polyfill :

```diff
- const prefersColorScheme = require('css-prefers-color-scheme')();
+ const prefersColorScheme = require('css-prefers-color-scheme/browser')();
```

_The old CND url is now deprecated and will be removed in a next major release._
_It will continue to work for now._

```diff
- <script src="https://unpkg.com/css-prefers-color-scheme/browser.min"></script>
+ <script src="https://unpkg.com/css-prefers-color-scheme/dist/browser-global.js"></script>
```

### 5.0.0

_September 17, 2021_

- Updated: Support for PostCS 8+ (major).
- Updated: Support for Node 12+ (major).

### 4.0.0

_May 24, 2019_

- Updated: `postcss` to 7.0.16 (patch)
- Updated: Node 8+ compatibility (major)

### 3.1.1

_November 10, 2018_

- Updated: Project organization. No functional changes.

### 3.1.0

_November 10, 2018_

- Include CLI tool for transforming CSS without any installation
- Update documentation

### 3.0.0

_November 4, 2018_

- Preserve `prefers-color-scheme` queries by default for non-JS environments
- Remove `prefers-color-scheme` queries on the frontend for JS environments

### 2.0.0

_November 3, 2018_

- The client library now returns an object with various features, including:
  - `scheme` to get or set the preferred color scheme
  - `hasNativeSupport` to report whether `prefers-color-scheme` is supported
  - `onChange` to listen for when the preferred color scheme changes
  - `removeListener` to destroy the native `prefers-color-scheme` listener

### 1.0.0

_September 24, 2018_

- Initial version
