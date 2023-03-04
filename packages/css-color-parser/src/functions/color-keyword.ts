import type { ColorData } from '../color-data';
import { ColorSpace } from '../color-space';
import { SyntaxFlag } from '../color-data';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

export function colorKeyword(name: string): ColorData | false {
	if (toLowerCaseAZ(name) === 'transparent') {
		return {
			colorSpace: ColorSpace.XYZ_D50,
			channels: [0, 0, 0],

			sourceColorSpace: ColorSpace.sRGB,
			alpha: 0,
			missingComponents: [false, false, false, false],
			syntaxFlags: (new Set([SyntaxFlag.ColorKeyword])),
		};
	}

	return false;
}
