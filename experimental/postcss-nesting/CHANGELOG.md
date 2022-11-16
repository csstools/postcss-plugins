# Changes to PostCSS Nesting Experimental

### 1.1.1 (November 16, 2022)

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

### 1.1.0 (November 3, 2022)

- match Chrome's behavior for pseudo elements.
- add support for `&` everywhere.

```css
.foo {
  ::before {}
}

/* becomes */

.foo ::before {}
```

### 1.0.0 (October 29, 2022)

Implement the 28 October version of [css-nestng-1](https://drafts.csswg.org/css-nesting/)

- relative selector syntax
- `:is()` pseudo is always used to de-sugar nesting
- better support for `@layer`
- remove `@nest`

Known issues :

- selector invalidation works different (needs examples in README)
- no support for `@scope` (needs media query parser)
- invalid nesting has become more complex to detect with the new proposal. We are now transforming certain edge cases but also emitting a warning.
