import type { AtRule, Container, Document, Node, Root } from 'postcss';
import { LayerName, parse as parseCascadeLayerNames, addLayerToModel } from '@csstools/cascade-layer-name-parser';

const implicitLayerNameForCloning = parseCascadeLayerNames('csstools-implicit-layer')[0];

export function collectCascadeLayerOrder(root: Root): WeakMap<Node, number> {
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
			let parent: Container | Document | undefined = node.parent;
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

		let currentLayerNames = parseCascadeLayerNames(layerParams);
		if (!currentLayerNames?.length) {
			return;
		}

		{
			// Stitch the layer names of the current node together with those of ancestors.
			// @layer foo { @layer bar { .any {} } }
			// -> "foo.bar"
			let parent: Container | Document | undefined = node.parent;
			while (parent && parent.type === 'atrule' && (parent as AtRule).name.toLowerCase() === 'layer') {
				const parentLayerName = referencesForLayerNames.get(parent);
				if (!parentLayerName) {
					parent = parent.parent;
					continue;
				}

				currentLayerNames = currentLayerNames.map((layerName) => {
					return parentLayerName.concat(layerName);
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

			const implicitLayerName = currentLayerNames[0].concat(implicitLayerNameForCloning);
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
		out.set(node, layers.findIndex((x) => {
			return layerName.equal(x);
		}));
	}

	return out;
}

// 0          : node was not found
// any number  : node was found, higher numbers have higher priority
// a very large number    : node wasn't layered, highest priority
export function cascadeLayerNumberForNode(node: Node, layers: WeakMap<Node, number>): number {
	if (node.parent && node.parent.type === 'atrule' && (node.parent as AtRule).name.toLowerCase() === 'layer') {
		if (!layers.has(node.parent)) {
			return 0;
		}

		return layers.get(node.parent)! + 1;
	}

	return 10_000_000;
}

function normalizeLayerName(layerName: string, counter: number): string {
	if (layerName.trim()) {
		return layerName;
	}

	return `csstools-anon-layer--${counter++}`;
}
