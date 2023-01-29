import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-nesting-experimental';

const mixinPluginRule = () => {
	return {
		postcssPlugin: 'mixin',
		AtRule: {
			mixin(node, { postcss }) {
				node.replaceWith(postcss.parse('& .in{ &.deep { color: blue; }}', {from : 'mixin.css'}));
			},
		},
	}
}

mixinPluginRule.postcss = true

const mixinPluginDeclaration = () => {
	return {
		postcssPlugin: 'mixin',
		AtRule: {
			mixin(node, { postcss }) {
				node.replaceWith(postcss.parse('color: blue;', {from : 'mixin.css'}));
			},
		},
	}
}

mixinPluginDeclaration.postcss = true

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'examples/example': {
		message: 'examples',
	},
	'examples/relative-selectors': {
		message: 'examples',
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
	'invalid-selector': {
		message: 'warns on invalid selectors',
		warnings: 2
	},
	'media': {
		message: 'supports nested @media',
	},
	'multiple-replacements': {
		message: 'supports multiple replacements',
	},
	'pseudo-element': {
		message: 'supports pseudo elements',
	},
	'supports': {
		message: 'supports nested @supports',
	},
	'layer': {
		message: 'supports nested @layer',
	},
	'empty': {
		message: 'removes empty rules',
	},
	'ignore': {
		message: 'ignores invalid entries',
		warnings: 3,
	},
	'mixin-declaration': {
		message: 'supports other visitors (mixin declaration)',
		plugins: [mixinPluginDeclaration(), plugin()]
	},
	'mixin-rule': {
		message: 'supports other visitors (mixin rule)',
		plugins: [mixinPluginRule(), plugin()]
	},
	'spec-examples': {
		message: 'supports all spec examples',
		warnings: 1,
	},
	'requires-is-pseudo': {
		message: 'examples of selector nesting that require :is to be correct',
	},
	'relative-selectors': {
		message: 'examples of relative selectors',
	},
	'ampersand-everywhere': {
		message: 'allow & to be used everywhere',
	}
});
