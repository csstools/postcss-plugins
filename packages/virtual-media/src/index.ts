import { addRange } from './range/add';
import { Range } from './range/range';

export type Unknown = 'unknown';
export type Impossible = 'impossible';

export enum Operator {
	LT = '<',
	LT_OR_EQ = '<=',
	GT = '>',
	GT_OR_EQ = '>=',
	EQ = '=',
}

const fraction = 1 / Math.pow(2, 32);

export class VirtualMedia {
	#impossibleMedia = false;

	#types = new Set([
		'print',
		'screen',
	]);

	mustMatchType(type: string) {
		if (type.toLowerCase() === 'all') {
			return;
		}

		if (!this.#types.has(type.toLowerCase())) {
			this.#types.clear();
			return;
		}

		this.#types.clear();
		this.#types.add(type.toLowerCase());
	}

	mustNotMatchType(type: string) {
		if (type.toLowerCase() === 'all') {
			this.#types.clear();
			return;
		}

		this.#types.delete(type.toLowerCase());
	}

	mustMatchWidth(low: number, lowOperator: Operator, high: number, highOperator: Operator) {
		if (this.#impossibleMedia) {
			return;
		}

		const range = {
			low: low,
			high: high,
		};

		switch (lowOperator) {
			case Operator.LT:
				range.low = range.low - fraction;
				break;
			case Operator.GT:
				range.low = range.low + fraction;
				break;
		}

		switch (highOperator) {
			case Operator.LT:
				range.high = range.high - fraction;
				break;
			case Operator.GT:
				range.high = range.high + fraction;
				break;
		}

		this.#width = addRange(this.#width, {
			low: range.low,
			high: range.high,
		});

		if (this.#width.length === 0) {
			this.#impossibleMedia = true;
		}
	}

	#width: Array<Range<number>> = [
		{
			low: Number.MIN_SAFE_INTEGER,
			high: Number.MAX_SAFE_INTEGER,
		},
	];

	/**
	 * https://www.w3.org/TR/mediaqueries-5/#width
	 *
	 */
	get width(): number | Unknown | Impossible {
		if (this.#impossibleMedia) {
			return 'impossible';
		}

		if (this.#width.length !== 1) {
			return 'unknown';
		}

		if (this.#width[0].low !== this.#width[0].high) {
			return 'unknown';
		}

		return this.#width[0].low;
	}

	#height: Array<Range<number>> = [
		{
			low: Number.MIN_SAFE_INTEGER,
			high: Number.MAX_SAFE_INTEGER,
		},
	];

	/**
	 * https://www.w3.org/TR/mediaqueries-5/#height
	 *
	 */
	get height(): number | Unknown | Impossible {
		if (this.#impossibleMedia) {
			return 'impossible';
		}

		if (this.#height.length !== 1) {
			return 'unknown';
		}

		if (this.#height[0].low !== this.#height[0].high) {
			return 'unknown';
		}

		return this.#height[0].low;
	}

	#aspectRatio: Range<{
		/** dividend / divisor */
		dividend: number,
		/** dividend / divisor */
		divisor: number
	}> | Unknown = 'unknown';

	/**
	 * https://www.w3.org/TR/mediaqueries-5/#aspect-ratio
	 *
	 */
	get aspectRatio() {
		if (this.#impossibleMedia) {
			return 'unknown';
		}

		if (this.#aspectRatio === 'unknown') {
			const height = this.height;
			const width = this.width;
			if (height === 'impossible' || width === 'impossible') {
				return 'impossible';
			}

			if (height !== 'unknown' && width !== 'unknown') {
				return width / height;
			}

			return 'unknown';
		}

		if (this.#aspectRatio.low.dividend !== this.#aspectRatio.high.dividend) {
			return 'unknown';
		}

		if (this.#aspectRatio.low.divisor !== this.#aspectRatio.high.divisor) {
			return 'unknown';
		}

		if (this.#aspectRatio.low.dividend === 0) {
			return 'unknown';
		}

		if (this.#aspectRatio.low.divisor === 0) {
			return 'unknown';
		}

		return this.#aspectRatio.low.dividend / this.#aspectRatio.low.divisor;
	}
}
