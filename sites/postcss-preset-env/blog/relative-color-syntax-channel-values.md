---
title: 'Relative Color Syntax : Channel Values'
description: Inspect the channel values for the origin color.
date: 2024-03-04
---

With relative color syntax it can become confusing what the exact values are at each step and how they can be used in math expressions.
This little tool aims to show the channel values at each step of the process.

<hr>

<label id="color-input-label-1" for="color-input-1" style="--color: oklch(0.31398 0.268 29.2339);">Channel values for:</label>
<textarea	id="color-input-1" class="color-input" rows="1">oklch(from red calc(l / 2) 0.268 h)</textarea>

<div class="channel-group">
	<div class="channel-group__label"></div>
	<output class="color-output-channel-name" channel="1 name" for="color-input-1">l</output>
	<output class="color-output-channel-name" channel="2 name" for="color-input-1">c</output>
	<output class="color-output-channel-name" channel="3 name" for="color-input-1">h</output>
	<output class="color-output-channel-name" channel="4 name" for="color-input-1">alpha</output>
</div>

<div class="channel-group">
	<p class="channel-group__label"><i>Origin color</i></p>
	<output class="color-output-channel" channel="1 input" for="color-input-1">0.628</output>
	<output class="color-output-channel" channel="2 input" for="color-input-1">0.258</output>
	<output class="color-output-channel" channel="3 input" for="color-input-1">29.234</output>
	<output class="color-output-channel" channel="4 input" for="color-input-1">1.000</output>
</div>

<div class="channel-group">
	<p class="channel-group__label"><i>Expressions</i></p>
	<output class="color-output-channel" channel="1 calc" for="color-input-1">calc(l / 2)</output>
	<output class="color-output-channel" channel="2 calc" for="color-input-1">0.268</output>
	<output class="color-output-channel" channel="3 calc" for="color-input-1">h</output>
	<output class="color-output-channel" channel="4 calc" for="color-input-1">1.000</output>
</div>

<div class="channel-group">
	<p class="channel-group__label"><i>Output color</i></p>
	<output class="color-output-channel" channel="1 output" for="color-input-1">0.314</output>
	<output class="color-output-channel" channel="2 output" for="color-input-1">0.268</output>
	<output class="color-output-channel" channel="3 output" for="color-input-1">29.234</output>
	<output class="color-output-channel" channel="4 output" for="color-input-1">1.000</output>
</div>

{% block scripts %}<script async defer src="{{ '/static/js/blog_relative_color_syntax_channel_values_2024_03_02.js' | addHash }}"></script>{% endblock %}

<style>
	.color-input, .color-output-channel {
		background-color: #263238;
		border-radius: 3px;
		border: 1px solid grey;
		color: white;
		display: block;
		font-size: 0.875em;
		line-height: 2;
		padding: 2px 8px;
		position: relative;
		text-align: right;
	}

	.color-input {
		margin: 1rem 0 2rem auto;
		width: calc(80% - 2px);
	}

	.channel-group {
		align-items: start;
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		margin: 0 0 1rem;
		max-width: 100%;
	}

	.color-output-channel, .channel-group__label {
		flex-basis: 200px;
		flex-grow: 1;
		font-family: monospace;
		font-size: 0.875rem;
		max-width: 20%;
		text-align: right;
	}

	.channel-group__label {
		text-align: left;
		margin-top: 0.25rem;
	}

	.color-output-channel-name {
		border-bottom: 1px solid currentColor;
		flex-basis: 200px;
		flex-grow: 1;
		font-family: monospace;
		font-size: 1rem;
		max-width: 20%;
		text-align: center;
	}

	#color-input-label-1 {
		position: relative;
		margin-left: calc(20% + 2px);
	}

	#color-input-label-1::after {
		background-color: var(--color);
		border-radius: 50%;
		content: "";
		display: inline-block;
		height: calc(0.875em * 2);
		position: absolute;
		right: calc(-1 * ((0.875em * 2) + 1rem));
		top: -5px;
		width: calc(0.875em * 2);
	}
</style>
