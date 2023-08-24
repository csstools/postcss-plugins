import assert from 'assert';
import { rebase } from '../../src/rebase.mjs';

{
	assert.equal(
		rebase(
			'@foo/bar',
			'/assets/css',
			'/assets/css',
		),
		'@foo/bar',
	);
}

{
	assert.equal(
		rebase(
			'@foo/bar',
			'/assets/css/components',
			'/assets/css',
		),
		'components/@foo/bar',
	);
}

{
	assert.equal(
		rebase(
			'~foo/bar',
			'/assets/css',
			'/assets/css',
		),
		'~foo/bar',
	);
}

{
	assert.equal(
		rebase(
			'~foo/bar',
			'/assets/css/components',
			'/assets/css',
		),
		'components/~foo/bar',
	);
}

{
	assert.equal(
		rebase(
			'~/foo/bar',
			'/assets/css',
			'/assets/css',
		),
		'~/foo/bar',
	);
}

{
	assert.equal(
		rebase(
			'~/foo/bar',
			'/assets/css/components',
			'/assets/css',
		),
		'components/~/foo/bar',
	);
}

{
	assert.equal(
		rebase(
			'node_modules:/foo/bar',
			'/assets/css',
			'/assets/css',
		),
		'node_modules:/foo/bar',
	);
}

{
	assert.equal(
		rebase(
			'node_modules:/foo/bar',
			'/assets/css/components',
			'/assets/css',
		),
		'components/node_modules:/foo/bar',
	);
}
