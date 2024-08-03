import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import type { FunctionNode} from '@csstools/css-parser-algorithms';
import { isTokenNode } from '@csstools/css-parser-algorithms';
import { ColorNotation } from '../color-notation';
import { SyntaxFlag } from '../color-data';
import { normalize_legacy_HSL_ChannelValues, normalize_modern_HSL_ChannelValues } from './hsl-normalize-channel-values';
import { threeChannelLegacySyntax } from './three-channel-legacy-syntax';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';
import { isTokenComma } from '@csstools/css-tokenizer';

export function hsl(hslNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	if (hslNode.value.some((x) => isTokenNode(x) && isTokenComma(x.value))) {
		const output = hslCommaSeparated(hslNode);
		if (output !== false) {
			return output;
		}
	}

	{
		const output = hslSpaceSeparated(hslNode, colorParser);
		if (output !== false) {
			return output;
		}
	}

	return false;
}

function hslCommaSeparated(hslNode: FunctionNode): ColorData | false {
	return threeChannelLegacySyntax(
		hslNode,
		normalize_legacy_HSL_ChannelValues,
		ColorNotation.HSL,
		[
			SyntaxFlag.LegacyHSL,
		],
	);
}

function hslSpaceSeparated(hslNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	return threeChannelSpaceSeparated(
		hslNode,
		normalize_modern_HSL_ChannelValues,
		ColorNotation.HSL,
		[],
		colorParser,
	);
}
