import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import valueParser from 'postcss-value-parser';
import type { ParsedValue, FunctionNode } from 'postcss-value-parser';
import type { Declaration, Result } from 'postcss';
import { onCSSFunctionDisplayP3, onCSSFunctionSRgb } from './on-css-function';
import { hasFallback } from './has-fallback-decl';
import type { PluginCreator } from 'postcss';

/** Transform lab() and lch() functions in CSS. */
const postcssPlugin: PluginCreator<{ preserve: boolean, displayP3: boolean }> = (opts?: { preserve: boolean, displayP3: boolean }) => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false;
	const displayP3Enabled = 'displayP3' in Object(opts) ? Boolean(opts.displayP3) : false;

	return {
		postcssPlugin: 'postcss-lab-function',
		Declaration: (decl: Declaration, { result }: { result: Result }) => {
			if (hasFallback(decl)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl)) {
				return;
			}

			const originalValue = decl.value;
			if (!(/(^|[^\w-])(lab|lch)\(/i.test(originalValue))) {
				return;
			}

			const modified = modifiedValues(originalValue, decl, result);
			if (typeof modified === 'undefined') {
				return;
			}

			if (preserve) {
				decl.cloneBefore({ value: modified.rgb });

				if (displayP3Enabled) {
					decl.cloneBefore({ value: modified.displayP3 });
				}
			} else {
				decl.cloneBefore({ value: modified.rgb });

				if (displayP3Enabled) {
					decl.cloneBefore({ value: modified.displayP3 });
				}

				decl.remove();
			}
		},
		RuleExit: (rule, { postcss }) => {
			const atSupportsRules = [];
			const variableNames = new Set<string>();

			rule.each((decl) => {
				if (decl.type !== 'decl') {
					return;
				}

				if (!decl.variable) {
					return;
				}

				if (!variableNames.has(decl.prop.toString())) {
					variableNames.add(decl.prop.toString());
					return;
				}

				const atSupports = postcss.atRule({ name: 'supports', params: `(${decl.prop}: ${decl.value})`, source: rule.source });
				const parentClone = rule.clone();
				parentClone.removeAll();

				parentClone.append(decl.clone());
				decl.remove();

				atSupports.append(parentClone);
				atSupportsRules.push(atSupports);
			});

			if (atSupportsRules.length === 0) {
				return;
			}

			atSupportsRules.reverse().forEach((atSupports) => {
				rule.after(atSupports);
			});
		},
	};
};

postcssPlugin.postcss = true;

export default postcssPlugin;

function modifiedValues(originalValue: string, decl: Declaration, result: Result): {rgb: string, displayP3: string} | undefined {
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

		if (node.value !== 'lab' && node.value !== 'lch') {
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

		if (node.value !== 'lab' && node.value !== 'lch') {
			return;
		}

		onCSSFunctionDisplayP3(node as FunctionNode);
	});

	const modifiedValueDisplayP3 = String(valueASTSDisplayP3);

	return {
		rgb: modifiedValueSRgb,
		displayP3: modifiedValueDisplayP3,
	};
}
