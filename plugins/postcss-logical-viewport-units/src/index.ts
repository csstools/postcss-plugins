import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { PluginCreator } from 'postcss';
import { hasFallback, hasSupportsAtRuleAncestor } from '@csstools/utilities';
import { DirectionFlow } from './lib/types';
import type { Replacements} from './transform';
import { transform } from './transform';
import { predicate } from './has-feature';

export type { DirectionFlow } from './lib/types';

/** postcss-logical-viewport-units plugin options */
export type basePluginOptions = {
	/** Preserve the original notation. default: true */
	preserve: boolean,
	/** Sets the direction for inline. default: left-to-right */
	inlineDirection?: DirectionFlow,
};

const HAS_VIEWPORT_UNITS_REGEX = /(?:vi|vb|svi|svb|lvi|lvb)\b/i;

const basePlugin: PluginCreator<basePluginOptions> = (opts?: basePluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			inlineDirection: DirectionFlow.LeftToRight,
		},
		// Provided options
		opts,
	);

	switch (options.inlineDirection) {
		case DirectionFlow.LeftToRight:
		case DirectionFlow.RightToLeft:
		case DirectionFlow.TopToBottom:
		case DirectionFlow.BottomToTop:
			break;
		default:
			throw new Error(`[postcss-logical-viewport-units] "inlineDirection" must be one of ${Object.values(DirectionFlow).join(', ')}`);
	}

	const isHorizontal = [DirectionFlow.LeftToRight, DirectionFlow.RightToLeft].includes(options.inlineDirection);

	const replacements: Replacements = {
		vb: 'vh',
		vi: 'vw',
	};

	if (!isHorizontal) {
		replacements.vb = 'vw';
		replacements.vi = 'vh';
	}

	return {
		postcssPlugin: 'postcss-logical-viewport-units',
		Declaration(decl): void {
			{
				if (!HAS_VIEWPORT_UNITS_REGEX.test(decl.value)) {
					return;
				}

				if (hasFallback(decl)) {
					return;
				}

				// Is wrapped in a relevant `@supports`
				if (hasSupportsAtRuleAncestor(decl, predicate)) {
					return;
				}
			}

			const modifiedValue = transform(decl.value, replacements);
			if (modifiedValue === decl.value) {
				return;
			}

			decl.cloneBefore({
				value: modifiedValue,
			});

			if (!options.preserve) {
				decl.remove();
			}
		},
	};
};


basePlugin.postcss = true;

/** postcss-logical-viewport-units plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
	/** Sets the direction for inline. default: left-to-right */
	inlineDirection?: DirectionFlow,
	/** Enable "@csstools/postcss-progressive-custom-properties". default: true */
	enableProgressiveCustomProperties?: boolean,
};

const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		preserve: true,
		enableProgressiveCustomProperties: true,
	}, opts);

	if (options.enableProgressiveCustomProperties && options.preserve) {
		return {
			postcssPlugin: 'postcss-logical-viewport-units',
			plugins: [
				postcssProgressiveCustomProperties(),
				basePlugin(options),
			],
		};
	}

	return basePlugin(options);
};

postcssPlugin.postcss = true;

export default postcssPlugin;
export { postcssPlugin as 'module.exports' };

