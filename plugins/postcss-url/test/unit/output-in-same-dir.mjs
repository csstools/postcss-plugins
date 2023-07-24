import assert from 'assert';
import { rebase } from '../../src/rebase.mjs';

{
	assert.equal(
		rebase(
			'foo.png',
			'/assets/css',
			'/assets/css',
			'/assets/css',
		),
		'foo.png',
	);
}

{
	assert.equal(
		rebase(
			'foo.png',
			'/assets/css/components',
			'/assets/css',
			'/assets/css',
		),
		'components/foo.png',
	);
}

{
	assert.equal(
		rebase(
			'../images/foo.png',
			'/assets/css/components',
			'/assets/css',
			'/assets/css',
		),
		'images/foo.png',
	);
}

{
	assert.equal(
		rebase(
			'images/foo.png',
			'/assets/css/components',
			'/assets/css',
			'/assets/css',
		),
		'components/images/foo.png',
	);
}

{
	assert.equal(
		rebase(
			'../../images/foo.png',
			'/assets/css/components',
			'/assets/css',
			'/assets/css',
		),
		'../images/foo.png',
	);
}
