---
title: PostCSS Relative Color Syntax
description: Use relative color syntax in CSS color functions.
date: 2023-05-22
---

We are happy to announce the release of [`@csstools/postcss-relative-color-syntax`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-relative-color-syntax#readme), a PostCSS plugin to use [`relative color syntax`](https://drafts.csswg.org/css-color-5/#relative-colors) in any browser.

```css
.example {
	background: oklab(
		from oklab(54.3% -22.5% -5%)
		calc(1.0 - l)
		calc(a * 0.8)
		b
	);
}
```

This plugin uses [`@csstools/css-color-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser#readme) under the hood to parse the color values, checkout [the blog post](/blog/css-color-parser-v1.0.0/) for all the technical details.

_If you are using [`postcss-preset-env`](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env#readme) you will already have this plugin when using the latest version._

## Color palette demo

Relative color syntax is especially useful for creating color palettes.  

Use these controls to alter the center color swatch.  
All surrounding colors are generated from that single color.

<div class="relative-color-syntax-demo">
	<div class="relative-color-syntax-demo-controls">
		<label for="relative-color-syntax-main-hue">Hue</label>
		<input name="relative-color-syntax-main-hue" id="relative-color-syntax-main-hue" type="range" min="0" max="360" value="215">

		<label for="relative-color-syntax-chroma-factor">Chroma</label>
		<input name="relative-color-syntax-chroma-factor" id="relative-color-syntax-chroma-factor" type="range" min="0" max="10" value="5.4" step="0.1">

		<label for="relative-color-syntax-hue-separation">Distance to secondary colors</label>
		<input name="relative-color-syntax-hue-separation" id="relative-color-syntax-hue-separation" type="range" min="0" max="180" value="20">
	</div>

	<div class="relative-color-syntax-palettes">
		<div class="relative-color-syntax-palette">
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
		</div>
		<div class="relative-color-syntax-palette">
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
		</div>
		<div class="relative-color-syntax-palette">
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
			<div class="relative-color-syntax-swatch">◉</div>
		</div>
	</div>
</div>

### How the demo works :

#### `sin` curves

All the colors are generated from a single color by using `sin`.  
`sin` curves go [up and down and up and down again](https://www.wolframalpha.com/input?i=sin%28x%29).  
They are not as nice as bell curves, or tailored cubic Bézier curves, but `sin` is simple to work with in CSS.

This effect can be used to smooth value progression or to create "toggles".

#### controlling `chroma`

We do not want to have a high chrome when nearing black or white as that would lead to excessive clamping in browsers without support for gamut mapping.
Using `sin` to control the chroma, we can have a lower chroma when nearing black or white.

#### keeping contrast high

For the text color we actually want to use [`color-contrast()`](https://drafts.csswg.org/css-color-6/#colorcontrast) but the specification isn't final yet. 
So we use something simpler that will work often enough.

When the color has a lightness over `0.5` we toggle to black, when it is under `0.5` we toggle to white.
We clamp the result a bit as pure white and black might be to harsh.

All these values are able to be controlled with relative color syntax.
Without this new CSS feature it would not be possible to easily create derivative colors.

#### secondary colors

The secondary colors are generated by by adding and subtracting a number of degrees from the primary hue.
Depending on the angle this gives a harmonic or more eclectic palette.


```css
.swatch {
	/* NOTE :
		postcss-preset-env and other plugins 
		can not generate fallback values when `var()` is used.

		But using custom properties in this example
		makes it clear which values change and which are static.
	*/

	/* Your starting color: */
	--palette-start-color: hotpink;
	/* The lightness of this swatch */
	--lightness: 50%;
	/* Chroma factor is inverted, higher number is less chroma */
	--chroma-factor: 10;

	--background-color: oklch(
		/* every swatch has the same start color */
		from var(--palette-start-color)
		/* the lightness is the variable */
		var(--lightness)
		/* 
			the chroma is a function of the lightness,
			using a smooth curve that is lower when approaching white and black
		*/
		calc((sin((l * 2 * PI) + (-1 * (PI / 2))) + 1) / var(--chroma-factor))
		/* hue is taken from the palette start color */
		h
	);
	color: oklab(
		/* foreground color starts from the background color */
		from var(--background-color)
		/*
			lightness is a function of the background color lightness:
			- any value over 0.5 will be clamped to 0.9
			- any value under 0.5 will be clamped to 0.2

			Clamp is used because sub pixel rendering with overly bright colors seems to be bugged.
		*/
		clamp(0.2, ((sin((l * PI) + (PI / 2)) + 0.1) * 9999), 0.9)
		0
		0
	);
	background-color: var(--background-color);
}
```

{% block scripts %}<script async defer src="{{ '/static/js/blog_relative_color_syntax_2023_05_22.js' | addHash }}"></script>{% endblock %}

<style>
	.relative-color-syntax-demo-controls {
		max-width: 300px;
	}

	.relative-color-syntax-demo-controls label {
		color: #666;
		font-size: 14px;
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}

	.relative-color-syntax-demo-controls input[type=range] {
		-webkit-appearance: none;
		width: 100%;
		height: 10px;
		border-radius: 5px;
		background-color: #ddd;
		margin-inline: 0;
		outline: none;
	}
	
	.relative-color-syntax-demo-controls input[type=range]::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: var(--color-brand);
		cursor: pointer;
	}

	.relative-color-syntax-demo {
		max-width: 100vw;
	}

	@media (min-width: 900px) {
		.relative-color-syntax-demo {
			max-width: 900px;
		}
	}

	.relative-color-syntax-palettes {
		display: flex;
		flex-direction: row;
		width: 100%;
	}

	@media (min-aspect-ratio: 1 / 1) {
		.relative-color-syntax-palettes {
			flex-direction: column;
		}
	}

	.relative-color-syntax-palette {
		display: flex;
		flex-direction: column-reverse;
	}

	@media (min-aspect-ratio: 1 / 1) {
		.relative-color-syntax-palette {
			flex-direction: row-reverse;
		}
	}

	.relative-color-syntax-swatch {
		width: 90px;
		height: 56px;
		padding: 2px 5px;
	}

	.relative-color-syntax-palette:nth-child(1) .relative-color-syntax-swatch:nth-child(1) {
		background-color: var(--color-a-l-10-background);
		color: var(--color-a-l-10-foreground);
	}

	.relative-color-syntax-palette:nth-child(1) .relative-color-syntax-swatch:nth-child(2) {
		background-color: var(--color-a-l-20-background);
		color: var(--color-a-l-20-foreground);
	}

	.relative-color-syntax-palette:nth-child(1) .relative-color-syntax-swatch:nth-child(3) {
		background-color: var(--color-a-l-30-background);
		color: var(--color-a-l-30-foreground);
	}

	.relative-color-syntax-palette:nth-child(1) .relative-color-syntax-swatch:nth-child(4) {
		background-color: var(--color-a-l-40-background);
		color: var(--color-a-l-40-foreground);
	}

	.relative-color-syntax-palette:nth-child(1) .relative-color-syntax-swatch:nth-child(5) {
		background-color: var(--color-a-l-50-background);
		color: var(--color-a-l-50-foreground);
	}

	.relative-color-syntax-palette:nth-child(1) .relative-color-syntax-swatch:nth-child(6) {
		background-color: var(--color-a-l-60-background);
		color: var(--color-a-l-60-foreground);
	}

	.relative-color-syntax-palette:nth-child(1) .relative-color-syntax-swatch:nth-child(7) {
		background-color: var(--color-a-l-70-background);
		color: var(--color-a-l-70-foreground);
	}

	.relative-color-syntax-palette:nth-child(1) .relative-color-syntax-swatch:nth-child(8) {
		background-color: var(--color-a-l-80-background);
		color: var(--color-a-l-80-foreground);
	}

	.relative-color-syntax-palette:nth-child(1) .relative-color-syntax-swatch:nth-child(9) {
		background-color: var(--color-a-l-90-background);
		color: var(--color-a-l-90-foreground);
	}

	.relative-color-syntax-palette:nth-child(1) .relative-color-syntax-swatch:nth-child(10) {
		background-color: var(--color-a-l-95-background);
		color: var(--color-a-l-95-foreground);
	}

	.relative-color-syntax-palette:nth-child(2) .relative-color-syntax-swatch:nth-child(1) {
		background-color: var(--color-b-l-10-background);
		color: var(--color-b-l-10-foreground);
	}

	.relative-color-syntax-palette:nth-child(2) .relative-color-syntax-swatch:nth-child(2) {
		background-color: var(--color-b-l-20-background);
		color: var(--color-b-l-20-foreground);
	}

	.relative-color-syntax-palette:nth-child(2) .relative-color-syntax-swatch:nth-child(3) {
		background-color: var(--color-b-l-30-background);
		color: var(--color-b-l-30-foreground);
	}

	.relative-color-syntax-palette:nth-child(2) .relative-color-syntax-swatch:nth-child(4) {
		background-color: var(--color-b-l-40-background);
		color: var(--color-b-l-40-foreground);
	}

	.relative-color-syntax-palette:nth-child(2) .relative-color-syntax-swatch:nth-child(5) {
		background-color: var(--color-b-l-50-background);
		color: var(--color-b-l-50-foreground);
	}

	.relative-color-syntax-palette:nth-child(2) .relative-color-syntax-swatch:nth-child(6) {
		background-color: var(--color-b-l-60-background);
		color: var(--color-b-l-60-foreground);
	}

	.relative-color-syntax-palette:nth-child(2) .relative-color-syntax-swatch:nth-child(7) {
		background-color: var(--color-b-l-70-background);
		color: var(--color-b-l-70-foreground);
	}

	.relative-color-syntax-palette:nth-child(2) .relative-color-syntax-swatch:nth-child(8) {
		background-color: var(--color-b-l-80-background);
		color: var(--color-b-l-80-foreground);
	}

	.relative-color-syntax-palette:nth-child(2) .relative-color-syntax-swatch:nth-child(9) {
		background-color: var(--color-b-l-90-background);
		color: var(--color-b-l-90-foreground);
	}

	.relative-color-syntax-palette:nth-child(2) .relative-color-syntax-swatch:nth-child(10) {
		background-color: var(--color-b-l-95-background);
		color: var(--color-b-l-95-foreground);
	}

	.relative-color-syntax-palette:nth-child(3) .relative-color-syntax-swatch:nth-child(1) {
		background-color: var(--color-c-l-10-background);
		color: var(--color-c-l-10-foreground);
	}

	.relative-color-syntax-palette:nth-child(3) .relative-color-syntax-swatch:nth-child(2) {
		background-color: var(--color-c-l-20-background);
		color: var(--color-c-l-20-foreground);
	}

	.relative-color-syntax-palette:nth-child(3) .relative-color-syntax-swatch:nth-child(3) {
		background-color: var(--color-c-l-30-background);
		color: var(--color-c-l-30-foreground);
	}

	.relative-color-syntax-palette:nth-child(3) .relative-color-syntax-swatch:nth-child(4) {
		background-color: var(--color-c-l-40-background);
		color: var(--color-c-l-40-foreground);
	}

	.relative-color-syntax-palette:nth-child(3) .relative-color-syntax-swatch:nth-child(5) {
		background-color: var(--color-c-l-50-background);
		color: var(--color-c-l-50-foreground);
	}

	.relative-color-syntax-palette:nth-child(3) .relative-color-syntax-swatch:nth-child(6) {
		background-color: var(--color-c-l-60-background);
		color: var(--color-c-l-60-foreground);
	}

	.relative-color-syntax-palette:nth-child(3) .relative-color-syntax-swatch:nth-child(7) {
		background-color: var(--color-c-l-70-background);
		color: var(--color-c-l-70-foreground);
	}

	.relative-color-syntax-palette:nth-child(3) .relative-color-syntax-swatch:nth-child(8) {
		background-color: var(--color-c-l-80-background);
		color: var(--color-c-l-80-foreground);
	}

	.relative-color-syntax-palette:nth-child(3) .relative-color-syntax-swatch:nth-child(9) {
		background-color: var(--color-c-l-90-background);
		color: var(--color-c-l-90-foreground);
	}

	.relative-color-syntax-palette:nth-child(3) .relative-color-syntax-swatch:nth-child(10) {
		background-color: var(--color-c-l-95-background);
		color: var(--color-c-l-95-foreground);
	}
</style>

<style id="palette-styles">
</style>
