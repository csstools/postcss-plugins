import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-logical';

postcssTape(plugin)({
	'caption-side': {
		message: 'supports logical "caption-side" properties',
	},
	'caption-side:chinese': {
		message: 'supports logical "caption-side" properties { blockDirection: "right-to-left", inlineDirection: "top-to-bottom" }',
		options: {
			blockDirection: 'right-to-left',
			inlineDirection: 'top-to-bottom'
		}
	},
	'float-and-clear': {
		message: 'supports logical "float" & "clear" properties',
	},
	'float-and-clear:chinese ': {
		message: 'supports logical "float" & "clear" properties { blockDirection: "right-to-left", inlineDirection: "top-to-bottom" }',
		options: {
			blockDirection: 'right-to-left',
			inlineDirection: 'top-to-bottom'
		}
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
		}
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
		}
	}
});
