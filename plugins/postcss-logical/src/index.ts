import type { Declaration, PluginCreator, Result } from 'postcss';
import { Axes, Direction, DirectionConfig, DirectionFlow } from './lib/types';
import {
	transformBorder,
	transformBorderProperty,
	transformBorderShorthand,
	transformBorderRadius,
} from './lib/transform-borders';
import { transformLogicalSize } from './lib/transform-logical-size';
import {
	transformOffset,
	transformOffsetShorthand,
} from './lib/transform-offset';
import { transformInset } from './lib/transform-inset';
import { transformResize } from './lib/transform-resize';
import {
	transformSide,
	transformSideShorthand,
} from './lib/transform-side';
import { transformTextAlign } from './lib/transform-text-align';
import {
	transformValue,
	transformValueWithSingleDirection,
} from './lib/transform-value';
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
			if (!transform) {
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

	// Only used for border-radius
	const textDirection: [Axes, Axes] = directionConfig.inlineIsHorizontal
		? [inlineStart, inlineEnd]
		: [Axes.Left, Axes.Right];

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
			// 2.4 Resize
			'resize': makeTransform(transformResize(directionConfig)),
			// 4.1 Block Size and Inline Size
			'block-size': makeTransform(transformLogicalSize(directionConfig)),
			'inline-size': makeTransform(transformLogicalSize(directionConfig)),
			// 4.2 Margins
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
				transformSideShorthand('margin', directionConfig.block),
			),
			'margin-inline': makeTransform(
				transformSideShorthand('margin', [inlineStart, inlineEnd]),
			),
			// 4.3 Offsets
			'inset-block': makeTransform(transformOffsetShorthand(directionConfig.block)),
			'inset-block-start': makeTransform(transformOffset(blockStart)),
			'inset-block-end': makeTransform(transformOffset(blockEnd)),
			'inset-inline': makeTransform(transformOffsetShorthand([inlineStart, inlineEnd])),
			'inset-inline-start': makeTransform(transformOffset(inlineStart)),
			'inset-inline-end': makeTransform(transformOffset(inlineEnd)),
			'inset': makeTransform(transformInset()),
			// 4.4 Paddings
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
				transformSideShorthand('padding', directionConfig.block),
			),
			'padding-inline': makeTransform(
				transformSideShorthand('padding', [inlineStart, inlineEnd]),
			),
			// 4.5 Borders
			// 4.5.1 Border Width
			'border-block-start-width': makeTransform(
				transformBorder('width', blockStart),
			),
			'border-block-end-width': makeTransform(
				transformBorder('width', blockEnd),
			),
			'border-inline-start-width': makeTransform(
				transformBorder('width', inlineStart),
			),
			'border-inline-end-width': makeTransform(
				transformBorder('width', inlineEnd),
			),
			'border-block-width': makeTransform(
				transformBorderProperty('width', directionConfig.block),
			),
			'border-inline-width': makeTransform(
				transformBorderProperty('width', directionConfig.inline),
			),
			// 4.5.2 Border Style
			'border-block-start-style': makeTransform(
				transformBorder('style', blockStart),
			),
			'border-block-end-style': makeTransform(
				transformBorder('style', blockEnd),
			),
			'border-inline-start-style': makeTransform(
				transformBorder('style', inlineStart),
			),
			'border-inline-end-style': makeTransform(
				transformBorder('style', inlineEnd),
			),
			'border-block-style': makeTransform(
				transformBorderProperty('style', directionConfig.block),
			),
			'border-inline-style': makeTransform(
				transformBorderProperty('style', directionConfig.inline),
			),
			// 4.5.3 Border Color
			'border-block-start-color': makeTransform(
				transformBorder('color', blockStart),
			),
			'border-block-end-color': makeTransform(
				transformBorder('color', blockEnd),
			),
			'border-inline-start-color': makeTransform(
				transformBorder('color', inlineStart),
			),
			'border-inline-end-color': makeTransform(
				transformBorder('color', inlineEnd),
			),
			'border-block-color': makeTransform(
				transformBorderProperty('color', directionConfig.block),
			),
			'border-inline-color': makeTransform(
				transformBorderProperty('color', directionConfig.inline),
			),
			// 4.5.4 Border Shorthand
			'border-block': makeTransform(
				transformBorderShorthand(directionConfig.block),
			),
			'border-block-start': makeTransform(
				transformBorderShorthand([blockStart]),
			),
			'border-block-end': makeTransform(
				transformBorderShorthand([blockEnd]),
			),
			'border-inline': makeTransform(
				transformBorderShorthand(directionConfig.inline),
			),
			'border-inline-start': makeTransform(
				transformBorderShorthand([inlineStart]),
			),
			'border-inline-end': makeTransform(
				transformBorderShorthand([inlineEnd]),
			),
			// 4.6 Border Radius
			'border-start-start-radius': makeTransform(
				transformBorderRadius(...textDirection),
			),
			'border-start-end-radius': makeTransform(
				transformBorderRadius(...textDirection),
			),
			'border-end-start-radius': makeTransform(
				transformBorderRadius(...textDirection),
			),
			'border-end-end-radius': makeTransform(
				transformBorderRadius(...textDirection),
			),
		},
	};
};

creator.postcss = true;

export default creator;
