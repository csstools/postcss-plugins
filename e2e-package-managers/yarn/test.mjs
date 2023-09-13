import postcssPresetEnv from 'postcss-preset-env';
import postcss from 'postcss';
import assert from 'assert';

const result = await postcss([postcssPresetEnv({ browsers: 'ie 11' })]).process('a { color: oklch(50% 50% 50deg); }', { from: undefined });

assert.strictEqual(result.css, 'a { color: rgb(163, 65, 0); color: color(display-p3 0.60751 0.2644 0); }');
