// overflow shorthand property matcher
import valueParser from 'postcss-value-parser';

const creator = opts => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;

	return {
		postcssPlugin: 'postcss-overflow-shorthand',
		Declaration: (decl, {result}) => {
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
			} catch(err) {
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

			if (!preserve) {
				decl.remove();
			}
		},
	};
};

creator.postcss = true;

export default creator;
