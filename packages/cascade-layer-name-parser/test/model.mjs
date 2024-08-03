import { addLayerToModel, parse } from '@csstools/cascade-layer-name-parser';
import assert from 'node:assert';

{
	const model = [];

	addLayerToModel(model, parse('alpha'));
	addLayerToModel(model, parse('beta'));

	addLayerToModel(model, parse('alpha.one'));
	addLayerToModel(model, parse('alpha.two.other2'));
	addLayerToModel(model, parse('alpha.two'));
	addLayerToModel(model, parse('alpha.one.other1'));

	addLayerToModel(model, parse('delta'));
	addLayerToModel(model, parse('alpha'));

	addLayerToModel(model, parse('gamma.sub-layer.foo'));

	assert.deepEqual(
		model.map(x => x.toString()),
		[
			'alpha',
			'alpha.one',
			'alpha.one.other1',
			'alpha.two',
			'alpha.two.other2',
			'beta',
			'delta',
			'gamma',
			'gamma.sub-layer',
			'gamma.sub-layer.foo',
		],
	);
}
