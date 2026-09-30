import assert from 'node:assert/strict';
import test from 'node:test';
import { flattenNestedSelector } from '@csstools/selector-resolve-nested';
import { parse } from '../util/parse.mjs';

test('surrounding whitespace', async () => {
	assert.equal(
		flattenNestedSelector(parse(' .foo'), parse(' .bar')).toString(),
		' .bar  .foo',
	);

	assert.equal(
		flattenNestedSelector(parse('.foo '), parse('.bar ')).toString(),
		'.bar  .foo ',
	);

	assert.equal(
		flattenNestedSelector(parse('  .foo  '), parse('  .bar  ')).toString(),
		'  .bar     .foo  ',
	);
});

test('simple - simple', async () => {
	assert.equal(
		flattenNestedSelector(parse('.foo'), parse('.bar')).toString(),
		'.bar .foo',
	);
});

test('simple - compound', async () => {
	assert.equal(
		flattenNestedSelector(parse('.foo'), parse('.bar:hover')).toString(),
		'.bar:hover .foo',
	);
});

test('compound - simple', async () => {
	assert.equal(
		flattenNestedSelector(parse('.foo:focus'), parse('.bar')).toString(),
		'.bar .foo:focus',
	);
});

test('compound - compound', async () => {
	assert.equal(
		flattenNestedSelector(parse('.foo:focus'), parse('.bar:hover')).toString(),
		'.bar:hover .foo:focus',
	);
});

test('simple - complex', async () => {
	assert.equal(
		flattenNestedSelector(parse('.foo'), parse('.bar + .baz')).toString(),
		'.bar + .baz .foo',
	);
});

test('compound - complex', async () => {
	assert.equal(
		flattenNestedSelector(parse('.foo:focus'), parse('.bar + .baz')).toString(),
		'.bar + .baz .foo:focus',
	);
});

test('complex - compound', async () => {
	assert.equal(
		flattenNestedSelector(parse('.foo + .fooz'), parse('.bar:hover')).toString(),
		'.bar:hover .foo + .fooz',
	);
});

test('complex - complex', async () => {
	assert.equal(
		flattenNestedSelector(parse('.foo + .fooz'), parse('.bar + .baz')).toString(),
		'.bar + .baz .foo + .fooz',
	);
});

test('pseudo element - compound', async () => {
	assert.equal(
		flattenNestedSelector(parse('&::before'), parse('.foo:hover')).toString(),
		'.foo:hover::before',
	);
});

test('compound - pseudo element', async () => {
	assert.equal(
		flattenNestedSelector(parse('&:hover'), parse('.foo::before')).toString(),
		'.foo::before:hover',
	);
});

test('compound - pseudo element', async () => {
	assert.equal(
		flattenNestedSelector(parse('&:hover'), parse('.foo::before:focus')).toString(),
		'.foo::before:focus:hover',
	);
});
