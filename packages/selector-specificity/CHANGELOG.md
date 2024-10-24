# Changes to Selector Specificity

### 5.0.0

_October 23, 2024_

- Updated: `postcss-selector-parser`

### 4.0.0

_August 3, 2024_

- Updated: Support for Node v18+ (major).

### 3.1.1

_May 13, 2024_

- Prevent mutation of selectors with An+B microsyntax (e.g. `:nth-child(2n+1 of .foo)`) during specificity calculation

### 3.1.0

_May 11, 2024_

- Add an option to `selectorSpecificity` and `specificityOfMostSpecificListItem` to customize the calculation
- Add `specificityOfMostSpecificListItem` as an exported function

### 3.0.3

_March 31, 2024_

- Add support for:
	- `:active-view-transition`
	- `:active-view-transition-type(foo)`

### 3.0.2

_February 19, 2024_

- Fixed specificity calculation for `:any()` and `:-webkit-any()` pseudo class functions. by @carlosjeurissen

### 3.0.1

_December 15, 2023_

- Add support for:
	- `:active-view-transition(*)`
	- `:active-view-transition(name)`

### 3.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))

### 2.2.0

_March 21, 2023_

- Improve case insensitive string matching.
- Add support for:
	- `::view-transition`
	- `::view-transition-group(*)` and `::view-transition-group(name)`
	- `::view-transition-image-par(*)` and `::view-transition-image-par(name)`
	- `::view-transition-old(*)` and `::view-transition-old(name)`
	- `::view-transition-new(*)` and `::view-transition-new(name)`

### 2.1.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 2.1.0

_January 19, 2023_

- Add support for `::slotted`
- Add support for `:host`
- Add support for `:host-context`

### 2.0.2

_July 8, 2022_

- Fix case insensitive matching.

### 2.0.1

_June 10, 2022_

- Fixed: Exception on `:nth-child` without arguments. [#439](https://github.com/csstools/postcss-plugins/issues/439)

### 2.0.0

_June 4, 2022_

- Breaking: use only named exports instead of `default`
- Added: `compare(a, b)` function to compare selectors by specificity

```diff
- `import selectorSpecificity from '@csstools/selector-specificity';`
+ `import { selectorSpecificity } from '@csstools/selector-specificity';`
```

### 1.0.0

_April 26, 2022_

- Initial version
