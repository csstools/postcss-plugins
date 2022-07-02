import type { PluginCreator } from 'postcss';
import valueParser, { StringNode } from 'postcss-value-parser';

const keywords = [
	'woff',
	'truetype',
	'opentype',
	'woff2',
	'embedded-opentype',
	'collection',
	'svg',
];

const creator: PluginCreator<{ preserve: boolean }> = (opts?: { preserve: boolean }) => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false;

	return {
		postcssPlugin: 'postcss-font-format-keywords',
		AtRule(atRule) {
			if (atRule.name.toLowerCase() !== 'font-face') {
				return;
			}

			atRule.walkDecls(decl => {
				if (decl.prop.toLowerCase() !== 'src') {
					return;
				}

				if (!decl.value.toLowerCase().includes('format(')) {
					// No point in doing parsing if no format is specified
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
			});
		},
	};
};

creator.postcss = true;

export default creator;

