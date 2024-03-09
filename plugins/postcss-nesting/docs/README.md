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
<!-- <parallelBuildsNotice> -->
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
Future versions of this plugin will error if you use `@nest`.

We advice everyone to migrate their codebase **now** to nested CSS without `@nest`.  
We published a [Stylelint Plugin](https://github.com/csstools/postcss-plugins/tree/main/plugins-stylelint/no-at-nest-rule#csstoolsstylelint-no-at-nest-rule) to help you migrate.

example warning:
> `@nest` was removed from the CSS Nesting specification and will be removed from PostCSS Nesting in the next major version.
> Change `@nest foo & {}` to `foo & {}` to migrate to the latest standard.

You can silence this warning with a new `silenceAtNestWarning` plugin option.

```js
<exportName>({
	silenceAtNestWarning: true
})
```

## Options

### edition

The default behavior is to transpile CSS following an older version of the CSS nesting specification.

If you want to already use the latest version you can set the `edition` option to `2024-02`.

```js
<exportName>({
	edition: '2024-02'
})
```

#### `2021` (default)

This version is a continuation of what existed before CSS nesting was implemented in browsers.  
It made a few non-invasive changes to keep up with implementations but it is falling behind.

In a future version of this plugin this will no longer be the default.

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

#### `2024-02`

- usage of `:is()` pseudo-class is no longer optional
- at rules are not combined with the `and` keyword
- `@nest` is removed from the specification
- declarations and nested rules/at-rules are no longer re-ordered

```pcss
<example.css>

/* becomes */

<example.edition-2024-02.expect.css>
```

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
