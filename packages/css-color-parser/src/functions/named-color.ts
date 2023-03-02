import type { ColorData } from '../color-data';
import { ColorSpace } from '../color-space';
import { SyntaxFlag } from '../color-data';
import { namedColors, xyz } from '@csstools/color-helpers';

const namedColorsMap = new Map();
for (const [name, color] of Object.entries(namedColors)) {
	namedColorsMap.set(name.toLowerCase(), color);
}

export function namedColor(name: string): ColorData | -1 {
	const x = namedColorsMap.get(name);
	if (!x) {
		return -1;
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
