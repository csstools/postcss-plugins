import { parse } from '@csstools/postcss-plugins-values-parser';
import { processImageSet } from './lib/process-image-set';
import type { PluginCreator } from 'postcss';

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
			if (!imageSetValueMatchRegExp.test(value)) {
				return;
			}

			let valueAST;

			try {
				valueAST = parse(value, { ignoreUnknownWords: true });
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
			valueAST.walk((node) => {
				if (node.type !== 'func') {
					return;
				}

				if (!imageSetFunctionMatchRegExp.test(node.name)) {
					return;
				}

				processImageSet(node.nodes, decl, {
					decl,
					oninvalid,
					preserve,
					result: result,
					postcss: postcss,
				});
			});
		},
	};
};

creator.postcss = true;

export default creator;

