import type { Node } from 'postcss-value-parser';
import valueParser from 'postcss-value-parser';

export type ColorStop = {
	color: string;
	colorStopLength: string;
	colorHintBetween: Array<ColorStop>;
	nodes: Array<Node>;
}

export function colorStopList(nodes: Array<Node>, interpolationArguments: string) : Array<ColorStop> | false {
	const stops: Array<ColorStop> = [];
	let currentStop: ColorStop = {
		color: '',
		colorStopLength: '',
		colorHintBetween: [],
		nodes: [],
	};

	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (node.type === 'div' && node.value === ',') {
			stops.push(currentStop);
			currentStop = {
				color: '',
				colorStopLength: '',
				colorHintBetween: [],
				nodes: [],
			};

			continue;
		}

		currentStop.nodes.push(node);
	}

	stops.push(currentStop);

	// Assign values and handle double position gradients.
	const formattedStops : Array<ColorStop> = [];
	for (let i = 0; i < stops.length; i++) {
		const stop = stops[i];

		switch (stop.nodes.length) {
			case 0:
				break;
			case 1:
				return false;
			case 2:
				stop.color = valueParser.stringify(stop.nodes[0]);
				stop.colorStopLength = valueParser.stringify(stop.nodes[1]);
				formattedStops.push(stop);
				break;
			case 3:
				formattedStops.push({
					color: valueParser.stringify(stop.nodes[0]),
					colorStopLength: valueParser.stringify(stop.nodes[1]),
					colorHintBetween: [],
					nodes: [
						stop.nodes[0],
						stop.nodes[1],
					],
				});

				formattedStops.push({
					color: valueParser.stringify(stop.nodes[0]),
					colorStopLength: valueParser.stringify(stop.nodes[2]),
					colorHintBetween: [],
					nodes: [
						stop.nodes[0],
						stop.nodes[2],
					],
				});

				break;

			default:
				break;
		}
	}

	for (let i = 0; i < formattedStops.length; i++) {
		const stop = formattedStops[i];
		if (!stop.color) {
			stop.color = `color-mix(in ${interpolationArguments}, ${formattedStops[i - 1].color} 50%, ${formattedStops[i + 1].color} 50%)`;
			stop.colorHintBetween = [
				formattedStops[i - 1],
				formattedStops[i + 1],
			];
		}
	}

	return formattedStops;
}
