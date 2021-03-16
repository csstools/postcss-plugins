import { color } from './color.js'
import readline from 'readline'

// symbols
const isWin32 = process.platform === 'win32'
const tick    = isWin32 ? '√' : '✔'
const cross   = isWin32 ? '×' : '✖'
const stdout  = process.stdout

let interval

/** Log as a passing state. */
export const pass = (/** @type {string} */ name, /** @type {string} */ message, /** @type {boolean} */ ci) => {
	clearInterval(interval)

	if (ci) {
		stdout.write(` ${color('green', tick)}\n`)
	} else {
		// reset current stream line
		readline.clearLine(stdout, 0)
		readline.cursorTo(stdout, 0)

		stdout.write(`${color('green', tick)} ${name} ${color('dim', message)}\n`)
	}
}

/** Log as a failing state. */
export const fail = (/** @type {string} */ name, /** @type {string} */ message, /** @type {string} */ details, /** @type {boolean} */ ci) => {
	clearInterval(interval)

	if (ci) {
		stdout.write(` ${color('red', cross)}\n${details}\n`)
	} else {
		// reset current stream line
		readline.clearLine(stdout, 0)
		readline.cursorTo(stdout, 0)

		stdout.write(`${color('red', cross)} ${name} ${color('dim', message)}\n${details}\n`)
	}
}

/** Log as a waiting state. */
export const wait = (/** @type {string} */ name, /** @type {string} */ message, /** @type {boolean} */ ci) => {
	if (ci) {
		stdout.write(`${name} ${color('dim', message)}`)
	} else {
		const spinner = isWin32 ? '-–—–-' : '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'

		let index = 0

		clearInterval(interval)

		// reset current stream line
		readline.clearLine(stdout, 0)
		readline.cursorTo(stdout, 0)

		stdout.write(`${color('yellow', spinner[index])} ${name} ${color('dim', message)}`)

		interval = setInterval(() => {
			index = (index + 1) % spinner.length

			readline.cursorTo(stdout, 0)

			stdout.write(`${color('yellow', spinner[index])} ${name} ${color('dim', message)}`)
		}, 60)
	}
}
