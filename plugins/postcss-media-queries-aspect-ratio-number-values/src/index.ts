import { cloneMediaQuery, isMediaFeaturePlain, isMediaFeatureRangeNameValue, isMediaFeatureRangeValueName, isMediaFeatureRangeValueNameValue, isMediaQueryInvalid, parse } from '@csstools/media-query-list-parser';
import type { PluginCreator } from 'postcss';
import { transformMediaFeatureValue } from './transform-media-feaure-value';

type pluginOptions = { preserve?: boolean };

const featureNamesSet = new Set([
	'aspect-ratio',
	'min-aspect-ratio',
	'max-aspect-ratio',
	'device-aspect-ratio',
	'min-device-aspect-ratio',
	'max-device-aspect-ratio',
]);

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			preserve: false,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-media-queries-aspect-ratio-number-values',
		AtRule(atRule) {
			if (atRule.name.toLowerCase() !== 'media') {
				return;
			}

			const lowerCaseParams = atRule.params.toLowerCase();
			if (!(
				lowerCaseParams.includes('aspect-ratio') ||
				lowerCaseParams.includes('min-aspect-ratio') ||
				lowerCaseParams.includes('max-aspect-ratio') ||
				lowerCaseParams.includes('device-aspect-ratio') ||
				lowerCaseParams.includes('min-device-aspect-ratio') ||
				lowerCaseParams.includes('max-device-aspect-ratio')
			)) {
				return;
			}

			const mediaQueryList = parse(atRule.params, {
				preserveInvalidMediaQueries: true,
				onParseError: () => {
					throw new Error(`Unable to parse media query "${atRule.params}"`);
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

						return;
					}
				});

				const mediaQueryString = mediaQuery.toString();
				const cloneString = clone.toString();
				if (cloneString !== mediaQueryString && !mediaQueryListSet.has(cloneString)) {
					if (!options.preserve) {
						return [cloneString];
					}

					return [mediaQueryString, cloneString];
				}

				return [mediaQueryString];
			});

			const modifiedParams = mediaQueryListString.join(',');
			if (modifiedParams === atRule.params) {
				return;
			}

			atRule.cloneBefore({ params: modifiedParams });
			atRule.remove();
		},
	};
};

creator.postcss = true;

export default creator;

