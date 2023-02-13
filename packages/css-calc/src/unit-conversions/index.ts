import { CSSToken, NumberType, TokenType } from '@csstools/css-tokenizer';
import { convert_cm } from './cm';
import { convert_deg } from './deg';
import { convert_grad } from './grad';
import { convert_in } from './in';
import { convert_mm } from './mm';
import { convert_ms } from './ms';
import { convert_pc } from './pc';
import { convert_pt } from './pt';
import { convert_px } from './px';
import { convert_q } from './q';
import { convert_rad } from './rad';
import { convert_s } from './s';
import { convert_turn } from './turn';

export const conversions: Map<string, Map<string, (number) => number>> = new Map([
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
]);

export function convertUnit<T extends CSSToken>(a: CSSToken, b: T): T {
	if (a[0] !== TokenType.Dimension) {
		return b;
	}

	if (b[0] !== TokenType.Dimension) {
		return b;
	}

	const aUnit = a[4].unit.toLowerCase();
	const bUnit = b[4].unit.toLowerCase();

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
	return [
		TokenType.Dimension,
		value.toString() + a[4].unit,
		b[2],
		b[3],
		{
			value: value,
			unit: a[4].unit,
			type: Number.isInteger(value) ? NumberType.Integer : NumberType.Number,
		},
	] as T;
}
