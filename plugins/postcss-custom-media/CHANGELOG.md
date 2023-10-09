# Changes to PostCSS Custom Media

### 10.0.2

_October 9, 2023_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#221) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#232) (patch)
- Updated [`@csstools/cascade-layer-name-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/cascade-layer-name-parser) to [`1.0.5`](https://github.com/csstools/postcss-plugins/tree/main/packages/cascade-layer-name-parser/CHANGELOG.md#105) (patch)
- Updated [`@csstools/media-query-list-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/media-query-list-parser) to [`2.1.5`](https://github.com/csstools/postcss-plugins/tree/main/packages/media-query-list-parser/CHANGELOG.md#215) (patch)

### 10.0.1

_September 18, 2023_

- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`2.2.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#220) (minor)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#231) (patch)
- Updated [`@csstools/cascade-layer-name-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/cascade-layer-name-parser) to [`1.0.4`](https://github.com/csstools/postcss-plugins/tree/main/packages/cascade-layer-name-parser/CHANGELOG.md#104) (patch)
- Updated [`@csstools/media-query-list-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/media-query-list-parser) to [`2.1.4`](https://github.com/csstools/postcss-plugins/tree/main/packages/media-query-list-parser/CHANGELOG.md#214) (patch)

### 10.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`2.3.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#230) (minor)
- Updated [`@csstools/cascade-layer-name-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/cascade-layer-name-parser) to [`1.0.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/cascade-layer-name-parser/CHANGELOG.md#103) (patch)
- Updated [`@csstools/media-query-list-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/media-query-list-parser) to [`2.1.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/media-query-list-parser/CHANGELOG.md#212) (patch)

### 9.1.5

_June 21, 2023_

- Updated `@csstools/media-query-list-parser` to `2.1.1` (patch)


### 9.1.4

_June 1, 2023_

- Updated `@csstools/media-query-list-parser` to `2.1.0` (minor)


### 9.1.3

_April 10, 2023_

- Updated `@csstools/css-tokenizer` to `2.1.1` (patch)
- Updated `@csstools/css-parser-algorithms` to `2.1.1` (patch)
- Updated `@csstools/cascade-layer-name-parser` to `1.0.2` (patch)
- Updated `@csstools/media-query-list-parser` to `2.0.4` (patch)

### 9.1.2

_February 8, 2023_

- Fixed: exception on missing media queries.
- Reduce the amount of duplicate fallback CSS.

### 9.1.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 9.1.0

_January 24, 2023_

- Added: Support for Cascade Layers.

### 9.0.1

_November 19, 2022_

- Fixed: avoid complex generated CSS when `@custom-media` contains only a single simple media feature.

### 9.0.0

_November 14, 2022_

- Updated: Support for Node v14+ (major).
- Removed: `importFrom` feature (breaking).
- Removed: `exportTo` feature (breaking).
- Removed: References without parenthesis `@media --foo {}` (breaking).
- Fixed: implement logical evaluation of custom media queries.
- Added: Support for `true` and `false` keywords in `@custom-media`.

### 8.0.2

_June 4, 2022_

- Fixed: dependency declarations in package.json

### 8.0.1

_June 3, 2022_

- Updated: use specific AtRule visitor
- Fixed: allow any valid ident in custom media (`@custom-media --🧑🏾‍🎤 (min-width: 320px);`)
- Fixed: allow white space around custom media (`@media ( --mq-1   );`) (https://github.com/csstools/postcss-custom-media/pull/59) (https://github.com/csstools/postcss-custom-media/pull/71)

### 8.0.0

_January 12, 2021_

- Added: Support for PostCSS v8

### 7.0.8

_March 30, 2019_

- Fixed: Issue importing from `.pcss` files
- Updated: `postcss` to 7.0.14 (patch)

### 7.0.7

_October 19, 2018_

- Fixed: Issue combining custom media media queries with `and`

### 7.0.6

_October 12, 2018_

- Fixed: Issue combining multiple custom media

### 7.0.5

_October 5, 2018_

- Fixed: Possible issues resolving paths to imports and exports
- Added: Imports from `customMedia` and `custom-media` simultaneously
- Updated: `postcss` to 7.0.5

### 7.0.4

_September 23, 2018_

- Added: `importFromPlugins` option to process imports

### 7.0.3

_September 20, 2018_

- Fixed: Do not break on an empty `importFrom` object

### 7.0.2

_September 15, 2018_

- Fixed: An issue with re-assigning params as a non-string

### 7.0.1

_September 14, 2018_

- Fixed: An issue with how opposing queries are resolved.

### 7.0.0

_September 14, 2018_

- Added: New `preserve` option to preserve custom media and atrules using them
- Added: New `exportTo` function to specify where to export custom media
- Added: New `importFrom` option to specify where to import custom media
- Added: Support for PostCSS v7
- Added: Support for Node v6+

# 6.0.0 (May 12, 2017)

- Added: compatibility with postcss v6.x

# 5.0.1 (February 3, 2016)

- Fixed: circular dependencies are properly detected
(https://github.com/postcss/postcss-custom-media/pull/17)

# 5.0.0 (August 25, 2015)

- Removed: compatibility with postcss v4.x
- Added: compatibility with postcss v5.x

# 4.1.0 (06 30, 2015)

- Added: Allow custom media to reference each other
(https://github.com/postcss/postcss-custom-media/pull/10)

# 4.0.0 (May 17, 2015)

- Changed: warning messages are now sent via postcss messages api (^4.1.0)
- Added: automatic custom media `--` prefixing
(https://github.com/postcss/postcss-custom-media/issues/11)
- Added: `preserve` allows you to preserve custom media query defintions
- Added: `appendExtensions` allows you (when `preserve` is truthy) to append your extensions as media queries

# 3.0.0 (January 29, 2015)

- Added: compatibility with postcss v4.x
- Removed: compatibility with postcss v3.x

# 2.0.0 [Yanked]

_You never saw this version (this is a bad release that points to 1.0.0)._

# 1.3.0 (November 25, 2014)

- Changed: better gnu message

# 1.2.1 (October 9, 2014)

- Fixed: npm description

# 1.2.0 (October 1, 2014)

- Added: support for multiples media in query list (ref https://github.com/reworkcss/rework-custom-media/pull/5)

# 1.1.0 (September 30, 2014)

- Added: support for js-defined media queries (fix https://github.com/postcss/postcss-custom-media/issues/3)

# 1.0.1 (September 16, 2014)

- Added: Allow whitespace around custom media name (fix https://github.com/postcss/postcss-custom-media/issues/2)

# 1.0.0 (August 12, 2014)

✨ First release based on https://github.com/reworkcss/rework-custom-media v0.1.1
