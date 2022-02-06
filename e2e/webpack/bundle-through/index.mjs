import postcss from 'postcss';
import postcssPresetEnv from 'postcss-preset-env';

try {
	postcss([postcssPresetEnv({
		stage: 0,
	})]).process('a { color: rebeccapurple; }', {from: 'string'}).then(result => {
		console.log(result.css);
	});
} catch (err) {
	console.error(err.message);
	process.exit(1);
}
