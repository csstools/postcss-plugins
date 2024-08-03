import { calcFromComponentValues, mathFunctionNames } from '@csstools/css-calc';
import type { ComponentValue} from '@csstools/css-parser-algorithms';
import { isFunctionNode, isTokenNode } from '@csstools/css-parser-algorithms';
import type { CSSToken} from '@csstools/css-tokenizer';
import { NumberType, TokenType, isTokenDimension, isTokenNumber, isTokenNumeric } from '@csstools/css-tokenizer';
import type { MediaFeature, MediaFeatureComparison, MediaFeatureValue} from '@csstools/media-query-list-parser';
import { invertComparison, matchesRatio, matchesRatioExactly, MediaFeatureEQ, MediaFeatureGT, MediaFeatureLT, newMediaFeaturePlain } from '@csstools/media-query-list-parser';

const unitsForFeature: Record<string, string | undefined> = {
	'width': 'px',
	'height': 'px',
	'device-width': 'px',
	'device-height': 'px',
	'aspect-ratio': '',
	'device-aspect-ratio': '',
	'color': '',
	'color-index': '',
	'monochrome': '',
	'resolution': 'dpi',
};

const integerFeatures: Record<string, string | boolean> = {
	'width': false,
	'height': false,
	'device-width': false,
	'device-height': false,
	'aspect-ratio': false,
	'device-aspect-ratio': false,
	'color': true,
	'color-index': true,
	'monochrome': true,
	'resolution': 'dpi',
};

function featureNamePrefix(operator: MediaFeatureComparison): 'max-' | 'min-' | '' {
	if (operator === MediaFeatureLT.LT || operator === MediaFeatureLT.LT_OR_EQ) {
		return 'max-';
	}

	if (operator === MediaFeatureGT.GT || operator === MediaFeatureGT.GT_OR_EQ) {
		return 'min-';
	}

	return '';
}

const power = {
	'>': 1,
	'<': -1,
};

const step = .001; // smallest even number that won’t break complex queries (1in = 96px)
const pixelStep = .02; // smallest step that will work in older Safari

export function transformSingleNameValuePair(name: string, operator: MediaFeatureComparison, value: MediaFeatureValue, nameBeforeValue: boolean): MediaFeature | undefined {
	let tokensBefore: Array<CSSToken> = value.before;
	let tokensAfter: Array<CSSToken> = value.after;
	if (!nameBeforeValue) {
		tokensBefore = value.after;
		tokensAfter = value.before;
	}

	if (!nameBeforeValue) {
		const invertedOperator = invertComparison(operator);
		if (invertedOperator === false) {
			return;
		}

		operator = invertedOperator;
	}

	if (operator === MediaFeatureEQ.EQ || operator === MediaFeatureLT.LT_OR_EQ || operator === MediaFeatureGT.GT_OR_EQ) {
		if (Array.isArray(value.value)) {
			return newMediaFeaturePlain(
				featureNamePrefix(operator) + name,
				...tokensBefore,
				...value.value.flatMap(x => x.tokens()),
				...tokensAfter,
			);
		} else {
			return newMediaFeaturePlain(
				featureNamePrefix(operator) + name,
				...tokensBefore,
				...value.value.tokens(),
				...tokensAfter,
			);
		}
	}

	let isRatio = false;
	let valueNode: ComponentValue | undefined;
	let valueRemainder: Array<CSSToken>;

	if (Array.isArray(value.value)) {
		if (!matchesRatioExactly(value.value)) {
			return;
		}

		if (name !== 'aspect-ratio' && name !== 'device-aspect-ratio') {
			return;
		}

		const ratioValues = matchesRatio(value.value);
		if (ratioValues === -1) {
			return;
		}

		isRatio = true;
		valueNode = value.value[ratioValues[0]];
		valueRemainder = [
			...value.value.slice(ratioValues[0] + 1).flatMap(x => x.tokens()),
		];
	} else {
		valueNode = value.value;
		valueRemainder = [];
	}

	const featureUnit: string | undefined = unitsForFeature[name.toLowerCase()];

	// 1. If the value is a calc() function, try to evaluate it.
	if (isFunctionNode(valueNode)) {
		const functionName = valueNode.getName().toLowerCase();
		if (mathFunctionNames.has(functionName) || functionName === 'env') {
			const [[result]] = calcFromComponentValues([[valueNode]], { precision: 5, toCanonicalUnits: true });
			if (
				result &&
				isTokenNode(result) &&
				isTokenNumeric(result.value) &&
				Number.isInteger(result.value[4].value)
			) {
				// 1.a. If the result is an integer it is safe to use the result as the value and proceed as if there was no calc() function.

				valueNode = result;
			} else {
				// 1.b. If the result is not an integer, it is not safe to use the result as the value.
				// Wrap the value in an additional calc() function and adjust with the appropriate step.

				let valueToken: CSSToken;

				if (typeof featureUnit !== 'undefined') {
					const tokenValue = power[operator] * (featureUnit === 'px' ? pixelStep : step);

					valueToken = [TokenType.Dimension, `${tokenValue.toString()}${featureUnit}`, -1, -1, { value: tokenValue, unit: featureUnit, type: NumberType.Integer }];
				} else if (integerFeatures[name] === true) {
					const tokenValue = power[operator];

					valueToken = [TokenType.Number, tokenValue.toString(), -1, -1, { value: tokenValue, type: NumberType.Integer }];
				} else if (isRatio) {
					const tokenValue = power[operator] * step;

					valueToken = [TokenType.Number, tokenValue.toString(), -1, -1, { value: tokenValue, type: NumberType.Integer }];
				} else {
					const tokenValue = power[operator];

					valueToken = [TokenType.Number, tokenValue.toString(), -1, -1, { value: tokenValue, type: NumberType.Integer }];
				}

				// 1.c. return a new media feature with the adjusted value.
				return newMediaFeaturePlain(
					featureNamePrefix(operator) + name,
					...tokensBefore,
					[TokenType.Function, 'calc(', -1, -1, { value: 'calc(' }],
					[TokenType.OpenParen, '(', -1, -1, undefined],
					...valueNode.tokens().slice(1),
					[TokenType.Whitespace, ' ', -1, -1, undefined],
					[TokenType.Delim, '+', -1, -1, { value: '+' }],
					[TokenType.Whitespace, ' ', -1, -1, undefined],
					valueToken,
					[TokenType.CloseParen, ')', -1, -1, undefined],
					...valueRemainder,
					...tokensAfter,
				);
			}
		}
	}

	// 2. If the value is not a single token, return.
	if (!isTokenNode(valueNode)) {
		return;
	}

	// 3. The value is a single token.
	// Adjust the value by the appropriate step and return a new media feature with the adjusted value.

	let token = valueNode.value;
	let tokenValue: number;
	let tokenUnit = '';

	if (typeof featureUnit !== 'undefined' && isTokenNumber(token) && token[4].value === 0) {
		// unit-less zero for dimension features:
		// - convert to "1<unit>" or "-1<unit>"
		tokenValue = power[operator];
		tokenUnit = featureUnit;
	} else if (isTokenNumber(token) && token[4].value === 0) {
		// unit-less zero for number features:
		// - convert to "1" or "-1"
		tokenValue = power[operator];
		tokenUnit = '';
	} else if ((isTokenDimension(token)) && token[4].value === 0) {
		// Zero values:
		// - convert to "1" or "-1"
		// - assign a unit when needed
		tokenValue = power[operator];
		tokenUnit = token[4].unit;
	} else if (isTokenNumber(token) && integerFeatures[name] === true) {
		// Integer features
		// - add "+step" or "-step"
		tokenValue = token[4].value + power[operator];
	} else if (isTokenDimension(token) && token[4].unit === 'px' && token[4].type === NumberType.Integer) {
		// Pixel values
		// - add "+1" or "-1"
		tokenValue = Number(Math.round(Number(token[4].value + pixelStep * power[operator] + 'e6')) + 'e-6');
	} else if (isTokenDimension(token) || isTokenNumber(token)) {
		// Float or non-pixel values
		// - add "+step" or "-step"
		tokenValue = Number(Math.round(Number(token[4].value + step * power[operator] + 'e6')) + 'e-6');
	} else {
		return;
	}

	if (tokenUnit) {
		token = [
			TokenType.Dimension,
			token[1],
			token[2],
			token[3],
			{
				value: token[4].value,
				unit: tokenUnit,
				type: token[4].type,
			},
		];
	}

	token[4].value = tokenValue;
	if (isTokenDimension(token)) {
		token[1] = token[4].value.toString() + token[4].unit;
	} else {
		token[1] = token[4].value.toString();
	}

	return newMediaFeaturePlain(
		featureNamePrefix(operator) + name,
		...tokensBefore,
		token,
		...valueRemainder,
		...tokensAfter,
	);
}
