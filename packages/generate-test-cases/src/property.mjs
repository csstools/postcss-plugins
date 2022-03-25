import * as mdnData from 'mdn-data';
const mdnCSSData = mdnData.css;

export function generatePropertyTestCases(property) {
	let properties = [];

	properties.push(`-webkit-${property}`);
	properties.push(`-moz-${property}`);
	properties.push(`-ms-${property}`);
	properties.push(`-o-${property}`);
	properties.push(`--${property}`);
	properties.push(`foo-${property}`);

	let result = properties.map((x, index) => {
		return `.order-${index} {
	${x}: ${index};
}`;
	}).join('\n\n') + '\n\n';

	result = result + `/* ${property} */\n\n`;

	result = result + `.content {
	content: '${property}';
}\n\n`;

	if (mdnCSSData.properties[property] && !['discrete', 'notAnimatable'].includes(mdnCSSData.properties[property].animationType)) {
		result = result + `.transition {
	transition: 1s ${property} ease;
}\n\n`;
	}

	result = result + `@supports (${property}: red) {
	.support {
		${property}: red;
	}
}\n`;

	result = result + `@keyframes KEYFRAMES {
	50% {
		${property}: red;
	}
}\n`;

	return result;
}
