import { newTestLogger } from '../../log/test-logger.mjs';
import { strict as assert } from 'assert';
import { listFeatures } from '../../../lib/list-features.mjs';
import { cssdb } from './cssdb-fixture.mjs';

const testLogger = newTestLogger();

testLogger.logger.resetLogger();
assert.deepStrictEqual(
	cleanResult(listFeatures(cssdb, {stage: 0, enableClientSidePolyfills: false}, undefined, testLogger.logger)),
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

testLogger.logger.resetLogger();
assert.deepStrictEqual(
	cleanResult(listFeatures(cssdb, {stage: 0, enableClientSidePolyfills: true}, undefined, testLogger.logger)),
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
assert.deepStrictEqual(
	testLogger.getLogs().map(x => x.split('\n')),
	[
		[
			'Using features from Stage 0.',
			'- \'any-link-pseudo-class\' enabled for:',
			'    op_mini all',
			'- \'blank-pseudo-class\' enabled for:',
			'    and_chr 126',
			'    and_ff 127',
			'    android 126',
			'    chrome 126',
			'    chrome 125',
			'    chrome 124',
			'    chrome 123',
			'    chrome 109',
			'    edge 126',
			'    edge 125',
			'    edge 124',
			'    firefox 127',
			'    firefox 126',
			'    firefox 125',
			'    firefox 115',
			'    ios_saf 17.5',
			'    ios_saf 17.4',
			'    ios_saf 16.6-16.7',
			'    ios_saf 15.6-15.8',
			'    op_mini all',
			'    op_mob 80',
			'    opera 111',
			'    opera 110',
			'    opera 109',
			'    safari 17.5',
			'    safari 17.4',
			'    samsung 25',
			'    samsung 24',
		],
	],
);

function cleanResult(res) {
	return res.map((x) => {
		if (!x.plugin) {
			throw new Error(`feature "${x.id}" must have a plugin`);
		}
		delete x.plugin;
		return x;
	});
}
