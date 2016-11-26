// tests
var tests = {
	'postcss-place': {
		'basic': {
			message: 'supports basic usage'
		}
	}
};

// tooling
const fs     = require('fs');
const path   = require('path');
const plugin = require('.');

// error symbols
const pass = '\x1b[32m\✔\x1b[0m';
const fail = '\x1b[31m\✖\x1b[0m';

// runner
Promise.all(Object.keys(tests).map(
	(section) => Promise.all(
		Object.keys(tests[section]).map(
			(name) => {
				const baseName = name.split(':')[0];
				const testName = name.split(':').join('.');
				const warnings = tests[section][name].warning || 0;

				return Promise.all([
					readFile(path.resolve(__dirname, 'test', baseName + '.css'), 'utf8'),
					readFile(path.resolve(__dirname, 'test', testName + '.expect.css'), 'utf8')
				]).then(
					([actualCSS, expectCSS]) => plugin.process(actualCSS, tests[section][name].options || {}).then(
						(result) => writeFile(path.resolve(__dirname, 'test', testName + '.result.css'), result.css).then(
							() => {
								if (result.css !== expectCSS) {
									throw new Error(`  ${ fail }  ${ tests[section][name].message }\n${ JSON.stringify({
										expect: expectCSS,
										result: result.css
									}, null, '  ') }`);
								} else if (result.warnings().length !== warnings) {
									throw Error(`  ${ fail } ${ tests[section][name].message } (${ result.warnings().length } warnings, expected ${ warnings })`);
								} else {
									return `  ${ pass }  ${ tests[section][name].message }`;
								}
							}
						)
					)
				);
			}
		)
	).then(
		(messages) => console.log(`${ pass } ${ section }\n${ messages.join('\n') }`)
	).catch(
		(error)    => {
			console.log(`${ fail } ${ section }\n${ error.message }`);

			throw Error;
		}
	)
)).then(
	() => console.log(`\n${ pass } Test passed`) && process.exit(0),
	() => console.log(`\n${ fail } Test failed`) && process.exit(1)
);

// Promise fs.readFile
function readFile(filename) {
	return new Promise(
		(resolve, reject) => fs.readFile(filename, 'utf8',
			(error, data) => error ? reject(error) : resolve(data)
		)
	);
}

// Promise fs.writeFile
function writeFile(filename, data) {
	return new Promise(
		(resolve, reject) => fs.writeFile(filename, data,
			(error) => error ? reject(error) : resolve()
		)
	);
}
