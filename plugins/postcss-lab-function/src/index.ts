import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import { parse, Root } from 'postcss-values-parser';
import type { Declaration, Postcss, Result } from 'postcss';
import onCSSFunction from './on-css-function';

import type { PluginCreator } from 'postcss';

/** Transform lab() and lch() functions in CSS. */
const postcssPlugin: PluginCreator<{ preserve: boolean }> = (opts?: { preserve: boolean }) => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false;

	return {
		postcssPlugin: 'postcss-lab-function',
		Declaration: (decl: Declaration, { result, postcss }: { result: Result, postcss: Postcss }) => {
			if (preserve && hasSupportsAtRuleAncestor(decl)) {
				return;
			}

			const originalValue = decl.value;
			if (!(/(^|[^\w-])(lab|lch)\(/i.test(originalValue))) {
				return;
			}

			let valueAST: Root|undefined;

			try {
				valueAST = parse(originalValue, { ignoreUnknownWords: true });
			} catch (error) {
				decl.warn(
					result,
					`Failed to parse value '${originalValue}' as a lab or hcl function. Leaving the original value intact.`,
				);
			}

			if (typeof valueAST === 'undefined') {
				return;
			}

			valueAST.walkType('func', onCSSFunction);
			const modifiedValue = String(valueAST);

			if (modifiedValue === originalValue) {
				return;
			}

			if (preserve && decl.variable) {
				const parent = decl.parent;
				const atSupportsParams = '(color: lab(0% 0 0)) and (color: lch(0% 0 0))';
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
