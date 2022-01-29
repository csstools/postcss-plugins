
import getUnsupportedBrowsersByFeature from '../../lib/get-unsupported-browsers-by-feature.mjs';
import { strict as assert } from 'assert';

assert.deepStrictEqual(
	getUnsupportedBrowsersByFeature(),
	[],
);

assert.deepStrictEqual(
	getUnsupportedBrowsersByFeature({}),
	['> 0%'],
);

assert.deepStrictEqual(
	getUnsupportedBrowsersByFeature({ browser_support: { firefox: 30 }}),
	[
		'ie >= 1',
		'edge >= 1',
		'firefox >= 1',
		'chrome >= 1',
		'safari >= 1',
		'opera >= 1',
		'ios_saf >= 1',
		'android >= 1',
		'op_mob >= 1',
		'and_chr >= 1',
		'and_ff >= 1',
		'and_uc >= 1',
		'samsung >= 1',
		'and_qq >= 1',
		'baidu >= 1',
		'kaios >= 1',
	],
);

assert.deepStrictEqual(
	getUnsupportedBrowsersByFeature({ browser_support: { firefox: 'Beta' }}),
	[
		'ie >= 1',
		'edge >= 1',
		'firefox >= 1',
		'chrome >= 1',
		'safari >= 1',
		'opera >= 1',
		'ios_saf >= 1',
		'android >= 1',
		'op_mob >= 1',
		'and_chr >= 1',
		'and_ff >= 1',
		'and_uc >= 1',
		'samsung >= 1',
		'and_qq >= 1',
		'baidu >= 1',
		'kaios >= 1',
	],
);

assert.deepStrictEqual(
	getUnsupportedBrowsersByFeature({ browser_support: { firefox: 'Beta 5' }}),
	[
		'ie >= 1',
		'edge >= 1',
		'firefox >= 1',
		'chrome >= 1',
		'safari >= 1',
		'opera >= 1',
		'ios_saf >= 1',
		'android >= 1',
		'op_mob >= 1',
		'and_chr >= 1',
		'and_ff >= 1',
		'and_uc >= 1',
		'samsung >= 1',
		'and_qq >= 1',
		'baidu >= 1',
		'kaios >= 1',
	],
);

assert.deepStrictEqual(
	getUnsupportedBrowsersByFeature({ browser_support: { firefox: '5 Beta' }}),
	[
		'ie >= 1',
		'edge >= 1',
		'firefox >= 1',
		'chrome >= 1',
		'safari >= 1',
		'opera >= 1',
		'ios_saf >= 1',
		'android >= 1',
		'op_mob >= 1',
		'and_chr >= 1',
		'and_ff >= 1',
		'and_uc >= 1',
		'samsung >= 1',
		'and_qq >= 1',
		'baidu >= 1',
		'kaios >= 1',
	],
);

assert.deepStrictEqual(
	getUnsupportedBrowsersByFeature({ browser_support: { unknown: 30 }}),
	[
		'ie >= 1',
		'edge >= 1',
		'firefox >= 1',
		'chrome >= 1',
		'safari >= 1',
		'opera >= 1',
		'ios_saf >= 1',
		'android >= 1',
		'op_mob >= 1',
		'and_chr >= 1',
		'and_ff >= 1',
		'and_uc >= 1',
		'samsung >= 1',
		'and_qq >= 1',
		'baidu >= 1',
		'kaios >= 1',
	],
);

assert.deepStrictEqual(
	getUnsupportedBrowsersByFeature({ browser_support: { firefox: '30' }}),
	[
		'ie >= 1',
		'edge >= 1',
		'firefox < 30',
		'chrome >= 1',
		'safari >= 1',
		'opera >= 1',
		'ios_saf >= 1',
		'android >= 1',
		'op_mob >= 1',
		'and_chr >= 1',
		'and_ff >= 1',
		'and_uc >= 1',
		'samsung >= 1',
		'and_qq >= 1',
		'baidu >= 1',
		'kaios >= 1',
	],
);

assert.deepStrictEqual(
	getUnsupportedBrowsersByFeature({
		browser_support: {
			'edge': '89',
			'firefox': '66',
			'chrome': '89',
			'safari': '15',
			'opera': '76',
			'ios_saf': '15',
			'android': '97',
			'op_mob': '64',
			'and_chr': '97',
			'and_ff': '95',
			'samsung': '15',
		}}),
	[
		'ie >= 1',
		'edge < 89',
		'firefox < 66',
		'chrome < 89',
		'safari < 15',
		'opera < 76',
		'ios_saf < 15',
		'android < 97',
		'op_mob < 64',
		'and_chr < 97',
		'and_ff < 95',
		'and_uc >= 1',
		'samsung < 15',
		'and_qq >= 1',
		'baidu >= 1',
		'kaios >= 1',
	],
);
