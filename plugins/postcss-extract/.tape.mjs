import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-extract';
import assert from 'assert';

postcssTape(plugin)({
	'variables': {
		message: "Can extract custom props from root",
		options: {
			queries: {
				'custom-props-in-root': 'rule[selector*=":ROOT" i] decl[variable]',
				'not-variable': 'decl:not([variable])'
			},
			results: function(results) {
				assert.deepStrictEqual(
					results['custom-props-in-root'],
					[
						{ type: 'decl', prop: '--foo', value: '1', variable: true },
						{
							type: 'decl',
							prop: '--bar',
							value: 'calc(1px * 100)',
							variable: true
						},
						{ type: 'decl', prop: '--baz', value: '"a value"', variable: true }
					]
				)

				assert.deepStrictEqual(
					results['not-variable'],
					[
						{
							type: 'decl',
							prop: 'not-a-variable',
							value: '1',
							variable: false
						}
					]
				)
			}
		}
	},
	'variables:adjacent-sibling': {
		message: "Respects adjacent siblings",
		options: {
			queries: {
				'adjacent-sibling': 'comment[text="extract only this one"] + decl[variable]'
			},
			results: function (results) {
				assert.deepStrictEqual(
					results,
					{
						'adjacent-sibling': [{ type: 'decl', prop: '--foo', value: '1', variable: true }]
					}
				)
			}
		}
	},
	'variables:adjacent-sibling-with-not': {
		message: "Respects adjacent siblings and supports :not",
		options: {
			queries: {
				'adjacent-sibling': 'rule[selector*=":root"] :not([selector*=":root"] comment[text="extract only this one"]) + decl[variable]'
			},
			results: function (results) {
				assert.deepStrictEqual(
					results,
					{
						'adjacent-sibling': [
							{
								type: 'decl',
								prop: '--bar',
								value: 'calc(1px * 100)',
								variable: true
							}
						]
					}
				)
			}
		}
	},
	'media': {
		message: "At rules : media",
		options: {
			queries: {
				'media': 'atrule[name=media]'
			},
			results: function (results) {
				assert.deepStrictEqual(
					results,
					{
						media: [
							{
								type: 'atrule',
								name: 'media',
								params: '(prefers-color-scheme: dark)'
							}
						]
					}
				)
			}
		}
	},
	'media:custom-media': {
		message: "At rules : custom-media",
		options: {
			queries: {
				'media': 'atrule[name=custom-media]'
			},
			results: function (results) {
				assert.deepStrictEqual(
					results,
					{
						media: [
							{
								type: 'atrule',
								name: 'custom-media',
								params: 'screen and (min-width: 300px)'
							}
						]
					}
				)
			}
		}
	},
	'mixed': {
		message: "Mixed results",
		options: {
			queries: {
				'mixed-results': '[name=supports], [value=red]'
			},
			results: function (results) {
				assert.deepStrictEqual(
					results,
					{
						'mixed-results': [
							{ type: 'atrule', name: 'supports', params: '(display: grid)' },
							{ type: 'decl', prop: '--color', value: 'red', variable: true }
						]
					},
				)
			}
		}
	},
	'mixed:alpha': {
		message: "Mixed results : *",
		options: {
			queries: {
				'mixed-results': '*'
			},
			results: function (results) {
				assert.deepStrictEqual(
					results,
					{
						'mixed-results': [
							{
								type: 'rule',
								selectors: ['.a-selector', 'another-selector']
							},
							{ type: 'decl', prop: 'order', value: '1', variable: false },
							{ type: 'decl', prop: '--color', value: 'red', variable: true },
							{ type: 'atrule', name: 'media', params: 'screen' },
							{ type: 'rule', selectors: ['[more=selectors]'] },
							{ type: 'atrule', name: 'supports', params: '(display: grid)' },
							{ type: 'rule', selectors: ['&'] },
							{
								type: 'decl',
								prop: 'color',
								value: 'var(--color)',
								variable: false
							}
						]
					},
				)
			}
		}
	},
	'mixed:beta': {
		message: "Mixed results : * ~ * > *",
		options: {
			queries: {
				'mixed-results': '* ~ * > *'
			},
			results: function (results) {
				assert.deepStrictEqual(
					results,
					{
						'mixed-results': [{ type: 'rule', selectors: ['[more=selectors]'] }]
					},
				)
			}
		}
	},
});
