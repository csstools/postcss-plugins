import cssBlankPseudo from './plugins/css-blank-pseudo';
import cssHasPseudo from './plugins/css-has-pseudo';
import cssPrefersColorScheme from './plugins/css-prefers-color-scheme';
import postcssColorFunctionalNotation from './plugins/postcss-color-functional-notation';
import postcssColorHexAlpha from './plugins/postcss-color-hex-alpha';
import postcssColorRebeccaPurple from './plugins/postcss-color-rebeccapurple';
import postcssCustomProperties from './plugins/postcss-custom-properties';
import postcssDirPseudoClass from './plugins/postcss-dir-pseudo-class';
import postcssDoublePositionGradients from './plugins/postcss-double-position-gradients';
import postcssEnvFunction from './plugins/postcss-env-function';
import postcssFocusVisible from './plugins/postcss-focus-visible';
import postcssFocusWithin from './plugins/postcss-focus-within';
import postcssGapProperties from './plugins/postcss-gap-properties';
import postcssImageSetFunction from './plugins/postcss-image-set-function';
import postcssLabFunction from './plugins/postcss-lab-function';
import postcssLogical from './plugins/postcss-logical';
import postcssNesting from './plugins/postcss-nesting';
import postcssOverflowShorthand from './plugins/postcss-overflow-shorthand';
import postcssPlace from './plugins/postcss-place';
import postcssPresetEnv from './plugins/postcss-preset-env';
import postcssPseudoClassAnyLink from './plugins/postcss-pseudo-class-any-link';

main();
function main() {
	switch (process.argv[2] ?? false) {
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
			postcssDoublePositionGradients();
			return;
		case 'postcss-env-function':
			postcssEnvFunction();
			return;
		case 'postcss-focus-visible':
			postcssFocusVisible();
			return;
		case 'postcss-focus-within':
			postcssFocusWithin();
			return;
		case 'postcss-gap-properties':
			postcssGapProperties();
			return;
		case 'postcss-image-set-function':
			postcssImageSetFunction();
			return;
		case 'postcss-lab-function':
			postcssLabFunction();
			return;
		case 'postcss-logical':
			postcssLogical();
			return;
		case 'postcss-nesting':
			postcssNesting();
			return;
		case 'postcss-overflow-shorthand':
			postcssOverflowShorthand();
			return;
		case 'postcss-place':
			postcssPlace();
			return;
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
