import type { AtRule, Container, Declaration, Node, Postcss, Result } from 'postcss';
import type { PluginCreator } from 'postcss';
import { atSupportsHwbParams, hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import { color } from '@csstools/css-color-parser';
import { hasFallback } from './has-fallback-decl';
import { isFunctionNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { serializeRGB, SyntaxFlag } from '@csstools/css-color-parser';
import { tokenize } from '@csstools/css-tokenizer';

const hwbFunctionRegex = /hwb\(/i;
const hwbNameRegex = /^hwb$/i;

/** postcss-hwb-function plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

/** Transform hwb() functions in CSS. */
const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts?.preserve) : false;

	return {
		postcssPlugin: 'postcss-hwb-function',
		Declaration: (decl: Declaration, { postcss }: { result: Result, postcss: Postcss }) => {
			const originalValue = decl.value;
			if (!hwbFunctionRegex.test(originalValue)) {
				return;
			}

			if (preserve && hasSupportsAtRuleAncestor(decl)) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			const replaced = replaceComponentValues(
				parseCommaSeparatedListOfComponentValues(tokenize({ css: originalValue })),
				(componentValue) => {
					if (isFunctionNode(componentValue) && hwbNameRegex.test(componentValue.getName())) {
						const colorData = color(componentValue);
						if (!colorData) {
							return;
						}

						if (colorData.syntaxFlags.has(SyntaxFlag.Experimental)) {
							return;
						}

						if (colorData.syntaxFlags.has(SyntaxFlag.HasNoneKeywords)) {
							return;
						}

						if (colorData.syntaxFlags.has(SyntaxFlag.RelativeColorSyntax)) {
							return;
						}

						return serializeRGB(colorData);
					}
				},
			);

			const modified = stringify(replaced);
			if (modified === originalValue) {
				return;
			}

			if (decl.variable && preserve && decl.parent) {
				const parent = decl.parent;
				const atSupports = postcss.atRule({ name: 'supports', params: atSupportsHwbParams, source: decl.source });

				const parentClone = parent.clone();
				parentClone.removeAll();

				parentClone.append(decl.clone());
				atSupports.append(parentClone);

				insertAtSupportsAfterCorrectRule(atSupports, parent, atSupportsHwbParams);

				decl.replaceWith(decl.clone({ value: modified }));
			} else if (preserve) {
				decl.cloneBefore({ value: modified });

			} else {
				decl.replaceWith(decl.clone({ value: modified }));
			}
		},
	};
};

postcssPlugin.postcss = true;

export default postcssPlugin;

function insertAtSupportsAfterCorrectRule(atSupports: AtRule, parent: Container<Node>, params: string) {
	// Ensure correct order of @supports rules
	// Find the last one created by us or the current parent and insert after.
	let insertAfter = parent;
	let nextInsertAfter = parent.next();
	while (
		insertAfter &&
		nextInsertAfter &&
		nextInsertAfter.type === 'atrule' &&
		nextInsertAfter.name.toLowerCase() === 'supports' &&
		nextInsertAfter.params === params
	) {
		insertAfter = nextInsertAfter;
		nextInsertAfter = nextInsertAfter.next();
	}

	insertAfter.after(atSupports);
}
