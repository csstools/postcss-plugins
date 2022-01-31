import { log } from './helper.mjs';
import { clientSideDocumentation } from '../client-side-polyfills/plugins.mjs';

export default function logFeaturesList(supportedFeatures, options) {
	if (options.debug) {
		log('Enabling the following feature(s):');
		const clientSideFeatures = [];

		supportedFeatures.forEach(feature => {
			if (feature.id.startsWith('before') || feature.id.startsWith('after')) {
				log(`  ${feature.id} (injected via options)`);
			} else {
				log(`  ${feature.id}`);
			}

			if (typeof clientSideDocumentation[feature.id] !== 'undefined') {
				clientSideFeatures.push(feature.id);
			}
		});

		if (clientSideFeatures.length) {
			log('These feature(s) need a browser library to work:');
			clientSideFeatures.forEach(featureId => log(` ${featureId}: ${clientSideDocumentation[featureId]}`));
		}
	}
}
