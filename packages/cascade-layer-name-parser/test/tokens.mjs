import { parse } from '@csstools/cascade-layer-name-parser';
import assert from 'node:assert';

// The "tokens" function exists for API parity with other parser tools.
// It's value is the same as "parts".
function tokensAndPartsAreEqual(layerNames) {
	for (let i = 0; i < layerNames.length; i++) {
		const layerName = layerNames[i];
		assert.deepEqual(
			layerName.tokens(),
			layerName.parts,
		);
	}
}

{
	tokensAndPartsAreEqual(parse('alpha'));
	tokensAndPartsAreEqual(parse('beta'));

	tokensAndPartsAreEqual(parse('alpha.one'));
	tokensAndPartsAreEqual(parse('alpha.two.other2'));
	tokensAndPartsAreEqual(parse('alpha.two'));
	tokensAndPartsAreEqual(parse('alpha.one.other1'));

	tokensAndPartsAreEqual(parse('delta'));
	tokensAndPartsAreEqual(parse('alpha'));

	tokensAndPartsAreEqual(parse('gamma.sub-layer.foo'));
}
