import fs from 'fs';
import path from 'path';
import { parseArguments, SignalValue } from './args';
import postcss from 'postcss';
import type { PluginCreator } from 'postcss';

export * from './help';

type PluginCreatorOptions = Record<string, unknown> | null;

export function cli(plugin: PluginCreator<PluginCreatorOptions>, allowedPluginOpts: Array<string>, helpLogger: () => void) {
	// get process and plugin options from the command line
	const argo = parseArguments(process.argv.slice(2), allowedPluginOpts, helpLogger);
	if (argo === SignalValue.InvalidArguments) {
		process.exit(1);
	}

	if (argo.stdin && argo.stdout) {
		return getStdin().then((css) => {
			if (!css) {
				helpLogger();
				process.exit(1);
			}

			const result = postcss([plugin(argo.pluginOptions)]).process(css, {
				from: 'stdin',
				to: 'stdout',
				map: argo.inlineMap ? { inline: true } : false,
			});

			return result.css;
		}).then((result) => {
			process.stdout.write(result + (argo.inlineMap ? '\n' : ''));

			process.exit(0);
		}).catch((error) => {
			console.error(argo.debug ? error : error.message);

			process.exit(1);
		});
	}

	if (argo.stdin) {
		let output = argo.output;
		if (!output && argo.outputDir) {
			output = path.join(argo.outputDir, 'output.css');
		}

		return getStdin().then((css) => {
			if (!css) {
				helpLogger();
				process.exit(1);
			}

			const result = postcss([plugin(argo.pluginOptions)]).process(css, {
				from: 'stdin',
				to: output,
				map: (argo.inlineMap || argo.externalMap) ? { inline: argo.inlineMap } : false,
			});

			if (argo.externalMap && result.map) {
				return Promise.all([
					writeFile(output, result.css),
					writeFile(`${output}.map`, result.map.toString()),
				]).then(() => {
					console.log(`CSS was written to "${path.normalize(output)}"`);
					return;
				});
			}

			return writeFile(output, result.css + (argo.inlineMap ? '\n' : ''));
		}).then(() => {
			console.log(`CSS was written to "${path.normalize(output)}"`);

			process.exit(0);
		}).catch((error) => {
			console.error(argo.debug ? error : error.message);

			process.exit(1);
		});
	}

	if (argo.stdout) {
		const outputs = argo.inputs.map((input) => {
			return {
				input: input,
				result: null,
			};
		});

		return Promise.all(argo.inputs.map((input) => {
			return readFile(input).then((css) => {
				const result = postcss([plugin(argo.pluginOptions)]).process(css, {
					from: input,
					to: 'stdout',
					map: false,
				});

				return result.css;
			}).then((result) => {
				outputs.find((output) => output.input === input).result = result;
			});
		})).then(() => {
			outputs.forEach((output) => {
				process.stdout.write(output.result);
			});

			process.exit(0);
		}).catch((error) => {
			console.error(argo.debug ? error : error.message);

			process.exit(1);
		});
	}

	return Promise.all(argo.inputs.map((input) => {
		let output = argo.output;
		if (argo.outputDir) {
			output = path.join(argo.outputDir, path.basename(input));
		}
		if (argo.replace) {
			output = input;
		}

		return readFile(input).then((css) => {
			return postcss([plugin(argo.pluginOptions)]).process(css, {
				from: input,
				to: output,
				map: (argo.inlineMap || argo.externalMap) ? { inline: argo.inlineMap } : false,
			});
		}).then((result) => {
			if (argo.externalMap && result.map) {
				return Promise.all([
					writeFile(output, result.css),
					writeFile(`${output}.map`, result.map.toString()),
				]).then(() => {
					console.log(`CSS was written to "${path.normalize(output)}"`);
					return;
				});
			}

			return writeFile(output, result.css + (argo.inlineMap ? '\n' : '')).then(() => {
				console.log(`CSS was written to "${path.normalize(output)}"`);
			});
		});
	})).catch((error) => {
		console.error(argo.debug ? error : error.message);

		process.exit(1);
	});
}

function readFile (pathname: string): Promise<string> {
	return new Promise((resolve, reject) => {
		fs.readFile(pathname, 'utf8', (error, data) => {
			if (error) {
				reject(error);
			} else {
				resolve(data);
			}
		});
	});
}

function writeFile (pathname: string, data: string): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.writeFile(pathname, data, (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

function getStdin(): Promise<string> {
	return new Promise(resolve => {
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
