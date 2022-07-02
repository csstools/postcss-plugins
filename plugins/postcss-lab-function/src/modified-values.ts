import type { Declaration, Result } from 'postcss';
import type { ParsedValue, FunctionNode } from 'postcss-value-parser';
import valueParser from 'postcss-value-parser';
import { onCSSFunctionDisplayP3, onCSSFunctionSRgb } from './on-css-function';

export function modifiedValues(originalValue: string, decl: Declaration, result: Result, preserve: boolean): { rgb: string, displayP3: string } | undefined {
	let valueASTSRgb: ParsedValue | undefined;

	try {
		valueASTSRgb = valueParser(originalValue);
	} catch (error) {
		decl.warn(
			result,
			`Failed to parse value '${originalValue}' as a lab or lch function. Leaving the original value intact.`,
		);
	}

	if (typeof valueASTSRgb === 'undefined') {
		return;
	}

	valueASTSRgb.walk((node) => {
		if (!node.type || node.type !== 'function') {
			return;
		}

		if (node.value.toLowerCase() !== 'lab' && node.value.toLowerCase() !== 'lch') {
			return;
		}

		onCSSFunctionSRgb(node as FunctionNode);
	});
	const modifiedValueSRgb = String(valueASTSRgb);

	if (modifiedValueSRgb === originalValue) {
		return;
	}

	// If sRGB parses correctly, display-p3 will as well.
	const valueASTSDisplayP3 = valueParser(originalValue);
	valueASTSDisplayP3.walk((node) => {
		if (!node.type || node.type !== 'function') {
			return;
		}

		if (node.value.toLowerCase() !== 'lab' && node.value.toLowerCase() !== 'lch') {
			return;
		}

		onCSSFunctionDisplayP3(node as FunctionNode, decl, result, preserve);
	});

	const modifiedValueDisplayP3 = String(valueASTSDisplayP3);

	return {
		rgb: modifiedValueSRgb,
		displayP3: modifiedValueDisplayP3,
	};
}
