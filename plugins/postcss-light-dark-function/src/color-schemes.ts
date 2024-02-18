import { tokenize } from '@csstools/css-tokenizer';
import { TokenType } from '@csstools/css-tokenizer';

const DARK_REGEX = /dark/i;
const LIGHT_REGEX = /light/i;

export function colorSchemes(value: string): [boolean, boolean] {
	const tokens = tokenize({ css: value });

	let light = false;
	let dark = false;

	tokens.forEach((token) => {
		if (token[0] !== TokenType.Ident) {
			return;
		}

		if (LIGHT_REGEX.test(token[4].value)) {
			light = true;
			return;
		}

		if (DARK_REGEX.test(token[4].value)) {
			dark = true;
			return;
		}
	});

	return [light, dark];
}
