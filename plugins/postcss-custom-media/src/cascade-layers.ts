import type { AtRule, Container, Document, Node, Root } from 'postcss';

export function collectCascadeLayerOrder(root: Root) {
	const references: Map<Node, string> = new Map();
	const referencesForLayerNames: Map<Node, string> = new Map();

	const layers: Array<Array<string>> = [];
	const anonLayerCounter = 1;

	root.walkAtRules((node) => {
		if (node.name.toLowerCase() !== 'layer') {
			return;
		}

		{
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

		let currentLayerNames = [];
		if (node.nodes) {
			currentLayerNames.push(normalizeLayerName(node.params, anonLayerCounter));
		} else if (node.params.trim()) {
			currentLayerNames = node.params.split(',').map((layerName) => {
				return layerName.trim();
			});
		} else {
			// `@layer;`
			return;
		}

		{
			let parent: Container | Document = node.parent;
			while (parent && parent.type === 'atrule' && (parent as AtRule).name.toLowerCase() === 'layer') {
				const parentLayerName = referencesForLayerNames.get(parent);
				if (!parentLayerName) {
					parent = parent.parent;
					continue;
				}

				currentLayerNames = currentLayerNames.map((layerName) => {
					return parentLayerName + '.' + layerName;
				});

				parent = parent.parent;
			}
		}

		addLayerToModel(layers, currentLayerNames);

		if (node.nodes) {
			const implicitLayerName = currentLayerNames[0] + '.' + 'csstools-implicit-layer';
			references.set(node, implicitLayerName);
			referencesForLayerNames.set(node, currentLayerNames[0]);
		}
	});

	for (const layerName of references.values()) {
		addLayerToModel(layers, [layerName]);
	}

	const finalLayers = layers.map((x) => x.join('.'));

	const out: WeakMap<Node, number> = new WeakMap();
	for (const [node, layerName] of references) {
		out.set(node, finalLayers.indexOf(layerName));
	}

	return out;
}

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

function addLayerToModel(layers, currentLayerNames) {
	currentLayerNames.forEach((layerName) => {
		const allLayerNameParts = layerName.split('.');

		ALL_LAYER_NAME_PARTS_LOOP: for (let x = 0; x < allLayerNameParts.length; x++) {
			const layerNameParts = allLayerNameParts.slice(0, x + 1);

			let layerWithMostEqualSegments = -1;
			let mostEqualSegments = 0;

			for (let i = 0; i < layers.length; i++) {
				const existingLayerParts = layers[i];

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
				layers.push(layerNameParts);
			} else {
				layers.splice(layerWithMostEqualSegments+1, 0, layerNameParts);
			}
		}
	});

	return layers;
}
