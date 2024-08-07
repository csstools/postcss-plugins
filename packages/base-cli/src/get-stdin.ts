export async function getStdin(): Promise<string> {
	return new Promise((resolve: (str: string) => void) => {
		let data: string = '';
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
				let chunk: string | null = '';

				while ((chunk = process.stdin.read() as string | null)) {
					data += chunk ?? '';
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
