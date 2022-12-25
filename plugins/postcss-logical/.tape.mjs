import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-logical';

postcssTape(plugin)({
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
