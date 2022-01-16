import { log } from './log-helper';

export default function logFeaturesList(supportedFeatures, options) {
	if (options.debug) {
		log('Enabling the following feature(s):');

		supportedFeatures.forEach(feature => {
			if (feature.id.startsWith('before') || feature.id.startsWith('after')) {
				log(`  ${feature.id} (injected via options)`);
			} else {
				log(`  ${feature.id}`);
			}
		});
	}
}
