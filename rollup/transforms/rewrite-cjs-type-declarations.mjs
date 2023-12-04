export function rewriteCjsTypeDeclarations() {
	return {
		name: 'rewrite-cjs-type-declarations',
		generateBundle (_, bundle) {
			if (
				bundle['index.d.cts']?.source &&
				bundle['index.d.cts'].source.includes('declare const creator: PluginCreator')
			) {
				bundle['index.d.cts'].source = bundle['index.d.cts'].source.replace(
					'export { creator as default };',
					'export = creator;',
				);

				bundle['index.d.cts'].source = bundle['index.d.cts'].source.replace(
					'export { creator as default, pluginOptions };',
					'export type { pluginOptions };\nexport = creator;',
				);

				bundle['index.d.ts'] = {
					...bundle['index.d.cts'],
				};

				bundle['index.d.ts'].fileName = 'index.d.ts';
			} else if (
				bundle['index.d.cts']?.source
			) {
				bundle['index.d.ts'] = {
					...bundle['index.d.cts'],
				};

				bundle['index.d.ts'].fileName = 'index.d.ts';
			}
		},
	};
}
