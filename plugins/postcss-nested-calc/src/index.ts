import type { PluginCreator } from 'postcss';
import valueParser from 'postcss-value-parser';
import type { ParsedValue } from 'postcss-value-parser';
import { numberOfCalcOccurrences } from './occurrences';
import { hasFallback } from '@csstools/utilities';

/** postcss-nested-calc plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			preserve: true,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-nested-calc',
		Declaration(decl, { result }): void {
			if (numberOfCalcOccurrences(decl.value) < 2) {
				// must have at least two calc functions.
				return;
			}

			if (decl.variable) {
				// We can not determine if something will become a nested calc after variable substitution.
				// Not touching variables at all is safest for now.
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			const originalValue = decl.value;
			let valueAST: ParsedValue | undefined;

			try {
				valueAST = valueParser(originalValue);
			} catch {
				decl.warn(
					result,
					`Failed to parse value '${originalValue}'. Leaving the original value intact.`,
				);
				return;
			}
			if (typeof valueAST === 'undefined') {
				return;
			}

			valueParser.walk(valueAST.nodes, (node) => {
				if (!node.type || node.type !== 'function') {
					return;
				}

				if (node.value.toLowerCase() !== 'calc') {
					return;
				}

				valueParser.walk(node.nodes, (nestedCalc) => {
					if (!nestedCalc.type || nestedCalc.type !== 'function') {
						return;
					}

					if (nestedCalc.value.toLowerCase() !== 'calc') {
						return false;
					}

					nestedCalc.value = '';
				});
			}, true);

			const modifiedValue = String(valueAST);
			if (modifiedValue === originalValue) {
				return;
			}

			decl.cloneBefore({ value: modifiedValue });

			if (!options.preserve) {
				decl.remove();
			}
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };

