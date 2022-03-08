export function generateSelectorTestCases(selector) {
	let selectors = [];

	for (const other of [selector, 'button', '.🧑🏾‍🎤', '.foo', '#foo', '__foo', ':--foo', '[foo="baz"]', '*', ':hover', '::before']) {
		for (const combinator of ['', ' ' , '  ', '+', ' + ', '~', ' ~ ', '>', ' > ']) {
			selectors.push(`${other}${combinator}${selector}`);
			selectors.push(`${selector}${combinator}${other}`);
		}

		selectors.push(`${other}, ${selector}`);
		selectors.push(`${selector}, ${other}`);
	}

	selectors.push(`foo[${selector}]`);
	selectors.push(`foo[baz="${selector}"]`);

	selectors.push(`:not(${selector})`);

	selectors.push(`:${selector}`);
	selectors.push(`:--${selector}`);
	selectors.push(`__${selector}`);

	let result = selectors.map((x, index) => {
		return `${x} {
	order: ${index};
}`;
	}).join('\n\n') + '\n\n';

	result = result + `/* ${selector} */\n`;

	return result;
}
