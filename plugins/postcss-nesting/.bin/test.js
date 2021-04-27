import process from 'node:process'
import lint from './test-lint.js'
import tape from './test-tape.js'

export default async function test() {
	let failures = 0
	try {
		if (!await lint()) {
			++failures
		}
		if (!await tape()) {
			++failures
		}
	} catch(error) {
		++failures
	}

	return failures === 0
}

if (new URL(process.argv[1], 'file:').href === import.meta.url) {
	test().then(
		process.exit.bind(process, 0),
		process.exit.bind(process, 1)
	)
}
