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
		options: {
			edition: '2024-02',
		},
	},
	'ampersand-everywhere:edition-2024-02': {
		message: 'supports & at the root',
		options: {
			edition: '2024-02',
		},
	},
	'complex:edition-2024-02': {
		message: 'supports complex entries',
		options: {
			edition: '2024-02',
		},
	},
	'direct:edition-2024-02': {
		message: 'supports direct usage',
		options: {
			edition: '2024-02',
		},
	},
	'container:edition-2024-02': {
		message: 'supports nested @container',
		options: {
			edition: '2024-02',
		},
	},
	'decl-order:edition-2024-02': {
		message: 'resolves to the correct order',
		options: {
			edition: '2024-02',
		},
	},
	'invalid-selector:edition-2024-02': {
		message: 'warns on invalid selectors',
		options: {
			edition: '2024-02',
		},
		warnings: 4,
	},
	'media:edition-2024-02': {
		message: 'supports nested @media',
		options: {
			edition: '2024-02',
		},
	},
	'multiple-replacements:edition-2024-02': {
		message: 'supports multiple replacements',
		options: {
			edition: '2024-02',
		},
	},
	'pseudo-element:edition-2024-02': {
		message: 'supports pseudo elements',
		options: {
			edition: '2024-02',
		},
	},
	'supports:edition-2024-02': {
		message: 'supports nested @supports',
		options: {
			edition: '2024-02',
		},
	},
	'layer:edition-2024-02': {
		message: 'supports nested @layer',
		options: {
			edition: '2024-02',
		},
	},
	'empty:edition-2024-02': {
		message: 'removes empty rules',
		options: {
			edition: '2024-02',
		},
	},
	'ignore:edition-2024-02': {
		message: 'ignores invalid entries',
		options: {
			edition: '2024-02',
		},
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
		options: {
			edition: '2024-02',
		},
	},
	'relative-selectors:edition-2024-02': {
		message: 'supports relative selectors',
		options: {
			edition: '2024-02',
		},
	},
	'requires-is-pseudo:edition-2024-02': {
		message: 'examples of selector nesting that require :is to be correct',
		options: {
			edition: '2024-02',
		},
	},
	'examples/example:edition-2024-02': {
		message: 'basic examples',
		options: {
			edition: '2024-02',
		},
	},
});
