# Changes to PostCSS Progressive Custom Properties

### 4.1.0

_May 27, 2025_

- Add matching rules for variadic function arguments in `color-mix()`

### 4.0.1

_April 19, 2025_

- Drop the `max` keyword for `contrast-color( <color> )`

### 4.0.0

_August 3, 2024_

- Updated: Support for Node v18+ (major).

### 3.3.0

_July 7, 2024_

- Add matching rules for alt text in `content`

### 3.2.0

_March 31, 2024_

- Add matching rules for `contrast-color`

### 3.1.1

_March 13, 2024_

- Test for mixed component types in color values (e.g. `lab(100 50% 50)`)
- Allow relative color syntax in `rgba` and `hsla` color notations.

### 3.1.0

_February 19, 2024_

- Add matching rules for `light-dark`

### 3.0.3

_December 15, 2023_

- Fix type definitions

### 3.0.2

_October 9, 2023_

- Add support for css nesting
- Improve grouping of `@supports` rules
- Reduce the size of the generated `@supports` rules for values that contain `var()`

### 3.0.1

_September 18, 2023_

- Improve performance

### 3.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))

### 2.3.0

_June 1, 2023_

- Add support for regular properties whose values contain `var()`

```css
.property-with-var--1 {
	color: rgba(87, 107, 149, var(--opacity));
	color: rgb(87 107 149 / var(--opacity));
}

/* becomes */
.property-with-var--1 {
	color: rgba(87, 107, 149, var(--opacity));
}

@supports (color: rgb(0 0 0 / 0)) and (top: var(--f)) {
	.property-with-var--1 {
		color: rgb(87 107 149 / var(--opacity));
	}
}
```

### 2.2.0

_May 19, 2023_

- Add relative color syntax support.
- Fix false positive matches for `rgb` and `hsl` modern function notations.

### 2.1.1

_March 25, 2023_

- Smaller `@supports` check for `color-mix`.

### 2.1.0

_February 2, 2023_

- Group support rules with the same params to reduce the output size.

### 2.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 2.0.0

_January 24, 2023_

- Updated: Support for Node v14+ (major).

## 1.3.0 (March 7, 2022)

- Add matching rules for `color-mix`
- Fix matching rules for gradient functions
- Reduce matchers size

## 1.2.0 (February 15, 2022)

- More matching rules for [double position gradients](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-double-position-gradients#readme).

## 1.1.0 (February 12, 2022)

- No longer uses custom properties in `@supports` rules.
- Implement AST matching for values and units and generate minimal `@supports` for select features.

## 1.0.0 (February 6, 2022)

Initial release
