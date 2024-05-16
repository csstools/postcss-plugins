'use strict';

// https://github.com/nodejs/node/blob/303c80c50b945cc8c779f7e4f31b898bd41923bf/lib/internal/test_runner/reporter/dot.js
// The dot reporter includes more debug info now, which makes it useless for our purposes.
// This is a fork from before the changes were made.
//
// @license : see nodejs license
// https://github.com/nodejs/node/blob/main/LICENSE

module.exports = async function* dot(source) {
	let count = 0;
	let columns = getLineLength();
	for await (const { type } of source) {
		if (type === 'test:pass') {
			yield '.';
		}
		if (type === 'test:fail') {
			yield 'X';
		}
		if ((type === 'test:fail' || type === 'test:pass') && ++count === columns) {
			yield '\n';

			// Getting again in case the terminal was resized.
			columns = getLineLength();
			count = 0;
		}
	}
	yield '\n';
};

function getLineLength() {
	return Math.max(process.stdout.columns ?? 20, 20);
}
