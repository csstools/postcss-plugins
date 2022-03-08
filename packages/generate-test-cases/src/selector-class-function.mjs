export function generateSelectorClassFunctionTestCases(selector) {
	let selectors = [];
	const selectorWithContents = `${selector}(.some, .other)`;

	for (const other of [selectorWithContents, 'button', '.🧑🏾‍🎤', '.foo', '#foo', '__foo', ':--foo', '[foo="baz"]', '*', ':hover', '::before']) {
		for (const combinator of ['', ' ' , '  ', '+', ' + ', '~', ' ~ ', '>', ' > ']) {
			selectors.push(`${other}${combinator}${selectorWithContents}`);
			selectors.push(`${selectorWithContents}${combinator}${other}`);
			selectors.push(`${selector}(${other}${combinator}${other})`);
		}

		selectors.push(`${other}, ${selectorWithContents}`);
		selectors.push(`${selectorWithContents}, ${other}`);
		selectors.push(`${selector}(${other})`);
	}

	selectors.push(`${selector}()`);

	selectors.push(`foo[${selectorWithContents}]`);
	selectors.push(`foo[baz="${selectorWithContents}"]`);

	selectors.push(`:not(${selectorWithContents})`);

	selectors.push(`:${selectorWithContents}`);
	selectors.push(`:--${selectorWithContents}`);
	selectors.push(`__${selectorWithContents}`);

	let result = selectors.map((x, index) => {
		return `${x} {
	order: ${index};
}`;
	}).join('\n\n') + '\n\n';

	result = result + `/* ${selector} */\n`;

	return result;
}
