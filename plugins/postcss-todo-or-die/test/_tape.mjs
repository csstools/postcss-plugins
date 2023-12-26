import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-todo-or-die';

process.env['BROWSERSLIST'] = '> 1%, chrome 79, safari 16';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'before-date-001': {
		message: 'throws',
		exception: /Died because 2000-1-2 is in the past/,
	},
	'browserslist-001': {
		message: 'throws',
		exception: /Died because the browsers matching "chrome <= 30" do not have any overlap with your project browserslist/,
	},
	'keyword-001': {
		message: 'throws',
		exception: /Died because A \(left\) is no longer equal to B \(center\)/,
	},
	'number-001': {
		message: 'throws',
		exception: /Died because A \(10\) is no longer greater than B \(16\)/,
	},
	'number-002': {
		message: 'throws',
		exception: /Died because A \(20\) is no longer less than B \(16\)/,
	},
	'number-003': {
		message: 'throws',
		exception: /Died because A \(-1\) is no longer equal to B \(1\)/,
	},
	'number-004': {
		message: 'throws',
		exception: /Died because A \(10px\) is no longer greater than B \(15px\)/,
	},
	'examples/example': {
		message: 'minimal example',
	},
});
