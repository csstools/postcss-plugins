import type { PluginCreator } from 'postcss';
import { ShorthandProperty, shorthandPropertyFromAtRule } from './shorthand-property';
import fs from 'fs';
import path from 'path';
import { generateVSCodeCustomDataInDirectory } from './vscode-custom-data';

type pluginOptions = {
	atRuleName?: string,
	generateVSCodeCustomDataInDirectory?: string
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		atRuleName: 'csstools-shorthand-property',
		generateVSCodeCustomDataInDirectory: '',
	}, opts);

	return {
		postcssPlugin: 'postcss-custom-shorthands',
		prepare: () => {
			const shorthands: Map<string, ShorthandProperty> = new Map();

			return {
				Once(root) {
					root.walkAtRules((atRule) => {
						if (atRule.name.toLowerCase() !== options.atRuleName.toLowerCase()) {
							return;
						}

						const shorthand = shorthandPropertyFromAtRule(atRule);
						if (!shorthand) {
							return;
						}

						shorthands.set(atRule.params.trim(), shorthand);
						atRule.remove();
					});

					if (options.generateVSCodeCustomDataInDirectory) {
						fs.writeFileSync(path.join(options.generateVSCodeCustomDataInDirectory, 'custom-shorthands.css-data.json'), JSON.stringify(
							generateVSCodeCustomDataInDirectory(options.atRuleName, shorthands),
							null, '\t',
						));
					}
				},
				Declaration(decl) {
					if (shorthands.has(decl.prop)) {
						shorthands.get(decl.prop).generate(decl);
					}
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;

