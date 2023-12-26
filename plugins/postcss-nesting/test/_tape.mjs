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
	};
};

mixinPluginRule.postcss = true;

const mixinPluginDeclaration = () => {
	return {
		postcssPlugin: 'mixin',
		AtRule: {
			mixin(node, { postcss }) {
				node.replaceWith(postcss.parse('color: blue;', {from : 'mixin.css'}));
			},
		},
	};
};

mixinPluginDeclaration.postcss = true;

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:no-is-pseudo-selector': {
		message: 'supports basic usage { noIsPseudoSelector: true }',
		options: {
			noIsPseudoSelector: true,
		},
	},
	'ampersand-everywhere': {
		message: 'supports & at the root',
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
	'at-nest': {
		message: 'supports at-nest usage',
		warnings: 64,
	},
	'at-nest:silent': {
		message: 'supports at-nest usage { silenceAtNestWarning: true }',
		warnings: 4,
		options: {
			silenceAtNestWarning: true,
		},
	},
	'at-nest:no-is-pseudo-selector': {
		message: 'supports at-nest usage { noIsPseudoSelector: true }',
		warnings: 64,
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
	'decl-order': {
		message: 'resolves to the correct order',
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
	'invalid-selector': {
		message: 'warns on invalid selectors',
		warnings: 4,
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
	'multiple-replacements': {
		message: 'supports multiple replacements',
	},
	'pseudo-element': {
		message: 'supports pseudo elements',
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
	'layer': {
		message: 'supports nested @layer',
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
		plugins: [mixinPluginDeclaration(), plugin()],
	},
	'mixin-declaration:no-is-pseudo-selector': {
		message: 'supports other visitors (mixin declaration) { noIsPseudoSelector: true }',
		plugins: [mixinPluginDeclaration(), plugin()],
		options: {
			noIsPseudoSelector: true,
		},
	},
	'mixin-rule': {
		message: 'supports other visitors (mixin rule)',
		plugins: [mixinPluginRule(), plugin()],
	},
	'mixin-rule:no-is-pseudo-selector': {
		message: 'supports other visitors (mixin rule) { noIsPseudoSelector: true }',
		plugins: [mixinPluginRule(), plugin()],
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
	'relative-selectors': {
		message: 'supports relative selectors',
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
	'examples/example': {
		message: 'basic examples',
	},
});
