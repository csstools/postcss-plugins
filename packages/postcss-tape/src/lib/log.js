import color from './color';
import readline from 'readline';

// symbols
const isWin32 = process.platform === 'win32';
const tick    = isWin32 ? '√' : '✔';
const cross   = isWin32 ? '×' : '✖';
const stdout  = process.stdout;

let interval;

export function pass(name, message, ci) {
	clearInterval(interval);

	if (ci) {
		stdout.write(` ${color('green', tick)}\n`);
	} else {
		// reset current stream line
		readline.clearLine(stdout, 0);
		readline.cursorTo(stdout, 0);

		stdout.write(`${color('green', tick)} ${name} ${color('dim', message)}\n`);
	}
}

export function fail(name, message, ci) {
	clearInterval(interval);

	if (ci) {
		stdout.write(` ${color('red', cross)}\n`);
	} else {
		// reset current stream line
		readline.clearLine(stdout, 0);
		readline.cursorTo(stdout, 0);

		stdout.write(`${color('red', cross)} ${name} ${color('dim', message)}\n`);
	}
}

// log with a waiting appearance
export function wait(name, message, ci) {
	if (ci) {
		stdout.write(`${name} ${color('dim', message)}`);
	} else {
		const spinner = isWin32 ? '-–—–-' : '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';

		let index = 0;

		clearInterval(interval);

		// reset current stream line
		readline.clearLine(stdout, 0);
		readline.cursorTo(stdout, 0);

		stdout.write(`${color('yellow', spinner[index])} ${name} ${color('dim', message)}`);

		interval = setInterval(() => {
			index = (index + 1) % spinner.length;

			readline.cursorTo(stdout, 0);

			stdout.write(`${color('yellow', spinner[index])} ${name} ${color('dim', message)}`);
		}, 60);
	}
}
