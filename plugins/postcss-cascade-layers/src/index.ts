import type { Container } from 'postcss';

function postcssCascadeLayers(opts) {
	return {
		postcssPlugin: 'postcss-cascade-layers',
		Once(root: Container) {
			root.walkAtRules((atRule) => {
				if (atRule.name !== 'layer') {
					return;
				}

				// if layer anon, name
				if(atRule.params === '') {
					atRule.params = ` anon${(Math.random()).toString()}`;
				}

				if (atRule.nodes && atRule.nodes.length) {
					const atRuleClone = atRule.clone();
					atRuleClone.nodes.forEach((node) => {
						const modifiedSelectors = node.selectors.map((selector) => {
							return `${selector}:not(<N times #foo>)`;
						});
						atRule.parent.insertBefore(atRule, node.clone({ selectors: modifiedSelectors }));
					});

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
