<!-- Available Variables: -->
<!-- <humanReadableName> PostCSS Your Plugin -->
<!-- <exportName> postcssYourPlugin -->
<!-- <packageName> @csstools/postcss-your-plugin -->
<!-- <packageVersion> 1.0.0 -->
<!-- <packagePath> plugins/postcss-your-plugin -->
<!-- <cssdbId> your-feature -->
<!-- <specUrl> https://www.w3.org/TR/css-color-4/#funcdef-color -->
<!-- <example.css> file contents for examples/example.css -->
<!-- <header> -->
<!-- <usage> usage instructions -->
<!-- <envSupport> -->
<!-- <corsWarning> -->
<!-- <linkList> -->
<!-- to generate : npm run docs -->

<header>

[<humanReadableName>] lets you nest style rules inside each other, following the [CSS Nesting specification].

If you want nested rules the same way [Sass] works
you might want to use [PostCSS Nested] instead.

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<envSupport>

## ⚠️ `@nest` has been removed from the specification.

Previous iterations of the [CSS Nesting specification] required using `@nest` for certain selectors.

`@nest` was removed from the specification completely.
Future versions of this plugin will first warn and then error if you use `@nest`.

We advice everyone to migrate their codebase **now** to nested CSS without `@nest`.

## ⚠️ Nested selectors must start with a symbol

The current version of the [CSS Nesting specification](https://www.w3.org/TR/2023/WD-css-nesting-1-20230214/#example-34e8e94f) disallows nested selectors to start with a letter (i.e. a tag name or element selector). To write such selectors, they need to be prefixed with `& ` or wrapped with `:is()`.

You will get a warning when selectors start with a letter:
> Nested selectors must start with a symbol and "span" begins with a letter.

```pcss
.foo {
	/* ❌ invalid */
	span {
		color: hotpink;
	}

	/* ✅ valid */
	& span {
		color: hotpink;
	}

	/* ❌ invalid */
	span & {
		color: hotpink;
	}

	/* ✅ valid */
	:is(span) & {
		color: hotpink;
	}
}	
```

## Options

### noIsPseudoSelector

#### Specificity

Before :

```css
#alpha,
.beta {
	&:hover {
		order: 1;
	}
}
```

After **without** the option :

```js
<exportName>()
```

```css
:is(#alpha,.beta):hover {
	order: 1;
}
```

_`.beta:hover` has specificity as if `.beta` where an id selector, matching the specification._

[specificity: 1, 1, 0](https://polypane.app/css-specificity-calculator/#selector=%3Ais(%23alpha%2C.beta)%3Ahover)

After **with** the option :

```js
<exportName>({
	noIsPseudoSelector: true
})
```

```css
#alpha:hover, .beta:hover {
	order: 1;
}
```

_`.beta:hover` has specificity as if `.beta` where a class selector, conflicting with the specification._

[specificity: 0, 2, 0](https://polypane.app/css-specificity-calculator/#selector=.beta%3Ahover)


#### Complex selectors

Before :

```css
.alpha > .beta {
	& + & {
		order: 2;
	}
}
```

After **without** the option :

```js
<exportName>()
```

```css
:is(.alpha > .beta) + :is(.alpha > .beta) {
	order: 2;
}
```

After **with** the option :

```js
<exportName>({
	noIsPseudoSelector: true
})
```

```css
.alpha > .beta + .alpha > .beta {
	order: 2;
}
```

_this is a different selector than expected as `.beta + .alpha` matches `.beta` followed by `.alpha`._<br>
_avoid these cases when you disable `:is()`_<br>
_writing the selector without nesting is advised here_

```css
/* without nesting */
.alpha > .beta + .beta {
	order: 2;
}
```

<linkList>
[PostCSS Nested]: https://github.com/postcss/postcss-nested
[Sass]: https://sass-lang.com/
[CSS Nesting specification]: <specUrl>
