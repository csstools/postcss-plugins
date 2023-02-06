import type { ChildNode, PluginCreator } from 'postcss';
import { parseImport } from './parse-import';

/** postcss-global-data plugin options */
export type pluginOptions = {
	/** List of files to be used as context */
	files?: [],
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
		prepare() {
			let importedFiles = new Set<string>();
			let importedCSS = new Set<ChildNode>();

			return {
				Once: (root) => {
					options.files.forEach((file) => {
						if (importedFiles.has(file)) {
							return;
						}

						const newCSS = parseImport(file, importedFiles);

						if (newCSS) {
							newCSS.each((node) => {
								root.append(node);
								importedCSS.add(node);
							});
						}
					});
				},
				OnceExit: () => {
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
