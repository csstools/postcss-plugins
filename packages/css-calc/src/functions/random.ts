import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { convertUnit } from '../unit-conversions';
import { resultToCalculation } from './result-to-calculation';
import { twoOfSameNumeric } from '../util/kind-of-number';
import type { CSSToken} from '@csstools/css-tokenizer';
import { isTokenNumeric } from '@csstools/css-tokenizer';
import type { conversionOptions } from '../options';

const NULL_CHAR = String.fromCodePoint(0x000);

export type RandomValueSharing = {
	isAuto: boolean,
	dashedIdent: string,
	elementShared: boolean,
	fixed: number,
}

export function solveRandom(randomNode: FunctionNode, randomValueSharing: RandomValueSharing, a: TokenNode, b: TokenNode, stepValue: TokenNode|null, options: conversionOptions): Calculation | -1 {
	if (randomValueSharing.fixed === -1 && !options.randomCaching) {
		return -1;
	}

	if (!options.randomCaching) {
		options.randomCaching = {
			propertyName: '',
			propertyN: 0,
			elementID: '',
			documentID: '',
		}
	}

	if (options.randomCaching && !options.randomCaching.propertyN) {
		options.randomCaching.propertyN = 0;
	}

	const aToken = a.value;
	if (!isTokenNumeric(aToken)) {
		return -1;
	}

	const bToken = convertUnit(aToken, b.value);
	if (!twoOfSameNumeric(aToken, bToken)) {
		return -1;
	}

	let stepValueToken: CSSToken | null = null;
	if (stepValue) {
		stepValueToken = convertUnit(aToken, stepValue.value);
		if (!twoOfSameNumeric(aToken, stepValueToken)) {
			return -1;
		}
	}

	if (!Number.isFinite(aToken[4].value)) {
		return resultToCalculation(randomNode, aToken, Number.NaN);
	}

	if (!Number.isFinite(bToken[4].value)) {
		return resultToCalculation(randomNode, aToken, Number.NaN);
	}

	if (!Number.isFinite(bToken[4].value - aToken[4].value)) {
		return resultToCalculation(randomNode, aToken, Number.NaN);
	}

	if (stepValueToken && !Number.isFinite(stepValueToken[4].value)) {
		return resultToCalculation(randomNode, aToken, aToken[4].value);
	}

	const rnd = randomValueSharing.fixed === -1 ? sfc32(
		crc32(
			[
				randomValueSharing.dashedIdent ? randomValueSharing.dashedIdent : (`${options.randomCaching?.propertyName} ${options.randomCaching.propertyN++}`),
				randomValueSharing.elementShared ? "" : options.randomCaching.elementID,
				options.randomCaching.documentID,
			].join(NULL_CHAR),
		),
	) : () : number => { return randomValueSharing.fixed };

	let min = aToken[4].value;
	let max = bToken[4].value;
	if (min > max) {
		[min, max] = [max, min];
	}

	if (
		stepValueToken && (
			(stepValueToken[4].value <= 0) ||
			((Math.abs(min - max) / stepValueToken[4].value) > 10_000_000_000)
		)
	) {
		stepValueToken = null
	}

	if (stepValueToken) {
		const err = Math.max(stepValueToken[4].value / 1000, 0.000_000_001);

		const steps = [min];
		let lastStep = 0;
		while (true) {
			lastStep += stepValueToken[4].value;

			const stepResult = min + lastStep;
			if ((stepResult + err) < max) {
				steps.push(stepResult);
			} else {
				steps.push(max);
				break;
			}

			if ((stepResult + stepValueToken[4].value - err) > max) {
				break;
			}
		}

		const randomValue = rnd();
		return resultToCalculation(
			randomNode,
			aToken,
			Number(steps[Math.floor(steps.length * randomValue)].toFixed(5))
		);
	}

	const randomValue = rnd();
	return resultToCalculation(
		randomNode,
		aToken,
		Number(((randomValue * (max - min)) + min).toFixed(5))
	);
}

function sfc32(a: number = 0.34944106645296036, b: number = 0.19228640875738723, c: number = 0.8784393832007205, d: number = 0.04850964319275053): () => number {
	return (): number => {
		a |= 0; b |= 0; c |= 0; d |= 0;
		const t = (a + b | 0) + d | 0;
		d = d + 1 | 0;
		a = b ^ b >>> 9;
		b = c + (c << 3) | 0;
		c = (c << 21 | c >>> 11);
		c = c + t | 0;
		return (t >>> 0) / 4294967296;
	}
}

function crc32(str: string): number {
	const table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
	let crc = 0;
	let x = 0;
	let y = 0;

	crc = crc ^ (-1);
	for (let i = 0, iTop = str.length; i < iTop; i++) {
		y = (crc ^ str.charCodeAt(i)) & 0xFF;
		x = Number("0x" + table.substring((y * 9), (y * 9) + 8));
		crc = (crc >>> 8) ^ x;
	}

	return (crc ^ (-1)) >>> 0;
};
