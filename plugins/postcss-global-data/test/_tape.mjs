import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-global-data';
import postcssCustomMedia from 'postcss-custom-media';
import postcssCustomProperties from 'postcss-custom-properties';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
		plugins: [
			plugin({
				files: [
					'./test/fixtures/fixture.css',
				],
			}),
			postcssCustomMedia(),
		],
	},
	'late-remover': {
		message: 'supports late removal',
		plugins: (() => {
			const [early, late] = plugin({
				files: [
					'./test/fixtures/fixture.css',
				],
				lateRemover: true,
			}).plugins;

			const somethingOnOnceExit = () => {
				return {
					postcssPlugin: 'something-on-once-exit',
					OnceExit: (root) => {
						root.walkRules((rule) => {
							rule.cloneBefore({ selector: '.bar' });
						});
					},
				};
			};

			somethingOnOnceExit.postcss = true;

			return [
				early,
				somethingOnOnceExit,
				late,
			];
		})(),
	},
	'basic:append': {
		message: 'append',
		plugins: (() => {
			const lastColor = () => {
				return {
					postcssPlugin: 'last-color',
					Declaration: (decl) => {
						if (decl.prop !== 'background' || decl.parent.selector !== '.foo') {
							return;
						}

						decl.parent.cloneBefore({ selector: '.bar' });
					},
				};
			};

			lastColor.postcss = true;

			return [
				plugin({
					files: [
						'./test/fixtures/fixture.css',
					],
					prepend: false,
				}),
				lastColor,
			];
		})(),
	},
	'basic:append-implicit': {
		message: 'append (implicit)',
		plugins: (() => {
			const lastColor = () => {
				return {
					postcssPlugin: 'last-color',
					Declaration: (decl) => {
						if (decl.prop !== 'background' || decl.parent.selector !== '.foo') {
							return;
						}

						decl.parent.cloneBefore({ selector: '.bar' });
					},
				};
			};

			lastColor.postcss = true;

			return [
				plugin({
					files: [
						'./test/fixtures/fixture.css',
					],
				}),
				lastColor,
			];
		})(),
	},
	'basic:prepend': {
		message: 'prepend',
		plugins: (() => {
			const lastColor = () => {
				return {
					postcssPlugin: 'last-color',
					Declaration: (decl) => {
						if (decl.prop !== 'background' || decl.parent.selector !== '.foo') {
							return;
						}

						decl.parent.cloneBefore({ selector: '.bar' });
					},
				};
			};

			lastColor.postcss = true;

			return [
				plugin({
					files: [
						'./test/fixtures/fixture.css',
					],
					prepend: true,
				}),
				lastColor,
			];
		})(),
	},
	'open-props': {
		message: 'supports open-props usage',
		plugins: [
			plugin({
				files: [
					'node_modules:open-props/media.min.css',
					'node_modules://open-props/open-props.min.css',
				],
			}),
			postcssCustomProperties({ preserve: false }),
			postcssCustomMedia({ preserve: false }),
		],
	},
});
