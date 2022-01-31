import { testLogger } from '../log/test-logger.mjs';
import { strict as assert } from 'assert';
import { OUT_OF_RANGE_STAGE, stageFromOptions } from '../../lib/stage.mjs';
import { dumpLogs, resetLogger } from '../../log/helper.mjs';

const logger = testLogger();

resetLogger();
assert.deepStrictEqual(
	stageFromOptions({stage: 4}),
	4,
);

dumpLogs(logger);
assert.deepStrictEqual(
	logger.getLogs(),
	['Using features from Stage 4'],
);

resetLogger();
assert.deepStrictEqual(
	stageFromOptions({stage: '4'}),
	4,
);

dumpLogs(logger);
assert.deepStrictEqual(
	logger.getLogs(),
	['Using features from Stage 4'],
);

resetLogger();
assert.deepStrictEqual(
	stageFromOptions({stage: -1}),
	0,
);

dumpLogs(logger);
assert.deepStrictEqual(
	logger.getLogs(),
	['Using features from Stage 0'],
);

resetLogger();
assert.deepStrictEqual(
	stageFromOptions({stage: false}),
	OUT_OF_RANGE_STAGE,
);

dumpLogs(logger);
assert.deepStrictEqual(
	logger.getLogs(),
	['Stage has been disabled, features will be handled via the "features" option.'],
);

resetLogger();
assert.deepStrictEqual(
	stageFromOptions({stage: 'esfgdfg'}),
	0,
);

dumpLogs(logger);
assert.deepStrictEqual(
	logger.getLogs(),
	['Using features from Stage 0'],
);

resetLogger();
assert.deepStrictEqual(
	stageFromOptions({}),
	2,
);

dumpLogs(logger);
assert.deepStrictEqual(
	logger.getLogs(),
	['Using features from Stage 2 (default)'],
);

resetLogger();
assert.deepStrictEqual(
	stageFromOptions({stage: OUT_OF_RANGE_STAGE+2}),
	OUT_OF_RANGE_STAGE,
);

dumpLogs(logger);
assert.deepStrictEqual(
	logger.getLogs(),
	['Stage has been disabled, features will be handled via the "features" option.'],
);
