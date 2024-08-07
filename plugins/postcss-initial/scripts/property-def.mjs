import fs from 'node:fs/promises';
import path from 'node:path';

const properties = [
	{
		'prop': 'animation',
		'initial': '${animation-name} ${animation-duration} ${animation-timing-function} ${animation-delay} ${animation-iteration-count} ${animation-direction} ${animation-fill-mode} ${animation-play-state}',
		'combined': true,
	},
	{ 'prop': 'animation-delay', 'initial': '0s' },
	{ 'prop': 'animation-direction', 'initial': 'normal' },
	{ 'prop': 'animation-duration', 'initial': '0s' },
	{ 'prop': 'animation-fill-mode', 'initial': 'none' },
	{ 'prop': 'animation-iteration-count', 'initial': '1' },
	{ 'prop': 'animation-name', 'initial': 'none' },
	{ 'prop': 'animation-play-state', 'initial': 'running' },
	{ 'prop': 'animation-timing-function', 'initial': 'ease' },
	{
		'prop': 'backface-visibility', 'initial': 'visible',
		'basic': true,
	},
	{
		'prop': 'background',
		'initial': '${background-color} ${background-image} ${background-repeat} ${background-position} / ${background-size} ${background-origin} ${background-clip} ${background-attachment}',
		'combined': true,
	},
	{ 'prop': 'background-attachment', 'initial': 'scroll' },
	{ 'prop': 'background-clip', 'initial': 'border-box' },
	{ 'prop': 'background-color', 'initial': 'transparent' },
	{ 'prop': 'background-image', 'initial': 'none' },
	{ 'prop': 'background-origin', 'initial': 'padding-box' },
	{ 'prop': 'background-position', 'initial': '0 0' },
	{ 'prop': 'background-position-x', 'initial': '0' },
	{ 'prop': 'background-position-y', 'initial': '0' },
	{ 'prop': 'background-repeat', 'initial': 'repeat' },
	{ 'prop': 'background-size', 'initial': 'auto auto' },
	{
		'prop': 'border',
		'initial': '${border-width} ${border-style} ${border-color}',
		'combined': true,
	},
	{ 'prop': 'border-style', 'initial': 'none' },
	{ 'prop': 'border-width', 'initial': 'medium' },
	{ 'prop': 'border-color', 'initial': 'currentcolor' },
	{ 'prop': 'border-bottom', 'initial': '0' },
	{ 'prop': 'border-bottom-color', 'initial': 'currentcolor' },
	{ 'prop': 'border-bottom-left-radius', 'initial': '0' },
	{ 'prop': 'border-bottom-right-radius', 'initial': '0' },
	{ 'prop': 'border-bottom-style', 'initial': 'none' },
	{ 'prop': 'border-bottom-width', 'initial': 'medium' },
	{
		'prop': 'border-collapse', 'initial': 'separate',
		'basic': true,
		'inherited': true,
	},
	{
		'prop': 'border-image', 'initial': 'none',
		'basic': true,
	},
	{ 'prop': 'border-left', 'initial': '0' },
	{ 'prop': 'border-left-color', 'initial': 'currentcolor' },
	{ 'prop': 'border-left-style', 'initial': 'none' },
	{ 'prop': 'border-left-width', 'initial': 'medium' },
	{
		'prop': 'border-radius', 'initial': '0',
		'basic': true,
	},
	{ 'prop': 'border-right', 'initial': '0' },
	{ 'prop': 'border-right-color', 'initial': 'currentcolor' },
	{ 'prop': 'border-right-style', 'initial': 'none' },
	{ 'prop': 'border-right-width', 'initial': 'medium' },
	{
		'prop': 'border-spacing', 'initial': '0',
		'basic': true,
		'inherited': true,
	},
	{ 'prop': 'border-top', 'initial': '0' },
	{ 'prop': 'border-top-color', 'initial': 'currentcolor' },
	{ 'prop': 'border-top-left-radius', 'initial': '0' },
	{ 'prop': 'border-top-right-radius', 'initial': '0' },
	{ 'prop': 'border-top-style', 'initial': 'none' },
	{ 'prop': 'border-top-width', 'initial': 'medium' },
	{
		'prop': 'bottom', 'initial': 'auto',
		'basic': true,
	},
	{
		'prop': 'box-shadow', 'initial': 'none',
		'basic': true,
	},
	{
		'prop': 'box-sizing', 'initial': 'content-box',
		'basic': true,
	},
	{
		'prop': 'caption-side', 'initial': 'top',
		'basic': true,
		'inherited': true,
	},
	{
		'prop': 'clear', 'initial': 'none',
		'basic': true,
	},
	{
		'prop': 'clip', 'initial': 'auto',
		'basic': true,
	},
	{
		'prop': 'color', 'initial': '#000',
		'basic': true,
	},
	{
		'prop': 'columns', 'initial': 'auto',
		'basic': true,
	},
	{
		'prop': 'column-count', 'initial': 'auto',
		'basic': true,
	},
	{
		'prop': 'column-fill', 'initial': 'balance',
		'basic': true,
	},
	{
		'prop': 'column-gap', 'initial': 'normal',
		'basic': true,
	},
	{
		'prop': 'column-rule',
		'initial': '${column-rule-width} ${column-rule-style} ${column-rule-color}',
		'combined': true,
	},
	{ 'prop': 'column-rule-color', 'initial': 'currentcolor' },
	{ 'prop': 'column-rule-style', 'initial': 'none' },
	{ 'prop': 'column-rule-width', 'initial': 'medium' },
	{
		'prop': 'column-span', 'initial': '1',
		'basic': true,
	},
	{
		'prop': 'column-width', 'initial': 'auto',
		'basic': true,
	},
	{
		'prop': 'content', 'initial': 'normal',
		'basic': true,
	},
	{
		'prop': 'counter-increment', 'initial': 'none',
		'basic': true,
	},
	{
		'prop': 'counter-reset', 'initial': 'none',
		'basic': true,
	},
	{
		'prop': 'cursor', 'initial': 'auto',
		'basic': true,
		'inherited': true,
	},
	{
		'prop': 'direction', 'initial': 'ltr',
		'inherited': true,
	},
	{
		'prop': 'display', 'initial': 'inline',
		'basic': true,
	},
	{
		'prop': 'empty-cells', 'initial': 'show',
		'basic': true,
		'inherited': true,
	},
	{
		'prop': 'float', 'initial': 'none',
		'basic': true,
	},
	{
		'prop': 'font',
		'contains': [
			'font-style',
			'font-variant',
			'font-weight',
			'font-stretch',
			'font-size',
			'line-height',
			'font-family',
		],
		'basic': true,
		'inherited': true,
	},
	{ 'prop': 'font-family', 'initial': 'serif' },
	{ 'prop': 'font-size', 'initial': 'medium' },
	{ 'prop': 'font-style', 'initial': 'normal' },
	{ 'prop': 'font-variant', 'initial': 'normal' },
	{ 'prop': 'font-weight', 'initial': 'normal' },
	{ 'prop': 'font-stretch', 'initial': 'normal' },
	{
		'prop': 'line-height', 'initial': 'normal',
		'inherited': true,
	},
	{
		'prop': 'height', 'initial': 'auto',
		'basic': true,
	},
	{
		'prop': 'hyphens', 'initial': 'none',
		'basic': true,
		'inherited': true,
	},
	{
		'prop': 'left', 'initial': 'auto',
		'basic': true,
	},
	{
		'prop': 'letter-spacing', 'initial': 'normal',
		'basic': true,
		'inherited': true,
	},
	{
		'prop': 'list-style',
		'initial': '${list-style-type} ${list-style-position} ${list-style-image}',
		'combined': true,
		'inherited': true,
	},
	{ 'prop': 'list-style-image', 'initial': 'none' },
	{ 'prop': 'list-style-position', 'initial': 'outside' },
	{ 'prop': 'list-style-type', 'initial': 'disc' },
	{
		'prop': 'margin', 'initial': '0',
		'basic': true,
	},
	{ 'prop': 'margin-bottom', 'initial': '0' },
	{ 'prop': 'margin-left', 'initial': '0' },
	{ 'prop': 'margin-right', 'initial': '0' },
	{ 'prop': 'margin-top', 'initial': '0' },
	{
		'prop': 'max-height', 'initial': 'none',
		'basic': true,
	},
	{
		'prop': 'max-width', 'initial': 'none',
		'basic': true,
	},
	{
		'prop': 'min-height', 'initial': '0',
		'basic': true,
	},
	{
		'prop': 'min-width', 'initial': '0',
		'basic': true,
	},
	{
		'prop': 'opacity', 'initial': '1',
		'basic': true,
	},
	{
		'prop': 'orphans', 'initial': '2',
		'basic': true,
	},
	{
		'prop': 'outline',
		'initial': '${outline-width} ${outline-style} ${outline-color}',
		'combined': true,
	},
	{ 'prop': 'outline-color', 'initial': 'currentcolor' },
	{ 'prop': 'outline-style', 'initial': 'none' },
	{ 'prop': 'outline-width', 'initial': 'medium' },
	{
		'prop': 'overflow', 'initial': 'visible',
		'basic': true,
	},
	{
		'prop': 'overflow-x', 'initial': 'visible',
		'basic': true,
	},
	{
		'prop': 'overflow-y', 'initial': 'visible',
		'basic': true,
	},
	{
		'prop': 'padding', 'initial': '0',
		'basic': true,
	},
	{ 'prop': 'padding-bottom', 'initial': '0' },
	{ 'prop': 'padding-left', 'initial': '0' },
	{ 'prop': 'padding-right', 'initial': '0' },
	{ 'prop': 'padding-top', 'initial': '0' },
	{
		'prop': 'page-break-after', 'initial': 'auto',
		'basic': true,
	},
	{
		'prop': 'page-break-before', 'initial': 'auto',
		'basic': true,
	},
	{
		'prop': 'page-break-inside', 'initial': 'auto',
		'basic': true,
	},
	{
		'prop': 'perspective', 'initial': 'none',
		'basic': true,
	},
	{
		'prop': 'perspective-origin', 'initial': '50% 50%',
		'basic': true,
	},
	{
		'prop': 'position', 'initial': 'static',
		'basic': true,
	},
	{
		'prop': 'quotes',
		'initial': '"\u201C" "\u201D" "\u2018" "\u2019"',
	},
	{
		'prop': 'right', 'initial': 'auto',
		'basic': true,
	},
	{
		'prop': 'tab-size', 'initial': '8',
		'basic': true,
		'inherited': true,
	},
	{
		'prop': 'table-layout', 'initial': 'auto',
		'basic': true,
	},
	{
		'prop': 'text-align', 'initial': 'left',
		'basic': true,
		'inherited': true,
	},
	{
		'prop': 'text-align-last', 'initial': 'auto',
		'basic': true,
		'inherited': true,
	},
	{
		'prop': 'text-decoration',
		'initial': '${text-decoration-line}',
		'combined': true,
	},
	{ 'prop': 'text-decoration-color', 'initial': 'currentcolor' },
	{ 'prop': 'text-decoration-line', 'initial': 'none' },
	{ 'prop': 'text-decoration-style', 'initial': 'solid' },
	{
		'prop': 'text-indent', 'initial': '0',
		'basic': true,
		'inherited': true,
	},
	{
		'prop': 'text-shadow', 'initial': 'none',
		'basic': true,
		'inherited': true,
	},
	{
		'prop': 'text-transform', 'initial': 'none',
		'basic': true,
		'inherited': true,
	},
	{
		'prop': 'top', 'initial': 'auto',
		'basic': true,
	},
	{
		'prop': 'transform', 'initial': 'none',
		'basic': true,
	},
	{
		'prop': 'transform-origin', 'initial': '50% 50% 0',
		'basic': true,
	},
	{
		'prop': 'transform-style', 'initial': 'flat',
		'basic': true,
	},
	{
		'prop': 'transition',
		'initial': '${transition-property} ${transition-duration} ${transition-timing-function} ${transition-delay}',
		'combined': true,
	},
	{ 'prop': 'transition-delay', 'initial': '0s' },
	{ 'prop': 'transition-duration', 'initial': '0s' },
	{ 'prop': 'transition-property', 'initial': 'none' },
	{ 'prop': 'transition-timing-function', 'initial': 'ease' },
	{
		'prop': 'unicode-bidi', 'initial': 'normal',
	},
	{
		'prop': 'vertical-align', 'initial': 'baseline',
		'basic': true,
	},
	{
		'prop': 'visibility', 'initial': 'visible',
		'basic': true,
		'inherited': true,
	},
	{
		'prop': 'white-space', 'initial': 'normal',
		'basic': true,
		'inherited': true,
	},
	{
		'prop': 'widows', 'initial': '2',
		'basic': true,
		'inherited': true,
	},
	{
		'prop': 'width', 'initial': 'auto',
		'basic': true,
	},
	{
		'prop': 'word-spacing', 'initial': 'normal',
		'basic': true,
		'inherited': true,
	},
	{
		'prop': 'z-index', 'initial': 'auto',
		'basic': true,
	},
];

function buildFinal(property, string) {
	return string.replace(/\$\{([\w-]*)\}/g, function (_str, key) {
		var v = properties.find((x) => x.prop === key);
		if (!v) {
			throw new Error(`Property "${property}" references "${key}" which does not exist.`);
		}

		if (!v.initial) {
			throw new Error(`Property "${property}" references "${key}" which does not have an initial value.`);
		}

		return v.initial;
	});
}

const mapConstructorArgument = [];
const allProperties = [];

properties.forEach((property) => {
	if (property.combined || property.basic) {
		allProperties.push(property.prop);
	}

	if (property.initial && property.initial.includes('${')) {
		property.initial = buildFinal(property.prop, property.initial);
	}

	if (!property.initial) {
		return;
	}

	mapConstructorArgument.push([
		property.prop,
		property.initial,
	]);
});

allProperties.splice(
	allProperties.indexOf('float') + 1,
	0,
	'font-family',
	'font-size',
	'font-style',
	'font-variant',
	'font-weight',
	'font-stretch',
	'line-height',
);

await fs.writeFile(
	path.join('src', 'properties.ts'),
	`export const properties = new Map(${JSON.stringify(mapConstructorArgument, null, '\t')})\n\n` +
	`export const allProperties = ${JSON.stringify(allProperties, null, '\t')}\n`,
);
