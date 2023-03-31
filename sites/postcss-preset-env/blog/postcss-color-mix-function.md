---
title: PostCSS Color Mix Function
description: Use the color-mix function in CSS.
date: 2023-03-27
---

<div class="color-mix-wrapper">
	<div class="color-mix-settings">
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
		<select id="interpolation-method" hidden>
			<option value="shorter" selected>shorter</option>
			<option value="longer">longer</option>
			<option value="increasing">increasing</option>
			<option value="decreasing">decreasing</option>
		</select>
		<input type="range" id="color-mix-percentage" value="50" min="0" max="100">
		<input type="color" id="color-a" value="#ff0000">
		<input type="color" id="color-b" value="#0000ff">
	</div>
</div>
<div class="color-mix-results">
	<output id="output-color-a" for="color-a"></output>
	<output id="output-color-b" for="color-b"></output>
	<output id="output-color-mix" for="color-b"></output>
</div>

<output id="output-color-mix-css" for="color-space interpolation-method color-mix-percentage color-a color-b">color-mix(in srgb, #ff0000, #0000ff 50%)</output>

{% block scripts %}<script async defer src="{{ '/static/js/blog_color_mix_2023_03_27.js' | addHash }}"></script>{% endblock %}

<style>
	.color-mix-wrapper {
		display: flex;
		flex-wrap: wrap;
	}

	.color-mix-settings {
		display: flex;
		flex-direction: column;
	}

	input, select {
		margin: 0.5rem 1rem;
	}

	#interpolation-method,
	#color-space {
		width: 120px;
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
		z-index: 2;
	}

	#output-color-b::before {
		left: 100px;
		z-index: 3;
	}

	#output-color-b::after {
		background-color: var(--color, blue);
		left: 100px;
		z-index: 4;
	}

	#output-color-mix::before {
		clip-path: circle(75px at 175px 75px);
		z-index: 5;
	}

	#output-color-mix::after {
		background-color: var(--color, rgb(128, 0, 128));
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
		line-height: 2;
		margin: 1rem auto;
		max-width: calc(100% - 3rem);
		padding: 2px 8px;
		position: relative;
		text-align: left;
		width: 400px;
	}
</style>
