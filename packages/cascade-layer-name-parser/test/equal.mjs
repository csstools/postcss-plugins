import { parse } from '@csstools/cascade-layer-name-parser';
import assert from 'node:assert';

{
	const layerNames = [
		...parse('alpha'),
		...parse('beta'),
		...parse('alpha.one'),
		...parse('alpha.two.other2'),
		...parse('alpha.two'),
		...parse('alpha.one.other1'),
		...parse('delta'),
		...parse('gamma.sub-layer.foo'),
	];

	for (let i = 0; i < layerNames.length; i++) {
		const ii = layerNames[i];


		for (let j = 0; j < layerNames.length; j++) {
			const jj = layerNames[j];

			assert.equal(ii.equal(jj), ii === jj);
		}
	}
}
