import { stringify, tokenizer, TokenType } from '@csstools/css-tokenizer';

export function transform(source: string, replacements: { vi: 'vw' | 'vh', vb: 'vw' | 'vh' }): string {
	{
		const lowerCaseValue = source.toLowerCase();
		if (!(lowerCaseValue.includes('vb') || lowerCaseValue.includes('vi'))) {
			return source;
		}
	}

	const t = tokenizer({ css: source });
	const tokens = [];
	let didTransformUnits = false;

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const token = t.nextToken();
		tokens.push(token);

		if (token[0] === TokenType.EOF) {
			break;
		}

		if (token[0] !== TokenType.Dimension) {
			continue;
		}

		const unit = token[4].unit.toLowerCase();
		const replacement = replacements[unit];
		if (!replacement) {
			continue;
		}

		token[1] = token[4].value.toString() + replacement;
		token[4].unit = replacement;
		didTransformUnits = true;
	}

	if (!didTransformUnits) {
		return source;
	}

	return stringify(...tokens);
}
