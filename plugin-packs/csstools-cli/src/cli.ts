import cssBlankPseudo from './plugins/css-blank-pseudo';
import cssHasPseudo from './plugins/css-has-pseudo';
import cssPrefersColorScheme from './plugins/css-prefers-color-scheme';
import postcssColorFunctionalNotation from './plugins/postcss-color-functional-notation';
import postcssColorHexAlpha from './plugins/postcss-color-hex-alpha';
import postcssColorRebeccaPurple from './plugins/postcss-color-rebeccapurple';
import postcssCustomProperties from './plugins/postcss-custom-properties';
import postcssDirPseudoClass from './plugins/postcss-dir-pseudo-class';
import postcssPresetEnv from './plugins/postcss-preset-env';
import postcssPseudoClassAnyLink from './plugins/postcss-pseudo-class-any-link';

main();
function main() {
	switch (process.argv[2] ?? 'help') {
		case 'css-blank-pseudo':
			cssBlankPseudo();
			return;
		case 'css-has-pseudo':
			cssHasPseudo();
			return;
		case 'css-prefers-color-scheme':
			cssPrefersColorScheme();
			return;
		case 'postcss-color-functional-notation':
			postcssColorFunctionalNotation();
			return;
		case 'postcss-color-hex-alpha':
			postcssColorHexAlpha();
			return;
		case 'postcss-color-rebeccapurple':
			postcssColorRebeccaPurple();
			return;
		case 'postcss-custom-properties':
			postcssCustomProperties();
			return;
		case 'postcss-dir-pseudo-class':
			postcssDirPseudoClass();
			return;
		case 'postcss-double-position-gradients':
		case 'postcss-env-function':
		case 'postcss-focus-visible':
		case 'postcss-focus-within':
		case 'postcss-gap-properties':
		case 'postcss-image-set-function':
		case 'postcss-lab-function':
		case 'postcss-logical':
		case 'postcss-nesting':
		case 'postcss-overflow-shorthand':
		case 'postcss-place':
		case 'postcss-preset-env':
			postcssPresetEnv();
			return;
		case 'postcss-pseudo-class-any-link':
			postcssPseudoClassAnyLink();
			return;
		default:
			{
				const allHelp = [
					'CSSTools CLI\n',
					'  Transform CSS with any plugin from https://github.com/csstools/postcss-plugins\n',

					'Usage:',
					'  @csstools/csstools-cli postcss-preset-env [input.css] [OPTIONS] [-o|--output output.css]',
					'  @csstools/csstools-cli postcss-preset-env <input.css>... [OPTIONS] --dir <output-directory>',
					'  @csstools/csstools-cli postcss-preset-env <input.css>... [OPTIONS] --replace',

					'\nAvailable Plugins:',
					'  css-blank-pseudo',
					'  css-has-pseudo',
					'  css-prefers-color-scheme',
					'  postcss-color-functional-notation',
					'  postcss-color-hex-alpha',
					'  postcss-color-rebeccapurple',
					'  postcss-custom-properties',
					'  postcss-dir-pseudo-class',
					'  postcss-double-position-gradients',
					'  postcss-env-function',
					'  postcss-focus-visible',
					'  postcss-focus-within',
					'  postcss-gap-properties',
					'  postcss-image-set-function',
					'  postcss-lab-function',
					'  postcss-logical',
					'  postcss-nesting',
					'  postcss-overflow-shorthand',
					'  postcss-place',
					'  postcss-pseudo-class-any-link',

					'\nPlugin Help:',
					'  @csstools/csstools-cli <plugin-name>',
					'  @csstools/csstools-cli postcss-preset-env',
				];

				console.warn(allHelp.join('\n'));
			}
	}
}
