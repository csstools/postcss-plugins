// tooling
const color    = require('./color');
const readline = require('readline');

// symbols
const isWin32 = process.platform === 'win32';
const tick    = isWin32 ? '√' : '✔';
const cross   = isWin32 ? '×' : '✖';

// log methods
Object.assign(exports, {
	// log with a passing appearance
	pass(name, message, size) {
		clearInterval(exports.interval);

		// reset current stream line
		readline.clearLine(process.stdout, 0);
		readline.cursorTo(process.stdout, 0);

		process.stdout.write(color.green(tick) + ' ' + name + ' ' + color.dim(message) + (size ? ' ' + color.green('[' + size + ']') : '') + '\n');

		return exports;
	},

	// log with a failing appearance
	fail(name, message, errors) {
		clearInterval(exports.interval);

		// reset current stream line
		readline.clearLine(process.stdout, 0);
		readline.cursorTo(process.stdout, 0);

		process.stdout.write(color.red(cross) + ' ' + name + ' ' + color.dim(message) + '\n');

		if (errors) {
			if (Array.isArray(errors)) {
				errors.forEach((error) => {
					process.stdout.write('  → ' + color.dim(error) + '\n');
				});
			} else {
				process.stdout.write('  → ' + color.dim(errors) + '\n');
			}
		}

		return exports;
	},

	// log with a waiting appearance
	wait(name, message) {
		const spinner = isWin32 ? '-–—–-' : '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';

		let index = 0;

		clearInterval(exports.interval);

		// reset current stream line
		readline.clearLine(process.stdout, 0);
		readline.cursorTo(process.stdout, 0);

		process.stdout.write(color.yellow(spinner[index]) + ' ' + name + ' ' + color.dim(message));

		exports.interval = setInterval(() => {
			index = (index + 1) % spinner.length;

			readline.cursorTo(process.stdout, 0);

			process.stdout.write(color.yellow(spinner[index]) + ' ' + name + ' ' + color.dim(message));
		}, 60);

		return exports;
	},

	// stopped waiting log
	stop() {
		clearInterval(exports.interval);

		// reset current stream line
		readline.clearLine(process.stdout, 0);
		readline.cursorTo(process.stdout, 0);

		return exports;
	},

	// log
	line(message) {
		// reset current stream line
		readline.clearLine(process.stdout, 0);
		readline.cursorTo(process.stdout, 0);

		process.stdout.write(Array.isArray(message) ? message.join('\n') + '\n' : String(message || '') + '\n');

		return exports;
	}
});
