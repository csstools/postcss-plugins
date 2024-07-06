import { clientSideDocumentation } from '../client-side-polyfills/plugins.mjs';

export default function logFeaturesList(supportedFeatures, options, logger) {
	if (options.debug) {
		logger.log('Enabling the following feature(s):');
		const clientSideFeatures = [];

		const logLines = [];

		if (options.autoprefixer !== false) {
			logLines.push('  autoprefixer');
		}

		supportedFeatures.forEach(feature => {
			if (feature.id.startsWith('before') || feature.id.startsWith('after')) {
				logLines.push(`  ${feature.id} (injected via options)`);
			} else {
				logLines.push(`  ${feature.id}`);
			}

			if (typeof clientSideDocumentation[feature.id] !== 'undefined') {
				clientSideFeatures.push(feature.id);
			}
		});

		logLines.sort((a, b) => a.localeCompare(b));
		clientSideFeatures.sort((a, b) => a.localeCompare(b));

		logLines.forEach(x => logger.log(x));

		if (clientSideFeatures.length) {
			logger.log('These feature(s) need a browser library to work:');
			clientSideFeatures.forEach(featureId => logger.log(`  ${featureId}: ${clientSideDocumentation[featureId]}`));
		}
	}
}
