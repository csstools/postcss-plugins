import { newTestLogger } from '../../log/test-logger.mjs';
import { strict as assert } from 'node:assert';
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

function cleanResult(res) {
	return res.map((x) => {
		if (!x.plugin) {
			throw new Error(`feature "${x.id}" must have a plugin`);
		}
		delete x.plugin;
		return x;
	});
}
