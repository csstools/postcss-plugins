import type { ColorData } from '../color-data';
import { ColorNotation } from '../color-notation';
import { SyntaxFlag } from '../color-data';
import type { Color} from '@csstools/color-helpers';
import { namedColors } from '@csstools/color-helpers';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

const namedColorsMap: Map<string, Color> = new Map();
for (const [name, color] of Object.entries(namedColors)) {
	namedColorsMap.set(name, color);
}

export function namedColor(name: string): ColorData | false {
	const x = namedColorsMap.get(toLowerCaseAZ(name));
	if (!x) {
		return false;
	}

	return {
		colorNotation: ColorNotation.RGB,
		channels: [
			x[0] / 255,
			x[1] / 255,
			x[2] / 255,
		],
		alpha: 1,
		syntaxFlags: (new Set([SyntaxFlag.ColorKeyword, SyntaxFlag.NamedColor])),
	};
}
