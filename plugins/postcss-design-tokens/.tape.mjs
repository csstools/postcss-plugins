import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-design-tokens';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
		options: {
			requiresDesignTokens: {
				properties: [
					'color'
				]
			},
			designTokens: {
				selectors: [
					{
						name: 'button',
						value: ':is(.button, button[type="submit"])',
						deprecated: false,
					}
				],
				atSupports: [
					{
						name: 'cover',
						value: '(object-fit: cover)',
						deprecated: false,
					}
				],
				atMedia: [
					{
						name: 'medium',
						value: '(min-width: 768px)',
						deprecated: false
					}
				],
				values: [
					{
						name: 'color',
						value: '#f00',
						deprecated: false,
						allowedProperties: [],
						blockedProperties: [],
					},
					{
						name: 'red-components',
						value: '255, 0, 0',
						deprecated: false,
						allowedProperties: [],
						blockedProperties: [],
					}
				]
			}
		}
	},
	'examples/example': {
		message: 'minimal example',
		options: {
			requiresDesignTokens: {
				properties: [
					'color'
				]
			},
			designTokens: {
				selectors: [
					{
						name: 'button',
						value: ':is(.button, button[type="submit"])',
						deprecated: false,
					}
				],
				atSupports: [
					{
						name: 'cover',
						value: '(object-fit: cover)',
						deprecated: false,
					}
				],
				atMedia: [
					{
						name: 'medium',
						value: '(min-width: 768px)',
						deprecated: false
					}
				],
				values: [
					{
						name: 'color',
						value: '#f00',
						deprecated: false,
						allowedProperties: [],
						blockedProperties: [],
					},
					{
						name: 'red-components',
						value: '255, 0, 0',
						deprecated: false,
						allowedProperties: [],
						blockedProperties: [],
					}
				]
			}
		}
	},
});
