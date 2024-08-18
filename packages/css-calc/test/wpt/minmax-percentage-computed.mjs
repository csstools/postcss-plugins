import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

{
	assert.strictEqual(
		calc('min(1%)'),
		'min(1%)',
	);

	assert.strictEqual(
		calc('max(1%)'),
		'max(1%)',
	);

	assert.strictEqual(
		calc('min(20%, max(10%, 15%))'),
		'min(20%, max(10%, 15%))',
	);

	assert.strictEqual(
		calc('max(10%, min(20%, 15%))'),
		'max(10%, min(20%, 15%))',
	);

	assert.strictEqual(
		calc('calc(min(10%, 20%) + 5%)'),
		'calc(min(10%, 20%) + 5%)',
	);

	assert.strictEqual(
		calc('calc(min(10%, 20%) - 5%)'),
		'calc(min(10%, 20%) - 5%)',
	);

	assert.strictEqual(
		calc('calc(min(10%, 20%) * 2)'),
		'calc(min(10%, 20%) * 2)',
	);

	assert.strictEqual(
		calc('calc(min(10%, 20%) / 2)'),
		'calc(min(10%, 20%) / 2)',
	);

	assert.strictEqual(
		calc('calc(max(10%, 20%) + 5%)'),
		'calc(max(10%, 20%) + 5%)',
	);

	assert.strictEqual(
		calc('calc(max(10%, 20%) - 5%)'),
		'calc(max(10%, 20%) - 5%)',
	);

	assert.strictEqual(
		calc('calc(max(10%, 20%) * 2)'),
		'calc(max(10%, 20%) * 2)',
	);

	assert.strictEqual(
		calc('calc(max(10%, 20%) / 2)'),
		'calc(max(10%, 20%) / 2)',
	);

	assert.strictEqual(
		calc('calc(min(10%, 20%) + max(10%, 5%))'),
		'calc(min(10%, 20%) + max(10%, 5%))',
	);

	assert.strictEqual(
		calc('calc(min(11%, 20%) - max(10%, 5%))'),
		'calc(min(11%, 20%) - max(10%, 5%))',
	);
}

{
	assert.strictEqual(
		calc('min(1%)', { rawPercentages: true }),
		'1%',
	);

	assert.strictEqual(
		calc('max(1%)', { rawPercentages: true }),
		'1%',
	);

	assert.strictEqual(
		calc('min(20%, max(10%, 15%))', { rawPercentages: true }),
		'15%',
	);

	assert.strictEqual(
		calc('max(10%, min(20%, 15%))', { rawPercentages: true }),
		'15%',
	);

	assert.strictEqual(
		calc('calc(min(10%, 20%) + 5%)', { rawPercentages: true }),
		'15%',
	);

	assert.strictEqual(
		calc('calc(min(10%, 20%) - 5%)', { rawPercentages: true }),
		'5%',
	);

	assert.strictEqual(
		calc('calc(min(10%, 20%) * 2)', { rawPercentages: true }),
		'20%',
	);

	assert.strictEqual(
		calc('calc(min(10%, 20%) / 2)', { rawPercentages: true }),
		'5%',
	);

	assert.strictEqual(
		calc('calc(max(10%, 20%) + 5%)', { rawPercentages: true }),
		'25%',
	);

	assert.strictEqual(
		calc('calc(max(10%, 20%) - 5%)', { rawPercentages: true }),
		'15%',
	);

	assert.strictEqual(
		calc('calc(max(10%, 20%) * 2)', { rawPercentages: true }),
		'40%',
	);

	assert.strictEqual(
		calc('calc(max(10%, 20%) / 2)', { rawPercentages: true }),
		'10%',
	);

	assert.strictEqual(
		calc('calc(min(10%, 20%) + max(10%, 5%))', { rawPercentages: true }),
		'20%',
	);

	assert.strictEqual(
		calc('calc(min(11%, 20%) - max(10%, 5%))', { rawPercentages: true }),
		'1%',
	);
}
