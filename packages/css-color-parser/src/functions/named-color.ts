import type { ColorData } from '../color-data';
import { ColorSpace } from '../color-space';
import { SyntaxFlag } from '../color-data';
import { namedColors, xyz } from '@csstools/color-helpers';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

const namedColorsMap = new Map();
for (const [name, color] of Object.entries(namedColors)) {
	namedColorsMap.set(name, color);
}

export function namedColor(name: string): ColorData | false {
	const x = namedColorsMap.get(toLowerCaseAZ(name));
	if (!x) {
		return false;
	}

	return {
		colorSpace: ColorSpace.XYZ_D50,
		channels: xyz.sRGB_to_XYZ_D50([
			x[0] / 255,
			x[1] / 255,
			x[2] / 255,
		]),

		sourceColorSpace: ColorSpace.sRGB,
		alpha: 1,
		missingComponents: [false, false, false, false],
		syntaxFlags: (new Set([SyntaxFlag.ColorKeyword, SyntaxFlag.NamedColor])),
	};
}
