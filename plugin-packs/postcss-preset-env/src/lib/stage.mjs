import { clamp } from '../util/clamp.mjs';

export const DEFAULT_STAGE = 2;
export const OUT_OF_RANGE_STAGE = 5;

export function stageFromOptions(options, logger) {
	let stage = DEFAULT_STAGE;

	if (typeof options.stage === 'undefined') {
		logger.log(`Using features from Stage ${stage} (default)`);
		return stage;
	}

	if (options.stage === false) {
		stage = OUT_OF_RANGE_STAGE;
	} else {
		let parsedStage = parseInt(options.stage, 10);
		if (Number.isNaN(parsedStage)) {
			parsedStage = 0;
		}

		stage = clamp(0, parsedStage, OUT_OF_RANGE_STAGE);
	}

	if (stage === OUT_OF_RANGE_STAGE) {
		logger.log('Stage has been disabled, features will be handled via the "features" option.');
	} else {
		logger.log(`Using features from Stage ${stage}`);
	}

	return stage;
}
