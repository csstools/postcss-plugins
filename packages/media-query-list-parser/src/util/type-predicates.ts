import { GeneralEnclosed } from '../nodes/general-enclosed';
import { MediaAnd } from '../nodes/media-and';
import { MediaCondition } from '../nodes/media-condition';
import { MediaConditionList, MediaConditionListWithAnd, MediaConditionListWithOr } from '../nodes/media-condition-list';
import { MediaFeature } from '../nodes/media-feature';
import { MediaFeatureBoolean } from '../nodes/media-feature-boolean';
import { MediaFeatureName } from '../nodes/media-feature-name';
import { MediaFeaturePlain } from '../nodes/media-feature-plain';
import { MediaFeatureRange, MediaFeatureRangeNameValue, MediaFeatureRangeValueName, MediaFeatureRangeValueNameValue } from '../nodes/media-feature-range';
import { MediaFeatureValue } from '../nodes/media-feature-value';
import { MediaInParens } from '../nodes/media-in-parens';
import { MediaNot } from '../nodes/media-not';
import { MediaOr } from '../nodes/media-or';
import { MediaQuery, MediaQueryInvalid, MediaQueryWithoutType, MediaQueryWithType } from '../nodes/media-query';
import { NodeType } from './node-type';

export function isGeneralEnclosed(x: unknown): x is GeneralEnclosed {
	if (!x) {
		return false;
	}

	if (!(x instanceof GeneralEnclosed)) {
		return false;
	}

	return x.type === NodeType.GeneralEnclosed;
}

export function isMediaAnd(x: unknown): x is MediaAnd {
	if (!x) {
		return false;
	}

	if (!(x instanceof MediaAnd)) {
		return false;
	}

	return x.type === NodeType.MediaAnd;
}

export function isMediaConditionList(x: unknown): x is MediaConditionList {
	return isMediaConditionListWithAnd(x) || isMediaConditionListWithOr(x);
}

export function isMediaConditionListWithAnd(x: unknown): x is MediaConditionListWithAnd {
	if (!x) {
		return false;
	}

	if (!(x instanceof MediaConditionListWithAnd)) {
		return false;
	}

	return x.type === NodeType.MediaConditionListWithAnd;
}

export function isMediaConditionListWithOr(x: unknown): x is MediaConditionListWithOr {
	if (!x) {
		return false;
	}

	if (!(x instanceof MediaConditionListWithOr)) {
		return false;
	}

	return x.type === NodeType.MediaConditionListWithOr;
}

export function isMediaCondition(x: unknown): x is MediaCondition {
	if (!x) {
		return false;
	}

	if (!(x instanceof MediaCondition)) {
		return false;
	}

	return x.type === NodeType.MediaCondition;
}

export function isMediaFeatureBoolean(x: unknown): x is MediaFeatureBoolean {
	if (!x) {
		return false;
	}

	if (!(x instanceof MediaFeatureBoolean)) {
		return false;
	}

	return x.type === NodeType.MediaFeatureBoolean;
}

export function isMediaFeatureName(x: unknown): x is MediaFeatureName {
	if (!x) {
		return false;
	}

	if (!(x instanceof MediaFeatureName)) {
		return false;
	}

	return x.type === NodeType.MediaFeatureName;
}

export function isMediaFeatureValue(x: unknown): x is MediaFeatureValue {
	if (!x) {
		return false;
	}

	if (!(x instanceof MediaFeatureValue)) {
		return false;
	}

	return x.type === NodeType.MediaFeatureValue;
}

export function isMediaFeaturePlain(x: unknown): x is MediaFeaturePlain {
	if (!x) {
		return false;
	}

	if (!(x instanceof MediaFeaturePlain)) {
		return false;
	}

	return x.type === NodeType.MediaFeaturePlain;
}

export function isMediaFeatureRange(x: unknown): x is MediaFeatureRange {
	return isMediaFeatureRangeNameValue(x) || isMediaFeatureRangeValueName(x) || isMediaFeatureRangeValueNameValue(x);
}

export function isMediaFeatureRangeNameValue(x: unknown): x is MediaFeatureRangeNameValue {
	if (!x) {
		return false;
	}

	if (!(x instanceof MediaFeatureRangeNameValue)) {
		return false;
	}

	return x.type === NodeType.MediaFeatureRangeNameValue;
}

export function isMediaFeatureRangeValueName(x: unknown): x is MediaFeatureRangeValueName {
	if (!x) {
		return false;
	}

	if (!(x instanceof MediaFeatureRangeValueName)) {
		return false;
	}

	return x.type === NodeType.MediaFeatureRangeValueName;
}

export function isMediaFeatureRangeValueNameValue(x: unknown): x is MediaFeatureRangeValueNameValue {
	if (!x) {
		return false;
	}

	if (!(x instanceof MediaFeatureRangeValueNameValue)) {
		return false;
	}

	return x.type === NodeType.MediaFeatureRangeValueNameValue;
}

export function isMediaFeature(x: unknown): x is MediaFeature {
	if (!x) {
		return false;
	}

	if (!(x instanceof MediaFeature)) {
		return false;
	}

	return x.type === NodeType.MediaFeature;
}

export function isMediaInParens(x: unknown): x is MediaInParens {
	if (!x) {
		return false;
	}

	if (!(x instanceof MediaInParens)) {
		return false;
	}

	return x.type === NodeType.MediaInParens;
}

export function isMediaNot(x: unknown): x is MediaNot {
	if (!x) {
		return false;
	}

	if (!(x instanceof MediaNot)) {
		return false;
	}

	return x.type === NodeType.MediaNot;
}

export function isMediaOr(x: unknown): x is MediaOr {
	if (!x) {
		return false;
	}

	if (!(x instanceof MediaOr)) {
		return false;
	}

	return x.type === NodeType.MediaOr;
}

export function isMediaQuery(x: unknown): x is MediaQuery {
	return isMediaQueryWithType(x) || isMediaQueryWithoutType(x) || isMediaQueryInvalid(x);
}

export function isMediaQueryWithType(x: unknown): x is MediaQueryWithType {
	if (!x) {
		return false;
	}

	if (!(x instanceof MediaQueryWithType)) {
		return false;
	}

	return x.type === NodeType.MediaQueryWithType;
}

export function isMediaQueryWithoutType(x: unknown): x is MediaQueryWithoutType {
	if (!x) {
		return false;
	}

	if (!(x instanceof MediaQueryWithoutType)) {
		return false;
	}

	return x.type === NodeType.MediaQueryWithoutType;
}

export function isMediaQueryInvalid(x: unknown): x is MediaQueryInvalid {
	if (!x) {
		return false;
	}

	if (!(x instanceof MediaQueryInvalid)) {
		return false;
	}

	return x.type === NodeType.MediaQueryInvalid;
}
