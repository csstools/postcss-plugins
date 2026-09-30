import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import postcss from 'postcss';
import plugin from '@csstools/postcss-design-tokens';
import test from 'node:test';

// A long chain of aliases used to exhaust the call stack while sorting the
// dependency graph. It must now resolve without a `RangeError`.
test('deep token alias chains', async () => {
	const depth = 20000;

	const tokens = {};
	for (let i = 0; i < depth; i++) {
		tokens[`v${i}`] = { value: `{v${i + 1}}` };
	}
	tokens[`v${depth}`] = { value: 'red' };

	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'postcss-design-tokens-'));
	const tokensFile = path.join(dir, 'tokens.json');
	fs.writeFileSync(tokensFile, JSON.stringify(tokens));

	const css = `@design-tokens url('${tokensFile}') format('style-dictionary3');\n.a { color: design-token('v0'); }\n`;

	const result = await postcss([plugin()]).process(css, { from: path.join(dir, 'input.css') });

	assert.match(result.css, /color: red/);
});
