import type { ColorData} from '../color-data';
import { SyntaxFlag, noneToZeroInRelativeColorDataChannels, normalizeRelativeColorDataChannels } from '../color-data';
import type { ColorParser } from '../color-parser';
import { ColorNotation } from '../color-notation';
import type { FunctionNode} from '@csstools/css-parser-algorithms';
import { TokenNode, isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode, replaceComponentValues } from '@csstools/css-parser-algorithms';
import type { TokenNumber} from '@csstools/css-tokenizer';
import { isTokenDelim, isTokenIdent, isTokenNumber, isTokenNumeric } from '@csstools/css-tokenizer';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';
import { calcFromComponentValues, mathFunctionNames } from '@csstools/css-calc';
import { normalize_Color_ChannelValues } from './color-normalize-channel-values';

export function alpha(colorFunctionNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	const syntaxFlags: Array<SyntaxFlag> = [];

	let hasAlphaSlash: boolean = false;
	let hasAlpha: boolean = false;
	let relativeToColor: ColorData | false = false;
	let relativeColorChannels: Map<string, TokenNumber> | undefined = undefined;
	let relativeColorChannelsWithoutNone: Map<string, TokenNumber> | undefined = undefined;

	const colorData: ColorData = {
		colorNotation: ColorNotation.sRGB,
		channels: [0, 0, 0],
		alpha: 1,
		syntaxFlags: (new Set(syntaxFlags)),
	};

	for (let i = 0; i < colorFunctionNode.value.length; i++) {
		let node = colorFunctionNode.value[i];
		if (isWhitespaceNode(node) || isCommentNode(node)) {
			// consume as much whitespace as possible
			while (isWhitespaceNode(colorFunctionNode.value[i + 1]) || isCommentNode(colorFunctionNode.value[i + 1])) {
				i++;
			}

			continue;
		}

		if (
			relativeToColor &&
			!hasAlphaSlash &&
			!hasAlpha &&
			isTokenNode(node) &&
			isTokenDelim(node.value) &&
			node.value[4].value === '/'
		) {
			hasAlphaSlash = true;
			continue;
		}

		if (isFunctionNode(node) && mathFunctionNames.has(toLowerCaseAZ(node.getName()))) {
			const [[result]] = calcFromComponentValues([[node]], {
				censorIntoStandardRepresentableValues: true,
				globals: relativeColorChannelsWithoutNone,
				precision: -1,
				toCanonicalUnits: true,
				rawPercentages: true,
			});
			if (!result || !isTokenNode(result) || !isTokenNumeric(result.value)) {
				return false;
			}

			if (Number.isNaN(result.value[4].value)) {
				// NaN does not escape a top-level calculation; it’s censored into a zero value
				result.value[4].value = 0;
			}

			node = result;
		}

		if (
			!hasAlphaSlash &&
			!hasAlpha &&
			isTokenNode(node) &&
			isTokenIdent(node.value) &&
			toLowerCaseAZ(node.value[4].value) === 'from'
		) {
			if (relativeToColor) {
				return false;
			}

			while (isWhitespaceNode(colorFunctionNode.value[i + 1]) || isCommentNode(colorFunctionNode.value[i + 1])) {
				i++;
			}

			i++;
			node = colorFunctionNode.value[i];

			relativeToColor = colorParser(node);
			if (relativeToColor === false) {
				return false;
			}

			relativeColorChannels = normalizeRelativeColorDataChannels(relativeToColor);
			relativeColorChannelsWithoutNone = noneToZeroInRelativeColorDataChannels(relativeColorChannels);

			colorData.syntaxFlags = new Set(relativeToColor.syntaxFlags);
			colorData.syntaxFlags.add(SyntaxFlag.RelativeAlphaSyntax);
			colorData.channels = [...relativeToColor.channels];
			colorData.colorNotation = relativeToColor.colorNotation;
			colorData.alpha = relativeToColor.alpha;

			continue;
		}

		if (!hasAlphaSlash) {
			return false;
		}

		if (hasAlpha) {
			return false;
		}

		if (isTokenNode(node)) {
			if (isTokenIdent(node.value) && toLowerCaseAZ(node.value[4].value) === 'alpha' && relativeColorChannels && relativeColorChannels.has('alpha')) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				colorData.alpha = relativeColorChannels.get('alpha')![4].value!;
				hasAlpha = true;
				continue;
			}

			const normalized = normalize_Color_ChannelValues(node.value, 3, colorData);
			if (!normalized || !isTokenNumber(normalized)) {
				return false;
			}

			colorData.alpha = new TokenNode(normalized);
			hasAlpha = true;
			continue;
		}

		if (isFunctionNode(node)) {
			const replaced = replaceComponentValues([[node]], (x) => {
				if (isTokenNode(x)  && isTokenIdent(x.value) && toLowerCaseAZ(x.value[4].value) === 'alpha' && relativeColorChannels && relativeColorChannels.has('alpha')) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					return new TokenNode(relativeColorChannels.get('alpha')!);
				}
			});

			colorData.alpha = replaced[0][0];
			hasAlpha = true;
			continue;
		}

		return false;
	}

	if (!relativeColorChannels) {
		return false;
	}

	return colorData;
}
