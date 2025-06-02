import { CustomMedia } from '../nodes/custom-media';
import { GeneralEnclosed } from '../nodes/general-enclosed';
import { MediaAnd } from '../nodes/media-and';
import { MediaCondition } from '../nodes/media-condition';
import type { MediaConditionList} from '../nodes/media-condition-list';
import { MediaConditionListWithAnd, MediaConditionListWithOr } from '../nodes/media-condition-list';
import { MediaFeature } from '../nodes/media-feature';
import { MediaFeatureBoolean } from '../nodes/media-feature-boolean';
import { MediaFeatureName } from '../nodes/media-feature-name';
import { MediaFeaturePlain } from '../nodes/media-feature-plain';
import type { MediaFeatureRange} from '../nodes/media-feature-range';
import { MediaFeatureRangeNameValue, MediaFeatureRangeValueName, MediaFeatureRangeValueNameValue } from '../nodes/media-feature-range';
import { MediaFeatureValue } from '../nodes/media-feature-value';
import { MediaInParens } from '../nodes/media-in-parens';
import { MediaNot } from '../nodes/media-not';
import { MediaOr } from '../nodes/media-or';
import type { MediaQuery} from '../nodes/media-query';
import { MediaQueryInvalid, MediaQueryWithoutType, MediaQueryWithType } from '../nodes/media-query';

export function isCustomMedia(x: unknown): x is CustomMedia {
	return CustomMedia.isCustomMedia(x);
}

export function isGeneralEnclosed(x: unknown): x is GeneralEnclosed {
	return GeneralEnclosed.isGeneralEnclosed(x);
}

export function isMediaAnd(x: unknown): x is MediaAnd {
	return MediaAnd.isMediaAnd(x);
}

export function isMediaConditionList(x: unknown): x is MediaConditionList {
	return isMediaConditionListWithAnd(x) || isMediaConditionListWithOr(x);
}

export function isMediaConditionListWithAnd(x: unknown): x is MediaConditionListWithAnd {
	return MediaConditionListWithAnd.isMediaConditionListWithAnd(x);
}

export function isMediaConditionListWithOr(x: unknown): x is MediaConditionListWithOr {
	return MediaConditionListWithOr.isMediaConditionListWithOr(x);
}

export function isMediaCondition(x: unknown): x is MediaCondition {
	return MediaCondition.isMediaCondition(x);
}

export function isMediaFeatureBoolean(x: unknown): x is MediaFeatureBoolean {
	return MediaFeatureBoolean.isMediaFeatureBoolean(x);
}

export function isMediaFeatureName(x: unknown): x is MediaFeatureName {
	return MediaFeatureName.isMediaFeatureName(x);
}

export function isMediaFeatureValue(x: unknown): x is MediaFeatureValue {
	return MediaFeatureValue.isMediaFeatureValue(x);
}

export function isMediaFeaturePlain(x: unknown): x is MediaFeaturePlain {
	return MediaFeaturePlain.isMediaFeaturePlain(x);
}

export function isMediaFeatureRange(x: unknown): x is MediaFeatureRange {
	return isMediaFeatureRangeNameValue(x) || isMediaFeatureRangeValueName(x) || isMediaFeatureRangeValueNameValue(x);
}

export function isMediaFeatureRangeNameValue(x: unknown): x is MediaFeatureRangeNameValue {
	return MediaFeatureRangeNameValue.isMediaFeatureRangeNameValue(x);
}

export function isMediaFeatureRangeValueName(x: unknown): x is MediaFeatureRangeValueName {
	return MediaFeatureRangeValueName.isMediaFeatureRangeValueName(x);
}

export function isMediaFeatureRangeValueNameValue(x: unknown): x is MediaFeatureRangeValueNameValue {
	return MediaFeatureRangeValueNameValue.isMediaFeatureRangeValueNameValue(x);
}

export function isMediaFeature(x: unknown): x is MediaFeature {
	return MediaFeature.isMediaFeature(x);
}

export function isMediaInParens(x: unknown): x is MediaInParens {
	return MediaInParens.isMediaInParens(x);
}

export function isMediaNot(x: unknown): x is MediaNot {
	return MediaNot.isMediaNot(x);
}

export function isMediaOr(x: unknown): x is MediaOr {
	return MediaOr.isMediaOr(x);
}

export function isMediaQuery(x: unknown): x is MediaQuery {
	return isMediaQueryWithType(x) || isMediaQueryWithoutType(x) || isMediaQueryInvalid(x);
}

export function isMediaQueryWithType(x: unknown): x is MediaQueryWithType {
	return MediaQueryWithType.isMediaQueryWithType(x);
}

export function isMediaQueryWithoutType(x: unknown): x is MediaQueryWithoutType {
	return MediaQueryWithoutType.isMediaQueryWithoutType(x);
}

export function isMediaQueryInvalid(x: unknown): x is MediaQueryInvalid {
	return MediaQueryInvalid.isMediaQueryInvalid(x);
}
