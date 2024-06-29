import cssBlankPseudo from './plugins/css-blank-pseudo';
import cssHasPseudo from './plugins/css-has-pseudo';
import cssPrefersColorScheme from './plugins/css-prefers-color-scheme';
import postcssAttributeCaseInsensitive from './plugins/postcss-attribute-case-insensitive';
import postcssCascadeLayers from './plugins/postcss-cascade-layers';
import postcssColorFunction from './plugins/postcss-color-function';
import postcssColorFunctionalNotation from './plugins/postcss-color-functional-notation';
import postcssColorHexAlpha from './plugins/postcss-color-hex-alpha';
import postcssColorMixFunction from './plugins/postcss-color-mix-function';
import postcssColorRebeccaPurple from './plugins/postcss-color-rebeccapurple';
import postcssCustomMedia from './plugins/postcss-custom-media';
import postcssCustomProperties from './plugins/postcss-custom-properties';
import postcssCustomSelectors from './plugins/postcss-custom-selectors';
import postcssDirPseudoClass from './plugins/postcss-dir-pseudo-class';
import postcssDoublePositionGradients from './plugins/postcss-double-position-gradients';
import postcssExponentialFunctions from './plugins/postcss-exponential-functions';
import postcssFocusVisible from './plugins/postcss-focus-visible';
import postcssFocusWithin from './plugins/postcss-focus-within';
import postcssFontFormatKeywords from './plugins/postcss-font-format-keywords';
import postcssGapProperties from './plugins/postcss-gap-properties';
import postcssGradientsInterpolationMethod from './plugins/postcss-gradients-interpolation-method';
import postcssHWBFunction from './plugins/postcss-hwb-function';
import postcssICUnit from './plugins/postcss-ic-unit';
import postcssImageSetFunction from './plugins/postcss-image-set-function';
import postcssIsPseudoClass from './plugins/postcss-is-pseudo-class';
import postcssLabFunction from './plugins/postcss-lab-function';
import postcssLightDarkFunction from './plugins/postcss-light-dark-function';
import postcssLogical from './plugins/postcss-logical';
import postcssLogicalFloatAndClear from './plugins/postcss-logical-float-and-clear';
import postcssLogicalResize from './plugins/postcss-logical-resize';
import postcssLogicalViewportUnits from './plugins/postcss-logical-viewport-units';
import postcssMediaMinMax from './plugins/postcss-media-minmax';
import postcssMediaQueriesAspectRatioNumberValues from './plugins/postcss-media-queries-aspect-ratio-number-values';
import postcssNestedCalc from './plugins/postcss-nested-calc';
import postcssNesting from './plugins/postcss-nesting';
import postcssNormalizeDisplayValues from './plugins/postcss-normalize-display-values';
import postcssOKLabFunction from './plugins/postcss-oklab-function';
import postcssOverflowShorthand from './plugins/postcss-overflow-shorthand';
import postcssPlace from './plugins/postcss-place';
import postcssPresetEnv from './plugins/postcss-preset-env';
import postcssPseudoClassAnyLink from './plugins/postcss-pseudo-class-any-link';
import postcssRelativeColorSyntax from './plugins/postcss-relative-color-syntax';
import postcssScopePseudoClass from './plugins/postcss-scope-pseudo-class';
import postcssSelectorNot from './plugins/postcss-selector-not';
import postcssSteppedValueFunctions from './plugins/postcss-stepped-value-functions';
import postcssTextDecorationShorthand from './plugins/postcss-text-decoration-shorthand';
import postcssTrigonometricFunctions from './plugins/postcss-trigonometric-functions';
import postcssUnsetValue from './plugins/postcss-unset-value';

void main();

async function main(): Promise<void> {
	switch (process.argv[2] ?? false) {
		case 'css-blank-pseudo':
			await cssBlankPseudo();
			return;
		case 'css-has-pseudo':
			await cssHasPseudo();
			return;
		case 'css-prefers-color-scheme':
			await cssPrefersColorScheme();
			return;
		case 'postcss-attribute-case-insensitive':
			await postcssAttributeCaseInsensitive();
			return;
		case 'postcss-cascade-layers':
			await postcssCascadeLayers();
			return;
		case 'postcss-color-function':
			await postcssColorFunction();
			return;
		case 'postcss-color-mix-function':
			await postcssColorMixFunction();
			return;
		case 'postcss-color-functional-notation':
			await postcssColorFunctionalNotation();
			return;
		case 'postcss-color-hex-alpha':
			await postcssColorHexAlpha();
			return;
		case 'postcss-color-rebeccapurple':
			await postcssColorRebeccaPurple();
			return;
		case 'postcss-custom-media':
			await postcssCustomMedia();
			return;
		case 'postcss-custom-properties':
			await postcssCustomProperties();
			return;
		case 'postcss-custom-selectors':
			await postcssCustomSelectors();
			return;
		case 'postcss-dir-pseudo-class':
			await postcssDirPseudoClass();
			return;
		case 'postcss-double-position-gradients':
			await postcssDoublePositionGradients();
			return;
		case 'postcss-exponential-functions':
			await postcssExponentialFunctions();
			return;
		case 'postcss-focus-visible':
			await postcssFocusVisible();
			return;
		case 'postcss-focus-within':
			await postcssFocusWithin();
			return;
		case 'postcss-font-format-keywords':
			await postcssFontFormatKeywords();
			return;
		case 'postcss-gap-properties':
			await postcssGapProperties();
			return;
		case 'postcss-gradients-interpolation-method':
			await postcssGradientsInterpolationMethod();
			return;
		case 'postcss-hwb-function':
			await postcssHWBFunction();
			return;
		case 'postcss-ic-unit':
			await postcssICUnit();
			return;
		case 'postcss-image-set-function':
			await postcssImageSetFunction();
			return;
		case 'postcss-is-pseudo-class':
			await postcssIsPseudoClass();
			return;
		case 'postcss-lab-function':
			await postcssLabFunction();
			return;
		case 'postcss-light-dark-function':
			await postcssLightDarkFunction();
			return;
		case 'postcss-logical':
			await postcssLogical();
			return;
		case 'postcss-logical-float-and-clear':
			await postcssLogicalFloatAndClear();
			return;
		case 'postcss-logical-resize':
			await postcssLogicalResize();
			return;
		case 'postcss-logical-viewport-units':
			await postcssLogicalViewportUnits();
			return;
		case 'postcss-media-minmax':
			await postcssMediaMinMax();
			return;
		case 'postcss-media-queries-aspect-ratio-number-values':
			await postcssMediaQueriesAspectRatioNumberValues();
			return;
		case 'postcss-nested-calc':
			await postcssNestedCalc();
			return;
		case 'postcss-nesting':
			await postcssNesting();
			return;
		case 'postcss-normalize-display-values':
			await postcssNormalizeDisplayValues();
			return;
		case 'postcss-oklab-function':
			await postcssOKLabFunction();
			return;
		case 'postcss-overflow-shorthand':
			await postcssOverflowShorthand();
			return;
		case 'postcss-place':
			await postcssPlace();
			return;
		case 'postcss-preset-env':
			await postcssPresetEnv();
			return;
		case 'postcss-pseudo-class-any-link':
			await postcssPseudoClassAnyLink();
			return;
		case 'postcss-scope-pseudo-class':
			await postcssScopePseudoClass();
			return;
		case 'postcss-relative-color-syntax':
			await postcssRelativeColorSyntax();
			return;
		case 'postcss-selector-not':
			await postcssSelectorNot();
			return;
		case 'postcss-stepped-value-functions':
			await postcssSteppedValueFunctions();
			return;
		case 'postcss-text-decoration-shorthand':
			await postcssTextDecorationShorthand();
			return;
		case 'postcss-trigonometric-functions':
			await postcssTrigonometricFunctions();
			return;
		case 'postcss-unset-value':
			await postcssUnsetValue();
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
				'  postcss-preset-env',
				'  css-blank-pseudo',
				'  css-has-pseudo',
				'  css-prefers-color-scheme',
				'  postcss-attribute-case-insensitive',
				'  postcss-cascade-layers',
				'  postcss-color-function',
				'  postcss-color-functional-notation',
				'  postcss-color-hex-alpha',
				'  postcss-color-mix-function',
				'  postcss-color-rebeccapurple',
				'  postcss-custom-media',
				'  postcss-custom-properties',
				'  postcss-custom-selectors',
				'  postcss-dir-pseudo-class',
				'  postcss-double-position-gradients',
				'  postcss-exponential-functions',
				'  postcss-focus-visible',
				'  postcss-focus-within',
				'  postcss-font-format-keywords',
				'  postcss-gap-properties',
				'  postcss-gradients-interpolation-method',
				'  postcss-hwb-function',
				'  postcss-ic-unit',
				'  postcss-image-set-function',
				'  postcss-is-pseudo-class',
				'  postcss-lab-function',
				'  postcss-light-dark-function',
				'  postcss-logical',
				'  postcss-logical-float-and-clear',
				'  postcss-logical-resize',
				'  postcss-logical-viewport-units',
				'  postcss-media-minmax',
				'  postcss-media-queries-aspect-ratio-number-values',
				'  postcss-nested-calc',
				'  postcss-nesting',
				'  postcss-normalize-display-values',
				'  postcss-oklab-function',
				'  postcss-overflow-shorthand',
				'  postcss-place',
				'  postcss-pseudo-class-any-link',
				'  postcss-relative-color-syntax',
				'  postcss-scope-pseudo-class',
				'  postcss-selector-not',
				'  postcss-stepped-value-functions',
				'  postcss-text-decoration-shorthand',
				'  postcss-trigonometric-functions',
				'  postcss-unset-value',

				'\nPlugin Help:',
				'  @csstools/csstools-cli <plugin-name>',
				'  @csstools/csstools-cli postcss-preset-env',
			];

			console.warn(allHelp.join('\n'));
		}
	}
}
