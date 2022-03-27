import type { Declaration, Result } from 'postcss';
import valueParser from 'postcss-value-parser';
import { Token } from './data-formats/base/token';

export function onCSSValue(tokens: Map<string, Token>, result: Result, decl: Declaration) {
	const valueAST = valueParser(decl.value);

	valueAST.walk(node => {
		if (node.type !== 'function' || node.value !== 'design-token') {
			return;
		}

		if (!node.nodes || node.nodes.length !== 1) {
			decl.warn(result, 'Expected a single string literal for the design-token function.');
			return;
		}

		if (node.nodes[0].type !== 'string') {
			decl.warn(result, 'Expected a single string literal for the design-token function.');
			return;
		}

		const replacement = tokens.get(node.nodes[0].value);
		if (!replacement) {
			decl.warn(result, `design-token: "${node.nodes[0].value}" is not configured.`);
			return;
		}

		node.value = replacement.cssValue();
		node.nodes = undefined;
	});

	return String(valueAST);
}
