import type { Node } from 'postcss-value-parser';
import valueParser from 'postcss-value-parser';
import { Root, Declaration } from 'postcss';
import { getValueFromParsedVariable, isRgbaCssVariablesDecl } from './utils';

type OutputProps = {
	decl: Declaration,
	variableName: string,
}

export default function getRgbaVariables(root: Root): Set<OutputProps> {
	const output: Set<OutputProps> = new Set();

	root.walkDecls(decl => {
		if (isRgbaCssVariablesDecl(decl.value)) {
			// console.log(decl.value);
			// console.dir(valueParser(decl.value), { depth: null });
			const variableName = getValueFromParsedVariable(valueParser(decl.value));
			// console.dir(variableName, { depth: null });
			if (variableName) {
				output.add({
					decl,
					variableName,
				});
			}
		}
	});


	// console.dir(output, { depth: null });

	return output;
}
