import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import valueParser from 'postcss-value-parser';
import type { ParsedValue, FunctionNode } from 'postcss-value-parser';
import type { AtRule, Container, Declaration, Node, Postcss, Result } from 'postcss';
import { onCSSFunctionDisplayP3, onCSSFunctionSRgb } from './on-css-function';
import { hasFallback } from './has-fallback-decl';
import type { PluginCreator } from 'postcss';

const atSupportsLabParams = '(color: lab(0% 0 0)) and (color: lch(0% 0 0))';
const atSupportsDisplayP3Params = '(color: color(display-p3 1 1 1))';

/** Transform lab() and lch() functions in CSS. */
const postcssPlugin: PluginCreator<{ preserve: boolean, displayP3: boolean }> = (opts?: { preserve: boolean, displayP3: boolean }) => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false;
	const displayP3Enabled = 'displayP3' in Object(opts) ? Boolean(opts.displayP3) : false;

	return {
		postcssPlugin: 'postcss-lab-function',
		Declaration: (decl: Declaration, { result, postcss }: { result: Result, postcss: Postcss }) => {
			if (hasFallback(decl)) {
				return;
			}

			if (preserve && hasSupportsAtRuleAncestor(decl)) {
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

			if (decl.variable) {
				const parent = decl.parent;

				if (preserve) {
					// Only wrap original in @supports if preserve is true.
					const atSupports = postcss.atRule({ name: 'supports', params: atSupportsLabParams, source: decl.source });

					const parentClone = parent.clone();
					parentClone.removeAll();

					parentClone.append(decl.clone());
					atSupports.append(parentClone);

					insertAtSupportsAfterCorrectRule(atSupports, parent, atSupportsLabParams);
				}

				if (displayP3Enabled) {
					// Always wrap display-p3 in @supports.
					const atSupports = postcss.atRule({ name: 'supports', params: atSupportsDisplayP3Params, source: decl.source });

					const parentClone = parent.clone();
					parentClone.removeAll();

					parentClone.append(decl.clone({ value: modified.displayP3 }));
					atSupports.append(parentClone);

					insertAtSupportsAfterCorrectRule(atSupports, parent, atSupportsDisplayP3Params);
				}

				decl.value = modified.rgb;
			} else if (preserve) {
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
			`Failed to parse value '${originalValue}' as a lab or hcl function. Leaving the original value intact.`,
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

function insertAtSupportsAfterCorrectRule(atSupports: AtRule, parent: Container<Node>, params: string) {
	// Ensure correct order of @supports rules
	// Find the last one created by us or the current parent and insert after.
	let insertAfter = parent;
	let nextInsertAfter = parent.next();
	while (
		insertAfter &&
		nextInsertAfter &&
		nextInsertAfter.type === 'atrule' &&
		nextInsertAfter.name === 'supports' &&
		nextInsertAfter.params === params
	) {
		insertAfter = nextInsertAfter;
		nextInsertAfter = nextInsertAfter.next();
	}

	insertAfter.after(atSupports);
}
