import type { Node } from 'postcss-value-parser';
import valueParser from 'postcss-value-parser';
import { Root, Rule, Declaration } from 'postcss';

function isRgbaCssVariablesDecl(value: string): boolean {
	return /^rgba\(var\(/.test(value);
}

function getVariablefromParsed(parsed: Node[]): string {
	return parsed[0] && parsed[0].type === 'word' && parsed[0].value;
}

function getValidRgbaVariable(parsed: valueParser.ParsedValue): string {
	let result: string;
	parsed.walk(node => {
		if (node.type === 'function' && node.value === 'var') {
			if(!result) {
				result = getVariablefromParsed(node.nodes);
			}
		}
	});

	return result;
}

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
			const variableName = getValidRgbaVariable(valueParser(decl.value));
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
