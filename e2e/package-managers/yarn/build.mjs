import postcssPresetEnv from 'postcss-preset-env';
import postcss from 'postcss';

const result = await postcss([postcssPresetEnv({ browsers: 'last 100 Safari versions' })]).process('a { color: oklch(50% 50% 50deg); }', { from: undefined });

console.log(result.css);
