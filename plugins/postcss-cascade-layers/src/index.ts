import type { PluginCreator } from 'postcss';

const creator: PluginCreator<{ color: string }> = (opts?: { color: string }) => {
	return {
		postcssPlugin: 'postcss-cascade-layers',
		Declaration(decl) {
			if (decl.value === 'red') {
				if (opts && opts.color) {
					decl.value = opts.color;
				} else {
					decl.value = 'blue';
				}
			}
		},
	};
};

creator.postcss = true;

export default creator;
