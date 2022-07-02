import valueParser from 'postcss-value-parser';
import { processImageSet } from './lib/process-image-set';
import type { PluginCreator } from 'postcss';
import { handleInvalidation } from './lib/handle-invalidation';

const imageSetValueMatchRegExp = /(^|[^\w-])(-webkit-)?image-set\(/i;
const imageSetFunctionMatchRegExp = /^(-webkit-)?image-set$/i;

const creator: PluginCreator<{ preserve: boolean, oninvalid: string }> = (opts?: { preserve: boolean, oninvalid: string }) => {
	// prepare options
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;
	const oninvalid = 'oninvalid' in Object(opts) ? opts.oninvalid : 'ignore';

	return {
		postcssPlugin: 'postcss-image-set-function',
		Declaration(decl, { result, postcss }) {
			const value = decl.value;

			// if a declaration likely uses an image-set() function
			if (!imageSetValueMatchRegExp.test(value.toLowerCase())) {
				return;
			}

			let valueAST;

			try {
				valueAST = valueParser(value);
			} catch (error) {
				decl.warn(
					result,
					`Failed to parse value '${value}' as an image-set function. Leaving the original value intact.`,
				);
			}

			if (typeof valueAST === 'undefined') {
				return;
			}

			// process every image-set() function
			const imageSetFunctions = [];

			valueAST.walk((node) => {
				if (node.type !== 'function') {
					return;
				}

				if (!imageSetFunctionMatchRegExp.test(node.value.toLowerCase())) {
					return;
				}

				let foundNestedImageSet = false;
				valueParser.walk(node.nodes, (child) => {
					if (
						child.type === 'function' &&
						imageSetFunctionMatchRegExp.test(child.value.toLowerCase())
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

