import assert from 'node:assert';
import postcss from 'postcss';
import plugin from 'postcss-custom-properties';
import test from 'node:test';

// A long chain of custom properties used to exhaust the call stack while
// building the dependency graph. It must now resolve without a `RangeError`.
test('deep custom property chains', async () => {
	const depth = 15000;
	let css = ':root {\n';

	for (let i = 0; i < depth; i++) {
		css += `\t--v${i}: var(--v${i + 1});\n`;
	}

	css += `\t--v${depth}: red;\n}\n.a { color: var(--v0) }\n`;

	const result = await postcss([plugin()]).process(css, { from: undefined });

	assert.match(result.css, /color: red/);
});
