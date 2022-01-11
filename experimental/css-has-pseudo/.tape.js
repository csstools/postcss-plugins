const postcssLogical = require('postcss-logical');
const postcssDirPseudoClass = require('postcss-dir-pseudo-class');
const postcssNesting = require('postcss-nesting');

const hasWithLogicalBefore = (preserve) => {
	const plugin = () => {
		return {
			postcssPlugin: 'css-has-pseudo (with postcss-logical before)',
			plugins: [postcssLogical({preserve: preserve}), postcssDirPseudoClass({preserve: preserve}), require('./dist/index.cjs')({preserve: preserve})],
		};
	}

	plugin.postcss = true;

	return plugin;
};

const hasWithLogicalAfter = (preserve) => {
	const plugin = () => {
		return {
			postcssPlugin: 'css-has-pseudo (with postcss-logical after)',
			plugins: [require('./dist/index.cjs')({ preserve: preserve }), postcssLogical({ preserve: preserve }), postcssDirPseudoClass({ preserve: preserve })],
		};
	};

	plugin.postcss = true;

	return plugin;
};

const hasWithNestingBefore = (preserve) => {
	const plugin = () => {
		return {
			postcssPlugin: 'css-has-pseudo (with postcss-nesting before)',
			plugins: [postcssNesting({preserve: preserve}), require('./dist/index.cjs')({preserve: preserve})],
		};
	}

	plugin.postcss = true;

	return plugin;
};

const hasWithNestingAfter = (preserve) => {
	const plugin = () => {
		return {
			postcssPlugin: 'css-has-pseudo (with postcss-nesting after)',
			plugins: [require('./dist/index.cjs')({ preserve: preserve }), postcssNesting({ preserve: preserve })],
		};
	};

	plugin.postcss = true;

	return plugin;
};

module.exports = {
	'basic': {
		message: 'supports basic usage'
	},
	'basic:preserve': {
		message: 'supports { preserve: false } usage',
		options: {
			preserve: false
		}
	},
	'basic:specificity-matching-name': {
		message: 'supports { specificityMatchingName: "other-thing-that-does-not-exist" } usage',
		options: {
			specificityMatchingName: 'other-thing-that-does-not-exist'
		}
	},
	'generated-selector-cases': {
		message: 'correctly handles generated cases',
		warnings: 1,
		options: {
			preserve: false
		}
	},
	'browser': {
		message: 'prepare CSS for chrome test',
		options: {
			preserve: false
		}
	},
	'plugin-order-logical:before': {
		message: 'works with other plugins that modify selectors',
		plugin: hasWithLogicalBefore(false),
	},
	'plugin-order-logical:after': {
		message: 'works with other plugins that modify selectors',
		plugin: hasWithLogicalAfter(false),
	},
	'plugin-order-logical:before:preserve': {
		message: 'works with other plugins that modify selectors',
		plugin: hasWithLogicalBefore(true),
	},
	'plugin-order-logical:after:preserve': {
		message: 'works with other plugins that modify selectors',
		plugin: hasWithLogicalAfter(true),
	},
	'plugin-order-nesting:before': {
		message: 'works with other plugins that modify selectors',
		plugin: hasWithNestingBefore(false),
	},
	'plugin-order-nesting:after': {
		message: 'works with other plugins that modify selectors',
		plugin: hasWithNestingAfter(false),
	},
	'plugin-order-nesting:before:preserve': {
		message: 'works with other plugins that modify selectors',
		plugin: hasWithNestingBefore(true),
	},
	'plugin-order-nesting:after:preserve': {
		message: 'works with other plugins that modify selectors',
		plugin: hasWithNestingAfter(true),
	}
}
