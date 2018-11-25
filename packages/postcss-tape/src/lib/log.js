import color from './color';
import readline from 'readline';

// symbols
const isWin32 = process.platform === 'win32';
const tick    = isWin32 ? '√' : '✔';
const cross   = isWin32 ? '×' : '✖';

let interval;

export function pass(name, message, size) {
	clearInterval(interval);

	// reset current stream line
	readline.clearLine(process.stdout, 0);
	readline.cursorTo(process.stdout, 0);

	process.stdout.write(color('green', tick) + ' ' + name + ' ' + color('dim', message) + (size ? ' ' + color('green', '[' + size + ']') : '') + '\n');
}

export function fail(name, message, errors) {
	clearInterval(interval);

	// reset current stream line
	readline.clearLine(process.stdout, 0);
	readline.cursorTo(process.stdout, 0);

	process.stdout.write(color('red', cross) + ' ' + name + ' ' + color('dim', message) + '\n');

	if (errors) {
		if (Array.isArray(errors)) {
			errors.forEach((error) => {
				process.stdout.write('  → ' + color('dim', error) + '\n');
			});
		} else {
			process.stdout.write('  → ' + color('dim', errors) + '\n');
		}
	}
}

// log with a waiting appearance
export function wait(name, message) {
	const spinner = isWin32 ? '-–—–-' : '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';

	let index = 0;

	clearInterval(interval);

	// reset current stream line
	readline.clearLine(process.stdout, 0);
	readline.cursorTo(process.stdout, 0);

	process.stdout.write(color('yellow', spinner[index]) + ' ' + name + ' ' + color('dim', message));

	interval = setInterval(() => {
		index = (index + 1) % spinner.length;

		readline.cursorTo(process.stdout, 0);

		process.stdout.write(color('yellow', spinner[index]) + ' ' + name + ' ' + color('dim', message));
	}, 60);

	return exports;
}

// stopped waiting log
export function stop() {
	clearInterval(interval);

	// reset current stream line
	readline.clearLine(process.stdout, 0);
	readline.cursorTo(process.stdout, 0);

	return exports;
}

// log
export function line(message) {
	// reset current stream line
	readline.clearLine(process.stdout, 0);
	readline.cursorTo(process.stdout, 0);

	process.stdout.write(Array.isArray(message) ? message.join('\n') + '\n' : String(message || '') + '\n');

	return exports;
}
