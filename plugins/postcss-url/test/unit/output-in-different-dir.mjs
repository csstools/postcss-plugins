import assert from 'assert';
import { rebase } from '../../src/rebase.mjs';

{
	assert.equal(
		rebase(
			'foo.png',
			'/assets/css',
			'/assets/css',
			'/public/css',
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
			'/public/css',
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
			'/public/css',
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
			'/public/css',
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
			'/public/css',
		),
		'../images/foo.png',
	);
}
