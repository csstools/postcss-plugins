import assert from 'node:assert';
import plugin from 'postcss-preset-env';
import postcss from 'postcss';

const result = (await postcss([plugin()]).process(
	':any-link { color: blue; }',
	{from: undefined},
)).css;

assert.ok(['production', 'development', 'legacy-edge'].includes(process.env.BROWSERSLIST_ENV));

if (process.env.BROWSERSLIST_ENV === 'production') {
	assert.equal(
		result,
		':link, :visited { color: blue; }\n' +
		':-webkit-any-link { color: blue; }\n' +
		':-moz-any-link { color: blue; }\n' +
		':any-link { color: blue; }',
	);
}

if (process.env.BROWSERSLIST_ENV === 'development') {
	assert.equal(result, ':any-link { color: blue; }');
}

if (process.env.BROWSERSLIST_ENV === 'legacy-edge') {
	assert.equal(
		result,
		':link, :visited, area[href] { color: blue; }\n' +
		':any-link { color: blue; }',
	);
}
