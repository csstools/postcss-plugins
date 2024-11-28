import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-bundler';
import fs from 'node:fs/promises';
import path from 'node:path';

const testCases = {
	basic: {
		message: 'supports basic usage',
	},
	'leading-slash': {
		message: 'does not infer a root to resolve leading slash imports',
		exception: /Failed to find '\/imports\/basic.css'/,
	},
	'charset-utf8': {
		message: 'errors on mismatched charset',
		exception: /Incompatible @charset statements/,
	},
	'conditional-layer-before-external': {
		message: 'correctly handles conditional stylesheets containing layer statements before external resources',
	},
	'does-not-exist-1': {
		message: 'throws on files that don\'t exist',
		exception: /Failed to find 'imports\/does-not-exist.css'/,
	},
	'does-not-exist-2': {
		message: 'throws on files that don\'t exist',
		exception: /Failed to find 'node_modules:does-not-exist.css'/,
	},
	'ignore': {
		message: 'ignores incorrect syntax',
		warnings: 5,
	},
	'layer-before-external': {
		message: 'correctly handles layer statements before external resources',
	},
	'regexp': {
		message: 'regexp sanity checks',
		warnings: 2,
	},
	'examples/example': {
		message: 'minimal example',
	},
}

;(await fs.readdir('./test/css-import-tests', { withFileTypes: true, recursive: true })).filter(dirent => {
	return dirent.isFile() && dirent.name === 'style.css';
}).sort().forEach(dirent => {
	const key = path.join(path.relative('./test', dirent.path), 'style');
	testCases[key] = {
		message: `passes 'css-import-tests' case : ${path.relative('./test/css-import-tests', dirent.path).split(path.sep).join(' - ')}`,
	};

	switch (dirent.path.split(path.sep).join(path.posix.sep)) {
		case 'test/css-import-tests/002-sub-features/004-at-supports/007':
			testCases[key].warnings = 1;
			break;
		case 'test/css-import-tests/002-sub-features/001-data-urls/004':
			testCases[key].warnings = 1;
			break;
		case 'test/css-import-tests/001-core-features/url-fragments/004':
			testCases[key].warnings = 1;
			break;
		case 'test/css-import-tests/001-core-features/url-fragments/005':
			testCases[key].warnings = 1;
			break;
		case 'test/css-import-tests/001-core-features/forwards-compat/004':
			testCases[key].warnings = 1;
			break;
		case 'test/css-import-tests/002-sub-features/003-at-layer/013':
			testCases[key].warnings = 1;
			break;
		case 'test/css-import-tests/002-sub-features/004-at-supports/012':
			testCases[key].warnings = 1;
			break;
		case 'test/css-import-tests/002-sub-features/005-at-scope/012':
			testCases[key].warnings = 1;
			break;
		default:
			break;
	}

	switch (dirent.path.split(path.sep).join(path.posix.sep)) {
		case 'test/css-import-tests/003-should-fail/001-core-features/before-other-styles/001':
			testCases[key].exception = /At-rule without name/;
			break;
		case 'test/css-import-tests/005-implementation-specific/leading-slash-is-import-root/001':
			testCases[key].exception = /Failed to find '\/a.css'/;
			break;
		case 'test/css-import-tests/005-implementation-specific/leading-slash-is-import-root/002':
			testCases[key].exception = /Failed to find '\/b.css'/;
			break;
		case 'test/css-import-tests/999-irrelevant/url-format/002':
			testCases[key].exception = /Unclosed string/;
			break;

		default:
			break;
	}
});

postcssTape(plugin)(testCases);
