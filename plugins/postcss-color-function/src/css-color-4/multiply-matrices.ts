/**
 * Simple matrix (and vector) multiplication
 * Warning: No error handling for incompatible dimensions!
 * @author Lea Verou 2020 MIT License
 *
 * @license W3C
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/multiply-matrices.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/multiply-matrices.js
 */
// A is m x n. B is n x p. product is m x p.
export function multiplyMatrices(a: Array<Array<number>> | Array<number>, b: Array<Array<number>> | Array<number>): Array<Array<number>> | Array<number> {
	const m = a.length;

	let A: Array<Array<number>>;
	if (!Array.isArray(a[0])) {
		// A is vector, convert to [[a, b, c, ...]]
		A = [a as Array<number>];
	} else {
		A = a as Array<Array<number>>;
	}

	let B: Array<Array<number>>;
	if (!Array.isArray(b[0])) {
		// B is vector, convert to [[a], [b], [c], ...]]
		B = (b as Array<number>).map(x => [x]);
	}

	const p = B[0].length;
	const B_cols = B[0].map((_, i) => B.map(x => x[i])); // transpose B
	let product: Array<Array<number>> | Array<number> = A.map(row => B_cols.map(col => {
		if (!Array.isArray(row)) {
			return col.reduce((d, f) => d + f * row, 0);
		}

		return row.reduce((d, f, i) => d + f * (col[i] || 0), 0);
	}));

	if (m === 1) {
		product = product[0]; // Avoid [[a, b, c, ...]]
	}

	if (p === 1) {
		return product.map(x => x[0]); // Avoid [[a], [b], [c], ...]]
	}

	return product;
}
