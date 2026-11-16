import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';

function assertChannels(css, channels, alpha = 1) {
	const result = color(parse(css));
	assert.ok(result, `expected "${css}" to parse`);
	assert.deepStrictEqual(
		result.channels.map((x) => Number.isNaN(x) ? 'none' : (x === 0 ? 0 : x)),
		channels,
		`"${css}" channels`,
	);
	assert.deepStrictEqual(result.alpha, alpha, `"${css}" alpha`);
}

// hsl() only clamps negative saturation.
// Lightness and the upper bound of saturation are not clamped, in both modern and legacy syntax.
assertChannels('hsl(0 -50% 40%)', [0, 0, 40]);
assertChannels('hsl(0 150% 50%)', [0, 150, 50]);
assertChannels('hsl(0 100% 200%)', [0, 100, 200]);
assertChannels('hsl(0 100% -50%)', [0, 100, -50]);

assertChannels('hsl(0, -50%, 40%)', [0, 0, 40]);
assertChannels('hsl(0, 150%, 50%)', [0, 150, 50]);
assertChannels('hsl(0, 100%, 200%)', [0, 100, 200]);
assertChannels('hsl(0, 100%, -50%)', [0, 100, -50]);

assertChannels('hsl(0 -50 40)', [0, 0, 40]);
assertChannels('hsl(0 150 50)', [0, 150, 50]);
assertChannels('hsl(0 100 200)', [0, 100, 200]);
assertChannels('hsl(0 100 -50)', [0, 100, -50]);

// Relative hsl() keeps out of range lightness and clamps negative saturation.
assertChannels('hsl(from red h calc(s * -1) l)', [0, 0, 50]);
assertChannels('hsl(from red h s calc(l + 100))', [0, 100, 150]);

assertChannels('hsl(0 100% 50% / 200%)', [0, 100, 50], 1);
assertChannels('hsl(0, 100%, 50%, -1)', [0, 100, 50], 0);

// hwb() does not clamp whiteness or blackness.
assertChannels('hwb(0 -10% 50%)', [0, -10, 50]);
assertChannels('hwb(0 50% -10%)', [0, 50, -10]);
assertChannels('hwb(0 200% 50%)', [0, 200, 50]);
assertChannels('hwb(0 50% 200%)', [0, 50, 200]);
assertChannels('hwb(from red h w calc(b + 100))', [0, 0, 100]);
assertChannels('hwb(from red h calc(w - 100) b)', [0, -100, 0]);
assertChannels('hwb(0 50% 50% / 200%)', [0, 50, 50], 1);

// lab() clamps lightness to [0, 100].
assertChannels('lab(200 300 -400)', [100, 300, -400]);
assertChannels('lab(-200 300 -400)', [0, 300, -400]);
assertChannels('lab(200% 0 0)', [100, 0, 0]);
assertChannels('lab(50 200% -200%)', [50, 250, -250]);
assertChannels('lab(from lab(0.7 45 30) 200 300 400)', [100, 300, 400]);
assertChannels('lab(50 0 0 / 200%)', [50, 0, 0], 1);

// lch() clamps lightness to [0, 100] and negative chroma to 0.
assertChannels('lch(200 300 400)', [100, 300, 40]);
assertChannels('lch(-200 -300 -400)', [0, 0, 320]);
assertChannels('lch(50 200% 0)', [50, 300, 0]);
assertChannels('lch(from lch(0.7 45 30) 200 -300 400)', [100, 0, 40]);
assertChannels('lch(50 0 0 / 200%)', [50, 0, 0], 1);

// oklab() clamps lightness to [0, 1].
assertChannels('oklab(2 3 -4)', [1, 3, -4]);
assertChannels('oklab(-2 3 -4)', [0, 3, -4]);
assertChannels('oklab(200% 0 0)', [1, 0, 0]);
assertChannels('oklab(50% 100% -100%)', [0.5, 0.4, -0.4]);
assertChannels('oklab(from oklab(0.7 0.45 0.3) 2 3 4)', [1, 3, 4]);
assertChannels('oklab(0.5 0 0 / 200%)', [0.5, 0, 0], 1);

// oklch() clamps lightness to [0, 1] and negative chroma to 0.
assertChannels('oklch(2 0.3 400)', [1, 0.3, 40]);
assertChannels('oklch(-2 -0.3 -400)', [0, 0, 320]);
assertChannels('oklch(50% 100% 0)', [0.5, 0.4, 0]);
assertChannels('oklch(from oklch(0.7 0.45 30) 2 -3 400)', [1, 0, 40]);
assertChannels('oklch(0.5 0 0 / 200%)', [0.5, 0, 0], 1);

// Hue angles are normalized to [0, 360).
assertChannels('hsl(720 100% 50%)', [0, 100, 50]);
assertChannels('hwb(720 0% 0%)', [0, 0, 0]);
assertChannels('lch(50 10 720)', [50, 10, 0]);
assertChannels('oklch(0.5 0.1 720)', [0.5, 0.1, 0]);
