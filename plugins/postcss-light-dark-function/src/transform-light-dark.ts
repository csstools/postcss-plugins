import { tokenize } from '@csstools/css-tokenizer';
import { TokenType } from '@csstools/css-tokenizer';
import { FunctionNode, TokenNode, WhitespaceNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { parseLightDark } from './parse-light-dark';
import { LIGHT_PROP } from './props';

export function transformLightDark(value: string, toggleNameGenerator: () => string): { value: string, toggles: Map<string, string> } {
	const toggles: Map<string, string> = new Map();

	const replaced = replaceComponentValues(
		parseCommaSeparatedListOfComponentValues(
			tokenize({ css: value }),
		),
		(componentValue) => {
			const lightDark = parseLightDark(componentValue);
			if (!lightDark) {
				return;
			}

			const [light, dark] = lightDark;

			const toggleName = toggleNameGenerator();
			toggles.set(toggleName, `var(${LIGHT_PROP}) ${dark.toString()}`);

			return new FunctionNode(
				[TokenType.Function, 'var(', -1, -1, { value: 'var' }],
				[TokenType.CloseParen, ')', -1, -1, undefined],
				[
					new TokenNode(
						[TokenType.Ident, toggleName, -1, -1, { value: toggleName }],
					),
					new TokenNode(
						[TokenType.Comma, ',', -1, -1, undefined],
					),
					new WhitespaceNode(
						[[TokenType.Whitespace, ' ', -1, -1, undefined]],
					),
					light,
				],
			);
		},
	);

	return {
		value: stringify(replaced),
		toggles,
	};
}
