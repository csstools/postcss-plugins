import { compare } from './compare';
import { Range } from './range';

export function addRange<T>(existingRanges: Array<Range<T>>, add: Range<T>): Array<Range<T>> {
	if (add.low > add.high) {
		throw new Error('Inversed range ' + JSON.stringify(add));
	}

	const updated: Array<Range<T>> = [];

	for (let i = 0; i < existingRanges.length; i++) {
		const existingRange = existingRanges[i];

		// The "add" spans an equal range as is currently allowed.
		// Return the current part of existing ranges.
		if (compare(add.low, existingRange.low) === 0 && compare(existingRange.high, add.high) === 0) {
			return [
				existingRange,
			];
		}

		// The "add" spans a range without any overlap with the current part.
		// Continue to the next part.
		if (compare(add.low, existingRange.high) > 0) {
			continue;
		}

		// The "add" spans a range without any overlap with the current part.
		// Continue to the next part.
		if (compare(add.high, existingRange.low) < 0) {
			continue;
		}

		// The "add" spans a smaller range, but is fully enclosed withing the current range.
		// Return the part to add.
		if (compare(add.low, existingRange.low) > 0 && compare(existingRange.high, add.high) > 0) {
			return [
				add,
			];
		}

		// The "add" spans a larger range than is currently allowed, but it fully encloses the current range.
		// Add the current part of the existing ranges to the updated slice.
		if (compare(add.low, existingRange.low) < 0 && compare(existingRange.high, add.high) < 0) {
			updated.push(existingRange);
			continue;
		}

		if (compare(add.low, existingRange.low) > 0) {
			updated.push({
				low: add.low,
				high: existingRange.high,
			});
			continue;
		}

		if (compare(add.high, existingRange.high) < 0) {
			updated.push({
				low: existingRange.low,
				high: add.high,
			});
			continue;
		}
	}

	return updated;
}
