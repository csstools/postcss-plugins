import type { PluginCreator, Declaration, Result } from 'postcss';
import { hasKeyframesAtRuleAncestor } from './lib/has-keyframes-atrule-ancestor';
import { transformSide } from './lib/transform-side';
import { transformSideShorthand } from './lib/transform-side-shorthand';

enum Direction {
	TopToBottom = 'top-to-bottom',
	BottomToTop = 'bottom-to-top',
	RightToLeft = 'right-to-left',
	LeftToRight = 'left-to-right',
}

const Axes = ['top', 'right', 'bottom', 'left'];

/** postcss-overflow-shorthand plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
	blockDirection?: Direction,
	inlineDirection?: Direction,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			preserve: false,
			blockDirection: Direction.TopToBottom,
			inlineDirection: Direction.LeftToRight,
		},
		// Provided options
		opts,
	);
	const directionValues = Object.values(Direction);

	if (!directionValues.includes(options.blockDirection)) {
		throw new Error(`[postcss-logical] "blockDirection" must be one of ${directionValues.join(', ')}`);
	}

	if (!directionValues.includes(options.inlineDirection)) {
		throw new Error(`[postcss-logical] "inlineDirection" must be one of ${directionValues.join(', ')}`);
	}

	const [blockStart, blockEnd] = options.blockDirection.split('-to-');
	const [inlineStart, inlineEnd] = options.inlineDirection.split('-to-');
	const allAxesCovered = Axes.every((axis) => [blockStart, blockEnd, inlineStart, inlineEnd].includes(axis));

	if (!allAxesCovered) {
		throw new Error('[postcss-logical] "blockDirection" and "inlineDirection" must be on separate axes');
	}

	const makeTransform = (transform: (decl: Declaration) => void) => {
		return (
			decl: Declaration,
			{ result }: { result: Result },
		) => {
			if (hasKeyframesAtRuleAncestor(decl)) {
				return;
			}
			const parent = decl.parent;
			let transformed = false;

			try {
				transform(decl);
				transformed = true;
			} catch (error) {
				decl.warn(result, error.message);
			}

			if (transformed) {
				if (!options.preserve) {
					decl.remove();
				}

				if (!parent.nodes.length) {
					parent.remove();
				}
			}
		};
	};

	return {
		postcssPlugin: 'postcss-logical',
		Declaration: {
			// Margins
			'margin-block-start': makeTransform(
				transformSide('margin', blockStart),
			),
			'margin-block-end': makeTransform(
				transformSide('margin', blockEnd),
			),
			'margin-inline-start': makeTransform(
				transformSide('margin', inlineStart),
			),
			'margin-inline-end': makeTransform(
				transformSide('margin', inlineEnd),
			),
			'margin-block': makeTransform(
				transformSideShorthand('margin', [blockStart, blockEnd]),
			),
			'margin-inline': makeTransform(
				transformSideShorthand('margin', [inlineStart, inlineEnd]),
			),

			// Paddings
			'padding-block-start': makeTransform(
				transformSide('padding', blockStart),
			),
			'padding-block-end': makeTransform(
				transformSide('padding', blockEnd),
			),
			'padding-inline-start': makeTransform(
				transformSide('padding', inlineStart),
			),
			'padding-inline-end': makeTransform(
				transformSide('padding', inlineEnd),
			),
			'padding-block': makeTransform(
				transformSideShorthand('padding', [blockStart, blockEnd]),
			),
			'padding-inline': makeTransform(
				transformSideShorthand('padding', [inlineStart, inlineEnd]),
			),
		},
	};
};

creator.postcss = true;

export default creator;
