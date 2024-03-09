import { calc } from '@csstools/css-calc';
import assert from 'assert';

// clamp(none, 10px, 20px)
{
	assert.strictEqual(
		calc('clamp(none, 10px, 20px)', { toCanonicalUnits: false }),
		calc('min(10px, 20px)', { toCanonicalUnits: false }),
	);

	assert.strictEqual(
		calc('clamp(none, 10px, 20px)', { toCanonicalUnits: false }),
		'10px',
	);

	assert.strictEqual(
		calc('clamp(none, 10px, 10px * 2)', { toCanonicalUnits: false }),
		calc('min(10px, 10px * 2)', { toCanonicalUnits: false }),
	);

	assert.strictEqual(
		calc('clamp(none, 10px, 10px * 2)', { toCanonicalUnits: false }),
		'10px',
	);

	assert.strictEqual(
		calc('clamp(none, 10px, (10px * 2))', { toCanonicalUnits: false }),
		calc('min(10px, (10px * 2))', { toCanonicalUnits: false }),
	);

	assert.strictEqual(
		calc('clamp(none, 10px, (10px * 2))', { toCanonicalUnits: false }),
		'10px',
	);
}

// clamp(5px, 10px, none)
{
	assert.strictEqual(
		calc('clamp(5px, 10px, none)', { toCanonicalUnits: false }),
		calc('max(5px, 10px)', { toCanonicalUnits: false }),
	);

	assert.strictEqual(
		calc('clamp(5px, 10px, none)', { toCanonicalUnits: false }),
		'10px',
	);

	assert.strictEqual(
		calc('clamp(5px, 5px * 2, none)', { toCanonicalUnits: false }),
		calc('max(5px, 5px * 2)', { toCanonicalUnits: false }),
	);

	assert.strictEqual(
		calc('clamp(5px, 5px * 2, none)', { toCanonicalUnits: false }),
		'10px',
	);

	assert.strictEqual(
		calc('clamp(5px, (5px * 2), none)', { toCanonicalUnits: false }),
		calc('max(5px, (5px * 2))', { toCanonicalUnits: false }),
	);

	assert.strictEqual(
		calc('clamp(5px, (5px * 2), none)', { toCanonicalUnits: false }),
		'10px',
	);
}

// clamp(none, 10px, none)
{
	assert.strictEqual(
		calc('clamp(none, 10px, none)', { toCanonicalUnits: false }),
		calc('calc(10px)', { toCanonicalUnits: false }),
	);

	assert.strictEqual(
		calc('clamp(none, 10px, none)', { toCanonicalUnits: false }),
		'10px',
	);

	assert.strictEqual(
		calc('clamp(none, 5px * 2, none)', { toCanonicalUnits: false }),
		calc('calc(5px * 2)', { toCanonicalUnits: false }),
	);

	assert.strictEqual(
		calc('clamp(none, 5px * 2, none)', { toCanonicalUnits: false }),
		'10px',
	);

	assert.strictEqual(
		calc('clamp(none, (5px * 2), none)', { toCanonicalUnits: false }),
		calc('calc((5px * 2))', { toCanonicalUnits: false }),
	);

	assert.strictEqual(
		calc('clamp(none, (5px * 2), none)', { toCanonicalUnits: false }),
		'10px',
	);
}

// bogus none
{
	assert.strictEqual(
		calc('clamp(none none, 10px, none)'),
		'clamp(none none, 10px, none)',
	);

	assert.strictEqual(
		calc('clamp(none, none, none)'),
		'clamp(none, none, none)',
	);

	assert.strictEqual(
		calc('clamp(1px, none, 10px)'),
		'clamp(1px, none, 10px)',
	);

	assert.strictEqual(
		calc('clamp(calc(none), 5px, 10px)'),
		'clamp(calc(none), 5px, 10px)',
	);

	assert.strictEqual(
		calc('clamp((none), 5px, 10px)'),
		'clamp((none), 5px, 10px)',
	);
}
