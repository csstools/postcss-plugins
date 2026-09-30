import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { convertUnit } from '../unit-conversions';
import { resultToCalculation } from './result-to-calculation';
import { arrayOfSameNumeric } from '../util/kind-of-number';
import type { CSSToken, NumericToken} from '@csstools/css-tokenizer';
import { isTokenNumeric } from '@csstools/css-tokenizer';

export function solveCalcMix(calcMixNode: FunctionNode, solvedNodes: Array<{ calcSum: TokenNode, percentage: number | false }>): Calculation | -1 {
	const firstSolvedNode = solvedNodes[0];

	const firstSolvedToken = firstSolvedNode.calcSum.value;
	if (!isTokenNumeric(firstSolvedToken)) {
		return -1;
	}

	const list = solvedNodes.map((x) => {
		return {
			calcSum: convertUnit(firstSolvedToken, x.calcSum.value),
			percentage: x.percentage
		};
	});

	const tokens = list.map((x) => x.calcSum);
	if (!arrayOfSameNumeric(tokens)) {
		return -1;
	}

	const { items: normalizedItems } = normalizeMixPercentages(list, false);
	const values = normalizedItems.map((item) => {
		return ((item.calcSum as NumericToken)[4].value * item.percentage) / 100;
	});

	let sum = 0;
	for (let i = 0; i < values.length; i++) {
		sum += values[i];
	}

	return resultToCalculation(calcMixNode, firstSolvedToken, sum);
}


// https://drafts.csswg.org/css-values-5/#normalize-mix-percentages
function normalizeMixPercentages(mix_items: Array<{ calcSum: CSSToken, percentage: number | false }>, force_normalization: boolean = false): { items: Array<{ calcSum: CSSToken, percentage: number }>, leftover: number } {
	// 1. Let specified sum be the sum of the percentages specified in items (clamped to 100%), or 0% if the percentages are omitted for all items.
	let specified_sum = 0;
	let number_of_omitted_percentages = 0;
	for (const item of mix_items) {
		if (item.percentage) {
			specified_sum += item.percentage;
		}

		if (item.percentage === false) {
			number_of_omitted_percentages++;
		}
	}

	// (clamped to 100%)
	specified_sum = Math.min(100, specified_sum);

	// 2. For each omitted percentage in items, set it to (100% - specified sum) / (number of omitted percentages).
	for (const item of mix_items) {
		if (item.percentage === false) {
			item.percentage = (100 - specified_sum) / (number_of_omitted_percentages);
		}
	}

	const mix_items_with_percentages = (mix_items as Array<{ calcSum: CSSToken, percentage: number }>).slice();

	// 3. Let total be the sum of the percentages of all the items.
	let total = 0;
	for (const item of mix_items_with_percentages) {
		total += item.percentage;
	}

	// 4. If total is greater than 100%, or if total is greater than 0% and the force normalization flag is true, multiply every percentage in items by (100% / total).
	if (total > 100 || (total > 0 && force_normalization)) {
		for (const item of mix_items_with_percentages) {
			item.percentage = item.percentage * (100 / total);
		}
	}

	let leftover = 0;
	if (total < 100) {
		leftover = 100 - total;
	}

	return {
		items: mix_items_with_percentages,
		leftover: leftover,
	};
}
