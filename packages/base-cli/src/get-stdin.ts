export async function getStdin() {
	return new Promise((resolve: (str: string) => void) => {
		let data = '';
		let timedOut = false;
		setTimeout(() => {
			timedOut = true;
			resolve('');
		}, 10000);

		if (process.stdin.isTTY) {
			if (timedOut) {
				return;
			}

			resolve(data);
		} else {
			process.stdin.setEncoding('utf8');

			process.stdin.on('readable', () => {
				let chunk;

				while ((chunk = process.stdin.read())) {
					data += chunk;
				}
			});

			process.stdin.on('end', () => {
				if (timedOut) {
					return;
				}

				resolve(data);
			});
		}
	});
}
