---
title: CSS Color Parser
description: A new package to parse CSS color notations.
date: 2023-03-27
---


<label id="color-input-label-1" for="color-input-1">Try it out:</label>
<textarea	id="color-input-1" class="color-input" rows="2">
oklch(calc(50% * 1.4) 0.268 134.568)
</textarea>
<output id="color-output-rgb-1" class="color-output-rgb" for="color-input-1" style="--color: rgb(88, 186, 0);">rgb(88, 186, 0)</output>
<output id="color-output-p3-1" class="color-output-p3" for="color-input-1" style="--color: color(display-p3 0.41387 0.73323 0);">color(display-p3 0.41387 0.73323 0)</output>

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

{% block scripts %}<script async defer src="{{ '/static/js/blog_color_2023_03_27.js' | addHash }}"></script>{% endblock %}

<style>
	.color-input, .color-output-rgb, .color-output-p3 {
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
	.color-output-p3::after {
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
