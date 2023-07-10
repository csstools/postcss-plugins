import assert from 'assert';
import plugin from 'postcss-preset-env';
import postcss from 'postcss';

const resultProduction = (await postcss([plugin({env: 'production'})]).process(
	':any-link { color: blue; }',
	{from: undefined},
)).css;

const resultDevelopment = (await postcss([plugin({env: 'development'})]).process(
	':any-link { color: blue; }',
	{from: undefined},
)).css;

assert.equal(
	resultProduction,
	':link, :visited, area[href] { color: blue; }\n' +
	':-webkit-any-link { color: blue; }\n' +
	':-moz-any-link { color: blue; }\n' +
	':any-link { color: blue; }',
);

assert.equal(resultDevelopment, ':any-link { color: blue; }');
