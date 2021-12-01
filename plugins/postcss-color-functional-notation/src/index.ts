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
			if (preserve && hasSupportsAtRuleAncestor(decl)) {
				return;
			}

			const originalValue = decl.value;
			if (!(/(^|[^\w-])(hsla?|rgba?)\(/i.test(originalValue))) {
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

				if (
					node.value !== 'hsl' &&
					node.value !== 'hsla' &&
					node.value !== 'rgb' &&
					node.value !== 'rgba'
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

				decl.value = modifiedValue;
			} else if (preserve) {
				decl.cloneBefore({ value: modifiedValue });
			} else {
				decl.value = modifiedValue;
			}
		},
	};
};

postcssPlugin.postcss = true;

export default postcssPlugin;
