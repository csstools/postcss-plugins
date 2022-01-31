import { clientSideDocumentation } from '../client-side-polyfills/plugins.mjs';

export default function logFeaturesList(supportedFeatures, options, logger) {
	if (options.debug) {
		logger.log('Enabling the following feature(s):');
		const clientSideFeatures = [];

		supportedFeatures.forEach(feature => {
			if (feature.id.startsWith('before') || feature.id.startsWith('after')) {
				logger.log(`  ${feature.id} (injected via options)`);
			} else {
				logger.log(`  ${feature.id}`);
			}

			if (typeof clientSideDocumentation[feature.id] !== 'undefined') {
				clientSideFeatures.push(feature.id);
			}
		});

		if (clientSideFeatures.length) {
			logger.log('These feature(s) need a browser library to work:');
			clientSideFeatures.forEach(featureId => logger.log(` ${featureId}: ${clientSideDocumentation[featureId]}`));
		}
	}
}
