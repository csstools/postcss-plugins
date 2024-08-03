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
export function addLayerToModel(layers: Array<LayerName>, currentLayerNames: Array<LayerName>): void {
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
}
