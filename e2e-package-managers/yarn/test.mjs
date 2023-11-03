import postcssPresetEnv from 'postcss-preset-env';
import postcss from 'postcss';
import assert from 'assert';

const result = await postcss([postcssPresetEnv({ browsers: 'ie 11' })]).process('a { color: oklch(50% 1% 50deg); }', { from: undefined });

assert.strictEqual(result.css, 'a { color: rgb(101, 99, 97); }');
