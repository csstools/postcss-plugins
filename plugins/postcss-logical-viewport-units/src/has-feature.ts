import { isTokenDimension, isTokenEOF, tokenizer } from '@csstools/css-tokenizer';

const HAS_UNITS_REGEX = /vb|vi/i;

export const predicate = {
	test(source: string): boolean {
		if (!HAS_UNITS_REGEX.test(source)) {
			return false;
		}

		const t = tokenizer({ css: source });

		while (true) {
			const token = t.nextToken();
			if (isTokenEOF(token)) {
				break;
			}

			if (!isTokenDimension(token)) {
				continue;
			}

			const unit = token[4].unit.toLowerCase();
			if (unit === 'vb' || unit === 'vi') {
				return true;
			}
		}

		return false;
	},
};
