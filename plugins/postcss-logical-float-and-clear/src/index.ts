import type { PluginCreator, Declaration } from 'postcss';
import { DirectionFlow, DirectionValues } from './lib/types';
import { directionFlowToAxes } from './utils/direction-flow-to-axes';
import { cloneDeclaration } from './lib/clone-declaration';

export type { DirectionFlow } from './lib/types';

/** postcss-logical-float-and-clear plugin options */
export type pluginOptions = {
	/** Sets the direction for inline. default: left-to-right */
	inlineDirection?: DirectionFlow,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			inlineDirection: DirectionFlow.LeftToRight,
		},
		// Provided options
		opts,
	);

	const directionValues = Object.values(DirectionFlow);
	if (!directionValues.includes(options.inlineDirection)) {
		throw new Error(`[postcss-logical-float-and-clear] "inlineDirection" must be one of ${directionValues.join(', ')}`);
	}

	const isHorizontal = [DirectionFlow.LeftToRight, DirectionFlow.RightToLeft].includes(options.inlineDirection);

	if (!isHorizontal) {
		return {
			postcssPlugin: 'postcss-logical-float-and-clear',
			Once(): void {
				// noop
			},
		};
	}

	const [inlineStart, inlineEnd] = directionFlowToAxes(options.inlineDirection);
	const makeTransform = (decl: Declaration): void => {
		const value = decl.value.toLowerCase();
		const possibleValues = [DirectionValues.InlineStart, DirectionValues.InlineEnd];

		if (!possibleValues.includes(value)) {
			return;
		}

		const newValue = value === DirectionValues.InlineStart ? inlineStart : inlineEnd;
		cloneDeclaration(decl, newValue, decl.prop);
		decl.remove();
	};

	return {
		postcssPlugin: 'postcss-logical-float-and-clear',
		Declaration: {
			'float': makeTransform,
			'clear': makeTransform,
		},
	};
};

creator.postcss = true;

export default creator;
