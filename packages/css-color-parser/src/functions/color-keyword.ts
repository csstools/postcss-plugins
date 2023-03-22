import type { ColorData } from '../color-data';
import { ColorNotation } from '../color-notation';
import { SyntaxFlag } from '../color-data';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

export function colorKeyword(name: string): ColorData | false {
	if (toLowerCaseAZ(name) === 'transparent') {
		return {
			colorNotation: ColorNotation.RGB,
			channels: [0, 0, 0],
			alpha: 0,
			syntaxFlags: (new Set([SyntaxFlag.ColorKeyword])),
		};
	}

	return false;
}
