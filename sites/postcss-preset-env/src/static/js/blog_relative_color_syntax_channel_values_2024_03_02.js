import { color, serializeOKLCH } from '@csstools/css-color-parser';
import { isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode, parseComponentValue } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';

function renderResult() {
	document.querySelectorAll('.color-input').forEach((inputEl) => {
		const [
			outputChannel1Name,
			outputChannel1Input,
			outputChannel1Calc,
			outputChannel1Output,
			outputChannel2Name,
			outputChannel2Input,
			outputChannel2Calc,
			outputChannel2Output,
			outputChannel3Name,
			outputChannel3Input,
			outputChannel3Calc,
			outputChannel3Output,
			outputChannel4Name,
			outputChannel4Input,
			outputChannel4Calc,
			outputChannel4Output,
		] = [
			document.querySelector('[channel~="1"][channel~="name"]'),
			document.querySelector('[channel~="1"][channel~="input"]'),
			document.querySelector('[channel~="1"][channel~="calc"]'),
			document.querySelector('[channel~="1"][channel~="output"]'),
			document.querySelector('[channel~="2"][channel~="name"]'),
			document.querySelector('[channel~="2"][channel~="input"]'),
			document.querySelector('[channel~="2"][channel~="calc"]'),
			document.querySelector('[channel~="2"][channel~="output"]'),
			document.querySelector('[channel~="3"][channel~="name"]'),
			document.querySelector('[channel~="3"][channel~="input"]'),
			document.querySelector('[channel~="3"][channel~="calc"]'),
			document.querySelector('[channel~="3"][channel~="output"]'),
			document.querySelector('[channel~="4"][channel~="name"]'),
			document.querySelector('[channel~="4"][channel~="input"]'),
			document.querySelector('[channel~="4"][channel~="calc"]'),
			document.querySelector('[channel~="4"][channel~="output"]'),
		];

		if (
			!outputChannel1Name ||
			!outputChannel1Input ||
			!outputChannel1Calc ||
			!outputChannel1Output ||
			!outputChannel2Name ||
			!outputChannel2Input ||
			!outputChannel2Calc ||
			!outputChannel2Output ||
			!outputChannel3Name ||
			!outputChannel3Input ||
			!outputChannel3Calc ||
			!outputChannel3Output ||
			!outputChannel4Name ||
			!outputChannel4Input ||
			!outputChannel4Calc ||
			!outputChannel4Output
		) {
			return;
		}

		const value = inputEl.value;
		if (!value) {
			return;
		}

		const componentValue = parseComponentValue(tokenize({ css: value.trim() }));
		if (!componentValue || !isFunctionNode(componentValue)) {
			inputEl.style.outline = '2px solid rgb(255 0 0 / 70%)';
			return;
		}

		const originColor = (() => {
			let didSeeFrom = false;

			for (let i = 0; i < componentValue.value.length; i++) {
				const node = componentValue.value[i];
				if (isCommentNode(node) || isWhitespaceNode(node)) {
					continue;
				}

				if (isTokenNode(node) && node.toString().toLowerCase() === 'from') {
					didSeeFrom = true;
					continue;
				}

				if (!didSeeFrom) {
					return;
				}

				return node;
			}
		})();

		if (!originColor) {
			inputEl.style.outline = '2px solid rgb(255 0 0 / 70%)';
			return;
		}

		let { channel1, channel2, channel3, alpha, colorSpace } = (() => {
			let didSeeFrom = false;
			let didSeeOrigin = false;

			let nodes = [];
			let expectColorSpace = componentValue.getName().toLowerCase() === 'color';
			let colorSpace = null;

			for (let i = 0; i < componentValue.value.length; i++) {
				const node = componentValue.value[i];
				if (isCommentNode(node) || isWhitespaceNode(node)) {
					continue;
				}

				if (isTokenNode(node) && node.toString().toLowerCase() === 'from') {
					didSeeFrom = true;
					continue;
				}

				if (!didSeeFrom) {
					return {};
				}

				if (!didSeeOrigin) {
					didSeeOrigin = true;
					continue;
				}

				nodes.push(node);
			}

			if (expectColorSpace) {
				colorSpace = nodes.splice(0, 1);
			}

			if (nodes.length > 3) {
				const slash = nodes[3];
				if (!isTokenNode(slash) || slash.toString() !== '/') {
					return {};
				}

				nodes.splice(3, 1);
			}

			if (nodes.length < 3 || nodes.length > 4) {
				return {};
			}

			return {
				channel1: nodes[0],
				channel2: nodes[1],
				channel3: nodes[2],
				alpha: nodes[3],
				colorSpace,
			};
		})();

		if (!channel1 || !channel2 || !channel3) {
			inputEl.style.outline = '2px solid rgb(255 0 0 / 70%)';
			return;
		}

		const functionNodeName = componentValue.getName().toLowerCase();
		let passThroughColor = originColor;
		let channelNames = ['l', 'c', 'h'];
		switch (functionNodeName) {
			case 'rgb':
				passThroughColor = parseComponentValue(tokenize({ css: `rgb(from ${originColor.toString()} r g b / alpha)` }));
				channelNames = ['r', 'g', 'b'];
				break;
			case 'hsl':
				passThroughColor = parseComponentValue(tokenize({ css: `hsl(from ${originColor.toString()} h s l / alpha)` }));
				channelNames = ['h', 's', 'l'];
				break;
			case 'hwb':
				passThroughColor = parseComponentValue(tokenize({ css: `hwb(from ${originColor.toString()} h w b / alpha)` }));
				channelNames = ['h', 'w', 'b'];
				break;
			case 'lab':
				passThroughColor = parseComponentValue(tokenize({ css: `lab(from ${originColor.toString()} l a b / alpha)` }));
				channelNames = ['l', 'a', 'b'];
				break;
			case 'oklab':
				passThroughColor = parseComponentValue(tokenize({ css: `oklab(from ${originColor.toString()} l a b / alpha)` }));
				channelNames = ['l', 'a', 'b'];
				break;
			case 'lch':
				passThroughColor = parseComponentValue(tokenize({ css: `lch(from ${originColor.toString()} l c h / alpha)` }));
				channelNames = ['l', 'c', 'h'];
				break;
			case 'oklch':
				passThroughColor = parseComponentValue(tokenize({ css: `oklch(from ${originColor.toString()} l c h / alpha)` }));
				channelNames = ['l', 'c', 'h'];
				break;
			case 'color':
				if (colorSpace?.toString().includes('xyz')) {
					passThroughColor = parseComponentValue(tokenize({ css: `color(from ${originColor.toString()} ${colorSpace.toString()} x y z / alpha)` }));
					channelNames = ['x', 'y', 'z'];
				} else if (colorSpace) {
					passThroughColor = parseComponentValue(tokenize({ css: `color(from ${originColor.toString()} ${colorSpace.toString()} r g b / alpha)` }));
					channelNames = ['r', 'g', 'b'];
				}
				break;

			default:
				break;
		}

		const passThroughColorValue = color(passThroughColor);
		if (!passThroughColorValue) {
			inputEl.style.outline = '2px solid rgb(255 0 0 / 70%)';
			return;
		}

		const outputColorValue = color(componentValue);
		if (!outputColorValue) {
			inputEl.style.outline = '2px solid rgb(255 0 0 / 70%)';
			return;
		}

		inputEl.style.outline = 'none';

		outputChannel1Name.value = channelNames[0];
		outputChannel2Name.value = channelNames[1];
		outputChannel3Name.value = channelNames[2];
		outputChannel4Name.value = 'alpha';

		if (passThroughColorValue.colorNotation === 'rgb' || passThroughColorValue.colorNotation === 'hex') {
			passThroughColorValue.channels = passThroughColorValue.channels.map((channel) => channel * 255);
		}

		outputChannel1Input.value = round(passThroughColorValue.channels[0]);
		outputChannel2Input.value = round(passThroughColorValue.channels[1]);
		outputChannel3Input.value = round(passThroughColorValue.channels[2]);
		outputChannel4Input.value = round(passThroughColorValue.alpha);

		outputChannel1Calc.value = channel1.toString();
		outputChannel2Calc.value = channel2.toString();
		outputChannel3Calc.value = channel3.toString();
		outputChannel4Calc.value = alpha ? alpha.toString() : round(passThroughColorValue.alpha);

		document.getElementById('color-input-label-1').style.setProperty('--color', serializeOKLCH(outputColorValue));

		if (outputColorValue.colorNotation === 'rgb' || outputColorValue.colorNotation === 'hex') {
			outputColorValue.channels = outputColorValue.channels.map((channel) => channel * 255);
		}

		outputChannel1Output.value = round(outputColorValue.channels[0]);
		outputChannel2Output.value = round(outputColorValue.channels[1]);
		outputChannel3Output.value = round(outputColorValue.channels[2]);
		outputChannel4Output.value = round(outputColorValue.alpha);
	});
}

function round(x) {
	return Math.round(x * 1000) / 1000;
}

addEventListener('change', renderResult);
addEventListener('keyup', renderResult);
