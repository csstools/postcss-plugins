import type { CSSToken, TokenDimension } from '@csstools/css-tokenizer';
import { NumberType, TokenType, isTokenDimension, mutateUnit } from '@csstools/css-tokenizer';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';
import { canonicalUnits } from './canonical';
import { convert_cm } from './cm';
import { convert_deg } from './deg';
import { convert_grad } from './grad';
import { convert_hz } from './hz';
import { convert_in } from './in';
import { convert_khz } from './khz';
import { convert_mm } from './mm';
import { convert_ms } from './ms';
import { convert_pc } from './pc';
import { convert_pt } from './pt';
import { convert_px } from './px';
import { convert_q } from './q';
import { convert_rad } from './rad';
import { convert_s } from './s';
import { convert_turn } from './turn';

const conversions: Map<string, Map<string, (number: number) => number>> = new Map([
	[
		'cm',
		convert_cm,
	],
	[
		'mm',
		convert_mm,
	],
	[
		'q',
		convert_q,
	],
	[
		'in',
		convert_in,
	],
	[
		'pc',
		convert_pc,
	],
	[
		'pt',
		convert_pt,
	],
	[
		'px',
		convert_px,
	],
	[
		'ms',
		convert_ms,
	],
	[
		's',
		convert_s,
	],
	[
		'deg',
		convert_deg,
	],
	[
		'grad',
		convert_grad,
	],
	[
		'rad',
		convert_rad,
	],
	[
		'turn',
		convert_turn,
	],
	[
		'hz',
		convert_hz,
	],
	[
		'khz',
		convert_khz,
	],
]);

export function convertUnit<T extends CSSToken>(a: CSSToken, b: T): T {
	if (!isTokenDimension(a)) {
		return b;
	}

	if (!isTokenDimension(b)) {
		return b;
	}

	const aUnit = toLowerCaseAZ(a[4].unit);
	const bUnit = toLowerCaseAZ(b[4].unit);

	if (aUnit === bUnit) {
		return b;
	}

	const conversionTable = conversions.get(bUnit);
	if (!conversionTable) {
		return b;
	}

	const conversion = conversionTable.get(aUnit);
	if (!conversion) {
		return b;
	}

	const value = conversion(b[4].value);
	const convertedToken: TokenDimension = [
		TokenType.Dimension,
		'',
		b[2],
		b[3],
		{
			...b[4],
			signCharacter: value < 0 ? '-' : undefined,
			type: Number.isInteger(value) ? NumberType.Integer : NumberType.Number,
			value: value,
		},
	];

	mutateUnit(convertedToken, a[4].unit);

	return convertedToken as T;
}

export function toCanonicalUnit<T extends CSSToken>(a: T): T {
	if (!isTokenDimension(a)) {
		return a;
	}

	const aUnit = toLowerCaseAZ(a[4].unit);
	const bUnit = canonicalUnits[aUnit];

	if (aUnit === bUnit) {
		return a;
	}

	const conversionTable = conversions.get(aUnit);
	if (!conversionTable) {
		return a;
	}

	const conversion = conversionTable.get(bUnit);
	if (!conversion) {
		return a;
	}

	const value = conversion(a[4].value);
	const convertedToken: TokenDimension = [
		TokenType.Dimension,
		'',
		a[2],
		a[3],
		{
			...a[4],
			signCharacter: value < 0 ? '-' : undefined,
			type: Number.isInteger(value) ? NumberType.Integer : NumberType.Number,
			value: value,
		},
	];

	mutateUnit(convertedToken, bUnit);

	return convertedToken as T;
}
