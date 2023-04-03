---
title: PostCSS Color Mix Function
description: Use the color-mix function in CSS.
date: 2023-04-03
---

We are happy to announce the release of [`@csstools/postcss-color-mix-function`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-color-mix-function#readme), a PostCSS plugin to use the [`color-mix()`](https://drafts.csswg.org/css-color-5/#color-mix) function in any browser.

This plugin uses [`@csstools/css-color-parser`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-color-parser#readme) under the hood to parse the color values, checkout [the blog post](/blog/css-color-parser-v1.0.0/) for all the technical details.

_If you are using [`postcss-preset-env`](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env#readme) you will already have this plugin when using the latest version._

Try it out in this interactive demo that showcases with a Venn diagram how colors are mixing together:

<div class="color-mix-wrapper">
	<div class="color-mix-settings">
		<div class="color-mix-settings__selects">
			<div class="color-mix-settings__select">
				<label for="color-space">Color Space</label>
				<select id="color-space">
					<option value="srgb" selected>srgb</option>
					<option value="srgb-linear">srgb-linear</option>
					<option value="lab">lab</option>
					<option value="oklab">oklab</option>
					<option value="xyz">xyz</option>
					<option value="xyz-d50">xyz-d50</option>
					<option value="xyz-d65">xyz-d65</option>
					<option value="hsl">hsl</option>
					<option value="hwb">hwb</option>
					<option value="lch">lch</option>
					<option value="oklch">oklch</option>
				</select>
			</div>
			<div class="color-mix-settings__select">
				<label for="interpolation-method" hidden>Interpolation Method</label>
				<select id="interpolation-method" hidden>
					<option value="shorter" selected>shorter</option>
					<option value="longer">longer</option>
					<option value="increasing">increasing</option>
					<option value="decreasing">decreasing</option>
				</select>
			</div>
		</div>
		<div class="color-mix-settings__percent">
			<label for="color-mix-percentage">Mix %</label>
			<input type="range" id="color-mix-percentage" value="50" min="0" max="100" />
		</div>
		<div class="color-mix-settings__colors">
			<div class="color-mix-settings__color">
				<label for="color-a">Left Color</label>
				<input type="color" id="color-a" value="#ff0000">
			</div>
			<div class="color-mix-settings__color">
				<label for="color-b">Right Color</label>
				<input type="color" id="color-b" value="#0000ff">
			</div>
		</div>	
	</div>
</div>
<div class="color-mix-results">
	<output id="output-color-a" for="color-a"></output>
	<output id="output-color-b" for="color-b"></output>
	<output id="output-color-mix" for="color-b"></output>
</div>

<output id="output-color-mix-css" for="color-space interpolation-method color-mix-percentage color-a color-b">color-mix(in srgb, #ff0000, #0000ff 50%)</output>

Definitely check out the [awesome blog post by Una on color-mix](https://una.im/color-mix-opacity/). It showcases a similar widget but purely using native `color-mix()`, so it's a great way to compare the two.

------

After `color-mix()` we will focus on bringing relative color syntax to PostCSS Preset Env, but we are still waiting for a few specification issues to be resolved. [Subscribe to this issue to follow along](https://github.com/csstools/postcss-plugins/issues/177).

{% block scripts %}<script async defer src="{{ '/static/js/blog_color_mix_2023_03_27.js' | addHash }}"></script>{% endblock %}

<style>
	.color-mix-wrapper {
		display: flex;
		flex-wrap: wrap;
	}

	.color-mix-settings {
		display: flex;
		flex-direction: column;
		max-width: 525px;
		margin: 0 auto 40px;
		width: 100%;
	}

	.color-mix-settings__colors {
		display:flex;
	}

	.color-mix-settings__percent,
	.color-mix-settings__colors {
		margin-top: 32px;
	}

	.color-mix-settings__color {
		align-items: center;
		display:flex;
		flex: 1;
		flex-direction: column;
	}

	label {
		color: #666;
		font-size: 14px;
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}

	input, select {
		margin: 0.5rem 1rem;
	}

	#interpolation-method,
	#color-space {
		width: 150px;
	}

	.color-mix-results {
		display: flex;
		height: 150px;
		margin: 1rem auto;
		position: relative;
		width: 250px;
	}

	#output-color-a,
	#output-color-b,
	#output-color-mix {
		color: transparent; /* invisible text */
	}

	#output-color-a::after,
	#output-color-a::before,
	#output-color-b::after,
	#output-color-b::before,
	#output-color-mix::after,
	#output-color-mix::before {
		position: absolute;
		aspect-ratio: 1;
		border-radius: 50%;
		content: "";
		display: block;
		width: 150px;
		left: 0;
		top: 0;
	}

	#output-color-a::before,
	#output-color-b::before,
	#output-color-mix::before {
		background-color: white;
	}

	#output-color-a::before {
		z-index: 1;
	}

	#output-color-a::after {
		background-color: var(--color, red);
		border: 2px solid black;
		z-index: 2;
	}

	#output-color-b::before {
		left: 100px;
		z-index: 3;
	}

	#output-color-b::after {
		background-color: var(--color, blue);
		border: 2px solid black;
		left: 100px;
		z-index: 4;
	}

	#output-color-mix {
		transition: background-color 0.5s ease;
	}

	#output-color-mix::before {
		clip-path: circle(75px at 175px 75px);
		z-index: 5;
	}

	#output-color-mix::after {
		background-color: var(--color, rgb(128, 0, 128));
		transition: inherit;
		clip-path: circle(75px at 175px 75px);
		z-index: 6;
	}

	#output-color-mix-css {
		background-color: #263238;
		border-radius: 3px;
		border: 1px solid grey;
		color: white;
		display: block;
		font-size: 0.875em;
		font-family: monospace;
		line-height: 2;
		margin: 1rem auto;
		max-width: 100%;
		padding: 2px 8px;
		position: relative;
		text-align: left;
		width: fit-content;
	}

	input[type="color"] {
		-moz-appearance: none;
		-webkit-appearance: none;
		appearance: none;
		background-color: transparent;
		border: none;
		cursor: pointer;
		height: 50px;
		transition: opacity .3s;
		margin: 0;
		width: 50px;
	}
	
	input[type="color"]::-webkit-color-swatch {
		border-radius: 50%;
		border: 2px solid #000000;
	}
	
	input[type="color"]::-moz-color-swatch {
		border-radius: 50%;
		border: 2px solid #000000;
	}

	input[type="color"]:is(:hover,:focus) {
		opacity: 0.8;
	}

	.color-mix-settings__selects {
		display:flex;
	}

	.color-mix-settings__select {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 4px;
	}

	select {
		background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
		background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
		font-size: 1rem;
		color: #333;
		padding: 10px;
		border: 2px solid #ccc;
		border-radius: 5px;
		background-color: #fff;
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		margin: 0;
		transition: border .3s;
	}

	select:hover {
		border-color: #666;
	}

	input[type=range] {
		-webkit-appearance: none;
		width: 100%;
		height: 10px;
		border-radius: 5px;
		background-color: #ddd;
		margin-inline: 0;
		outline: none;
	}
	
	input[type=range]::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: var(--color-brand);
		cursor: pointer;
	}
</style>
