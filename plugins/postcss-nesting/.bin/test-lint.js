import process from 'node:process'
import { ESLint } from 'eslint'

export default async function lint() {
	try {
		const eslint = new ESLint({ fix: true })

		const results = await eslint.lintFiles(['src/**/*.js'])

		await ESLint.outputFixes(results)

		const formatter = await eslint.loadFormatter('stylish')
		const resultText = formatter.format(results)

		console.log(`\x1b[42m\x1b[30m PASS \x1b[0m`, 'linting')

		if (resultText) {
			console.log(resultText)
		}

		return true
	} catch (error) {
		console.error(`\x1b[41m\x1b[30m FAIL \x1b[0m`, 'linting')
		console.error(error)

		return false
	}
}

if (new URL(process.argv[1], 'file:').href === import.meta.url) {
	lint().then((pass) => {
		if (pass) {
			process.exit(0)
		}

		process.exit(1)
	})
}
