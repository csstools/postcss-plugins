import path from 'path';
import { generate } from './generate.mjs';

(async () => {
	await Promise.all(
		[
			generate(
				'selector',
				path.join('../../plugins', 'postcss-dir-pseudo-class'),
				[
					':dir(ltr)',
					':dir(rtl)',
				],
			),

			generate(
				'selector',
				path.join('../../plugins', 'postcss-pseudo-class-any-link'),
				[
					':any-link',
				],
			),

			generate(
				'selector',
				path.join('../../plugins', 'postcss-scope-pseudo-class'),
				[
					':scope',
				],
			),

			generate(
				'selector',
				path.join('../../plugins', 'postcss-focus-visible'),
				[
					':focus-visible',
				],
			),

			generate(
				'selector',
				path.join('../../plugins', 'postcss-focus-within'),
				[
					':focus-within',
				],
			),

			generate(
				'selector-class-function',
				path.join('../../plugins', 'postcss-is-pseudo-class'),
				[
					':is',
				],
			),

			generate(
				'value',
				path.join('../../plugins', 'postcss-color-functional-notation'),
				[
					'rgba(178 34 34 / 1)',
					'hsl(120 100% 50% / 1)',
				],
			),

			generate(
				'value',
				path.join('../../plugins', 'postcss-double-position-gradients'),
				[
					'linear-gradient(90deg, black 25% 50%, blue 50% 75%)',
				],
			),

			generate(
				'value',
				path.join('../../plugins', 'postcss-unset-value'),
				[
					'unset',
				],
			),

			generate(
				'value',
				path.join('../../plugins', 'postcss-image-set-function'),
				[
					'image-set(url(img/test.png) 1x, url(img/test-2x.png) 2x)',
				],
			),

			generate(
				'value',
				path.join('../../plugins', 'postcss-color-rebeccapurple'),
				[
					'rebeccapurple',
				],
			),

			generate(
				'declaration',
				path.join('../../plugins', 'postcss-place'),
				[
					['place-content', 'first second'],
				],
			),

			generate(
				'declaration',
				path.join('../../plugins', 'postcss-logical'),
				[
					['inset-inline-start', '0'],
				],
			),

			generate(
				'declaration',
				path.join('../../plugins', 'postcss-overflow-shorthand'),
				[
					['overflow', 'hidden auto'],
				],
			),
		],
	);
})();
