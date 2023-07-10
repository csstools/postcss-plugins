# Changes to Selector Specificity

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
