---
title: CSS Calc
description: A new package to solve css calc expressions.
date: 2023-02-21
---

In the past we have mostly ignored values that contain `calc()` when generating fallbacks, but no more!

```css
.foo {
	/* today this is ignored by postcss-oklab-function */
	color: oklch(calc(20% * 2) 0.268 34.568);
}
```

[CSS Calc] is a calculator library that is based on the [CSS Values Specification].

It allows us to "solve" a `calc()` expression and use the resulting numeric value in any PostCSS plugin.

[CSS Calc] will take `calc(20% * 2)` and convert it to `40%`.  
The remaining `oklch(40% 0.268 34.568)` is then easier to fallback to `rgb()`.

It can not do everything a browser would be able to, but it can still do enough to make it useful for specific features.
(e.g. `1rem + 4px` is unsolvable)

<label id="calc-input-label" for="calc-input">Try it out:</label>
<input id="calc-input" type="text" value="10px * -2">
<output id="calc-output" for="calc-input">-20px</output>

This new tool will enable us to create better PostCSS plugins for [Relative Color Syntax], [Color Mix] and any other feature that interacts with `calc()`.

{% block scripts %}<script async defer src="{{ '/static/js/blog_calc_2023_02_21.js' | addHash }}"></script>{% endblock %}

[CSS Calc]: https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc#readme
[Relative Color Syntax]: https://css-tricks.com/new-css-color-features-preview/#aa-the-relative-color-syntax-is-super-useful
[Color Mix]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix
[CSS Values Specification]: https://drafts.csswg.org/css-values-4/

<style>
	#calc-input, #calc-output {
		background-color: #263238;
		border-radius: 3px;
		border: 1px solid grey;
		color: white;
		display: block;
		font-size: 0.875em;
		line-height: 2;
		margin: 1rem 0 2rem;
		max-width: 100%;
		padding: 2px 8px;
		text-align: left;
		width: 450px;
	}

	#calc-input-label {
		display: block;
		font-size: 0.875em;
		line-height: 2;
		margin: 1rem 0;
		max-width: 100%;
		padding: 2px 0;
		text-align: left;
		width: 450px;
	}
</style>
