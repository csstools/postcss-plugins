# Changes to PostCSS Nesting Experimental

### 4.0.0

_January 14, 2026_

- Updated: Support for Node `20.19.0` or later (major).
- Removed: `commonjs` API. In supported Node versions `require(esm)` will work without needing to make code changes.

### 3.0.1

_October 23, 2024_

- Updated: `postcss-selector-parser`

### 3.0.0

_August 3, 2024_

- Updated: Support for Node v18+ (major).

### 2.0.1

_December 15, 2023_

- Fix type definitions

### 2.0.0

_January 24, 2023_

- Fix: Change how `&` is handled in functional pseudo classes in a non-nested context.

```diff
:has(&) {}

/* becomes */

- :has(:scope) {}
+ :has(:is(:root,:host)) {}
```

- Updated: Support for Node v14+ (major).

### 1.1.1

_November 16, 2022_

- Fix: Do not throw when a selector is invalid, show a warning instead.
- Fix: Correctly handle declarations after nested rules.

```diff
/* 
	Example 7
	https://drafts.csswg.org/css-nesting/#mixing
*/
article {
	color: green;

+ 	color: red;
}
:is(article) {
		color: blue;
	}
- article {
- 	color: red;
- }
```

### 1.1.0

_November 3, 2022_

- match Chrome's behavior for pseudo elements.
- add support for `&` everywhere.

```css
.foo {
  ::before {}
}

/* becomes */

.foo ::before {}
```

### 1.0.0

_October 29, 2022_

Implement the 28 October version of [css-nestng-1](https://drafts.csswg.org/css-nesting/)

- relative selector syntax
- `:is()` pseudo is always used to de-sugar nesting
- better support for `@layer`
- remove `@nest`

Known issues :

- selector invalidation works different (needs examples in README)
- no support for `@scope` (needs media query parser)
- invalid nesting has become more complex to detect with the new proposal. We are now transforming certain edge cases but also emitting a warning.
