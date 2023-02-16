import { stringify, tokenizer } from '@csstools/css-tokenizer';
import { isFunctionNode, isSimpleBlockNode, parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import { calcFromComponentValues } from '@csstools/css-calc';
import { checks } from './checks';

export function calc(css: string) {
	const t = tokenizer({
		css: css,
	});

	const tokens = [];

	{
		while (!t.endOfFile()) {
			tokens.push(t.nextToken());
		}

		tokens.push(t.nextToken()); // EOF-token
	}

	const result = parseCommaSeparatedListOfComponentValues(tokens, {});

	let hasTrigFunctions = false;
	for (let i = 0; i < result.length; i++) {
		const componentValues = result[i];

		for (let j = 0; j < componentValues.length; j++) {
			const componentValue = componentValues[j];

			if (isFunctionNode(componentValue)) {
				if (checks.includes(componentValue.getName().toLowerCase() + '(')) {
					hasTrigFunctions = true;
					break;
				}
			}

			if (!isSimpleBlockNode(componentValue) && !isFunctionNode(componentValue)) {
				continue;
			}

			componentValue.walk((entry, index) => {
				if (typeof index !== 'number') {
					return;
				}

				const node = entry.node;
				if (isFunctionNode(node)) {
					if (checks.includes(node.getName().toLowerCase() + '(')) {
						hasTrigFunctions = true;
						return false;
					}
				}
			});
		}
	}

	if (!hasTrigFunctions) {
		return css;
	}

	return calcFromComponentValues(result, { precision: 5, toCanonicalUnits: true }).map((componentValues) => {
		return componentValues.map((x) => stringify(...x.tokens())).join('');
	}).join(',');
}
