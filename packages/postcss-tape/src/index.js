import { exitFail, exitPass } from './lib/exit';
import { readOrWriteFile, safelyReadFile, writeFile } from './lib/utils';
import * as log from './lib/log';
import getErrorMessage from './lib/get-error-message';
import getOptions from './lib/get-options';
import path from 'path';

getOptions().then(
	async options => {
		let hadError = false;

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

			const pluginName = Object(testPlugin.postcss).postcssPlugin || 'postcss';

			log.wait(pluginName, test.message, options.ci);

			try {
				if (Object(test.before) instanceof Function) {
					await test.before();
				}

				const expectCSS = await safelyReadFile(expectPath);
				const sourceCSS = await readOrWriteFile(sourcePath, expectCSS);

				const result = await testPlugin.process(sourceCSS, processOptions, pluginOptions);
				const resultCSS = result.css;

				if (options.fix) {
					await writeFile(expectPath, resultCSS);
					await writeFile(resultPath, resultCSS);
				} else {
					await writeFile(resultPath, resultCSS);

					if (expectCSS !== resultCSS) {
						throw new Error([
							`Expected: ${JSON.stringify(expectCSS).slice(1, -1)}`,
							`Received: ${JSON.stringify(resultCSS).slice(1, -1)}`
						].join('\n'));
					}
				}

				const warnings = result.warnings();

				if (typeof test.warnings === 'number') {
					if (test.warnings !== warnings.length) {
						const s = warnings.length !== 1 ? 's' : '';

						throw new Error(`Expected: ${test.warnings} warning${s}\nReceived: ${warnings.length} warnings`);
					}
				} else if (warnings.length) {
					const areExpectedWarnings = warnings.every(
						warning => test.warnings === Object(test.warnings) && Object.keys(test.warnings).every(
							key => test.warnings[key] instanceof RegExp
								? test.warnings[key].test(warning[key])
							: test.warnings[key] === warning[key]
						)
					);

					if (!areExpectedWarnings) {
						const s = warnings.length !== 1 ? 's' : '';

						throw new Error(`Unexpected warning${s}:\n${warnings.join('\n')}`);
					}
				} else if (test.warnings) {
					throw new Error(`Expected a warning`);
				} else if (test.errors) {
					throw new Error(`Expected an error`);
				}

				if (Object(test.after) instanceof Function) {
					await test.after();
				}

				log.pass(pluginName, test.message, options.ci);
			} catch (error) {
				if ('error' in test) {
					const isObjectError = test.error === Object(test.error);

					if (isObjectError) {
						const isExpectedError = Object.keys(test.error).every(
							key => test.error[key] instanceof RegExp
								? test.error[key].test(Object(error)[key])
							: test.error[key] === Object(error)[key]
						);

						if (isExpectedError) {
							log.pass(pluginName, test.message, options.ci);
						} else {
							const reportedError = Object.keys(test.error).reduce(
								(reportedError, key) => Object.assign(reportedError, { [key]: Object(error)[key] }),
								{}
							);

							hadError = error;

							log.fail(pluginName, test.message, `  Expected Error: ${JSON.stringify(test.error)}\n  Received Error: ${JSON.stringify(reportedError)}`, options.ci);
						}
					} else {
						const isExpectedError = typeof test.error === 'boolean' && test.error;

						if (isExpectedError) {
							log.pass(pluginName, test.message, options.ci);
						} else {
							hadError = error;

							log.fail(pluginName, test.message, `  Expected Error`, options.ci);
						}

						if (options.ci) {
							break;
						}
					}
				} else {
					hadError = error;

					log.fail(pluginName, test.message, getErrorMessage(error), options.ci);
				}
			}
		}

		if (hadError) {
			throw hadError;
		}
	}
).then(exitPass, exitFail);


