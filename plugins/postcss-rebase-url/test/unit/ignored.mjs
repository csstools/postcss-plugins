import assert from 'node:assert';
import { rebase } from '../../src/rebase.mjs';

{
	assert.equal(
		rebase(
			'https://example.com/foo.png',
			'/assets/css/components',
			'/assets/css',
		),
		false,
	);
}

{
	assert.equal(
		rebase(
			'//example.com/foo.png',
			'/assets/css/components',
			'/assets/css',
		),
		false,
	);
}

{
	assert.equal(
		rebase(
			'example.com:8080/foo.png',
			'/assets/css/components',
			'/assets/css',
		),
		false,
	);
}

{
	// Not distinguishable from a relative URL.
	assert.equal(
		rebase(
			'example.com/foo.png',
			'/assets/css/components',
			'/assets/css',
		),
		'components/example.com/foo.png',
	);
}

{
	assert.equal(
		rebase(
			'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
			'/assets/css/components',
			'/assets/css',
		),
		false,
	);
}
