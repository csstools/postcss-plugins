import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveNestedSelector } from '@csstools/selector-resolve-nested';
import { parse } from '../util/parse.mjs';

test('simple - list', async () => {
	assert.equal(
		resolveNestedSelector(parse('.foo'), parse('.bar, baz')).toString(),
		':is(.bar,baz) .foo',
	);
});

test('relative - list', async () => {
	assert.equal(
		resolveNestedSelector(parse('> .foo'), parse('.bar, baz')).toString(),
		':is(.bar,baz)  > .foo',
	);
});

test('list - simple', async () => {
	assert.equal(
		resolveNestedSelector(parse('.foo, fooz'), parse('.bar')).toString(),
		'.bar .foo,.bar fooz',
	);
});

test('list - list', async () => {
	assert.equal(
		resolveNestedSelector(parse('.foo, .fooz'), parse('.bar, .baz')).toString(),
		':is(.bar,.baz) .foo,:is(.bar,.baz) .fooz',
	);

	assert.equal(
		resolveNestedSelector(parse('.foo, .fooz, .foos'), parse('.bar, .baz, .bas')).toString(),
		':is(.bar,.baz,.bas) .foo,:is(.bar,.baz,.bas) .fooz,:is(.bar,.baz,.bas) .foos',
	);

	assert.equal(
		resolveNestedSelector(parse('& & .foo, & & .fooz, & & .foos'), parse('.bar > :hover, .baz > :hover, .bas')).toString(),
		':is(.bar > :hover,.baz > :hover,.bas) :is(.bar > :hover,.baz > :hover,.bas) .foo,:is(.bar > :hover,.baz > :hover,.bas) :is(.bar > :hover,.baz > :hover,.bas) .fooz,:is(.bar > :hover,.baz > :hover,.bas) :is(.bar > :hover,.baz > :hover,.bas) .foos',
	);
});

test('relative list - simple', async () => {
	assert.equal(
		resolveNestedSelector(parse('> .foo, + fooz'), parse('.bar')).toString(),
		'.bar  > .foo,.bar  + fooz',
	);
});
