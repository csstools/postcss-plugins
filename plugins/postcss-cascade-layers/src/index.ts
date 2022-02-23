import type { PluginCreator } from 'postcss';

const creator: PluginCreator<{ color: string }> = (opts?: { color: string }) => {
	return {
		postcssPlugin: 'postcss-cascade-layers',
		Declaration(decl) {
			decl.remove();
		},
	};
};

creator.postcss = true;

export default creator;
