import { newTestLogger } from '../../log/test-logger.mjs';
import { strict as assert } from 'assert';
import { listFeatures } from '../../../lib/list-features.mjs';
import { cssdb } from './cssdb-fixture.mjs';

const testLogger = newTestLogger();

testLogger.logger.resetLogger();
assert.deepStrictEqual(
	cleanResult(listFeatures(cssdb, { stage: 0 }, { preserve: true }, testLogger.logger)),
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
				subFeatures: { areaHrefNeedsFixing: true },
				preserve: true,
				enableProgressiveCustomProperties: false,
			},
			id: 'any-link-pseudo-class',
		},
		{
			browsers: ['> 0%'],
			vendors_implementations: undefined,
			pluginOptions: { preserve: true },
			id: 'progressive-custom-properties',
		},
	],
);

testLogger.logger.emitLogs(testLogger);
assert.deepStrictEqual(
	testLogger.getLogs(),
	[
		'Using features from Stage 0\n' +
		'  blank-pseudo-class has been disabled by "enableClientSidePolyfills: false".\n' +
		'Adding area[href] fallbacks for ":any-link" support in Edge and IE.',
	],
);


testLogger.logger.resetLogger();
assert.deepStrictEqual(
	cleanResult(listFeatures(cssdb, { stage: 0 }, { preserve: false }, testLogger.logger)),
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
				subFeatures: { areaHrefNeedsFixing: true },
				preserve: false,
				enableProgressiveCustomProperties: false,
			},
			id: 'any-link-pseudo-class',
		},
		{
			browsers: ['> 0%'],
			vendors_implementations: undefined,
			pluginOptions: { preserve: false },
			id: 'progressive-custom-properties',
		},
	],
);

testLogger.logger.emitLogs(testLogger);
assert.deepStrictEqual(
	testLogger.getLogs(),
	[
		'Using features from Stage 0\n' +
		'  blank-pseudo-class has been disabled by "enableClientSidePolyfills: false".\n' +
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
