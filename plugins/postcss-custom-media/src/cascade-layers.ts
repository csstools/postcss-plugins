import type { AtRule, Container, Document, Node, Root } from 'postcss';
import { LayerName, parse as parseCascadeLayerNames } from '@csstools/cascade-layer-name-parser';

export function collectCascadeLayerOrder(root: Root) {
	const references: Map<Node, LayerName> = new Map();
	const referencesForLayerNames: Map<Node, LayerName> = new Map();

	const layers: Array<LayerName> = [];
	const anonLayerCounter = 1;

	root.walkAtRules((node) => {
		if (node.name.toLowerCase() !== 'layer') {
			return;
		}

		{
			// We do not want to process anything except for `@layer` rules
			// and maybe `@layer` rules inside other `@later` rules.
			//
			// Traverse up the tree and abort when we find something unexpected
			let parent: Container | Document = node.parent;
			while (parent) {
				if (parent.type === 'atrule' && (parent as AtRule).name.toLowerCase() === 'layer') {
					parent = parent.parent;
					continue;
				}

				if (parent === node.root()) {
					break;
				}

				return;
			}
		}

		let layerParams;
		if (node.nodes) { // @layer { .foo {} }
			layerParams = normalizeLayerName(node.params, anonLayerCounter);
		} else if (node.params.trim()) { // @layer a, b;
			layerParams = node.params;
		} else { // @layer;
			return;
		}

		let currentLayerNames = parseCascadeLayerNames(layerParams, {
			onParseError(error) {
				throw node.error(error.message);
			},
		});

		{
			// Stitch the layer names of the current node together with those of ancestors.
			// @layer foo { @layer bar { .any {} } }
			// -> "foo.bar"
			let parent: Container | Document = node.parent;
			while (parent && parent.type === 'atrule' && (parent as AtRule).name.toLowerCase() === 'layer') {
				const parentLayerName = referencesForLayerNames.get(parent);
				if (!parentLayerName) {
					parent = parent.parent;
					continue;
				}

				currentLayerNames = currentLayerNames.map((layerName) => {
					return parseCascadeLayerNames(parentLayerName.toString().trim() + '.' + layerName.toString().trim(), {
						onParseError(error) {
							throw node.error(error.message);
						},
					})[0];
				});

				parent = parent.parent;
			}
		}

		// Add the new layer names to "layers".
		addLayerToModel(layers, currentLayerNames);

		if (node.nodes) {
			// Implicit layers have higher priority than nested layers.
			// This requires some trickery.
			//
			// 1. connect the node to the real layer
			// 2. connect the node to an implicit layer
			// 3. use the real layer to resolve other real layer names
			// 4. use the implicit layer later

			const implicitLayerName = parseCascadeLayerNames(currentLayerNames[0].toString().trim() + '.' + 'csstools-implicit-layer')[0];
			references.set(node, implicitLayerName);
			referencesForLayerNames.set(node, currentLayerNames[0]);
		}
	});

	for (const layerName of references.values()) {
		// Add the implicit layer names to "layers".
		// By doing this after all the real layers we are sure that the implicit layers have the right order in "layers".
		addLayerToModel(layers, [layerName]);
	}

	const out: WeakMap<Node, number> = new WeakMap();
	for (const [node, layerName] of references) {
		const layerNameSegments = layerName.segments();
		out.set(node, layers.findIndex((x) => {
			const cursorSegments = x.segments();
			if (cursorSegments.length !== layerNameSegments.length) {
				return false;
			}

			for (let i = 0; i < cursorSegments.length; i++) {
				const a = cursorSegments[i];
				const b = layerNameSegments[i];
				if (a !== b) {
					return false;
				}
			}

			return true;
		}));
	}

	return out;
}

// -1          : node was not found
// any number  : node was found, higher numbers have higher priority
// Infinity    : node wasn't layered, highest priority
export function cascadeLayerNumberForNode(node: Node, layers: WeakMap<Node, number>) {
	if (node.parent && node.parent.type === 'atrule' && (node.parent as AtRule).name.toLowerCase() === 'layer') {
		if (!layers.has(node.parent)) {
			return -1;
		}

		return layers.get(node.parent);
	}

	return Infinity;
}

function normalizeLayerName(layerName, counter) {
	return layerName.trim() || `csstools-anon-layer--${counter++}`;
}

// Insert new items after the most similar current item
//
// [["a", "b"]]
// insert "a.first"
// [["a", "a.first", "b"]]
//
// [["a", "a.first", "a.second", "b"]]
// insert "a.first.foo"
// [["a", "a.first", "a.first.foo", "a.second", "b"]]
//
// [["a", "b"]]
// insert "c"
// [["a", "b", "c"]]
function addLayerToModel(layers: Array<LayerName>, currentLayerNames: Array<LayerName>) {
	currentLayerNames.forEach((layerName) => {
		const allLayerNameParts = layerName.segments();

		ALL_LAYER_NAME_PARTS_LOOP: for (let x = 0; x < allLayerNameParts.length; x++) {
			const layerNameSlice = layerName.slice(0, x + 1);
			const layerNameParts = layerNameSlice.segments();

			let layerWithMostEqualSegments = -1;
			let mostEqualSegments = 0;

			for (let i = 0; i < layers.length; i++) {
				const existingLayerParts = layers[i].segments();

				let numberOfEqualSegments = 0;

				LAYER_PARTS_LOOP: for (let j = 0; j < existingLayerParts.length; j++) {
					const existingLayerPart = existingLayerParts[j];
					const layerPart = layerNameParts[j];

					if (layerPart === existingLayerPart && (j + 1) === layerNameParts.length) {
						continue ALL_LAYER_NAME_PARTS_LOOP; // layer already exists in model
					}

					if (layerPart === existingLayerPart) {
						numberOfEqualSegments++;
						continue;
					}

					if (layerPart !== existingLayerPart) {
						break LAYER_PARTS_LOOP;
					}
				}

				if (numberOfEqualSegments >= mostEqualSegments) {
					layerWithMostEqualSegments = i;
					mostEqualSegments = numberOfEqualSegments;
				}
			}

			if (layerWithMostEqualSegments === -1) {
				layers.push(layerNameSlice);
			} else {
				layers.splice(layerWithMostEqualSegments + 1, 0, layerNameSlice);
			}
		}
	});

	return layers;
}
