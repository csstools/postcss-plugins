
import { cloneMediaQuery, isMediaFeaturePlain, isMediaFeatureRangeNameValue, isMediaFeatureRangeValueName, isMediaFeatureRangeValueNameValue, isMediaQueryInvalid, parse } from '@csstools/media-query-list-parser';
import { transformMediaFeatureValue } from './transform-media-feature-value';

const featureNamesSet = new Set([
	'aspect-ratio',
	'min-aspect-ratio',
	'max-aspect-ratio',
	'device-aspect-ratio',
	'min-device-aspect-ratio',
	'max-device-aspect-ratio',
]);

export function transformMediaQueryList(params: string, preserve: boolean): string {
	const mediaQueryList = parse(params, {
		preserveInvalidMediaQueries: true,
		onParseError: () => {
			throw new Error(`Unable to parse media query "${params}"`);
		},
	});

	const mediaQueryListSet = new Set(mediaQueryList.map(x => x.toString()));

	const mediaQueryListString = mediaQueryList.flatMap((mediaQuery) => {
		if (isMediaQueryInvalid(mediaQuery)) {
			return [mediaQuery.toString()];
		}

		const clone = cloneMediaQuery(mediaQuery);

		clone.walk((entry) => {
			const node = entry.node;

			if (isMediaFeaturePlain(node) || isMediaFeatureRangeNameValue(node) || isMediaFeatureRangeValueName(node)) {
				const featureName = node.name.getName().toLowerCase();
				if (!featureNamesSet.has(featureName)) {
					return;
				}

				const value = node.value;
				transformMediaFeatureValue(value);
				return;
			}

			if (isMediaFeatureRangeValueNameValue(node)) {
				const featureName = node.name.getName().toLowerCase();
				if (!featureNamesSet.has(featureName)) {
					return;
				}

				{
					const value = node.valueOne;
					transformMediaFeatureValue(value);
				}

				{
					const value = node.valueTwo;
					transformMediaFeatureValue(value);
				}
			}
		});

		const mediaQueryString = mediaQuery.toString();
		const cloneString = clone.toString();
		if (cloneString !== mediaQueryString && !mediaQueryListSet.has(cloneString)) {
			if (!preserve) {
				return [cloneString];
			}

			return [mediaQueryString, cloneString];
		}

		return [mediaQueryString];
	});

	return mediaQueryListString.join(',');
}
