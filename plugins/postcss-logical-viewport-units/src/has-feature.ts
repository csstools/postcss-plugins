import { isTokenDimension, isTokenEOF, tokenizer } from '@csstools/css-tokenizer';

export const predicate = {
	test(source: string): boolean {
		{
			const lowerCaseValue = source.toLowerCase();
			if (!(lowerCaseValue.includes('vb') || lowerCaseValue.includes('vi'))) {
				return false;
			}
		}

		const t = tokenizer({ css: source });

		// eslint-disable-next-line no-constant-condition
		while (true) {
			const token = t.nextToken();
			if (!token) {
				break;
			}

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
