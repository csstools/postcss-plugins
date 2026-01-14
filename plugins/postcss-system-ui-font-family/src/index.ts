import type { ComponentValue} from '@csstools/css-parser-algorithms';
import { isTokenNode, isWhiteSpaceOrCommentNode, parseCommaSeparatedListOfComponentValues, stringify, TokenNode } from '@csstools/css-parser-algorithms';
import { isTokenIdent, tokenize, TokenType } from '@csstools/css-tokenizer';
import type { PluginCreator } from 'postcss';

/** postcss-system-ui-font-family plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
};

const PROPERTY_REGEX = /^font(?:-family)?$/i;

const systemUiFamilies = [
	'system-ui',
	/* macOS 10.11-10.12 */ '-apple-system',
	/* Windows 6+ */ 'Segoe UI',
	/* Android 4+ */ 'Roboto',
	/* Ubuntu 10.10+ */ 'Ubuntu',
	/* Gnome 3+ */ 'Cantarell',
	/* KDE Plasma 5+ */ 'Noto Sans',
	/* fallback */ 'sans-serif',
];

function systemUIFamiliesAsComponentValues(existingSet: Map<string, number>, preserve: boolean): Array<Array<ComponentValue>> {
	return systemUiFamilies.filter((family) => {
		if (family === 'system-ui' && preserve) {
			return true;
		}

		return !existingSet.has(family)
	}).map((family) => {
		return [
			new TokenNode([TokenType.Ident, family, -1, -1, { value: family }]),
		]
	});
}

const systemUIFamiliesList = systemUiFamilies.join(',');

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options: pluginOptions = Object.assign(
		{
			preserve: true,
		},
		opts,
	);

	return {
		postcssPlugin: 'postcss-system-ui-font-family',
		Declaration(decl): void {
			if (!decl.variable && !PROPERTY_REGEX.test(decl.prop)) {
				return;
			}

			if (decl.value.includes(systemUIFamiliesList)) {
				return;
			}

			const originalValue = decl.value;

			const tokens = tokenize({ css: originalValue });
			const componentValuesList = parseCommaSeparatedListOfComponentValues(tokens)

			const foundFamilies = new Map<string, number>()
			let symstemUI_Index = -1;

			TOP_LEVEL:
			for (let i = 0; i < componentValuesList.length; i++) {
				const componentValues = componentValuesList[i];

				const fontFamilyParts = [];

				for (let j = 0; j < componentValues.length; j++) {
					const componentValue = componentValues[j];
					if (isWhiteSpaceOrCommentNode(componentValue)) {
						continue;
					}

					if (!isTokenNode(componentValue)) {
						continue TOP_LEVEL;
					}

					const token = componentValue.value;
					if (!isTokenIdent(token)) {
						continue TOP_LEVEL;
					}

					if (token[4].value.toLowerCase() === 'system-ui') {
						symstemUI_Index = i;
					}

					fontFamilyParts.push(token[4].value);
				}

				const fontFamily = fontFamilyParts.join(' ');
				if (systemUiFamilies.includes(fontFamily)) {
					foundFamilies.set(fontFamily, i)
				}
			}

			if (symstemUI_Index === -1) {
				return;
			}

			const replacements = systemUIFamiliesAsComponentValues(foundFamilies, !!options.preserve);
			if (replacements.length === 0) {
				return;
			}

			componentValuesList.splice(symstemUI_Index, 1, ...replacements);

			const modified = stringify(componentValuesList);
			if (modified === originalValue) {
				return;
			}

			decl.cloneBefore({
				prop: decl.prop,
				value: modified,
			});

			decl.remove();
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
