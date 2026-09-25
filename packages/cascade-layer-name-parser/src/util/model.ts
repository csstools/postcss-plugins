import type { LayerName } from '../nodes/layer-name';

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

// The model grows by one entry per layer name segment.
// Insertion scans the existing model, so the cost is super-linear in its size.
// Bound it so that a small input can not exhaust memory and CPU.
const MAX_LAYERS = 4096;

export function addLayerToModel(layers: Array<LayerName>, currentLayerNames: Array<LayerName>): void {
	// `LayerName.segments()` allocates a new array on every call.
	// Keep the segments of the existing layers in sync with `layers`
	// instead of recomputing them inside the nested loops.
	const layerSegments: Array<Array<string>> = layers.map((layer) => layer.segments());

	currentLayerNames.forEach((layerName) => {
		const allLayerNameParts = layerName.segments();

		for (let x = 0; x < allLayerNameParts.length; x++) {
			const layerNameParts = allLayerNameParts.slice(0, x + 1);

			let layerWithMostEqualSegments = -1;
			let mostEqualSegments = 0;
			let alreadyExists = false;

			for (let i = 0; i < layers.length; i++) {
				const existingLayerParts = layerSegments[i];

				let numberOfEqualSegments = 0;

				for (let j = 0; j < existingLayerParts.length; j++) {
					const existingLayerPart = existingLayerParts[j];
					const layerPart = layerNameParts[j];

					if (layerPart === existingLayerPart && (j + 1) === layerNameParts.length) {
						alreadyExists = true; // layer already exists in model
						break;
					}

					if (layerPart === existingLayerPart) {
						numberOfEqualSegments++;
						continue;
					}

					break;
				}

				if (alreadyExists) {
					break;
				}

				if (numberOfEqualSegments >= mostEqualSegments) {
					layerWithMostEqualSegments = i;
					mostEqualSegments = numberOfEqualSegments;
				}
			}

		if (alreadyExists) {
			continue;
		}

		if (layers.length >= MAX_LAYERS) {
			throw new Error(`Too many cascade layers, reduce the complexity of your stylesheet.`);
		}

		const layerNameSlice = layerName.slice(0, x + 1);

		if (layerWithMostEqualSegments === -1) {
				layers.push(layerNameSlice);
				layerSegments.push(layerNameParts);
			} else {
				layers.splice(layerWithMostEqualSegments + 1, 0, layerNameSlice);
				layerSegments.splice(layerWithMostEqualSegments + 1, 0, layerNameParts);
			}
		}
	});
}
