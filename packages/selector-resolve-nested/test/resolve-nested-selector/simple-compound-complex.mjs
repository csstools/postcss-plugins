import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveNestedSelector } from '@csstools/selector-resolve-nested';
import { parse } from '../util/parse.mjs';

test('surrounding whitespace', async () => {
	assert.equal(
		resolveNestedSelector(parse(' .foo'), parse(' .bar')).toString(),
		'.bar .foo',
	);

	assert.equal(
		resolveNestedSelector(parse('.foo '), parse('.bar ')).toString(),
		'.bar .foo',
	);

	assert.equal(
		resolveNestedSelector(parse('  .foo  '), parse('  .bar  ')).toString(),
		'.bar .foo',
	);
});

test('simple - simple', async () => {
	assert.equal(
		resolveNestedSelector(parse('.foo'), parse('.bar')).toString(),
		'.bar .foo',
	);
});

test('simple - compound', async () => {
	assert.equal(
		resolveNestedSelector(parse('.foo'), parse('.bar:hover')).toString(),
		'.bar:hover .foo',
	);
});

test('compound - simple', async () => {
	assert.equal(
		resolveNestedSelector(parse('.foo:focus'), parse('.bar')).toString(),
		'.bar .foo:focus',
	);
});

test('compound - compound', async () => {
	assert.equal(
		resolveNestedSelector(parse('.foo:focus'), parse('.bar:hover')).toString(),
		'.bar:hover .foo:focus',
	);
});

test('simple - complex', async () => {
	assert.equal(
		resolveNestedSelector(parse('.foo'), parse('.bar + .baz')).toString(),
		':is(.bar + .baz) .foo',
	);
});

test('compound - complex', async () => {
	assert.equal(
		resolveNestedSelector(parse('.foo:focus'), parse('.bar + .baz')).toString(),
		':is(.bar + .baz) .foo:focus',
	);
});

test('complex - compound', async () => {
	assert.equal(
		resolveNestedSelector(parse('.foo + .fooz'), parse('.bar:hover')).toString(),
		'.bar:hover .foo + .fooz',
	);
});

test('complex - complex', async () => {
	assert.equal(
		resolveNestedSelector(parse('.foo + .fooz'), parse('.bar + .baz')).toString(),
		':is(.bar + .baz) .foo + .fooz',
	);
});

test('pseudo element - compound', async () => {
	assert.equal(
		resolveNestedSelector(parse('&::before'), parse('.foo:hover')).toString(),
		'.foo:hover::before',
	);
});

test('compound - pseudo element', async () => {
	assert.equal(
		resolveNestedSelector(parse('&:hover'), parse('.foo::before')).toString(),
		':is(.foo::before):hover',
	);
});

test('compound - pseudo element', async () => {
	assert.equal(
		resolveNestedSelector(parse('&:hover'), parse('.foo::before:focus')).toString(),
		':is(.foo::before:focus):hover',
	);
});
