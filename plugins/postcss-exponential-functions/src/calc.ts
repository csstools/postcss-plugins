import { calcFromComponentValues } from '@csstools/css-calc';
import { parseCommaSeparatedListOfComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { TokenType, tokenize } from '@csstools/css-tokenizer';
import { FUNCTION_NAME_REGEXP } from './checks';

export function calc(css: string) {
	const tokens = tokenize({ css: css });
	if (!tokens.some(token => token[0] === TokenType.Function && FUNCTION_NAME_REGEXP.test(token[4].value))) {
		return css;
	}

	return stringify(
		calcFromComponentValues(
			parseCommaSeparatedListOfComponentValues(tokens),
			{
				precision: 5,
				toCanonicalUnits: true,
			}),
	);
}
