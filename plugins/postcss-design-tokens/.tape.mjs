import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-design-tokens';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
		options: {
			requireDesignTokens: {
				properties: [
					'color'
				]
			},
			designTokens: {
				selectors: [
					{
						name: 'button',
						value: ':is(.button, button[type="submit"])',
						required: false,
						deprecated: false,
					}
				],
				atSupports: [
					{
						name: 'cover',
						value: '(object-fit: cover)',
						required: false,
						deprecated: false,
					}
				],
				atMedia: [
					{
						name: 'medium',
						value: '(min-width: 768px)',
						required: false,
						deprecated: false
					}
				],
				values: [
					{
						name: 'my-color',
						value: '#f00',
						required: false,
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
	},
});
