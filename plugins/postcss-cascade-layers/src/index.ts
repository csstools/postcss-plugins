import { Container, AtRule, Node} from "postcss";

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

				let hasNestedLayers = false;
				let hasUnlayeredStyles = false;

				// check for where a layer has nested layers AND styles outside of those layers
				atRule.each((node) => {
					if (node.type == "atrule") {
						hasNestedLayers = true;
					} else if (node.type == "rule") {
						hasUnlayeredStyles = true;
					}
				});

				if (hasNestedLayers && hasUnlayeredStyles) {
					//create new final layer via cloning, empty it
					const implicitLayer = atRule.clone({
						params: `${atRule.params}-implicit`,
					});
					implicitLayer.each((node) => {
						node.remove();
					});

					// insert new layer
					atRule.append(implicitLayer);

					// go through the unlayered rules, clone, and delete from top level atRule
					atRule.each((node) => {
						if (node.type == "rule") {
							implicitLayer.append(node.clone());
							node.remove();
						}
					});
				}
			});

			root.walkAtRules("layer", (layer) => {
				layerCount += 1;
				layerOrder[layer.params] = layerCount;
			});

			// functions for 2nd walkthrough
			function generateNot(specificity: number) {
				let list = ''; for (let i = 0; i < specificity; i++) {
					list += '#\\#'; // something short but still very uncommon
				} return `:not(${list})`;
			}
			function hasLayerAtRuleAncestor(node: Node): boolean {
				let parent = node.parent;
				while (parent) {
					if (parent.type !== 'atrule') {
						parent = parent.parent; continue;
					}
					if ((parent as AtRule).name === 'layer') {
						 return true;
						}
						parent = parent.parent;
					}
					return false; }

					if (!layerCount) {
						// no layers, so nothing to transform.
						return;
						} // 2nd walkthrough to transform unlayered styles - need highest specificity (layerCount)
						root.walkRules((rule) => {
							if (hasLayerAtRuleAncestor(rule)) {
							  return;
								} rule.selectors = rule.selectors.map((selector) => {
									// Needs `postcss-selector-parser` to insert `:not()` before any pseudo elements like `::after`
									// This is a side track and can be fixed later.
									return `${generateNot(layerCount)} ${selector}`;
								});
							});

			// 3rd walkthrough to transform layered styles:
			//  - move out styles from atRule, insert before: https://postcss.org/api/#container-insertbefore
			//  - delete empty atRule
			//  - give selectors the specifity they need based on layerPriority state
			// root.walkAtRules((atRule) => {
			// 	console.log(atRule, "third walkthrough");
			// });
			console.log(layerOrder);
		},
	};
}

postcssCascadeLayers.postcss = true;

export default postcssCascadeLayers;
