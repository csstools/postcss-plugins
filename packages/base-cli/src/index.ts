import fsp from 'fs/promises';
import path from 'path';
import { parseArguments, SignalValue } from './args';
import postcss from 'postcss';
import type { PluginCreator } from 'postcss';

export * from './help';

type PluginCreatorOptions = Record<string, unknown> | null;

export async function cli(plugin: PluginCreator<PluginCreatorOptions>, allowedPluginOpts: Array<string>, helpLogger: () => void) {
	// get process and plugin options from the command line
	const argo = parseArguments(process.argv.slice(2), allowedPluginOpts, helpLogger);
	if (argo === SignalValue.InvalidArguments) {
		process.exit(1);
	}

	// Read from stdin and write to stdout
	if (argo.stdin && argo.stdout) {
		try {
			const css = await getStdin();
			if (!css) {
				helpLogger();
				process.exit(1);
			}

			const result = await postcss([plugin(argo.pluginOptions)]).process(css, {
				from: 'stdin',
				to: 'stdout',
				map: argo.inlineMap ? { inline: true } : false,
			});

			process.stdout.write(result.css + (argo.inlineMap ? '\n' : ''));
		} catch (error) {
			console.error(argo.debug ? error : error.message);

			process.exit(1);
		}

		return;
	}

	// Read from stdin and write to a file
	if (argo.stdin) {
		let output = argo.output;
		if (!output && argo.outputDir) {
			output = path.join(argo.outputDir, 'output.css');
		}

		try {
			const css = await getStdin();
			if (!css) {
				helpLogger();
				process.exit(1);
			}

			const result = await postcss([plugin(argo.pluginOptions)]).process(css, {
				from: 'stdin',
				to: output,
				map: (argo.inlineMap || argo.externalMap) ? { inline: argo.inlineMap } : false,
			});

			if (argo.externalMap && result.map) {
				await Promise.all([
					await fsp.writeFile(output, result.css + (argo.inlineMap ? '\n' : '')),
					await fsp.writeFile(`${output}.map`, result.map.toString()),
				]);
			} else {
				await fsp.writeFile(output, result.css + (argo.inlineMap ? '\n' : ''));
			}

			console.log(`CSS was written to "${path.normalize(output)}"`);
		} catch (error) {
			console.error(argo.debug ? error : error.message);

			process.exit(1);
		}

		return;
	}

	// Read from one or more files and write to stdout
	if (argo.stdout) {
		let allCss: Array<string> = [];
		try {
			allCss = await Promise.all(argo.inputs.map(async (input) => {
				const css = await fsp.readFile(input);
				const result = await postcss([plugin(argo.pluginOptions)]).process(css, {
					from: input,
					to: 'stdout',
					map: false,
				});

				return result.css;
			}));
		} catch (error) {
			console.error(argo.debug ? error : error.message);

			process.exit(1);
		}

		for (const css of allCss) {
			process.stdout.write(css);
		}

		return;
	}

	// Read from one or more files and write to as many files
	try {
		await Promise.all(argo.inputs.map(async (input) => {
			let output = argo.output;
			if (argo.outputDir) {
				output = path.join(argo.outputDir, path.basename(input));
			}
			if (argo.replace) {
				output = input;
			}

			const css = await fsp.readFile(input);
			const result = await postcss([plugin(argo.pluginOptions)]).process(css, {
				from: input,
				to: output,
				map: (argo.inlineMap || argo.externalMap) ? { inline: argo.inlineMap } : false,
			});

			if (argo.externalMap && result.map) {
				await Promise.all([
					await fsp.writeFile(output, result.css + (argo.inlineMap ? '\n' : '')),
					await fsp.writeFile(`${output}.map`, result.map.toString()),
				]);
			} else {
				await fsp.writeFile(output, result.css + (argo.inlineMap ? '\n' : ''));
			}

			console.log(`CSS was written to "${path.normalize(output)}"`);
		}));
	} catch (error) {
		console.error(argo.debug ? error : error.message);

		process.exit(1);
	}
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
