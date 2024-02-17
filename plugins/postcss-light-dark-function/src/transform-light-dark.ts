import { tokenize } from '@csstools/css-tokenizer';
import { TokenType } from '@csstools/css-tokenizer';
import { FunctionNode, TokenNode, WhitespaceNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { parseLightDark } from './parse-light-dark';
import { DARK_PROP, LIGHT_PROP } from './props';

export function transformLightDark(value: string): string {
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

			return [
				new FunctionNode(
					[TokenType.Function, 'var(', -1, -1, { value: 'var' }],
					[TokenType.CloseParen, ')', -1, -1, undefined],
					[
						new TokenNode(
							[TokenType.Ident, LIGHT_PROP, -1, -1, { value: LIGHT_PROP }],
						),
						new TokenNode(
							[TokenType.Comma, ',', -1, -1, undefined],
						),
						new WhitespaceNode(
							[[TokenType.Whitespace, ' ', -1, -1, undefined]],
						),
						light,
					],
				),
				new WhitespaceNode(
					[[TokenType.Whitespace, ' ', -1, -1, undefined]],
				),
				new FunctionNode(
					[TokenType.Function, 'var(', -1, -1, { value: 'var' }],
					[TokenType.CloseParen, ')', -1, -1, undefined],
					[
						new TokenNode(
							[TokenType.Ident, DARK_PROP, -1, -1, { value: DARK_PROP }],
						),
						new TokenNode(
							[TokenType.Comma, ',', -1, -1, undefined],
						),
						new WhitespaceNode(
							[[TokenType.Whitespace, ' ', -1, -1, undefined]],
						),
						dark,
					],
				),
			];
		},
	);

	return stringify(replaced);
}
