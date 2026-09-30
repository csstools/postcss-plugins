import type { Declaration, PluginCreator, Result } from 'postcss';
import type { DirectionConfig, TransformFunction } from './lib/types';
import { Axes, DirectionFlow } from './lib/types';
import { directionFlowToAxes } from './utils/direction-flow-to-axes';
import { transformTransition } from './lib/transform-transition';
import { prepareTransforms } from './lib/transforms';
import { HAS_VARIABLE_FUNCTION_REGEX } from './utils/has-variable-function';

export type { DirectionFlow } from './lib/types';

/** postcss-logical plugin options */
export type pluginOptions = {
	/** Ignore logical properties with values containing `var()` */
	ignoreCustomProperties?: true,
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

	const makeTransform = (transform: TransformFunction | null) => {
		return (
			decl: Declaration,
			{ result }: { result: Result },
		): void => {
			if (!transform) {
				return;
			}

			if (options.ignoreCustomProperties && HAS_VARIABLE_FUNCTION_REGEX.test(decl.value)) {
				return;
			}

			let transformed: Array<Declaration>;

			try {
				transformed = transform(decl);
			} catch (err) {
				decl.warn(result, (err instanceof Error) ? err.message : String(err));
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

	const transforms = prepareTransforms(directionConfig, blockStart, blockEnd, inlineStart, inlineEnd);

	return {
		postcssPlugin: 'postcss-logical',
		Declaration: {
			// 2.1 Caption
			'caption-side': makeTransform(transforms['caption-side']),
			// 2.3 Text Align
			'text-align': makeTransform(transforms['text-align']),
			// 4.1 Block Size and Inline Size
			'block-size': makeTransform(transforms['block-size']),
			'inline-size': makeTransform(transforms['inline-size']),
			'min-block-size': makeTransform(transforms['min-block-size']),
			'max-block-size': makeTransform(transforms['max-block-size']),
			'min-inline-size': makeTransform(transforms['min-inline-size']),
			'max-inline-size': makeTransform(transforms['max-inline-size']),
			// 4.2 Margins
			'margin-block-start': makeTransform(transforms['margin-block-start']),
			'margin-block-end': makeTransform(transforms['margin-block-end']),
			'margin-inline-start': makeTransform(transforms['margin-inline-start']),
			'margin-inline-end': makeTransform(transforms['margin-inline-end']),
			'margin-block': makeTransform(transforms['margin-block']),
			'margin-inline': makeTransform(transforms['margin-inline']),
			// 4.3 Offsets
			'inset-block': makeTransform(transforms['inset-block']),
			'inset-block-start': makeTransform(transforms['inset-block-start']),
			'inset-block-end': makeTransform(transforms['inset-block-end']),
			'inset-inline': makeTransform(transforms['inset-inline']),
			'inset-inline-start': makeTransform(transforms['inset-inline-start']),
			'inset-inline-end': makeTransform(transforms['inset-inline-end']),
			'inset': makeTransform(transforms['inset']),
			// 4.4 Paddings
			'padding-block-start': makeTransform(transforms['padding-block-start']),
			'padding-block-end': makeTransform(transforms['padding-block-end']),
			'padding-inline-start': makeTransform(transforms['padding-inline-start']),
			'padding-inline-end': makeTransform(transforms['padding-inline-end']),
			'padding-block': makeTransform(transforms['padding-block']),
			'padding-inline': makeTransform(transforms['padding-inline']),
			// 4.5 Borders
			// 4.5.1 Border Width
			'border-block-start-width': makeTransform(transforms['border-block-start-width']),
			'border-block-end-width': makeTransform(transforms['border-block-end-width']),
			'border-inline-start-width': makeTransform(transforms['border-inline-start-width']),
			'border-inline-end-width': makeTransform(transforms['border-inline-end-width']),
			'border-block-width': makeTransform(transforms['border-block-width']),
			'border-inline-width': makeTransform(transforms['border-inline-width']),
			// 4.5.2 Border Style
			'border-block-start-style': makeTransform(transforms['border-block-start-style']),
			'border-block-end-style': makeTransform(transforms['border-block-end-style']),
			'border-inline-start-style': makeTransform(transforms['border-inline-start-style']),
			'border-inline-end-style': makeTransform(transforms['border-inline-end-style']),
			'border-block-style': makeTransform(transforms['border-block-style']),
			'border-inline-style': makeTransform(transforms['border-inline-style']),
			// 4.5.3 Border Color
			'border-block-start-color': makeTransform(transforms['border-block-start-color']),
			'border-block-end-color': makeTransform(transforms['border-block-end-color']),
			'border-inline-start-color': makeTransform(transforms['border-inline-start-color']),
			'border-inline-end-color': makeTransform(transforms['border-inline-end-color']),
			'border-block-color': makeTransform(transforms['border-block-color']),
			'border-inline-color': makeTransform(transforms['border-inline-color']),
			// 4.5.4 Border Shorthand
			'border-block': makeTransform(transforms['border-block']),
			'border-block-start': makeTransform(transforms['border-block-start']),
			'border-block-end': makeTransform(transforms['border-block-end']),
			'border-inline': makeTransform(transforms['border-inline']),
			'border-inline-start': makeTransform(transforms['border-inline-start']),
			'border-inline-end': makeTransform(transforms['border-inline-end']),
			// 4.6 Border Radius
			'border-start-start-radius': makeTransform(transforms['border-start-start-radius']),
			'border-start-end-radius': makeTransform(transforms['border-start-end-radius']),
			'border-end-start-radius': makeTransform(transforms['border-end-start-radius']),
			'border-end-end-radius': makeTransform(transforms['border-end-end-radius']),
			'transition': (decl, { result, postcss }): void => {
				if (options.ignoreCustomProperties && HAS_VARIABLE_FUNCTION_REGEX.test(decl.value)) {
					return;
				}

				let transformed: Array<Declaration>;

				try {
					transformed = transformTransition(decl, postcss, transforms);
				} catch (err) {
					decl.warn(result, (err instanceof Error) ? err.message : String(err));
					return;
				}

				if (!transformed?.length) {
					return;
				}

				transformed.forEach((transformedDecl) => {
					decl.cloneBefore(transformedDecl);
				});

				decl.remove();
			},
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
