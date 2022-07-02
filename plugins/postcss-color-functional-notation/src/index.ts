import valueParser from 'postcss-value-parser';
import type { ParsedValue, FunctionNode } from 'postcss-value-parser';
import type { Declaration, Postcss, Result } from 'postcss';
import onCSSFunction from './on-css-function';

import type { PluginCreator } from 'postcss';
import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';

/** Transform lab() and lch() functions in CSS. */
const postcssPlugin: PluginCreator<{ preserve: boolean }> = (opts?: { preserve: boolean }) => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false;

	return {
		postcssPlugin: 'postcss-color-functional-notation',
		Declaration: (decl: Declaration, { result, postcss }: { result: Result, postcss: Postcss }) => {
			if (hasSupportsAtRuleAncestor(decl)) {
				return;
			}

			const originalValue = decl.value;
			const lowerCaseValue = originalValue.toLowerCase();
			if (
				!lowerCaseValue.includes('rgb') &&
				!lowerCaseValue.includes('rgba') &&
				!lowerCaseValue.includes('hsl') &&
				!lowerCaseValue.includes('hsla')
			) {
				return;
			}

			let valueAST: ParsedValue|undefined;

			try {
				valueAST = valueParser(originalValue);
			} catch (error) {
				decl.warn(
					result,
					`Failed to parse value '${originalValue}' as a hsl or rgb function. Leaving the original value intact.`,
				);
			}

			if (typeof valueAST === 'undefined') {
				return;
			}

			valueAST.walk((node) => {
				if (!node.type || node.type !== 'function') {
					return;
				}

				const lowerCaseNodeValue = node.value.toLowerCase();

				if (
					lowerCaseNodeValue !== 'hsl' &&
					lowerCaseNodeValue !== 'hsla' &&
					lowerCaseNodeValue !== 'rgb' &&
					lowerCaseNodeValue !== 'rgba'
				) {
					return;
				}

				onCSSFunction(node as FunctionNode);
			});
			const modifiedValue = String(valueAST);

			if (modifiedValue === originalValue) {
				return;
			}

			if (preserve && decl.variable) {
				const parent = decl.parent;
				const atSupportsParams = '(color: rgb(0 0 0 / 0.5)) and (color: hsl(0 0% 0% / 0.5))';
				const atSupports = postcss.atRule({ name: 'supports', params: atSupportsParams, source: decl.source });

				const parentClone = parent.clone();
				parentClone.removeAll();

				parentClone.append(decl.clone());
				atSupports.append(parentClone);

				// Ensure correct order of @supports rules
				// Find the last one created by us or the current parent and insert after.
				let insertAfter = parent;
				let nextInsertAfter = parent.next();
				while (
					insertAfter &&
					nextInsertAfter &&
					nextInsertAfter.type === 'atrule' &&
					nextInsertAfter.name === 'supports' &&
					nextInsertAfter.params === atSupportsParams
				) {
					insertAfter = nextInsertAfter;
					nextInsertAfter = nextInsertAfter.next();
				}

				insertAfter.after(atSupports);

				decl.replaceWith(decl.clone({ value: modifiedValue }));
			} else if (preserve) {
				decl.cloneBefore({ value: modifiedValue });
			} else {
				decl.replaceWith(decl.clone({ value: modifiedValue }));
			}
		},
	};
};

postcssPlugin.postcss = true;

export default postcssPlugin;
