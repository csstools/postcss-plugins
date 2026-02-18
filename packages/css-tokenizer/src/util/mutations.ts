import { HYPHEN_MINUS, NULL, REPLACEMENT_CHARACTER } from '../code-points/code-points';
import { isIdentCodePoint, isIdentStartCodePoint } from '../code-points/ranges';
import type { TokenDimension, TokenIdent } from '../interfaces/token';

/**
 * Set the ident value and update the string representation.
 * This handles escaping.
 */
export function mutateIdent(ident: TokenIdent, newValue: string): void {
	const codePoints: Array<number> = [];
	for (const codePoint of newValue) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		codePoints.push(codePoint.codePointAt(0)!);
	}

	const result = String.fromCodePoint(...serializeIdent(codePoints));

	ident[1] = result;
	ident[4].value = newValue;
}

/**
 * Set the unit and update the string representation.
 * This handles escaping.
 */
export function mutateUnit(ident: TokenDimension, newUnit: string): void {
	const codePoints: Array<number> = [];
	for (const codePoint of newUnit) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		codePoints.push(codePoint.codePointAt(0)!);
	}

	const escapedCodePoints = serializeIdent(codePoints);
	if (escapedCodePoints[0] === 101) { // `e`
		insertEscapedCodePoint(escapedCodePoints, 0, escapedCodePoints[0]);
	}

	const result = String.fromCodePoint(...escapedCodePoints);

	const signCharacter = ident[4].signCharacter === '+' ? ident[4].signCharacter : '';
	const numericValue = ident[4].value.toString();

	ident[1] = `${signCharacter}${numericValue}${result}`;
	ident[4].unit = newUnit;
}

function serializeIdent(codePoints: Array<number>): Array<number> {
	let remainderStartIndex: number;

	if (codePoints[0] === NULL) {
		codePoints.splice(
			0,
			1,
			REPLACEMENT_CHARACTER
		);

		remainderStartIndex = 1;
	} else if (codePoints[0] === HYPHEN_MINUS && codePoints[1] === HYPHEN_MINUS) {
		remainderStartIndex = 2;
	} else if (codePoints[0] === HYPHEN_MINUS && codePoints[1]) {
		remainderStartIndex = 2;

		if (!isIdentStartCodePoint(codePoints[1])) {
			remainderStartIndex += insertEscapedCodePoint(codePoints, 1, codePoints[1]);
		}
	} else if (codePoints[0] === HYPHEN_MINUS && !codePoints[1]) {
		return [
			92, // `\` backslash
			codePoints[0]
		];
	} else if (isIdentStartCodePoint(codePoints[0])) {
		remainderStartIndex = 1;
	} else {
		remainderStartIndex = 1;
		remainderStartIndex += insertEscapedCodePoint(codePoints, 0, codePoints[0]);
	}

	for (let i = remainderStartIndex; i < codePoints.length; i++) {
		if (codePoints[i] === NULL) {
			codePoints.splice(
				i,
				1,
				REPLACEMENT_CHARACTER
			);

			i++;
			continue;
		}

		if (isIdentCodePoint(codePoints[i])) {
			continue;
		}

		i += insertEscapedCharacter(codePoints, i, codePoints[i]);
	}

	return codePoints;
}

function insertEscapedCharacter(codePoints: Array<number>, index: number, codePoint: number): number {
	codePoints.splice(
		index,
		1,
		92, // `\` backslash
		codePoint
	);

	return 1;
}

function insertEscapedCodePoint(codePoints: Array<number>, index: number, codePoint: number): number {
	const hexRepresentation = codePoint.toString(16);
	const codePointsForHexRepresentation: Array<number> = [];

	for (const x of hexRepresentation) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		codePointsForHexRepresentation.push(x.codePointAt(0)!);
	}

	codePoints.splice(
		index,
		1,
		92, // `\` backslash
		...codePointsForHexRepresentation,
		32, // ` ` space
	);

	return 1 + codePointsForHexRepresentation.length;
}
