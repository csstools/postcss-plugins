---
title: Upcoming changes to CSS Nesting
description: The spec is changing, and we're following suit. Here's what you need to know!
date: 2023-02-10
---

Nesting in CSS has always been a desired feature. Sass did it first, and then every other preprocessor had it in one form or another. Tab Atkins proposed the spec for [CSS Nesting Module Level 3](https://tabatkins.github.io/specs/css-nesting/) back in 2015, and it wasn't until 2021 that it got to be picked as [an official spec](https://www.w3.org/TR/css-nesting-1/) by the CSS Working Group.

[PostCSS Nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting#readme) has been around since the beginning, and we've been following the spec closely. However, as it happens, the spec is evolving once it's finally ready to be implemented by browsers. This means that we will need to make some changes over time to keep up with the spec. 

In this post we'll outline what has changed from the plugin that you use today and that's bundled with [PostCSS Preset Env](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env#readme), and what you can expect in the future along with some rough timelines.

## What's changing?

In a nutshell there are three things that are changing. 

### `@nest` is gone 👋

`@nest` was previously required for all selectors that didn't start with `&`. This is now gone and `&` can be placed anywhere, or _nowhere_ (more on this below). 

Let's see an example:

```css
.foo {
	@nest .parent & {
		color: green;
	}
}
```

Has to be written as:

```css
.foo {
	.parent & {
		color: green;
	}
}
```

### Making `&` optional (sometimes)

One of the things that have been very different between CSS and Sass is the need for the `&` symbol. This how it needed to look:

```css
.foo {
	& .bar {
		color: green;
	}
	
	& > .baz {
		color: blue;
	}
	
	& + .qux {
		color: red;
	}
	
	& span {
		color: yellow;
	}
}
```

After these changes, (simply put) you _can_ omit the `&` symbol as long as the selector starts with a symbol. Either because it's a relative selector with an explicit combinator (`>` or `+`) or because it's a relative selector with an implicit descendant combinator.

You _could_ write the above as follows: 

```css
.foo {
	.bar {
		color: green;
	}
	
	> .baz {
		color: blue;
	}
	
	+ .qux {
		color: red;
	}
	
	/* span does not start with a symbol */
	& span {
		color: yellow;
	}
	
	/* You can also alter the selector to start with a symbol! */
	:is(span) {
		color: yellow;
	}
}
```

We're emphasizing _can_ and _could_ because skipping the `&` in some cases is not enforced, you can still write them and both are valid. 

#### Non-relative selectors (parent nesting)

The same rule of thumb applies when we have non-relative selector (where `@nest` used to be needed) though this will be a bit trickier.

```css
.foo {
	span & {
		color: rebeccapurple;
	}
}
```

This isn't valid **because the selector does not start with a symbol**. You would need to write it as follows:

```css
.foo {
	:is(span) & {
		color: rebeccapurple;
	}
}
```

Note that subsequent selectors that are comma separated don't need the symbol. These are all valid:

```css
.foo {
	:is(span), p & {
		color: rebeccapurple;
	}
	
	:is(span, p) & {
		color: rebeccapurple;
	}
	
	/* Even on separated lines */
	:is(span) &,
	p & {
		color: rebeccapurple;
	}
}
```

Obviously if you had a selector with a symbol in such list you could just place it first for the rest to work:

```css
.foo {
	.bar &,
	p & {
		color: rebeccapurple;
	}
}
```

### Defined order of declarations that come after nested rules

You can now write declarations after the nested CSS but this won't affect the order in which the cascade actually works. 

Let's see this strange (yet valid) example:

```css
.foo {
	color: pink;

	& {
		color: green;
	}

	color: red;
}
```

Intuitively, you'd think that an element `.foo` with the above CSS should be `red`. However it is actually `green` as this is how the browsers will interpret it:

```css
.foo {
	color: pink;
	color: red;

	& {
		color: green;
	}
}
```

Note that this is considered a bad practice given that it makes the code much harder to read and understand what's going on. Ideally, you should not place new declarations after nesting blocks so the intention is always clear.

## When is this changing?

It already did! Since version [11.1.0](https://github.com/csstools/postcss-plugins/blob/main/plugins/postcss-nesting/CHANGELOG.md#1110-january-31-2023) we have implemented these changes in a non-breaking way. Using [PostCSS Nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting#readme) on [PostCSS Preset Env](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env#readme) today will allow you to write the above syntax already. You can even try this in [the playground](/playground) now!

After the syntax is sufficiently stable (implemented by some vendors) we will release a new version that emit warnings if you use `@nest`. This will be configurable, so you can silence the warnings, but it is advisable to use as a migration guide.

In an upcoming major, `@nest` will be removed completely. 

## Final words

We understand how this can be complicated, and we want to offer a sensible path that does not lead to many breaking versions so you have enough time to adapt but also we can catch any changes that might come from the vendor's implementation.

We're very excited though that Nesting is finally coming to CSS!

As usual, we welcome any feedback, concerns or bug fixes! 
