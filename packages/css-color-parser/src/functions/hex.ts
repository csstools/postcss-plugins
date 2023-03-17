import type { ColorData } from '../color-data';
import type { TokenHash } from '@csstools/css-tokenizer';
import { ColorNotation } from '../color-notation';
import { SyntaxFlag } from '../color-data';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

export function hex(hexToken: TokenHash): ColorData | false {
	const hexValue = toLowerCaseAZ(hexToken[4].value);
	if (hexValue.match(/[^a-f0-9]/)) {
		return false;
	}

	const colorData: ColorData = {
		colorNotation: ColorNotation.HEX,
		channels: [0, 0, 0],
		alpha: 1,
		syntaxFlags: (new Set([SyntaxFlag.Hex])),
	};

	const length = hexValue.length;
	if (length === 3) {
		const r = hexValue[0];
		const g = hexValue[1];
		const b = hexValue[2];

		colorData.channels = [
			parseInt(r + r, 16) / 255,
			parseInt(g + g, 16) / 255,
			parseInt(b + b, 16) / 255,
		];

		return colorData;
	} else if (length === 6) {
		const r = hexValue[0] + hexValue[1];
		const g = hexValue[2] + hexValue[3];
		const b = hexValue[4] + hexValue[5];

		colorData.channels = [
			parseInt(r, 16) / 255,
			parseInt(g, 16) / 255,
			parseInt(b, 16) / 255,
		];

		return colorData;
	} else if (length === 4) {
		const r = hexValue[0];
		const g = hexValue[1];
		const b = hexValue[2];
		const a = hexValue[3];

		colorData.channels = [
			parseInt(r + r, 16) / 255,
			parseInt(g + g, 16) / 255,
			parseInt(b + b, 16) / 255,
		];

		colorData.alpha = parseInt(a + a, 16) / 255;

		colorData.syntaxFlags.add(SyntaxFlag.HasAlpha);

		return colorData;
	} else if (length === 8) {
		const r = hexValue[0] + hexValue[1];
		const g = hexValue[2] + hexValue[3];
		const b = hexValue[4] + hexValue[5];
		const a = hexValue[6] + hexValue[7];

		colorData.channels = [
			parseInt(r, 16) / 255,
			parseInt(g, 16) / 255,
			parseInt(b, 16) / 255,
		];

		colorData.alpha = parseInt(a, 16) / 255;

		colorData.syntaxFlags.add(SyntaxFlag.HasAlpha);

		return colorData;
	}

	return false;
}
