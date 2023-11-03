---
title: CSS Color Parser
description: A new package to parse CSS color notations.
date: 2023-03-27
---

## Try it out

<label id="color-input-label-1" for="color-input-1">A new parser for CSS color notations:</label>
<textarea	id="color-input-1" class="color-input" rows="2">
oklch(calc(50% * 1.4) 0.268 134.568)
</textarea>
<output id="color-output-rgb-1" class="color-output-rgb" for="color-input-1" style="--color: rgb(88, 186, 0);">rgb(88, 186, 0)</output>
<output id="color-output-p3-1" class="color-output-p3" for="color-input-1" style="--color: color(display-p3 0.41387 0.73323 0);">color(display-p3 0.41387 0.73323 0)</output>
<output id="color-output-oklch-1" class="color-output-oklch" for="color-input-1" style="--color: oklch(0.7 0.268 134.568);">oklch(0.7 0.268 134.568)</output>

## One more specialized parser

Plenty of plugins in `postcss-preset-env` interact with CSS color values.
We provide fallbacks for modern notations like `rgb(255 0 255 / 50%)` and new color functions like `color(display-p3 0.5 0 0.5 / 0.5)`.

In the past, each package had its own implementation of the needed conversion logic.
This was fine for a while, but as the number of plugins grew, so did the amount of duplicate code.
This was harder to maintain and plugins were larger than they needed to be.

_We had initially hoped to use an existing package (e.g. [color.js](https://colorjs.io) or [culori](https://culorijs.org)), but no package was designed specifically to parse and convert CSS colors exactly as a browser would. We hope that our modular approach allows others to reuse bits even if their use case is different._

[`css-color-5`](https://drafts.csswg.org/css-color-5/) introduced recursive color functions which required a different class of tools.<br>
Simple parsing algorithms or regular expressions were no longer sufficient.

_A recursive example :_<br>
```css
.example {
	color: color-mix(
		in lch,
		#d20 50%,
		color-mix(
			in srgb,
			purple,
			rgb(230 10 15) 10%
		)
	);
}
```

We started from our existing [tokenizer](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) and [parsing algorithms](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) and added [`@csstools/css-calc`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-calc) on on top of that.

We also created and published the [`@csstools/color-helpers` npm package](https://github.com/csstools/postcss-plugins/tree/main/packages/color-helpers) with the color logic based on the sample code maintained by the CSS Working Group.
We are not the creators of most of the algorithms in this package but our users require something distributed through npm.

`@csstools/color-helpers` contains all the parts needed to convert between color spaces and color notations, but it doesn't have any knowledge of CSS and isn't able to parse or serialize CSS color values.

We brought all these building blocks together in a new package [`@csstools/css-color-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser).

This package is able to parse CSS color values like a browser would and convert them to fallback notations.

Currently supported in the parser :
- `color-mix` from [CSS Color Module Level 5](https://drafts.csswg.org/css-color-5/)
- all color notations from [CSS Color Module Level 4](https://drafts.csswg.org/css-color-4/)
- named colors
- `transparent`
- hex colors
- `calc()` expressions in color notations
- recursive color functions

Only two serialization formats are currently supported :
- `rgb(...)`
- `color(display-p3 ...)`

_If you require other formats, please [open an issue](https://github.com/csstools/postcss-plugins/issues/new/choose)_

<label id="color-input-label-2" for="color-input-2">Go nuts:</label>
<textarea	id="color-input-2" class="color-input" rows="15">
color-mix(
	in lch,
	purple calc(100% * sin(0.1)),
	color-mix(
		in oklch,
		#4fe calc(100% / 3),
		color(
			display-p3
			calc(33% * 3)
			calc(1 / 2) -0.1)
			calc(100% / 3 * 2
		)
	) calc(20% + 4%)
)
</textarea>
<output id="color-output-rgb-2" class="color-output-rgb" for="color-input-2" style="--color: rgba(255, 99, 0, 0.339833);">rgba(255, 99, 0, 0.339833)</output>
<output id="color-output-p3-2" class="color-output-p3" for="color-input-2" style="--color: color(display-p3 0.9361 0.42808 0.14191 / 0.339833);">color(display-p3 0.9361 0.42808 0.14191 / 0.339833)</output>

<output id="color-output-oklch-2" class="color-output-oklch" for="color-input-2" style="--color: oklch(0.69433 0.21132 43.7908 / 0.34);">oklch(0.69433 0.21132 43.7908 / 0.34)</output>

{% block scripts %}<script async defer src="{{ '/static/js/blog_color_parser_2023_03_27.js' | addHash }}"></script>{% endblock %}

<style>
	.color-input, .color-output-rgb, .color-output-p3, .color-output-oklch {
		background-color: #263238;
		border-radius: 3px;
		border: 1px solid grey;
		color: white;
		display: block;
		font-size: 0.875em;
		line-height: 2;
		margin: 1rem 0 2rem;
		max-width: calc(100% - 3rem);
		padding: 2px 8px;
		position: relative;
		text-align: left;
		width: 650px;
	}

	.color-output-rgb::after,
	.color-output-p3::after,
	.color-output-oklch::after {
		background-color: var(--color);
		border-radius: 50%;
		content: "";
		display: inline-block;
		height: calc(0.875em * 2);
		position: absolute;
		right: calc(-1 * ((0.875em * 2) + 1rem));
		top: 2px;
		width: calc(0.875em * 2);
	}

	#color-input-label {
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
