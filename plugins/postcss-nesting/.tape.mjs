import { postcssTape } from '@csstools/postcss-tape';
import plugin from 'postcss-nesting';

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
	'ampersand-everywhere': {
		message: 'supports & at the root',
	},
	'complex': {
		message: 'supports complex entries',
	},
	'direct': {
		message: 'supports direct usage',
	},
	'at-nest': {
		message: 'supports at-nest usage',
		exception: /was removed/
	},
	'container': {
		message: 'supports nested @container',
	},
	'decl-order': {
		message: 'resolves to the correct order',
	},
	'document': {
		message: 'supports nested @document',
	},
	'invalid-selector': {
		message: 'warns on invalid selectors',
		warnings: 4
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
	},
	'relative-selectors': {
		message: 'supports relative selectors',
	},
	'requires-is-pseudo': {
		message: 'examples of selector nesting that require :is to be correct',
	},
	'examples/example': {
		message: 'basic examples'
	},
});
