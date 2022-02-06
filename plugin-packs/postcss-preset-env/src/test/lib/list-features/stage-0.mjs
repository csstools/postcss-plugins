import { newTestLogger } from '../../log/test-logger.mjs';
import { strict as assert } from 'assert';
import { listFeatures } from '../../../lib/list-features.mjs';
import { cssdb } from './cssdb-fixture.mjs';

const testLogger = newTestLogger();

testLogger.logger.resetLogger();
assert.deepStrictEqual(
	cleanResult(listFeatures(cssdb, {stage: 0}, undefined, testLogger.logger)),
	[
		{
			browsers: [
				'ie >= 1',       'edge < 79',
				'firefox < 1',   'chrome < 1',
				'safari < 3',    'opera < 15',
				'ios_saf < 1',   'android < 65',
				'op_mob < 14',   'and_chr < 18',
				'and_ff < 4',    'and_uc >= 1',
				'samsung < 1.0', 'and_qq >= 1',
				'baidu >= 1',    'kaios >= 1',
			],
			pluginOptions: { subFeatures: { areaHrefNeedsFixing: true } },
			vendors_implementations: 3,
			id: 'any-link-pseudo-class',
		},
		{
			browsers: [
				'ie >= 1',      'edge >= 1',
				'firefox >= 1', 'chrome >= 1',
				'safari >= 1',  'opera >= 1',
				'ios_saf >= 1', 'android >= 1',
				'op_mob >= 1',  'and_chr >= 1',
				'and_ff >= 1',  'and_uc >= 1',
				'samsung >= 1', 'and_qq >= 1',
				'baidu >= 1',   'kaios >= 1',
			],
			pluginOptions: {},
			vendors_implementations: 0,
			id: 'blank-pseudo-class',
		},
	],
);

testLogger.logger.dumpLogs(testLogger);
assert.deepStrictEqual(
	testLogger.getLogs(),
	[
		'Using features from Stage 0',
		'Adding area[href] fallbacks for ":any-link" support in Edge and IE.',
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
