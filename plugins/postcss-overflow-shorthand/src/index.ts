import type { PluginCreator } from 'postcss';
import valueParser from 'postcss-value-parser';

/** postcss-overflow-shorthand plugin options */
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
		postcssPlugin: 'postcss-overflow-shorthand',
		Declaration(decl, { result }): void {
			if (decl.prop.toLowerCase() !== 'overflow') {
				return;
			}

			let xValue = '';
			let yValue = '';

			const originalValue = decl.value;
			try {
				const valueAST = valueParser(originalValue);
				const relevantNodes = valueAST.nodes.slice().filter((x) => {
					return x.type !== 'comment' && x.type !== 'space';
				});

				if (relevantNodes.length < 2) {
					return;
				}

				xValue = valueParser.stringify(relevantNodes[0]);
				yValue = valueParser.stringify(relevantNodes[1]);
			} catch {
				decl.warn(
					result,
					`Failed to parse value '${originalValue}' as a shorthand for "overflow". Leaving the original value intact.`,
				);

				return;
			}

			if (!xValue || !yValue) {
				return;
			}

			if (xValue.toLowerCase() === yValue.toLowerCase()) {
				decl.cloneBefore({
					value: xValue,
				});
			} else {
				decl.cloneBefore({
					prop: 'overflow-x',
					value: xValue,
				});

				decl.cloneBefore({
					prop: 'overflow-y',
					value: yValue,
				});
			}

			if (!options.preserve) {
				decl.remove();
			}
		},
	};
};

creator.postcss = true;

export default creator;
