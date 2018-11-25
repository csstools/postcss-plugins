import getOptions from './lib/get-options';
import path from 'path';
import { readOrWriteFile, safelyReadFile, writeFile } from './lib/utils';
import { fail, pass, wait } from './lib/log';

getOptions().then(
	async options => {
		let hadErrors = false;

		// runner
		for (const name in options.config) {
			const test = options.config[name];

			const testPlugin = test.plugin instanceof Function ? test.plugin : options.plugin;

			const testBase = name.split(':')[0];
			const testFull = name.split(':').join('.');

			// test paths
			const sourcePath = path.resolve(options.fixtures, test.source || `${testBase}.css`);
			const expectPath = path.resolve(options.fixtures, test.expect || `${testFull}.expect.css`);
			const resultPath = path.resolve(options.fixtures, test.result || `${testFull}.result.css`);

			const processOptions = Object.assign({ from: sourcePath, to: resultPath }, test.processOptions);
			const pluginOptions = test.options;

			const pluginName = Object(testPlugin.postcss).postcssPlugin;

			wait(pluginName, test.message);

			try {
				if (Object(test.before) instanceof Function) {
					await test.before();
				}

				const expectCSS = await safelyReadFile(expectPath);
				const sourceCSS = await readOrWriteFile(sourcePath, expectCSS);

				const result = await testPlugin.process(sourceCSS, processOptions, pluginOptions);
				const resultCSS = result.css;

				if ('fix' in options && options.fix !== false) {
					await writeFile(expectPath, resultCSS);
					await writeFile(resultPath, resultCSS);
				} else {
					await writeFile(resultPath, resultCSS);

					if (expectCSS !== resultCSS) {
						throw new Error([
							`Expected: ${JSON.stringify(expectCSS).slice(1, -1)}`,
							`Rendered: ${JSON.stringify(resultCSS).slice(1, -1)}`
						].join('\n'));
					}
				}

				const warnings = result.warnings();

				if (Object(test.warnings) instanceof Number) {
					if (test.warnings !== warnings.length) {
						const s = warnings.length !== 1 ? 's' : '';

						throw new Error(`Expected: ${test.warnings} warning${s}\nRecieved: ${warnings.length} warnings`);
					}
				} else if (test.warnings) {
					if (warnings.length) {
						const areExpectedWarnings = warnings.every(
							warning => Object.keys(test.warnings).every(
								key => test.warnings[key] instanceof RegExp
									? test.warnings[key].test(warning[key])
								: test.warnings[key] === warning[key]
							)
						);

						if (!areExpectedWarnings) {
							const s = warnings.length !== 1 ? 's' : '';

							throw new Error(`Unexpected warning${s}:\n${warnings.join('\n')}`);
						}
					} else {
						throw new Error(`Expected a warning`);
					}
				}

				if (Object(test.after) instanceof Function) {
					await test.after();
				}

				pass(pluginName, test.message);
			} catch (error) {
				const areExpectedErrors = test.errors === Object(test.errors) && Object.keys(test.errors).every(
					key => test.errors[key] instanceof RegExp
						? test.errors[key].test(error[key])
					: test.error[key] === error[key]
				);

				if (!areExpectedErrors) {
					fail(pluginName, test.message);
					console.error(error.message);

					hadErrors = true;
				}
			}
		}

		if (hadErrors) {
			throw new Error();
		}
	}
).then(
	() => {
		process.exit(0);
	},
	() => {
		process.exit(1);
	}
)
