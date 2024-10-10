import { alwaysTrue, neverTrue } from './always-true-or-false';
import type {
	MediaFeature,
	MediaQuery} from '@csstools/media-query-list-parser';
import {
	isGeneralEnclosed,
	isMediaAnd,
	isMediaConditionList,
	isMediaFeature,
	isMediaFeatureBoolean,
	isMediaNot,
	isMediaOr,
	isMediaQueryInvalid,
	isMediaQueryWithType,
	newMediaFeaturePlain,
	parse,
} from '@csstools/media-query-list-parser';

export function transformAtMediaListTokens(params: string, replacements: Map<string, { truthy: Array<MediaQuery>, falsy: Array<MediaQuery> }>): Array<{ replaceWith: string, encapsulateWith?: Array<string> }> {
	const mediaQueries = parse(params, {
		preserveInvalidMediaQueries: true, onParseError: () => {
			throw new Error(`Unable to parse media query "${params}"`);
		},
	});

	const stringQueries = mediaQueries.map((x) => x.toString());

	for (let i = 0; i < mediaQueries.length; i++) {
		const mediaQuery = mediaQueries[i];
		const original = stringQueries[i];

		{
			const transformedQuery = transformSimpleMediaQuery(mediaQuery, replacements);
			if (transformedQuery && transformedQuery.replaceWith !== original) {
				return stringQueries.map((query, index) => {
					if (index === i) {
						return transformedQuery;
					}

					return {
						replaceWith: query,
					};
				});
			}
		}

		const transformedQuery = transformComplexMediaQuery(mediaQuery, replacements);
		if (!transformedQuery || transformedQuery.length === 0) {
			continue;
		}

		if (transformedQuery[0].replaceWith === original) {
			continue;
		}

		return stringQueries.flatMap((query, index) => {
			if (index === i) {
				return transformedQuery;
			}

			return [{
				replaceWith: query,
			}];
		});
	}

	return [];
}

function transformSimpleMediaQuery(mediaQuery: MediaQuery, replacements: Map<string, { truthy: Array<MediaQuery>, falsy: Array<MediaQuery> }>): { replaceWith: string, encapsulateWith?: Array<string> } | null {
	if (!mediaQueryIsSimple(mediaQuery)) {
		return null;
	}

	let candidate: { replaceWith: string, encapsulateWith?: Array<string> } | null = null;

	mediaQuery.walk((entry) => {
		const node = entry.node;
		if (!isMediaFeatureBoolean(node)) {
			return;
		}

		const name = node.getName();
		if (!name.startsWith('--')) {
			return;
		}

		const replacement = replacements.get(name);
		if (replacement) {
			candidate = {
				replaceWith: replacement.truthy.map((x) => x.toString().trim()).join(','),
			};

			return false;
		}
	});

	return candidate;
}

function transformComplexMediaQuery(mediaQuery: MediaQuery, replacements: Map<string, { truthy: Array<MediaQuery>, falsy: Array<MediaQuery> }>): Array<{ replaceWith: string, encapsulateWith?: Array<string> }> {
	let candidate: Array<{ replaceWith: string, encapsulateWith?: Array<string> }> = [];

	mediaQuery.walk((entry) => {
		const node = entry.node;
		if (!isMediaFeatureBoolean(node)) {
			return;
		}

		const parent = entry.parent;
		if (!isMediaFeature(parent)) {
			return;
		}

		const name = node.getName();
		if (!name.startsWith('--')) {
			return;
		}

		const replacement = replacements.get(name);
		if (replacement) {

			if (replacement.truthy.length === 1 && mediaQueryIsSimple(replacement.truthy[0])) {
				let mediaFeature: MediaFeature | null = null;
				const replacementMediaQuery = replacement.truthy[0];
				replacementMediaQuery.walk((replacementEntry) => {
					if (isMediaFeature(replacementEntry.node)) {
						mediaFeature = replacementEntry.node;
						return false;
					}
				});

				// TypeScript is unable to detect that `walk` is a synchronous function that is immediately called.
				// TypeScript things the actual type is `never`
				mediaFeature = mediaFeature as MediaFeature | null;

				if (mediaFeature && mediaFeature.feature) {
					parent.feature = mediaFeature.feature;
					candidate = [
						{
							replaceWith: mediaQuery.toString(),
						},
					];

					return false;
				}
			}

			const replaceWithTrue = newMediaFeaturePlain(
				alwaysTrue[0][4].value,
				alwaysTrue[2],
			);

			parent.feature = replaceWithTrue.feature;
			const replaceWithTrueString = mediaQuery.toString();

			const replaceWithFalse = newMediaFeaturePlain(
				neverTrue[0][4].value,
				neverTrue[2],
			);

			parent.feature = replaceWithFalse.feature;
			const replaceWithFalseString = mediaQuery.toString();

			candidate = [
				{
					replaceWith: replaceWithTrueString,
					encapsulateWith: [replacement.truthy.map((x) => x.toString().trim()).join(',')],
				},
				{
					replaceWith: replaceWithFalseString,
					encapsulateWith: replacement.falsy.map((x) => x.toString().trim()),
				},
			];

			return false;
		}
	});

	return candidate;
}

function mediaQueryIsSimple(mediaQuery: MediaQuery): boolean {
	if (isMediaQueryInvalid(mediaQuery)) {
		return false;
	}

	if (isMediaQueryWithType(mediaQuery)) {
		return false;
	}

	let isSimple = true;
	mediaQuery.walk((entry) => {
		if (
			isMediaAnd(entry.node) ||
			isMediaOr(entry.node) ||
			isMediaNot(entry.node) ||
			isMediaConditionList(entry.node) ||
			isGeneralEnclosed(entry.node)
		) {
			isSimple = false;
			return false;
		}
	});

	return isSimple;
}
