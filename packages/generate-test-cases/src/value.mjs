export function generateValueTestCases(value) {
	let values = [];

	values.push(`${value} !important`);
	values.push(`var(1, ${value})`);
	values.push(`var(${value}, 1)`);
	values.push(`var(${value}, ${value})`);
	values.push(`pre${value}`);
	values.push(`pre ${value}`);
	values.push(`pre,${value}`);
	values.push(`${value}post`);
	values.push(`${value} post`);
	values.push(`${value},post`);

	let result = values.map((x, index) => {
		return `.order-${index} {
	order: ${x};
}`;
	}).join('\n\n') + '\n\n';

	result = result + `/* ${value} */\n\n`;

	result = result + `:root {
	--some-var: ${value};
}\n\n`;

	result = result + `.content {
	content: '${value}';
}\n\n`;

	result = result + `@supports (order: ${value}) {
	.support {
		order: ${value};
	}
}\n`;

	return result;
}
