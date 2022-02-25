import type { Container } from 'postcss';

function postcssCascadeLayers(opts) {
	return {
		postcssPlugin: 'postcss-cascade-layers',
		Once(root: Container) {
			root.walkAtRules((atRule) => {
				if (atRule.name !== 'layer') {
					return;
				}

				if (atRule.nodes && atRule.nodes.length) {
					console.log(atRule.name, 'layer name', atRule.params);
					// parse .params as layer name
					// replace layer.name with :is()
					// add layer.param after
					// duplicate node contents

					console.log('nodes', atRule.nodes);
				} else {
					console.log(atRule.name, atRule.params);
					// parse .params as list of layer names
				/*
					pattern:
					@layer foo foo.baz;
				*/
				}
			});
		},
	};
}

postcssCascadeLayers.postcss = true;

export default postcssCascadeLayers;
