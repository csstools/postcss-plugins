import assert from 'node:assert';
import { test } from 'node:test';
import { rebase } from '../../src/rebase.mjs';

test('does not rebase when from and to directories are identical', () => {
	assert.equal(
		rebase(
			'foo.png',
			'/assets/css',
			'/assets/css',
		),
		'foo.png',
	);
});

test('rebases relative path from nested directory to parent', () => {
	assert.equal(
		rebase(
			'foo.png',
			'/assets/css/components',
			'/assets/css',
		),
		'components/foo.png',
	);
});

test('preserves absolute path when directories are identical', () => {
	assert.equal(
		rebase(
			'/foo.png',
			'/assets/css',
			'/assets/css',
		),
		'/foo.png',
	);
});

test('preserves absolute path when rebasing from nested directory', () => {
	assert.equal(
		rebase(
			'/foo.png',
			'/assets/css/components',
			'/assets/css',
		),
		'/foo.png',
	);
});

test('rebases parent-relative image path from nested directory', () => {
	assert.equal(
		rebase(
			'../images/foo.png',
			'/assets/css/components',
			'/assets/css',
		),
		'images/foo.png',
	);
});

test('rebases nested image path from nested directory', () => {
	assert.equal(
		rebase(
			'images/foo.png',
			'/assets/css/components',
			'/assets/css',
		),
		'components/images/foo.png',
	);
});

test('rebases path that goes above nested directory', () => {
	assert.equal(
		rebase(
			'../../images/foo.png',
			'/assets/css/components',
			'/assets/css',
		),
		'../images/foo.png',
	);
});

test('preserves path when base directories do not match', () => {
	assert.equal(
		rebase(
			'../../images/foo.png',
			'/blocks/components',
			'/assets/css',
		),
		'../../images/foo.png',
	);
});
