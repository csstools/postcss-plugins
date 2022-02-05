import { atSupportsParams, hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import valueParser from 'postcss-value-parser';
import type { ParsedValue, FunctionNode } from 'postcss-value-parser';
import type { AtRule, Container, Declaration, Node, Postcss, Result } from 'postcss';
import { onCSSFunctionDisplayP3 } from './on-css-function';
import { hasFallback } from './has-fallback-decl';
import type { PluginCreator } from 'postcss';

/** Transform oklab() and oklch() functions in CSS. */
const postcssPlugin: PluginCreator<{ preserve: boolean }> = (opts?: { preserve: boolean }) => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false;

	return {
		postcssPlugin: 'postcss-oklab-function',
		Declaration: (decl: Declaration, { result, postcss }: { result: Result, postcss: Postcss }) => {
			if (hasFallback(decl)) {
				return;
			}

			if (preserve && hasSupportsAtRuleAncestor(decl)) {
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

			if (decl.variable) {
				const parent = decl.parent;

				if (preserve) {
					// Only wrap original in @supports if preserve is true.
					const atSupports = postcss.atRule({ name: 'supports', params: atSupportsParams, source: decl.source });

					const parentClone = parent.clone();
					parentClone.removeAll();

					parentClone.append(decl.clone());
					atSupports.append(parentClone);

					insertAtSupportsAfterCorrectRule(atSupports, parent, atSupportsParams);
				}

				decl.value = modified;
			} else if (preserve) {
				decl.cloneBefore({ value: modified });
			} else {
				decl.value = modified;
			}
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
