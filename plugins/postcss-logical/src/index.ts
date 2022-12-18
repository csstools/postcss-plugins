import type { PluginCreator, Declaration } from 'postcss';
import { hasKeyframesAtRuleAncestor } from '../lib/has-keyframes-atrule-ancestor';
import { transformSide } from '../lib/transform-side';

enum Direction {
	TopToBottom = 'top-to-bottom',
	BottomToTop = 'bottom-to-top',
	RightToLeft = 'right-to-left',
	LeftToRight = 'left-to-right',
}

const Axes = ['top', 'right', 'bottom', 'left'];

/**
 * Validar Direccion?
 * Bottom To Top existe?
 * Validar block diferente a inline?
 */

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
		return (decl) => {
			if (hasKeyframesAtRuleAncestor(decl)) {
				return;
			}
			const parent = decl.parent;
			transform(decl);

			if (!options.preserve) {
				decl.remove();
			}

			if (!parent.nodes.length) {
				parent.remove();
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
		},
	};
};

creator.postcss = true;

export default creator;
