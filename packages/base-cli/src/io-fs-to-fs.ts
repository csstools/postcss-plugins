import path from 'node:path';
import postcss from 'postcss';
import type { Plugin } from 'postcss';
import type { Arguments } from './args';
import fs from 'node:fs/promises';

// Read from one or more files and write to as many files
export async function fsToFs(plugin: Plugin, argo: Arguments): Promise<never> {
	try {
		await Promise.all(argo.inputs.map(async (input) => {
			let output = argo.output;
			if (argo.outputDir) {
				output = path.join(argo.outputDir, path.basename(input));
			}
			if (argo.replace) {
				output = input;
			}

			if (!output) {
				// no outputs, nothing to do
				process.exit(0);
			}

			const css = await fs.readFile(input);
			const result = await postcss([plugin]).process(css, {
				from: input,
				to: output,
				map: (argo.inlineMap || argo.externalMap) ? { inline: argo.inlineMap } : false,
			});

			result.warnings().forEach(warn => {
				// eslint-disable-next-line no-console
				console.warn(warn.toString());
			});

			if (argo.externalMap && result.map) {
				await Promise.all([
					fs.writeFile(output, result.css + (argo.inlineMap ? '\n' : '')),
					fs.writeFile(`${output}.map`, result.map.toString()),
				]);
			} else {
				await fs.writeFile(output, result.css + (argo.inlineMap ? '\n' : ''));
			}

			// eslint-disable-next-line no-console
			console.log(`CSS was written to "${path.normalize(output)}"`);
		}));
	} catch (err) {
		if (err instanceof Error) {
			// eslint-disable-next-line no-console
			console.error(argo.debug ? err : err.message);
		} else {
			// eslint-disable-next-line no-console
			console.error(err);
		}

		process.exit(1);
	}

	process.exit(0);
}
