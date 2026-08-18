---
title: Computed Color
---

This uses [`@csstools/css-color-parser`](https://www.npmjs.com/package/@csstools/css-color-parser).

<label id="color-input-label-1" for="color-input-1">Get the computed color:</label>
<textarea	id="color-input-1" class="color-input" rows="2">
oklch(calc(50% * 1.4) 0.268 134.568)
</textarea>

<label for="color-output-computed">@csstools/css-color-parser</label>
<output id="color-output-computed" class="color-output-computed" for="color-input-1" style="--color: oklch(0.7 0.268 134.568);">oklch(0.7 0.268 134.568)</output>

<label for="color-output-computed-native">native</label>
<output id="color-output-computed-native" class="color-output-computed" for="color-input-1" style="--color: oklch(0.7 0.268 134.568);">oklch(0.7 0.268 134.568)</output>

{% block scripts %}<script async defer src="{{ '/static/js/color_computed.js' | addHash }}"></script>{% endblock %}

<style>
	.color-input, .color-output-computed {
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

	.color-output-computed::after {
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
