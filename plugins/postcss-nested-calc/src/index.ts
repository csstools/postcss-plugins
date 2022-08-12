import type { PluginCreator } from 'postcss';
import valueParser from 'postcss-value-parser';
import type { ParsedValue } from 'postcss-value-parser';
import { numberOfCalcOccurrences } from './occurrences';

type pluginOptions = { preserve?: boolean };

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
		Declaration(decl, { result }) {
			if (numberOfCalcOccurrences(decl.value) < 2) {
				// must have at least two calc functions.
				return;
			}

			if (decl.variable) {
				// We can not determine if something will become a nested calc after variable substitution.
				// Not touching variables at all is safest for now.
				return;
			}

			const originalValue = decl.value;
			let valueAST: ParsedValue | undefined;

			try {
				valueAST = valueParser(originalValue);
			} catch (error) {
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

			if (options.preserve) {
				decl.cloneBefore({ value: modifiedValue });
			} else {
				decl.replaceWith(decl.clone({ value: modifiedValue }));
			}
		},
	};
};

creator.postcss = true;

export default creator;

