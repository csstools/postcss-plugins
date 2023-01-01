import type { Declaration, PluginCreator, Result } from 'postcss';
import { Axes, Direction, DirectionConfig, DirectionFlow } from './lib/types';
import { hasKeyframesAtRuleAncestor } from './lib/has-keyframes-atrule-ancestor';
import { transformSide } from './lib/transform-side';
import { transformSideShorthand } from './lib/transform-side-shorthand';
import { transformTextAlign } from './lib/transform-text-align';
import { transformValue, transformValueWithSingleDirection } from './lib/transform-value';
import { directionFlowToAxes } from './utils/direction-flow-to-axes';

/** postcss-overflow-shorthand plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
	blockDirection?: DirectionFlow,
	inlineDirection?: DirectionFlow,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			preserve: false,
			blockDirection: DirectionFlow.TopToBottom,
			inlineDirection: DirectionFlow.LeftToRight,
		},
		// Provided options
		opts,
	);
	const directionValues = Object.values(DirectionFlow);

	if (!directionValues.includes(options.blockDirection)) {
		throw new Error(`[postcss-logical] "blockDirection" must be one of ${directionValues.join(', ')}`);
	}

	if (!directionValues.includes(options.inlineDirection)) {
		throw new Error(`[postcss-logical] "inlineDirection" must be one of ${directionValues.join(', ')}`);
	}

	const [blockStart, blockEnd] = directionFlowToAxes(options.blockDirection);
	const [inlineStart, inlineEnd] = directionFlowToAxes(options.inlineDirection);
	const allAxesCovered = Object.values(Axes)
		.every((axis) => [blockStart, blockEnd, inlineStart, inlineEnd].includes(axis));

	if (!allAxesCovered) {
		throw new Error('[postcss-logical] "blockDirection" and "inlineDirection" must be on separate axes');
	}

	const directionConfig: DirectionConfig = {
		block: [blockStart, blockEnd],
		inline: [inlineStart, inlineEnd],
		inlineIsHorizontal: [DirectionFlow.LeftToRight, DirectionFlow.RightToLeft].includes(options.inlineDirection),
	};

	const makeTransform = (transform: (decl: Declaration) => boolean | null) => {
		return (
			decl: Declaration,
			{ result }: { result: Result },
		) => {
			if (!transform || hasKeyframesAtRuleAncestor(decl)) {
				return;
			}
			const parent = decl.parent;
			let transformed = false;

			try {
				transformed = transform(decl);
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
			// 2.1 Caption
			'caption-side': makeTransform(transformValue(directionConfig)),
			// 2.2 Float & Clear
			'float': makeTransform(
				directionConfig.inlineIsHorizontal
					? transformValueWithSingleDirection(Direction.Inline, directionConfig)
					: null,
			),
			'clear': makeTransform(
				directionConfig.inlineIsHorizontal
					? transformValueWithSingleDirection(Direction.Inline, directionConfig)
					: null,
			),
			// 2.3 Text Align
			'text-align': makeTransform(
				directionConfig.inlineIsHorizontal
					? transformTextAlign(directionConfig.inline)
					: null,
			),

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
