import { isTokenDimension, isTokenEOF, stringify, tokenizer } from '@csstools/css-tokenizer';

export function transform(source: string, replacements: { vi: 'vw' | 'vh', vb: 'vw' | 'vh' }): string {
	const t = tokenizer({ css: source });
	const tokens = [];
	let didTransformUnits = false;

	while (true) {
		const token = t.nextToken();
		if (!token) {
			break;
		}

		tokens.push(token);

		if (isTokenEOF(token)) {
			break;
		}

		if (!isTokenDimension(token)) {
			continue;
		}

		const unit = token[4].unit.toLowerCase();
		let replacement;
		if (unit === 'vi') {
			replacement = replacements.vi;
		} else if (unit === 'vb') {
			replacement = replacements.vb;
		}
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
