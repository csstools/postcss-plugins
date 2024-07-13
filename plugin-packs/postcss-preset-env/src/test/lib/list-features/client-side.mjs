import { logsContainEnabledFor, newTestLogger } from '../../log/test-logger.mjs';
import { strict as assert } from 'assert';
import { listFeatures } from '../../../lib/list-features.mjs';
import { cssdb } from './cssdb-fixture.mjs';

const testLogger = newTestLogger();

{
	testLogger.logger.resetLogger();
	assert.deepStrictEqual(
		cleanResult(listFeatures(cssdb, { stage: 0, enableClientSidePolyfills: false }, undefined, testLogger.logger)),
		[
			{
				browsers: [
					'and_chr < 18', 'and_ff < 4',
					'android < 65', 'chrome < 1',
					'edge < 79', 'firefox < 1',
					'ie >= 1', 'ios_saf < 1',
					'op_mini all', 'op_mob < 14',
					'opera < 15', 'safari < 3',
					'samsung < 1.0',
				],
				pluginOptions: {
					enableProgressiveCustomProperties: false,
				},
				vendors_implementations: 3,
				id: 'any-link-pseudo-class',
			},
			{
				browsers: ['> 0%'],
				vendors_implementations: undefined,
				pluginOptions: {},
				id: 'progressive-custom-properties',
			},
		],
	);

	testLogger.logger.emitLogs(testLogger);
	assert.deepStrictEqual(
		testLogger.getLogs().map(x => x.split('\n')),
		[
			[
				'Using features from Stage 0.',
				'- \'blank-pseudo-class\' disabled because \'enableClientSidePolyfills\' is \'false\'.',
				'- \'any-link-pseudo-class\' enabled for:',
				'    op_mini all',
			],
		],
	);
}

{
	testLogger.logger.resetLogger();
	assert.deepStrictEqual(
		cleanResult(listFeatures(cssdb, { stage: 0, enableClientSidePolyfills: true }, undefined, testLogger.logger)),
		[
			{
				browsers: [
					'and_chr < 18', 'and_ff < 4',
					'android < 65', 'chrome < 1',
					'edge < 79', 'firefox < 1',
					'ie >= 1', 'ios_saf < 1',
					'op_mini all', 'op_mob < 14',
					'opera < 15', 'safari < 3',
					'samsung < 1.0',
				],
				vendors_implementations: 3,
				pluginOptions: {
					enableProgressiveCustomProperties: false,
				},
				id: 'any-link-pseudo-class',
			},
			{
				browsers: [
					'and_chr >= 1', 'and_ff >= 1',
					'android >= 1', 'chrome >= 1',
					'edge >= 1', 'firefox >= 1',
					'ie >= 1', 'ios_saf >= 1',
					'op_mini all', 'op_mob >= 1',
					'opera >= 1', 'safari >= 1',
					'samsung >= 1',
				],
				vendors_implementations: 0,
				pluginOptions: { enableProgressiveCustomProperties: false },
				id: 'blank-pseudo-class',
			},
			{
				browsers: ['> 0%'],
				vendors_implementations: undefined,
				pluginOptions: {},
				id: 'progressive-custom-properties',
			},
		],
	);

	testLogger.logger.emitLogs(testLogger);
	const emittedLogs = testLogger.getLogs().map(x => x.split('\n'));

	assert.equal(emittedLogs.length, 1);

	const start = emittedLogs[0].slice(0, 4);
	const remainder = emittedLogs[0].slice(4);

	assert.deepStrictEqual(
		start,
		[
			'Using features from Stage 0.',
			'- \'any-link-pseudo-class\' enabled for:',
			'    op_mini all',
			'- \'blank-pseudo-class\' enabled for:',
		],
	);

	assert.ok(logsContainEnabledFor(remainder, ['chrome', 'firefox', 'safari']));
}

function cleanResult(res) {
	return res.map((x) => {
		if (!x.plugin) {
			throw new Error(`feature "${x.id}" must have a plugin`);
		}
		delete x.plugin;
		return x;
	});
}
