import { newTestLogger } from '../../log/test-logger.mjs';
import { strict as assert } from 'assert';
import { listFeatures } from '../../../lib/list-features.mjs';
import { cssdb }  from './cssdb-fixture.mjs';

const testLogger = newTestLogger();

testLogger.logger.resetLogger();
assert.deepStrictEqual(
	cleanResult(listFeatures(cssdb, {}, undefined, testLogger.logger)),
	[
		{
			browsers: [
				'and_chr < 18', 'and_ff < 4',
				'and_qq >= 1', 'and_uc >= 1',
				'android < 65', 'baidu >= 1',
				'chrome < 1', 'edge < 79',
				'firefox < 1', 'ie >= 1',
				'ie_mob >= 1', 'ios_saf < 1',
				'kaios >= 1', 'op_mini all',
				'op_mob < 14', 'opera < 15',
				'safari < 3', 'samsung < 1.0',
			],
			vendors_implementations: 3,
			pluginOptions: {
				subFeatures: {
					areaHrefNeedsFixing: true,
				},
				enableProgressiveCustomProperties: false,
			},
			id: 'any-link-pseudo-class',
		},
	],
);

testLogger.logger.dumpLogs(testLogger);
assert.deepStrictEqual(
	testLogger.getLogs(),
	[
		'Using features from Stage 2 (default)',
		'  blank-pseudo-class with stage 1 has been disabled',
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
