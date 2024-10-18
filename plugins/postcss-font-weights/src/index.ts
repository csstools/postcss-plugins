import { isTokenNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify, TokenNode } from '@csstools/css-parser-algorithms';
import { isTokenIdent, NumberType, tokenize, TokenType } from '@csstools/css-tokenizer';
import type { PluginCreator } from 'postcss';

/** postcss-font-weights plugin options */
export type pluginOptions = {
	/** Determine the prefix applied to properties being processed */
	prefix?: string,
	/** Additional font weight keywords and numeric pairs */
	weights?: Record<string, number>,
};

const fontWeightMap: Map<string, number> = new Map([
	['thin', 100],
	['extra-light', 200],
	['extralight', 200],
	['ultra-light', 200],
	['ultralight', 200],
	['light', 300],
	['book', 400],
	['normal', 400],
	['regular', 400],
	['roman', 400],
	['medium', 500],
	['semi-bold', 600],
	['semibold', 600],
	['demi-bold', 600],
	['demibold', 600],
	['bold', 700],
	['extra-bold', 800],
	['extrabold', 800],
	['ultra-bold', 800],
	['ultrabold', 800],
	['black', 900],
	['heavy', 900],
]);

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	// get the dashed prefix
	const prefix = opts?.prefix ? `-${opts.prefix}-` : '';

	// get the (conditionally prefixed) property pattern
	const propertyRegExp = new RegExp(`^${prefix}(font(-weight)?)$`, 'i');

	// get the custom weights map
	let customFontWeightMap: Map<string, number> = fontWeightMap;

	if (opts?.weights) {
		customFontWeightMap = new Map(fontWeightMap); // clone
		for (const [k, v] of Object.entries(opts.weights)) {
			customFontWeightMap.set(k, v);
		}
	}

	// get the font-weight pattern
	const fontWeightRegExp = new RegExp(`(${Array.from(customFontWeightMap.keys()).join('|')})`, 'i');

	return {
		postcssPlugin: 'postcss-font-weights',
		Declaration(decl): void {
			if (!propertyRegExp.test(decl.prop)) {
				return
			}

			{
				// unprefixed property
				const property = decl.prop.match(propertyRegExp)?.[1];

				// conditionally remove the prefix from the property
				if (prefix && property) {
					decl.prop = property;
				}
			}

			if (!fontWeightRegExp.test(decl.value)) {
				return;
			}

			const replaced = replaceComponentValues(
				parseCommaSeparatedListOfComponentValues(tokenize({ css: decl.value })),
				(componentValue) => {
					if (
						!isTokenNode(componentValue) ||
						!isTokenIdent(componentValue.value)
					) {
						return;
					}

					const ident = componentValue.value[4].value.toLowerCase();
					const weight = customFontWeightMap.get(ident);
					if (!weight) {
						return;
					}

					return new TokenNode([TokenType.Number, weight.toString(), -1, -1, { value: weight, type: NumberType.Integer }]);
				},
			);

			const modified = stringify(replaced);
			if (modified === decl.value) {
				return;
			}

			decl.value = modified
		},
	};
};

creator.postcss = true;

export default creator;
