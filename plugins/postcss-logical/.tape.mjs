import { postcssTape } from '@csstools/postcss-tape';
import plugin from 'postcss-logical';

postcssTape(plugin)({
	'abstract': {
		message: 'abstract test with default setting',
	},
	'abstract:rtl': {
		message: 'abstract test with rtl',
		options: {
			inlineDirection: 'right-to-left'
		},
	},
	'abstract:bt': {
		message: 'abstract test with bt',
		options: {
			blockDirection: 'bottom-to-top'
		},
	},
	'abstract:rtl-and-bt': {
		message: 'abstract test with rtl and bt',
		options: {
			blockDirection: 'bottom-to-top',
			inlineDirection: 'right-to-left'
		},
	},
	'abstract:chinese': {
		message: 'abstract test with rtl and bt',
		options: {
			blockDirection: 'right-to-left',
			inlineDirection: 'top-to-bottom'
		},
	},
	'caption-side': {
		message: 'supports logical "caption-side" properties',
	},
	'caption-side:chinese': {
		message: 'supports logical "caption-side" properties { blockDirection: "right-to-left", inlineDirection: "top-to-bottom" }',
		options: {
			blockDirection: 'right-to-left',
			inlineDirection: 'top-to-bottom'
		},
	},
	'text-align': {
		message: 'supports logical "text-align" property',
	},
	'text-align:chinese': {
		message: 'supports logical "text-align" property { blockDirection: "right-to-left", inlineDirection: "top-to-bottom" }',
		options: {
			blockDirection: 'right-to-left',
			inlineDirection: 'top-to-bottom'
		},
	},
	'text-align:hebrew': {
		message: 'supports logical "text-align" property { inlineDirection: "right-to-left" }',
		options: {
			inlineDirection: 'right-to-left',
		}
	},
	'logical-size': {
		message: 'supports logical "block-size" & "inline-size" properties',
	},
	'logical-size:chinese': {
		message: 'supports logical "block-size" & "inline-size" properties { blockDirection: "right-to-left", inlineDirection: "top-to-bottom" }',
		options: {
			blockDirection: 'right-to-left',
			inlineDirection: 'top-to-bottom'
		},
	},
	margin: {
		message: 'supports logical "margin" properties',
		warnings: 1,
	},
	'margin:chinese': {
		message: 'supports logical "margin" properties { blockDirection: "right-to-left", inlineDirection: "top-to-bottom" }',
		warnings: 1,
		options: {
			blockDirection: 'right-to-left',
			inlineDirection: 'top-to-bottom'
		},
	},
	offsets: {
		message: 'supports logical "offsets" properties',
		warnings: 3,
	},
	'offsets:chinese': {
		message: 'supports logical "offsets" properties { blockDirection: "right-to-left", inlineDirection: "top-to-bottom" }',
		warnings: 3,
		options: {
			blockDirection: 'right-to-left',
			inlineDirection: 'top-to-bottom'
		},
	},
	padding: {
		message: 'supports logical "padding" properties',
		warnings: 1,
	},
	'padding:chinese': {
		message: 'supports logical "padding" properties { blockDirection: "right-to-left", inlineDirection: "top-to-bottom" }',
		warnings: 1,
		options: {
			blockDirection: 'right-to-left',
			inlineDirection: 'top-to-bottom'
		},
	},
	border: {
		message: 'supports logical "border" properties',
		warnings: 6,
	},
	'border:chinese': {
		message: 'supports logical "border" properties { blockDirection: "right-to-left", inlineDirection: "top-to-bottom" }',
		warnings: 6,
		options: {
			blockDirection: 'right-to-left',
			inlineDirection: 'top-to-bottom'
		},
	},
	'transition': {
		message: 'supports logical "transition" property',
	},
	'transition:chinese': {
		message: 'supports logical "transition" property { blockDirection: "right-to-left", inlineDirection: "top-to-bottom" }',
		options: {
			blockDirection: 'right-to-left',
			inlineDirection: 'top-to-bottom'
		},
	},
	'transition:hebrew': {
		message: 'supports logical "transition" property { inlineDirection: "right-to-left" }',
		options: {
			inlineDirection: 'right-to-left',
		}
	},
	'generated-declaration-cases': {
		message: 'generated test cases',
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:chinese': {
		message: 'minimal example',
		options: {
			blockDirection: 'right-to-left',
			inlineDirection: 'top-to-bottom'
		}
	},
});
