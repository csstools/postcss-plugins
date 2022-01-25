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
		AtRule: {
			'font-face'(atRule) {
				if (atRule.name !== 'font-face') {
					// Case sensitive
					return;
				}

				atRule.walkDecls('src', decl => {
					if (!decl.value.includes('format(')) {
						// No point in doing parsing if no format is specified
						return;
					}

					const value = valueParser(decl.value);

					value.walk((node) => {
						if (node.type !== 'function' || node.value !== 'format') {
							return;
						}

						node.nodes.forEach((child) => {
							if (child.type !== 'word' || !keywords.includes(child.value)) {
								return;
							}

							child.value = valueParser.stringify({
								type: 'string',
								value: child.value,
								quote: '"',
							} as StringNode);
						});
					});

					if (preserve) {
						decl.cloneBefore({ value: value.toString() });
					} else {
						decl.value = value.toString();
					}
				});
			},
		},
	};
};

creator.postcss = true;

export default creator;

