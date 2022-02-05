import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import valueParser from 'postcss-value-parser';
import type { ParsedValue, FunctionNode } from 'postcss-value-parser';
import type { AtRule, Container, Declaration, Node, Result } from 'postcss';
import { onCSSFunctionDisplayP3 } from './on-css-function';
import { hasFallback } from './has-fallback-decl';
import type { PluginCreator } from 'postcss';

/** Transform oklab() and oklch() functions in CSS. */
const postcssPlugin: PluginCreator<{ preserve: boolean }> = (opts?: { preserve: boolean }) => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false;

	return {
		postcssPlugin: 'postcss-oklab-function',
		Declaration: (decl: Declaration, { result }: { result: Result }) => {
			if (hasFallback(decl)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl)) {
				return;
			}

			const originalValue = decl.value;
			if (!(/(^|[^\w-])(oklab|oklch)\(/i.test(originalValue))) {
				return;
			}

			const modified = modifiedValues(originalValue, decl, result);
			if (typeof modified === 'undefined') {
				return;
			}

			if (originalValue === modified) {
				return;
			}

			if (preserve) {
				decl.cloneBefore({ value: modified });
			} else {
				decl.value = modified;
			}
		},
		RuleExit: (rule, { postcss }) => {
			if (!preserve) {
				return;
			}

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

function modifiedValues(originalValue: string, decl: Declaration, result: Result): string | undefined {
	let valueASTSDisplayP3: ParsedValue | undefined;

	try {
		valueASTSDisplayP3 = valueParser(originalValue);
	} catch (error) {
		decl.warn(
			result,
			`Failed to parse value '${originalValue}' as a oklab or oklch function. Leaving the original value intact.`,
		);
	}

	if (typeof valueASTSDisplayP3 === 'undefined') {
		return;
	}

	valueASTSDisplayP3.walk((node) => {
		if (!node.type || node.type !== 'function') {
			return;
		}

		if (node.value !== 'oklab' && node.value !== 'oklch') {
			return;
		}

		onCSSFunctionDisplayP3(node as FunctionNode);
	});

	return String(valueASTSDisplayP3);
}
