import assert from 'node:assert/strict';
import test from 'node:test';
import { flattenNestedSelector } from '@csstools/selector-resolve-nested';
import { parse } from '../util/parse.mjs';

test('simple - list', async () => {
	assert.equal(
		flattenNestedSelector(parse('.foo'), parse('.bar, baz')).toString(),
		'.bar .foo, baz .foo',
	);
});

test('relative - list', async () => {
	assert.equal(
		flattenNestedSelector(parse('> .foo'), parse('.bar, baz')).toString(),
		'.bar > .foo, baz > .foo',
	);
});

test('list - simple', async () => {
	assert.equal(
		flattenNestedSelector(parse('.foo, fooz'), parse('.bar')).toString(),
		'.bar .foo,.bar  fooz',
	);
});

test('list - list', async () => {
	assert.equal(
		flattenNestedSelector(parse('.foo, .fooz'), parse('.bar, .baz')).toString(),
		'.bar .foo, .baz .foo,.bar  .fooz, .baz  .fooz',
	);

	assert.equal(
		flattenNestedSelector(parse('.foo, .fooz, .foos'), parse('.bar, .baz, .bas')).toString(),
		'.bar .foo, .baz .foo, .bas .foo,.bar  .fooz, .baz  .fooz, .bas  .fooz,.bar  .foos, .baz  .foos, .bas  .foos',
	);

	assert.equal(
		flattenNestedSelector(parse('& & .foo, & & .fooz, & & .foos'), parse('.bar > :hover, .baz > :hover, .bas')).toString(),
		'.bar > :hover .bar > :hover .foo,.bar > :hover  .baz > :hover .foo,.bar > :hover  .bas .foo, .baz > :hover .bar > :hover .foo, .baz > :hover  .baz > :hover .foo, .baz > :hover  .bas .foo, .bas .bar > :hover .foo, .bas  .baz > :hover .foo, .bas  .bas .foo,.bar > :hover .bar > :hover .fooz,.bar > :hover  .baz > :hover .fooz,.bar > :hover  .bas .fooz, .baz > :hover .bar > :hover .fooz, .baz > :hover  .baz > :hover .fooz, .baz > :hover  .bas .fooz, .bas .bar > :hover .fooz, .bas  .baz > :hover .fooz, .bas  .bas .fooz,.bar > :hover .bar > :hover .foos,.bar > :hover  .baz > :hover .foos,.bar > :hover  .bas .foos, .baz > :hover .bar > :hover .foos, .baz > :hover  .baz > :hover .foos, .baz > :hover  .bas .foos, .bas .bar > :hover .foos, .bas  .baz > :hover .foos, .bas  .bas .foos',
	);
});

test('relative list - simple', async () => {
	assert.equal(
		flattenNestedSelector(parse('> .foo, + fooz'), parse('.bar')).toString(),
		'.bar > .foo,.bar  + fooz',
	);
});
