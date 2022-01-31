import getTransformedInsertions from './get-transformed-insertions.mjs';
import { featureIsLess } from './feature-is-less.mjs';
import { featureIsInsertedOrHasAPlugin } from './feature-is-inserted-or-has-plugin.mjs';

export function prepareFeaturesList(cssdbList, insertBefore, insertAfter) {
	// All features from cssdb + inserted features features
	const allKnownFeatures = cssdbList.concat(
		// additional features to be inserted before cssdb features
		getTransformedInsertions(cssdbList, insertBefore, 'insertBefore'),
		// additional features to be inserted after cssdb features
		getTransformedInsertions(cssdbList, insertAfter, 'insertAfter'),
	);

	// polyfillable features (those with an available postcss plugin)
	return allKnownFeatures.filter((feature) => {
		return featureIsInsertedOrHasAPlugin(feature);
	}).sort((a, b) => {
		// features sorted by execution order and then insertion order
		return featureIsLess(a, b);
	});
}
