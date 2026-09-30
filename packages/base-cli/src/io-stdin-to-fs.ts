import path from 'node:path';
import postcss from 'postcss';
import type { Plugin } from 'postcss';
import type { Arguments } from './args';
import { getStdin } from './get-stdin';
import fs from 'node:fs/promises';


// Read from stdin and write to a file
export async function stdinToFs(plugin: Plugin, argo: Arguments, helpLogger: () => void): Promise<never> {
	let output = argo.output;
	if (!output && argo.outputDir) {
		output = path.join(argo.outputDir, 'output.css');
	}

	if (!output) {
		// no outputs, nothing to do
		process.exit(0);
	}

	try {
		const css = await getStdin();
		if (!css) {
			helpLogger();
			process.exit(1);
		}

		const result = await postcss([plugin]).process(css, {
			from: 'stdin',
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

	// eslint-disable-next-line no-console
	console.log(`CSS was written to "${path.normalize(output)}"`);

	process.exit(0);
}
