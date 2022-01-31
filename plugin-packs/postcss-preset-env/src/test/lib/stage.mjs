import { newTestLogger } from '../log/test-logger.mjs';
import { strict as assert } from 'assert';
import { OUT_OF_RANGE_STAGE, stageFromOptions } from '../../lib/stage.mjs';

const testLogger = newTestLogger();

testLogger.logger.resetLogger();
assert.deepStrictEqual(
	stageFromOptions({stage: 4}, testLogger.logger),
	4,
);

testLogger.logger.dumpLogs(testLogger);
assert.deepStrictEqual(
	testLogger.getLogs(),
	['Using features from Stage 4'],
);

testLogger.logger.resetLogger();
assert.deepStrictEqual(
	stageFromOptions({stage: '4'}, testLogger.logger),
	4,
);

testLogger.logger.dumpLogs(testLogger);
assert.deepStrictEqual(
	testLogger.getLogs(),
	['Using features from Stage 4'],
);

testLogger.logger.resetLogger();
assert.deepStrictEqual(
	stageFromOptions({stage: -1}, testLogger.logger),
	0,
);

testLogger.logger.dumpLogs(testLogger);
assert.deepStrictEqual(
	testLogger.getLogs(),
	['Using features from Stage 0'],
);

testLogger.logger.resetLogger();
assert.deepStrictEqual(
	stageFromOptions({stage: false}, testLogger.logger),
	OUT_OF_RANGE_STAGE,
);

testLogger.logger.dumpLogs(testLogger);
assert.deepStrictEqual(
	testLogger.getLogs(),
	['Stage has been disabled, features will be handled via the "features" option.'],
);

testLogger.logger.resetLogger();
assert.deepStrictEqual(
	stageFromOptions({stage: 'esfgdfg'}, testLogger.logger),
	0,
);

testLogger.logger.dumpLogs(testLogger);
assert.deepStrictEqual(
	testLogger.getLogs(),
	['Using features from Stage 0'],
);

testLogger.logger.resetLogger();
assert.deepStrictEqual(
	stageFromOptions({}, testLogger.logger),
	2,
);

testLogger.logger.dumpLogs(testLogger);
assert.deepStrictEqual(
	testLogger.getLogs(),
	['Using features from Stage 2 (default)'],
);

testLogger.logger.resetLogger();
assert.deepStrictEqual(
	stageFromOptions({stage: OUT_OF_RANGE_STAGE+2}, testLogger.logger),
	OUT_OF_RANGE_STAGE,
);

testLogger.logger.dumpLogs(testLogger);
assert.deepStrictEqual(
	testLogger.getLogs(),
	['Stage has been disabled, features will be handled via the "features" option.'],
);
