import { parse } from '@csstools/cascade-layer-name-parser';
import assert from 'node:assert';

{
	const layerName = parse('alpha./* a comment */beta.gamma.delta')[0];
	assert.equal(layerName.toString(), 'alpha./* a comment */beta.gamma.delta');

	const a = layerName.slice(1);
	assert.equal(a.toString(), 'beta.gamma.delta');

	const b = layerName.slice(-1);
	assert.equal(b.toString(), 'delta');

	const c = layerName.slice(0, -1);
	assert.equal(c.toString(), 'alpha./* a comment */beta.gamma');

	const d = layerName.slice(1, 2);
	assert.equal(d.toString(), 'beta');
}
