import type { ChildNode, Plugin, PluginCreator } from 'postcss';
import { parseImport } from './parse-import';

/** postcss-global-data plugin options */
export type pluginOptions = {
	/** List of files to be used as context */
	files?: Array<string>,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			files: [],
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-global-data',
		prepare(): Plugin {
			let importedFiles = new Set<string>();
			let importedCSS = new Set<ChildNode>();

			return {
				postcssPlugin: 'postcss-global-data',
				Once(root, postcssHelpers): void {
					options.files.forEach((file) => {
						if (importedFiles.has(file)) {
							return;
						}

						const newCSS = parseImport(root, postcssHelpers, file, importedFiles);
						if (!newCSS) {
							return;
						}

						newCSS.each((node) => {
							root.append(node);
							importedCSS.add(node);
						});
					});
				},
				OnceExit(): void {
					importedCSS.forEach((node) => {
						node.remove();
					});
					importedCSS = new Set<ChildNode>();
					importedFiles = new Set<string>();
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
