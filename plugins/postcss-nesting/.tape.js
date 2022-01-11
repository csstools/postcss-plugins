const mixinPluginRule = () => {
	return {
		postcssPlugin: 'mixin',
		AtRule: {
			mixin(node) {
				node.replaceWith('& .in{ &.deep { color: blue; }}')
			},
		},
	}
}

mixinPluginRule.postcss = true

const mixinPluginRuleWithNesting = () => {
	return {
		postcssPlugin: 'mixin-with-nesting',
		plugins: [mixinPluginRule(), require('./dist/index.cjs')()]
	}
}

mixinPluginRuleWithNesting.postcss = true

const mixinPluginDeclaration = () => {
	return {
		postcssPlugin: 'mixin',
		AtRule: {
			mixin(node) {
				node.replaceWith('color: blue;')
			},
		},
	}
}

mixinPluginDeclaration.postcss = true

const mixinPluginDeclarationWithNesting = () => {
	return {
		postcssPlugin: 'mixin-with-nesting',
		Once: () => {
			throw new Error('bork');
		},
		plugins: [mixinPluginDeclaration(), require('./dist/index.cjs')()]
	}
}

mixinPluginDeclarationWithNesting.postcss = true

module.exports = {
	'basic': {
		message: 'supports basic usage',
	},
	'basic:no-is-pseudo-selector': {
		message: 'supports basic usage { noIsPseudoSelector: true }',
		options: {
			noIsPseudoSelector: true,
		},
	},
	'complex': {
		message: 'supports complex entries',
	},
	'complex:no-is-pseudo-selector': {
		message: 'supports complex entries { noIsPseudoSelector: true }',
		options: {
			noIsPseudoSelector: true,
		},
	},
	'direct': {
		message: 'supports direct usage',
	},
	'direct:no-is-pseudo-selector': {
		message: 'supports direct usage { noIsPseudoSelector: true }',
		options: {
			noIsPseudoSelector: true,
		},
	},
	'at-rule': {
		message: 'supports at-rule usage',
	},
	'at-rule:no-is-pseudo-selector': {
		message: 'supports at-rule usage { noIsPseudoSelector: true }',
		options: {
			noIsPseudoSelector: true,
		},
	},
	'container': {
		message: 'supports nested @container',
	},
	'container:no-is-pseudo-selector': {
		message: 'supports nested @container { noIsPseudoSelector: true }',
		options: {
			noIsPseudoSelector: true,
		},
	},
	'document': {
		message: 'supports nested @document',
	},
	'document:no-is-pseudo-selector': {
		message: 'supports nested @document { noIsPseudoSelector: true }',
		options: {
			noIsPseudoSelector: true,
		},
	},
	'media': {
		message: 'supports nested @media',
	},
	'media:no-is-pseudo-selector': {
		message: 'supports nested @media { noIsPseudoSelector: true }',
		options: {
			noIsPseudoSelector: true,
		},
	},
	'supports': {
		message: 'supports nested @supports',
	},
	'supports:no-is-pseudo-selector': {
		message: 'supports nested @supports { noIsPseudoSelector: true }',
		options: {
			noIsPseudoSelector: true,
		},
	},
	'empty': {
		message: 'removes empty rules',
	},
	'empty:no-is-pseudo-selector': {
		message: 'removes empty rules { noIsPseudoSelector: true }',
		options: {
			noIsPseudoSelector: true,
		},
	},
	'ignore': {
		message: 'ignores invalid entries',
	},
	'ignore:no-is-pseudo-selector': {
		message: 'ignores invalid entries { noIsPseudoSelector: true }',
		options: {
			noIsPseudoSelector: true,
		},
	},
	'mixin-declaration': {
		message: 'supports other visitors (mixin declaration)',
		plugin: mixinPluginDeclarationWithNesting
	},
	'mixin-declaration:no-is-pseudo-selector': {
		message: 'supports other visitors (mixin declaration) { noIsPseudoSelector: true }',
		plugin: mixinPluginDeclarationWithNesting,
		options: {
			noIsPseudoSelector: true,
		},
	},
	'mixin-rule': {
		message: 'supports other visitors (mixin rule)',
		plugin: mixinPluginRuleWithNesting
	},
	'mixin-rule:no-is-pseudo-selector': {
		message: 'supports other visitors (mixin rule) { noIsPseudoSelector: true }',
		plugin: mixinPluginRuleWithNesting,
		options: {
			noIsPseudoSelector: true,
		},
	},
	'spec-examples': {
		message: 'supports all spec examples',
	},
	'spec-examples:no-is-pseudo-selector': {
		message: 'supports all spec examples { noIsPseudoSelector: true }',
		options: {
			noIsPseudoSelector: true,
		},
	},
	'requires-is-pseudo': {
		message: 'examples of selector nesting that require :is to be correct',
	},
	'requires-is-pseudo:no-is-pseudo-selector': {
		message: 'examples of selector nesting that require :is to be correct { noIsPseudoSelector: true }',
		options: {
			noIsPseudoSelector: true,
		},
	},
};
