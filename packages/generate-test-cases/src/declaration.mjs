import * as mdnData from 'mdn-data';
const mdnCSSData = mdnData.default.css;

export function generateDeclarationTestCases(property, value) {
	let properties = [];

	properties.push(`-webkit-${property}`);
	properties.push(`-moz-${property}`);
	properties.push(`-ms-${property}`);
	properties.push(`-o-${property}`);
	properties.push(`--${property}`);
	properties.push(`foo-${property}`);

	let result = properties.map((x, index) => {
		return `.order-${index} {
	${x}: ${value};
}`;
	}).join('\n\n') + '\n\n';

	result = result + `/* ${property}: ${value}; */\n\n`;

	result = result + `.content {
	content: '${property}: ${value};';
}\n\n`;

	if (mdnCSSData.properties[property] && !['discrete', 'notAnimatable'].includes(mdnCSSData.properties[property].animationType)) {
		result = result + `.transition {
	transition: 1s ${property} ease;
}\n\n`;
	}

	result = result + `.important {
	${property}: ${value} !important;
}\n\n`;

	result = result + `@supports (${property}: ${value}) {
	.support {
		${property}: ${value};
	}
}\n`;

	result = result + `@keyframes KEYFRAMES {
	50% {
		${property}: ${value};
	}
}\n`;

	return result;
}
