import type { AtRule, PluginCreator } from 'postcss';
import type { StringNode } from 'postcss-value-parser';
import valueParser from 'postcss-value-parser';
import { hasFallback } from '@csstools/utilities';

const keywords = [
	'woff',
	'truetype',
	'opentype',
	'woff2',
	'embedded-opentype',
	'collection',
	'svg',
];

/** postcss-font-format-keywords plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts?.preserve) : false;

	return {
		postcssPlugin: 'postcss-font-format-keywords',
		Declaration(decl): void {
			if (decl.prop.toLowerCase() !== 'src') {
				return;
			}

			if (!decl.value.toLowerCase().includes('format(')) {
				// No point in doing parsing if no format is specified
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			const parent = decl.parent;
			if (!parent || parent.type !== 'atrule') {
				return;
			}

			const atRule = parent as AtRule;
			if (atRule.name.toLowerCase() !== 'font-face') {
				return;
			}

			const value = valueParser(decl.value);

			value.walk((node) => {
				if (node.type !== 'function' || node.value.toLowerCase() !== 'format') {
					return;
				}

				node.nodes.forEach((child) => {
					if (child.type !== 'word' || !keywords.includes(child.value.toLowerCase())) {
						return;
					}

					child.value = valueParser.stringify({
						type: 'string',
						value: child.value,
						quote: '"',
					} as StringNode);
				});
			});

			if (value.toString() === decl.value) {
				return;
			}

			decl.cloneBefore({ value: value.toString() });

			if (!preserve) {
				decl.remove();
			}
		},
	};
};

creator.postcss = true;

export default creator;

