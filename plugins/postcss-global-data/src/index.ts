import type { ChildNode, Plugin, PluginCreator, Root } from 'postcss';
import { parseImport } from './parse-import';

/** postcss-global-data plugin options */
export type pluginOptions = {
	/** List of files to be used as context */
	files?: Array<string>,
	/** Remove nodes in a separate plugin object, this object can be added later in your list of plugins */
	lateRemover?: boolean,
	/** Add global CSS to the start of files, defaults to `false` */
	prepend?: boolean,
};

const pluginName = 'postcss-global-data';

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			files: [],
			lateRemover: false,
			prepend: false,
		},
		// Provided options
		opts,
	);

	function insert(destination: Root, source: Root, set: { add: (_: ChildNode) => void }): void {
		if (!options.prepend) {
			source.each((node) => {
				destination.append(node);
				set.add(node);
			});

			return;
		}

		const nodes = Array.from(source.nodes);
		nodes.reverse();

		nodes.forEach((node) => {
			destination.prepend(node);
			set.add(node);
		});
	}

	if (!options.lateRemover) {
		return {
			postcssPlugin: pluginName,
			prepare(): Plugin {
				const importedCSS = new Set<ChildNode>();
				const importedFiles = new Set<string>();

				return {
					postcssPlugin: pluginName,
					Once(root, postcssHelpers): void {
						options.files.forEach((file) => {
							const newCSS = parseImport(root, postcssHelpers, file, importedFiles);
							if (!newCSS) {
								return;
							}

							insert(root, newCSS, importedCSS);
						});
					},
					OnceExit(): void {
						importedCSS.forEach((node) => {
							node.remove();
						});

						importedFiles.clear();
						importedCSS.clear();
					},
				};
			},
		}
	}

	const importedCSS = new WeakSet<ChildNode>();

	return {
		postcssPlugin: pluginName,
		plugins: [
			{
				postcssPlugin: pluginName,
				prepare(): Plugin {
					const importedFiles = new Set<string>();

					return {
						postcssPlugin: pluginName,
						Once(root, postcssHelpers): void {
							options.files.forEach((file) => {
								const newCSS = parseImport(root, postcssHelpers, file, importedFiles);
								if (!newCSS) {
									return;
								}

								insert(root, newCSS, importedCSS);
							});
						},
						OnceExit(): void {
							importedFiles.clear();
						},
					};
				},
			},
			{
				postcssPlugin: pluginName + '/late-remover',
				OnceExit(root): void {
					root.each((node) => {
						if (importedCSS.has(node)) {
							node.remove();
						}
					});
				},
			}
		]
	}
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
