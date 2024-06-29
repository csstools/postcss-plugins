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

const mixinPluginNestedRules = () => {
	return {
		postcssPlugin: 'mixin',
		AtRule: {
			mixin(node, { postcss }) {
				if (node.params === 'alpha') {
					node.replaceWith(postcss.parse('@mixin alpha-1; @mixin alpha-2; & { color: white; }', {from : 'mixin.css'}));
				} else if (node.params === 'alpha-1') {
					node.replaceWith(postcss.parse('color: blue;', {from : 'mixin.css'}));
				} else if (node.params === 'alpha-2') {
					node.replaceWith(postcss.parse('display: flex;', {from : 'mixin.css'}));
				}
			},
		},
	};
};

mixinPluginNestedRules.postcss = true;

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
		options: {
			edition: '2021',
		},
	},
	'basic:no-is-pseudo-selector': {
		message: 'supports basic usage { noIsPseudoSelector: true }',
		options: {
			edition: '2021',
			noIsPseudoSelector: true,
		},
	},
	'ampersand-everywhere': {
		message: 'supports & at the root',
		options: {
			edition: '2021',
		},
	},
	'complex': {
		message: 'supports complex entries',
		options: {
			edition: '2021',
		},
	},
	'complex:no-is-pseudo-selector': {
		message: 'supports complex entries { noIsPseudoSelector: true }',
		options: {
			edition: '2021',
			noIsPseudoSelector: true,
		},
	},
	'direct': {
		message: 'supports direct usage',
		options: {
			edition: '2021',
		},
	},
	'direct:no-is-pseudo-selector': {
		message: 'supports direct usage { noIsPseudoSelector: true }',
		options: {
			edition: '2021',
			noIsPseudoSelector: true,
		},
	},
	'at-nest': {
		message: 'supports at-nest usage',
		warnings: 64,
		options: {
			edition: '2021',
		},
	},
	'at-nest:silent': {
		message: 'supports at-nest usage { silenceAtNestWarning: true }',
		warnings: 4,
		options: {
			edition: '2021',
			silenceAtNestWarning: true,
		},
	},
	'at-nest:no-is-pseudo-selector': {
		message: 'supports at-nest usage { noIsPseudoSelector: true }',
		warnings: 64,
		options: {
			edition: '2021',
			noIsPseudoSelector: true,
		},
	},
	'container': {
		message: 'supports nested @container',
		options: {
			edition: '2021',
		},
	},
	'container:no-is-pseudo-selector': {
		message: 'supports nested @container { noIsPseudoSelector: true }',
		options: {
			edition: '2021',
			noIsPseudoSelector: true,
		},
	},
	'decl-order': {
		message: 'resolves to the correct order',
		options: {
			edition: '2021',
		},
	},
	'document': {
		message: 'supports nested @document',
		options: {
			edition: '2021',
		},
	},
	'document:no-is-pseudo-selector': {
		message: 'supports nested @document { noIsPseudoSelector: true }',
		options: {
			edition: '2021',
			noIsPseudoSelector: true,
		},
	},
	'invalid-selector': {
		message: 'warns on invalid selectors',
		warnings: 4,
		options: {
			edition: '2021',
		},
	},
	'media': {
		message: 'supports nested @media',
		options: {
			edition: '2021',
		},
	},
	'media:no-is-pseudo-selector': {
		message: 'supports nested @media { noIsPseudoSelector: true }',
		options: {
			edition: '2021',
			noIsPseudoSelector: true,
		},
	},
	'multiple-replacements': {
		message: 'supports multiple replacements',
		options: {
			edition: '2021',
		},
	},
	'pseudo-element': {
		message: 'supports pseudo elements',
		options: {
			edition: '2021',
		},
	},
	'supports': {
		message: 'supports nested @supports',
		options: {
			edition: '2021',
		},
	},
	'supports:no-is-pseudo-selector': {
		message: 'supports nested @supports { noIsPseudoSelector: true }',
		options: {
			edition: '2021',
			noIsPseudoSelector: true,
		},
	},
	'layer': {
		message: 'supports nested @layer',
		options: {
			edition: '2021',
		},
	},
	'empty': {
		message: 'removes empty rules',
		options: {
			edition: '2021',
		},
	},
	'empty:no-is-pseudo-selector': {
		message: 'removes empty rules { noIsPseudoSelector: true }',
		options: {
			edition: '2021',
			noIsPseudoSelector: true,
		},
	},
	'ignore': {
		message: 'ignores invalid entries',
		options: {
			edition: '2021',
		},
	},
	'ignore:no-is-pseudo-selector': {
		message: 'ignores invalid entries { noIsPseudoSelector: true }',
		options: {
			edition: '2021',
			noIsPseudoSelector: true,
		},
	},
	'mixin-declaration': {
		message: 'supports other visitors (mixin declaration)',
		plugins: [mixinPluginDeclaration(), plugin({ edition: '2021' })],
	},
	'mixin-declaration:no-is-pseudo-selector': {
		message: 'supports other visitors (mixin declaration) { noIsPseudoSelector: true }',
		plugins: [mixinPluginDeclaration(), plugin({ noIsPseudoSelector: true, edition: '2021' })],
	},
	'mixin-rule': {
		message: 'supports other visitors (mixin rule)',
		plugins: [mixinPluginRule(), plugin({ edition: '2021' })],
	},
	'mixin-rule:no-is-pseudo-selector': {
		message: 'supports other visitors (mixin rule) { noIsPseudoSelector: true }',
		plugins: [mixinPluginRule(), plugin({ noIsPseudoSelector: true, edition: '2021' })],
	},
	'mixin-nested-rules': {
		message: 'supports mixin with nested rules',
		plugins: [mixinPluginNestedRules(), plugin({ edition: '2021' })],
	},
	'spec-examples': {
		message: 'supports all spec examples',
		options: {
			edition: '2021',
		},
	},
	'spec-examples:no-is-pseudo-selector': {
		message: 'supports all spec examples { noIsPseudoSelector: true }',
		options: {
			edition: '2021',
			noIsPseudoSelector: true,
		},
	},
	'relative-selectors': {
		message: 'supports relative selectors',
		options: {
			edition: '2021',
		},
	},
	'requires-is-pseudo': {
		message: 'examples of selector nesting that require :is to be correct',
		options: {
			edition: '2021',
		},
	},
	'requires-is-pseudo:no-is-pseudo-selector': {
		message: 'examples of selector nesting that require :is to be correct { noIsPseudoSelector: true }',
		options: {
			edition: '2021',
			noIsPseudoSelector: true,
		},
	},
	'examples/example': {
		message: 'basic examples',
		options: {
			edition: '2021',
		},
	},
});
