export enum MediaFeatureLT {
	LT = '<',
	LT_OR_EQ = '<=',
}

export enum MediaFeatureGT {
	GT = '>',
	GT_OR_EQ = '>=',
}

export enum MediaFeatureEQ {
	EQ = '=',
}

export type MediaFeatureComparison = MediaFeatureLT | MediaFeatureGT | MediaFeatureEQ

export function invertComparison(operator: MediaFeatureComparison): MediaFeatureComparison {
	switch (operator) {
		case MediaFeatureEQ.EQ:
			return MediaFeatureEQ.EQ;
		case MediaFeatureLT.LT:
			return MediaFeatureGT.GT;
		case MediaFeatureLT.LT_OR_EQ:
			return MediaFeatureGT.GT_OR_EQ;
		case MediaFeatureGT.GT:
			return MediaFeatureLT.LT;
		case MediaFeatureGT.GT_OR_EQ:
			return MediaFeatureLT.LT_OR_EQ;
		default:
			throw new Error('Unknown range syntax operator');
	}
}

export function comparisonToString(operator: MediaFeatureComparison): string {
	switch (operator) {
		case MediaFeatureEQ.EQ:
			return '=';
		case MediaFeatureLT.LT:
			return '<';
		case MediaFeatureLT.LT_OR_EQ:
			return '<=';
		case MediaFeatureGT.GT:
			return '>';
		case MediaFeatureGT.GT_OR_EQ:
			return '>=';
		default:
			throw new Error('Unknown range syntax operator');
	}
}
