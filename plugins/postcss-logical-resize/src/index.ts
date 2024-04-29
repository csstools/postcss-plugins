import type { Declaration, PluginCreator, Result } from 'postcss';
import { Axes, DirectionConfig, DirectionFlow } from './lib/types';
import { transformResize } from './lib/transform-resize';
import { directionFlowToAxes } from './utils/direction-flow-to-axes';

export type { DirectionFlow } from './lib/types';

/** postcss-logical-resize plugin options */
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
		throw new Error(`[postcss-logical-resize] "blockDirection" must be one of ${directionValues.join(', ')}`);
	}

	if (!directionValues.includes(options.inlineDirection)) {
		throw new Error(`[postcss-logical-resize] "inlineDirection" must be one of ${directionValues.join(', ')}`);
	}

	const [blockStart, blockEnd] = directionFlowToAxes(options.blockDirection);
	const [inlineStart, inlineEnd] = directionFlowToAxes(options.inlineDirection);
	const allAxesCovered = Object.values(Axes)
		.every((axis) => [blockStart, blockEnd, inlineStart, inlineEnd].includes(axis));

	if (!allAxesCovered) {
		throw new Error('[postcss-logical-resize] "blockDirection" and "inlineDirection" must be on separate axes');
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
		): void => {
			if (!transform) {
				return;
			}

			let transformed: boolean | null = false;

			try {
				transformed = transform(decl);
			} catch (err) {
				decl.warn(result, (err instanceof Error) ? err.message : String(err));
				return;
			}

			if (!transformed) {
				return;
			}

			decl.remove();
		};
	};

	return {
		postcssPlugin: 'postcss-logical-resize',
		Declaration: {
			// 2.4 Resize
			'resize': makeTransform(transformResize(directionConfig)),
		},
	};
};

creator.postcss = true;

export default creator;
