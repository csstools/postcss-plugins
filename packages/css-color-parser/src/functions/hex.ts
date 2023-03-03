import { xyz } from '@csstools/color-helpers';
import type { TokenHash } from '@csstools/css-tokenizer';
import { ColorData, SyntaxFlag } from '../color-data';
import { ColorSpace } from '../color-space';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

export function hex(hexToken: TokenHash): ColorData | -1 {
	const hexValue = toLowerCaseAZ(hexToken[4].value);
	if (hexValue.match(/[^a-f0-9]/)) {
		return -1;
	}

	const colorData: ColorData = {
		colorSpace: ColorSpace.XYZ_D50,
		channels: [0, 0, 0],

		sourceColorSpace: ColorSpace.sRGB,
		alpha: 1,
		missingComponents: [false, false, false, false],
		syntaxFlags: (new Set([SyntaxFlag.Hex])),
	};

	const length = hexValue.length;
	if (length === 3) {
		const r = hexValue[0];
		const g = hexValue[1];
		const b = hexValue[2];

		colorData.channels = xyz.sRGB_to_XYZ_D50([
			parseInt(r + r, 16) / 255,
			parseInt(g + g, 16) / 255,
			parseInt(b + b, 16) / 255,
		]);

		return colorData;
	} else if (length === 6) {
		const r = hexValue[0] + hexValue[1];
		const g = hexValue[2] + hexValue[3];
		const b = hexValue[4] + hexValue[5];

		colorData.channels = xyz.sRGB_to_XYZ_D50([
			parseInt(r, 16) / 255,
			parseInt(g, 16) / 255,
			parseInt(b, 16) / 255,
		]);

		return colorData;
	} else if (length === 4) {
		const r = hexValue[0];
		const g = hexValue[1];
		const b = hexValue[2];
		const a = hexValue[3];

		colorData.channels = xyz.sRGB_to_XYZ_D50([
			parseInt(r + r, 16) / 255,
			parseInt(g + g, 16) / 255,
			parseInt(b + b, 16) / 255,
		]);

		colorData.alpha = parseInt(a + a, 16) / 255;

		colorData.syntaxFlags.add(SyntaxFlag.HasAlpha);

		return colorData;
	} else if (length === 8) {
		const r = hexValue[0] + hexValue[1];
		const g = hexValue[2] + hexValue[3];
		const b = hexValue[4] + hexValue[5];
		const a = hexValue[6] + hexValue[7];

		colorData.channels = xyz.sRGB_to_XYZ_D50([
			parseInt(r, 16) / 255,
			parseInt(g, 16) / 255,
			parseInt(b, 16) / 255,
		]);

		colorData.alpha = parseInt(a, 16) / 255;

		colorData.syntaxFlags.add(SyntaxFlag.HasAlpha);

		return colorData;
	}

	return -1;
}
