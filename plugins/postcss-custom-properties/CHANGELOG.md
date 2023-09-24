# Changes to PostCSS Custom Properties

### 13.3.2

_September 24, 2023_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#221) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#232) (patch)
- Updated [`@csstools/cascade-layer-name-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/cascade-layer-name-parser) to [`1.0.5`](https://github.com/csstools/postcss-plugins/tree/main/packages/cascade-layer-name-parser/CHANGELOG.md#105) (patch)

### 13.3.1

_September 18, 2023_

- Improve performance

### 13.3.0

_July 24, 2023_

- Added: support for `:where(html)` and `:where(:root)` selectors
- Fixed: cascade layers support
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#220) (minor)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#231) (patch)
- Updated [`@csstools/cascade-layer-name-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/cascade-layer-name-parser) to [`1.0.4`](https://github.com/csstools/postcss-plugins/tree/main/packages/cascade-layer-name-parser/CHANGELOG.md#104) (patch)

### 13.2.1

_July 3, 2023_

- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#230) (minor)
- Updated [`@csstools/cascade-layer-name-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/cascade-layer-name-parser) to [`1.0.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/cascade-layer-name-parser/CHANGELOG.md#103) (patch)

### 13.2.0

_June 1, 2023_

- Do not generate fallback values when the rule is wrapped in `@supports (top: var(--f))`.

### 13.1.5

_April 10, 2023_

- Updated `@csstools/css-tokenizer` to `2.1.1` (patch)
- Updated `@csstools/css-parser-algorithms` to `2.1.1` (patch)
- Updated `@csstools/cascade-layer-name-parser` to `1.0.2` (patch)

### 13.1.4

_February 21, 2023_

- Fixed: exception on chained variable declarations.

### 13.1.3

_February 8, 2023_

- Fixed: exception on missing variables.

### 13.1.2

_February 7, 2023_

- Do not apply fallback values when these contain unresolvable custom properties.

### 13.1.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 13.1.0

_January 24, 2023_

- Added: Support for Cascade Layers.
- Improve plugin performance (port of fixes in `v12.1.11`)

### 13.0.0

_November 14, 2022_

- Updated: Support for Node v14+ (major).
- Removed : `importFrom` feature (breaking).
- Removed : `exportTo` feature (breaking).
- Added support for local custom property declarations.

```css
.example {
	--a-value: 20px;
	margin: var(--a-value);
}

/* becomes */

.example {
	--a-value: 20px;
	margin: 20px;
	margin: var(--a-value);
}
```

### 12.1.11

_December 1, 2022_

- Improve plugin performance

### 12.1.10

_October 20, 2022_

- Fix how `preserve: false` interacts with logic around duplicate code (see `12.1.9`).

```css
:root {
	--my-order: 1;
}

.foo {
	order: 1;
	order: var(--my-order);
}

/* With `preserve: false` : */

.foo {
	order: 1;
}
```

### 12.1.9

_September 14, 2022_

- Prevent duplicate code generation.

```diff
.foo {
	order: 1;
	order: var(--my-order, 1);
}

/* becomes */

.foo {
	order: 1;
- 	order: 1;
	order: var(--my-order, 1);
}
```

### 12.1.8

_June 10, 2022_

- Remove some unneeded regular expressions.

### 12.1.7

_April 8, 2022_

- Fix racing condition that could happen when using other async PostCSS plugins ([#331](https://github.com/csstools/postcss-plugins/issues/331))

### 12.1.6

_April 5, 2022_

- Fix `var()` fallback value downgrades with value lists.

### 12.1.5

_March 19, 2022_

- Add deprecation notice for `importFrom` and `exportTo`

[see the discussion](https://github.com/csstools/postcss-plugins/discussions/192)

### 12.1.4

_January 31, 2022_

- Fix `.mjs` in `importFrom` when using `export default`
- Fix `.mjs` in `importFrom` on Windows

### 12.1.3

_January 17, 2022_

- Reset plugin state after each process. It is now safe to use the plugin multiple times for different processes or when watching.

### 12.1.2

_January 12, 2022_

- Fix TypeScript transpilation.
- Avoid throwing errors on unexpected option objects.

### 12.1.1

_January 12, 2022_

- Fix Node 12/14 compatibility

### 12.1.0

_January 12, 2022_

- Add `overrideImportFromWithRoot` option
- Allow `.mjs` in `importFrom`
- Converted to TypeScript
- Correct typings for plugin options
- Fix unicode support in custom property names

### 12.0.4

_January 7, 2022_

- Fixed an issue that was causing synchronous mode to not being able to pick and transform properties that were added as part of the PostCSS flow. ([#132](https://github.com/csstools/postcss-plugins/issues/132))

### 12.0.2

_January 2, 2022_

- Removed Sourcemaps from package tarball.
- Moved CLI to CLI Package. See [announcement](https://github.com/csstools/postcss-plugins/discussions/121).

### 12.0.1

_December 16, 2021_

- Changed: now uses `postcss-value-parser` for parsing.
- Updated: documentation

### 12.0.0

_September 17, 2021_

- Updated: Support for PostCS 8+ (major).
- Updated: Support for Node 12+ (major).

### 11.0.0

_January 12, 2021_

- Added: Support for PostCSS v8.

### 10.0.0

_September 18, 2020_

- Fixed: `url-regex` vulnerability ([#228](https://github.com/postcss/postcss-custom-properties/pull/228))
- Breaking Change: Node v10+ now required

### 9.2.0

_September 18, 2020_

- Added: Export variables to SCSS file ([#212](https://github.com/postcss/postcss-custom-properties/pull/212))
- Added: Support for ".pcss" file resolution in `importFrom` ([#211](https://github.com/postcss/postcss-custom-properties/pull/211))
- Fixed: Allow combined selectors ([#199](https://github.com/postcss/postcss-custom-properties/pull/199))
- Fixed: Bug with spaces and commas in value ([#222](https://github.com/postcss/postcss-custom-properties/pull/222))
- Fixed: `importFrom` priority ([#222](https://github.com/postcss/postcss-custom-properties/pull/222))

### 9.1.1

_February 20, 2020_

- Fixed: Preserve spaces in multi-part values ([#203](https://github.com/postcss/postcss-custom-properties/pull/203))

### 9.1.0

_July 15, 2019_

- Added: Support for preserving trailing comments within a declaration.

### 9.0.2

_July 15, 2019_

- Updated: `postcss-values-parser` to 3.0.5 (patch)

### 9.0.1

_June 20, 2019_

- Updated: `postcss-values-parser` to 3.0.4 (major)
- Updated: Node 8+ compatibility (major)

> This release is identical to v9.0.0, only `npm publish` failed to publish v9.0.0 and threw the following error:
> ```
> You cannot publish over the previously published versions: 9.0.0.
> ```
> I did not want this issue to distract me, and so I thoughtfully and impatiently published v9.0.0 as v9.0.1.

### 8.0.11

_June 20, 2019_

- Added: Synchronous transforms when async is unnecessary (thank @eteeselink)
- Fixed: Unexpected mutations to imported Custom Properties (thank @EECOLOR)
- Fixed: Transforms throwing over unknown Custom Properties

### 8.0.10

_April 1, 2019_

- Added: Support for ignoring lines and or blocks using
  `postcss-custom-properties` comments.
- Updated: `postcss` to 7.0.14 (patch)
- Updated: `postcss-values-parser` to 2.0.1 (patch)

### 8.0.9

_November 5, 2018_

- Fixed: Issue with duplicate custom property usage within a declaration

### 8.0.8

_October 2, 2018_

- Fixed: Issue with nested fallbacks

### 8.0.7

_October 2, 2018_

- Fixed: Issue with parsing custom properties that are not strings
- Updated: `postcss` to 7.0.5 (patch)

### 8.0.6

_September 21, 2018_

- Fixed: Issue with regular `:root` and `html` properties not getting polyfilled
- Updated: `postcss` to 7.0.3 (patch)

### 8.0.5

_September 21, 2018_

- Fixed: Issue with multiple `importFrom` not getting combined

### 8.0.4

_September 18, 2018_

- Fixed: Do not break on an empty `importFrom` object

### 8.0.3

_September 18, 2018_

- Updated: PostCSS Values Parser 2

### 8.0.2

_September 17, 2018_

- Fixed: Spacing is preserved before replaced variables.

### 8.0.1

_September 17, 2018_

- Fixed: Workaround issue in `postcss-values-parser` incorrectly cloning nodes.

### 8.0.0

_September 16, 2018_

- Added: New `exportTo` function to specify where to export custom properties to.
- Added: New `importFrom` option to specify where to import custom properties from.
- Added: Support for variables written within `html`
- Added: Support for PostCSS v7.
- Added: Support for Node v6+.
- Removed: `strict` option, as using the fallback value isn’t necessarily more valid.
- Removed: `preserve: "computed"` option, as there seems to be little use in preserving custom property declarations while removing all usages of them.
- Removed: `warnings` and `noValueNotifications` options, as this should be the job of a linter tool.
- Removed: `variables` option, which is now replaced by `importFrom`
- Removed: `appendVariables` option, which is now replaced by `exportTo`
- Fixed: Custom Properties in `:root` are not also transformed.
- Fixed: Declarations that do not change are not duplicated during preserve.

### 7.0.0

_February 16, 2018_

- Changed: `preserve` option defaults as `true` to reflect the browser climate
- Changed: `warnings` option defaults to `false` to reflect the browser climate

### 6.3.1

_February 16, 2018_

- Reverted: `preserve` and `warnings` option to be added in major release

### 6.3.0

_February 15, 2018_

- Fixed: `var()` captures strictly `var()` functions and not `xvar()`, etc
- Fixed: `var()` better captures whitespace within the function
- Fixed: comments within declarations using `var()` are now preserved
- Changed: `preserve` option defaults as `true` to reflect the browser climate
- Changed: `warnings` option defaults to `false` to reflect the browser climate
- Updated documentation

### 6.2.0

_October 6, 2017_

- Added: `noValueNotifications` option (#71)
- Fixed: Typo in `prefixedVariables` variable name (#77)

### 6.1.0

_June 28, 2017_

- Added: Let "warnings" option silence all warnings
([#67](https://github.com/postcss/postcss-custom-properties/pull/67))
- Dependencies update (postcss, balanced-match)

### 6.0.1

_May 15, 2017_

- Fixed: incorrect export ([#69](https://github.com/postcss/postcss-custom-properties/issues/69))

### 6.0.0

_May 12, 2017_

- Added: compatibility with postcss v6.x

### 5.0.2

_February 1, 2017_

- Minor dependency update
  ([#57](https://github.com/postcss/postcss-custom-properties/pull/57))

### 5.0.1

_April 22, 2016_

- Fixed: trailing space after custom property name causes duplicate empty
  property
  ([#43](https://github.com/postcss/postcss-custom-properties/pull/43))

### 5.0.0

_August 25, 2015_

- Removed: compatibility with postcss v4.x
- Added: compatibility with postcss v5.x

### 4.2.0

_July 21, 2015_

- Added: `warnings` option allows you to disable warnings.
([cssnext#186](https://github.com/cssnext/cssnext/issues/186))

### 4.1.0

_July 14, 2015_

- Added: plugin now returns itself in order to expose a `setVariables` function
that allow you to programmatically change the variables.
([#35](https://github.com/postcss/postcss-custom-properties/pull/35))

### 4.0.0

_June 17, 2015_

- Changed: messages and exceptions are now sent using postcss message API.

### 3.3.0

_April 8, 2015_

- Added: `preserve` now support `"computed"` so only preserve resolved custom properties (see new option below)
- Added: `appendVariables` allows you (when `preserve` is truthy) to append your variables as custom properties
- Added: `strict: false` allows your to avoid too many fallbacks added in your CSS.

### 3.2.0

_03 31, 2015_

- Added: JS defined variables are now resolved too ([#22](https://github.com/postcss/postcss-custom-properties/issues/22))

### 3.1.0

_03 16, 2015_

- Added: variables defined in JS are now automatically prefixed with `--`
  ([0691784](https://github.com/postcss/postcss-custom-properties/commit/0691784ed2218d7e6b16da8c4df03e2ca0c4798c))

### 3.0.1

_February 6, 2015_

- Fixed: logs now have filename back ([#19](https://github.com/postcss/postcss-custom-properties/issues/19))

### 3.0.0

_January 20, 2015_

- Changed: upgrade to postcss 4 ([#18](https://github.com/postcss/postcss-custom-properties/pull/18))
- Removed: some code that seems to be useless ([16ff3c2](https://github.com/postcss/postcss-custom-properties/commit/16ff3c22fe0563a1283411d7866791966fff4c58))

### 2.1.1

_December 2, 2014_

- Fixed: issue when multiples undefined custom properties are referenced ([#16](https://github.com/postcss/postcss-custom-properties/issues/16))

### 2.1.0

_November 25, 2014_

- Added: enhanced exceptions & messages

### 2.0.0

_November 12, 2014_

- Changed: upgrade to postcss 3

### 1.0.2

_November 4, 2014_

- Fixed: more clear message for warning about custom prop used in non top-level :root

### 1.0.1

_November 3, 2014_

- Fixed: warning about custom prop used in non :root

### 1.0.0

_November 2, 2014_

- Added: warning when a custom prop is used in another place than :root
- Added: handle !important

### 0.4.0

_September 30, 2014_

- Added: JS-defined properties override CSS-defined

### 0.3.1

_August 27, 2014_

- Added: nested custom properties usages are now correctly resolved
- Changed: undefined var doesn't throw error anymore (just a console warning) & are kept as is in the output

### 0.3.0

_August 26, 2014_

- Changed: fallback now are always added by default ([see why](http://www.w3.org/TR/css-variables/#invalid-variables))
- Changed: `map` option renamed to `variables`

### 0.2.0

_August 22, 2014_

- Added: `map` option
- Changed: GNU style error message

### 0.1.0

_August 1, 2014_

✨ First release based on [rework-vars](https://github.com/reworkcss/rework-vars) v3.1.1
