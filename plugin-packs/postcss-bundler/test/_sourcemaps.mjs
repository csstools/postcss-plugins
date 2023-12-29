import postcss from 'postcss';
import plugin from '@csstools/postcss-bundler';
import test from 'node:test';
import assert from 'node:assert';
import path from 'node:path';

test('sourcemaps', async () => {
	const result = await postcss([
		plugin(),
	]).process(`@import url(./imports/minified-source.css);
`, {
		from: 'test/basic.css',
		map: {
			inline: false,
		},
	});

	assert.deepStrictEqual(
		result.map.toJSON(),
		{
			version: 3,
			sources: [
				'test/basic.css'.split(path.posix.sep).join(path.sep),
				'test/imports/basic.css'.split(path.posix.sep).join(path.sep), /* this has to reflect the path in the inline sourcemap of 'minified-source.css' */
			],
			names: [],
			mappings: 'AAAA,kCAA0C,ECA1C,OACE,sBAAsB,EAAE,SAC1B,EAEA,OACC,WACD,EAEA,OACC,WACD,EAEA,OACC,kBACD,EAEA,OACC,kBACD,EAEA,OACC,kBACD',
			file: 'test/basic.css'.split(path.posix.sep).join(path.sep),
			sourcesContent: [
				'@import url(./imports/minified-source.css);\n',
				'.foo {\n  --var: /* a comment */; bar: red;\n}\n\n.foo {\n\tcolor: red;\n}\n\n.foo {\n\tcolor:  red;\n}\n\n.foo {\n\tcolor: rgb(0  0 0);\n}\n\n.foo {\n\tcolor: rgb(0 /* a comment */ 0 0);\n}\n\n.foo {\n\tcolor: rgb(0 /* a comment */ /* more comments */ 0 0);\n}\n',
			],
		},
	);
});
