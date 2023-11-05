import postcss from 'postcss';
import type { Plugin } from 'postcss';
import { Arguments } from './args';
import { promises as fsp } from 'fs';

// Read from one or more files and write to stdout
export async function fsToStdout(plugin: Plugin, argo: Arguments): Promise<never> {
	let allCss: Array<string> = [];
	try {
		allCss = await Promise.all(argo.inputs.map(async (input) => {
			const css = await fsp.readFile(input);
			const result = await postcss([plugin]).process(css, {
				from: input,
				to: 'stdout',
				map: false,
			});

			result.warnings().forEach(warn => {
				console.warn(warn.toString());
			});

			return result.css;
		}));
	} catch (err) {
		if (err instanceof Error) {
			console.error(argo.debug ? err : err.message);
		} else {
			console.error(err);
		}

		process.exit(1);
	}

	for (const css of allCss) {
		process.stdout.write(css);
	}

	process.exit(0);
}
