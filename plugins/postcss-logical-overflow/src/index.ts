import type { Declaration, PluginCreator, Result } from 'postcss';
import { Axes, DirectionConfig, DirectionFlow, TransformFunction } from './lib/types';
import { directionFlowToAxes } from './utils/direction-flow-to-axes';
import { transformAxes } from './lib/transform-axes';

/** postcss-logical-overflow plugin options */
export type pluginOptions = {
	/** Sets the direction for block. default: top-to-bottom */
	blockDirection?: DirectionFlow,
	/** Sets the direction for inline. default: left-to-right */
	inlineDirection?: DirectionFlow,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			blockDirection: DirectionFlow.TopToBottom,
			inlineDirection: DirectionFlow.LeftToRight,
		},
		// Provided options
		opts,
	);
	const directionValues = Object.values(DirectionFlow);

	if (!directionValues.includes(options.blockDirection)) {
		throw new Error(`[postcss-logical-overflow] "blockDirection" must be one of ${directionValues.join(', ')}`);
	}

	if (!directionValues.includes(options.inlineDirection)) {
		throw new Error(`[postcss-logical-overflow] "inlineDirection" must be one of ${directionValues.join(', ')}`);
	}

	const [blockStart, blockEnd] = directionFlowToAxes(options.blockDirection);
	const [inlineStart, inlineEnd] = directionFlowToAxes(options.inlineDirection);
	const allAxesCovered = Object.values(Axes)
		.every((axis) => [blockStart, blockEnd, inlineStart, inlineEnd].includes(axis));

	if (!allAxesCovered) {
		throw new Error('[postcss-logical-overflow] "blockDirection" and "inlineDirection" must be on separate axes');
	}

	const directionConfig: DirectionConfig = {
		block: [blockStart, blockEnd],
		inline: [inlineStart, inlineEnd],
		inlineIsHorizontal: [DirectionFlow.LeftToRight, DirectionFlow.RightToLeft].includes(options.inlineDirection),
	};

	const makeTransform = (transform: TransformFunction | null) => {
		return (
			decl: Declaration,
			{ result }: { result: Result },
		) => {
			if (!transform) {
				return;
			}

			let transformed: Array<Declaration> = [];

			try {
				transformed = transform(decl);
			} catch (error) {
				decl.warn(result, error.message);
				return;
			}

			if (!transformed?.length) {
				return;
			}

			transformed.forEach((transformedDecl) => {
				decl.cloneBefore(transformedDecl);
			});

			decl.remove();
		};
	};

	return {
		postcssPlugin: 'postcss-logical-overflow',
		Declaration: {
			'overflow-block': makeTransform(transformAxes(directionConfig)),
			'overflow-inline': makeTransform(transformAxes(directionConfig)),
		},
	};
};

creator.postcss = true;

export default creator;
