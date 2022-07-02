import valueParser from 'postcss-value-parser';
import type { ParsedValue, FunctionNode } from 'postcss-value-parser';
import type { Declaration, Result } from 'postcss';
import { onCSSFunctionSRgb } from './on-css-function';

export function modifiedValues(originalValue: string, decl: Declaration, result: Result, preserve: boolean): string | undefined {
	let valueASTSRgb: ParsedValue | undefined;

	try {
		valueASTSRgb = valueParser(originalValue);
	} catch (error) {
		decl.warn(
			result,
			`Failed to parse value '${originalValue}' as a color function. Leaving the original value intact.`,
		);
	}

	if (typeof valueASTSRgb === 'undefined') {
		return;
	}

	valueASTSRgb.walk((node) => {
		if (!node.type || node.type !== 'function') {
			return;
		}

		if (node.value.toLowerCase() !== 'color') {
			return;
		}

		onCSSFunctionSRgb(node as FunctionNode, decl, result, preserve);
	});
	const modifiedValueSRgb = String(valueASTSRgb);

	if (modifiedValueSRgb === originalValue) {
		return;
	}

	return modifiedValueSRgb;
}
