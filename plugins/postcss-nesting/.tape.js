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
	'complex': {
		message: 'supports complex entries',
	},
	'direct': {
		message: 'supports direct usage',
	},
	'at-rule': {
		message: 'supports at-rule usage',
	},
	'container': {
		message: 'supports nested @container',
	},
	'document': {
		message: 'supports nested @document',
	},
	'media': {
		message: 'supports nested @media',
	},
	'supports': {
		message: 'supports nested @supports',
	},
	'empty': {
		message: 'removes empty rules',
	},
	'ignore': {
		message: 'ignores invalid entries',
	},
	'mixin-declaration': {
		message: 'supports other visitors (mixin declaration)',
		plugin: mixinPluginDeclarationWithNesting
	},
	'mixin-rule': {
		message: 'supports other visitors (mixin rule)',
		plugin: mixinPluginRuleWithNesting
	},
	'spec-examples': {
		message: 'supports all spec examples',
	},
};
