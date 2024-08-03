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
	'basic:edition-2024-02': {
		message: 'supports basic usage',
	},
	'ampersand-everywhere:edition-2024-02': {
		message: 'supports & at the root',
	},
	'complex:edition-2024-02': {
		message: 'supports complex entries',
	},
	'direct:edition-2024-02': {
		message: 'supports direct usage',
	},
	'container:edition-2024-02': {
		message: 'supports nested @container',
	},
	'decl-order:edition-2024-02': {
		message: 'resolves to the correct order',
	},
	'invalid-selector:edition-2024-02': {
		message: 'warns on invalid selectors',
		warnings: 4,
	},
	'media:edition-2024-02': {
		message: 'supports nested @media',
	},
	'multiple-replacements:edition-2024-02': {
		message: 'supports multiple replacements',
	},
	'pseudo-element:edition-2024-02': {
		message: 'supports pseudo elements',
	},
	'supports:edition-2024-02': {
		message: 'supports nested @supports',
	},
	'layer:edition-2024-02': {
		message: 'supports nested @layer',
	},
	'empty:edition-2024-02': {
		message: 'removes empty rules',
	},
	'ignore:edition-2024-02': {
		message: 'ignores invalid entries',
	},
	'mixin-declaration:edition-2024-02': {
		message: 'supports other visitors (mixin declaration)',
		plugins: [mixinPluginDeclaration(), plugin({ edition: '2024-02' })],
	},
	'mixin-rule:edition-2024-02': {
		message: 'supports other visitors (mixin rule)',
		plugins: [mixinPluginRule(), plugin({ edition: '2024-02' })],
	},
	'mixin-nested-rules:edition-2024-02': {
		message: 'supports mixin with nested rules',
		plugins: [mixinPluginNestedRules(), plugin({ edition: '2024-02' })],
	},
	'spec-examples:edition-2024-02': {
		message: 'supports all spec examples',
	},
	'relative-selectors:edition-2024-02': {
		message: 'supports relative selectors',
	},
	'requires-is-pseudo:edition-2024-02': {
		message: 'examples of selector nesting that require :is to be correct',
	},
	'examples/example:edition-2024-02': {
		message: 'basic examples',
	},
});
