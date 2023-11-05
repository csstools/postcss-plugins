import valueParser from 'postcss-value-parser';
import { processImageSet } from './lib/process-image-set';
import type { PluginCreator } from 'postcss';
import { handleInvalidation } from './lib/handle-invalidation';
import { hasFallback } from './has-fallback-decl';

const IMAGE_SET_VALUE_MATCH_REG_EXP = /(^|[^\w-])(-webkit-)?image-set\(/i;
const IMAGE_SET_FUNCTION_MATCH_REG_EXP = /^(-webkit-)?image-set$/i;

/** postcss-image-set-function plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
	/**
	 * Determine how invalid usage of `image-set()` should be handled.
	 * By default, invalid usages of `image-set()` are ignored.
	 * They can be configured to emit a warning with `warn` or throw an exception with `throw`.
	 * default: 'ignore'
	 */
	onInvalid?: 'warn' | 'throw' | 'ignore' | false
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	// prepare options
	const preserve = 'preserve' in Object(opts) ? Boolean(opts?.preserve) : true;
	const oninvalid = 'onInvalid' in Object(opts) ? opts?.onInvalid : 'ignore';

	if ('oninvalid' in Object(opts)) {
		throw new Error('"oninvalid" was changed to "onInvalid" to match other plugins with similar options');
	}

	return {
		postcssPlugin: 'postcss-image-set-function',
		Declaration(decl, { result, postcss }) {
			const value = decl.value;

			// if a declaration likely uses an image-set() function
			if (!IMAGE_SET_VALUE_MATCH_REG_EXP.test(value)) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			let valueAST;

			try {
				valueAST = valueParser(value);
			} catch (_) {
				decl.warn(
					result,
					`Failed to parse value '${value}' as an image-set function. Leaving the original value intact.`,
				);
			}

			if (typeof valueAST === 'undefined') {
				return;
			}

			// process every image-set() function
			const imageSetFunctions: Array<{
				imageSetFunction: valueParser.FunctionNode,
				imageSetOptionNodes: Array<valueParser.Node>,
			}> = [];

			valueAST.walk((node) => {
				if (node.type !== 'function') {
					return;
				}

				if (!IMAGE_SET_FUNCTION_MATCH_REG_EXP.test(node.value)) {
					return;
				}

				let foundNestedImageSet = false;
				valueParser.walk(node.nodes, (child) => {
					if (
						child.type === 'function' &&
						IMAGE_SET_FUNCTION_MATCH_REG_EXP.test(child.value)
					) {
						foundNestedImageSet = true;
					}
				});
				if (foundNestedImageSet) {
					handleInvalidation({
						decl,
						oninvalid,
						result: result,
					}, 'nested image-set functions are not allowed', valueParser.stringify(node));
					return false;
				}

				const relevantNodes = node.nodes.filter((x) => {
					return x.type !== 'comment' && x.type !== 'space';
				});

				imageSetFunctions.push({
					imageSetFunction: node,
					imageSetOptionNodes: relevantNodes,
				});
			});

			processImageSet(imageSetFunctions, decl, {
				decl,
				oninvalid,
				preserve,
				result: result,
				postcss: postcss,
			});
		},
	};
};

creator.postcss = true;

export default creator;

