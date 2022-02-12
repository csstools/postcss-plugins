import valueParser from 'postcss-value-parser';
import { promises as fsp } from 'fs';

function matcherForValue(value) {

	try {
		const ast = valueParser(value);
		ast.walk((node) => {
			delete node.sourceIndex;
			delete node.before;
			delete node.after;
			delete node.sourceEndIndex;

			if (node.value.startsWith('$')) {
				delete node.value;
				node.isVariable = true;
			} else {
				try {
					node.dimension = valueParser.unit(node.value);
				} finally {
					if (node.dimension === false) {
						delete node.dimension;
					}
				}
			}
		});

		if (ast.nodes.length === 1) {
			return ast.nodes[0];
		} else {
			return ast.nodes;
		}
	} catch (_) {
		/* ignore */
	}
}

const colorMatchers = [
	{
		'supports': 'color(display-p3 0 0 0)',
		'property': 'color',
		'sniff': 'color',
		'matchers': [
			matcherForValue('color(srgb $1 $2 $3)'),
			matcherForValue('color(srgb $1 $2 $3 / $4)'),
			matcherForValue('color(display-p3 $1 $2 $3)'),
			matcherForValue('color(display-p3 $1 $2 $3 / $4)'),
		],
	},
	{
		'supports': 'color(xyz 0 0 0)',
		'property': 'color',
		'sniff': 'color',
		'matchers': [
			matcherForValue('color($1 $2 $3 $4)'),
			matcherForValue('color($1 $2 $3 $4 / $5)'),
		],
	},
];

const hslMatchers = [
	{
		'supports': 'hsl(0, 0%, 0%)',
		'property': 'color',
		'sniff': 'hsl',
		'matchers': [
			matcherForValue('hsl($1, $2, $3, $4)'),
		],
	},
	{
		'supports': 'hsl(0 0% 0% / 0)',
		'property': 'color',
		'sniff': 'hsl',
		'matchers': [
			matcherForValue('hsl($1 $2 $3)'),
			matcherForValue('hsl($1 $2 $3 / $4)'),
		],
	},
	{
		'supports': 'hsla(0 0% 0% / 0)',
		'property': 'color',
		'sniff': 'hsla',
		'matchers': [
			matcherForValue('hsla($1 $2 $3 / $4)'),
		],
	},
];

const hwbMatchers = [
	{
		'supports': 'hwb(0 0% 0%)',
		'property': 'color',
		'sniff': 'hwb',
		'matchers': [
			matcherForValue('hwb($1 $2 $3)'),
			matcherForValue('hwb($1 $2 $3 / $4)'),
		],
	},
];

const labMatchers = [
	{
		'supports': 'lab(0% 0 0)',
		'property': 'color',
		'sniff': 'lab',
		'matchers': [
			matcherForValue('lab($1 $2 $3)'),
			matcherForValue('lab($1 $2 $3 / $4)'),
		],
	},
];

const lchMatchers = [
	{
		'supports': 'lch(0% 0 0)',
		'property': 'color',
		'sniff': 'lch',
		'matchers': [
			matcherForValue('lch($1 $2 $3)'),
			matcherForValue('lch($1 $2 $3 / $4)'),
		],
	},
];

const oklabMatchers = [
	{
		'supports': 'oklab(0% 0 0)',
		'property': 'color',
		'sniff': 'oklab',
		'matchers': [
			matcherForValue('oklab($1 $2 $3)'),
			matcherForValue('oklab($1 $2 $3 / $4)'),
		],
	},
];

const oklchMatchers = [
	{
		'supports': 'oklch(0% 0 0)',
		'property': 'color',
		'sniff': 'oklch',
		'matchers': [
			matcherForValue('oklch($1 $2 $3)'),
			matcherForValue('oklch($1 $2 $3 / $4)'),
		],
	},
];

const rgbMatchers = [
	{
		'supports': 'rgb(0, 0, 0)',
		'property': 'color',
		'sniff': 'rgb',
		'matchers': [
			matcherForValue('rgb($1, $2, $3, $4)'),
		],
	},
	{
		'supports': 'rgb(0 0 0 / 0)',
		'property': 'color',
		'sniff': 'rgb',
		'matchers': [
			matcherForValue('rgb($1 $2 $3)'),
			matcherForValue('rgb($1 $2 $3 / $4)'),
		],
	},
	{
		'supports': 'rgba(0 0 0 / 0)',
		'property': 'color',
		'sniff': 'rgba',
		'matchers': [
			matcherForValue('rgba($1 $2 $3 / $4)'),
		],
	},
];

fsp.writeFile(
	'./src/matchers.ts',
	'export const matchers = ' + JSON.stringify(
		[
			...colorMatchers,
			...hslMatchers,
			...hwbMatchers,
			...labMatchers,
			...lchMatchers,
			...oklabMatchers,
			...oklchMatchers,
			...rgbMatchers,
		],
		null,
		'\t',
	),
);
