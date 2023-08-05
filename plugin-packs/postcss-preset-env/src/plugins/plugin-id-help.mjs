import { getFeaturesIds, getPackageNames, getPackageNamesToIds } from './plugins-map.mjs';

export function pluginIdHelp(featureNamesInOptions, root, result) {
	const featureNames = getFeaturesIds();
	const packageNames = getPackageNames();
	const packageNamesToIds = getPackageNamesToIds();

	featureNamesInOptions.forEach((featureName) => {
		if (featureNames.includes(featureName)) {
			return;
		}

		const suggestions = [
			...featureNames.map((x) => {
				return [x, levenshteinDistance(featureName, x)];
			}),
			...packageNames.map((x) => {
				return [packageNamesToIds[x], levenshteinDistance(featureName, x)];
			}),
		].sort((a, b) => {
			return a[1] - b[1];
		}).filter((x) => x[1] < 10);

		const uniqueSuggestions = new Set();

		for (let i = 0; i < suggestions.length; i++) {
			uniqueSuggestions.add(suggestions[i][0]);

			if (uniqueSuggestions.size >= 3) {
				break;
			}
		}

		if (!uniqueSuggestions.size) {
			root.warn(result, `Unknown feature: "${featureName}", see the list of features https://github.com/csstools/postcss-plugins/blob/main/plugin-packs/postcss-preset-env/FEATURES.md`);
			return;
		}

		let formattedSuggestions = '"';
		formattedSuggestions += Array.from(uniqueSuggestions).join('", "');
		formattedSuggestions += '"';

		root.warn(result, `Unknown feature: "${featureName}", did you mean one of: ${formattedSuggestions}`);
	});
}

function levenshteinDistance(s, t) {
	if (!s.length) {
		return t.length;
	}
	if (!t.length) {
		return s.length;
	}
	const arr = [];
	for (let i = 0; i <= t.length; i++) {
		arr[i] = [i];
		for (let j = 1; j <= s.length; j++) {
			arr[i][j] =
				i === 0
					? j
					: Math.min(
						arr[i - 1][j] + 1,
						arr[i][j - 1] + 1,
						arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1),
					);
		}
	}
	return arr[t.length][s.length];
}

