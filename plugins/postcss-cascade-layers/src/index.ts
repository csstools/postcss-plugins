import { Container } from "postcss";

function postcssCascadeLayers(opts) {
	return {
		postcssPlugin: "postcss-cascade-layers",
		Once(root: Container) {
			let layerCount = 0;
			let layerOrder = {};

			// 1st walkthrough to rename anon layers and store state (no modification of layer styles)
			root.walkAtRules("layer", (atRule) => {
				// give anonymous layers a name
				if (!atRule.params) {
					atRule.params = `anon${layerCount}`;
				}

				layerCount += 1;
				layerOrder[atRule.params] = layerCount;
			});

			// 2nd walkthrough to transform unlayered styles - need highest specificity (layerCount + 1)
			// root.walkRules((rule) => {
			// 	console.log(rule, "second walkthrough");
			// });

			// 3rd walkthrough to transform layered styles:
			//  - move out styles from atRule, insert before: https://postcss.org/api/#container-insertbefore
			//  - delete empty atRule
			//  - give selectors the specifity they need based on layerPriority state
			// root.walkAtRules((atRule) => {
			// 	console.log(atRule, "third walkthrough");
			// });
		},
	};
}

postcssCascadeLayers.postcss = true;

export default postcssCascadeLayers;
