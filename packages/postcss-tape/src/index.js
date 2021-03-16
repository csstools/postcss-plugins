import * as exit from './lib/exit.js'
import { readOrWriteFile, safelyReadFile, writeFile } from './lib/utils.js'
import { getErrorMessage } from './lib/get-error-message.js'
import { getOptions } from './lib/get-options.js'
import * as log from './lib/log.js'
import path from 'path'

const postcss8 = async (plugins) => {
	const pkg = await import('postcss/package.json')

	if (pkg.version[0] === '8') {
		const m = await import('postcss')
		return m.default(plugins)
	} else {
		throw new Error(`postcss@8 must be installed, found ${pkg.version}`)
	}
}

const isPostcss8Plugin = (plugin) => typeof plugin === 'function' && Object(plugin).postcss === true

getOptions().then(
	async options => {
		let hadError = false

		// runner
		for (const name in options.config) {
			const test = options.config[name]

			const testBase = name.split(':')[0]
			const testFull = name.split(':').join('.')

			// test paths
			const sourcePath = path.resolve(options.fixtures, test.source || `${testBase}.css`)
			const expectPath = path.resolve(options.fixtures, test.expect || `${testFull}.expect.css`)
			const resultPath = path.resolve(options.fixtures, test.result || `${testFull}.result.css`)

			const processOptions = Object.assign({ from: sourcePath, to: resultPath }, test.processOptions)
			const pluginOptions = test.options

			let rawPlugin = test.plugin || options.plugin

			if (rawPlugin.default) {
				rawPlugin = rawPlugin.default
			}

			const plugin = isPostcss8Plugin(rawPlugin)
				? rawPlugin(pluginOptions)
			: typeof Object(rawPlugin).process === 'function'
				? rawPlugin
			: typeof rawPlugin === 'function'
				? { process: rawPlugin }
			: Object(rawPlugin).postcssPlugin

			const pluginName = plugin.postcssPlugin || Object(rawPlugin.postcss).postcssPlugin || 'postcss'

			log.wait(pluginName, test.message, options.ci)

			try {
				if (Object(test.before) instanceof Function) {
					await test.before()
				}

				const expectCSS = await safelyReadFile(expectPath)
				const sourceCSS = await readOrWriteFile(sourcePath, expectCSS)

				let result

				if (isPostcss8Plugin(rawPlugin)) {
					const postcss = await postcss8([ plugin ])

					result = await postcss.process(sourceCSS, processOptions)
				} else {
					result = await plugin.process(sourceCSS, processOptions, pluginOptions)
				}

				const resultCSS = result.css

				if (options.fix) {
					await writeFile(expectPath, resultCSS)
					await writeFile(resultPath, resultCSS)
				} else {
					await writeFile(resultPath, resultCSS)

					if (expectCSS !== resultCSS) {
						throw new Error([
							`Expected: ${JSON.stringify(expectCSS).slice(1, -1)}`,
							`Received: ${JSON.stringify(resultCSS).slice(1, -1)}`
						].join('\n'))
					}
				}

				const warnings = result.warnings()

				if (typeof test.warnings === 'number') {
					if (test.warnings !== warnings.length) {
						const s = warnings.length !== 1 ? 's' : ''

						throw new Error(`Expected: ${test.warnings} warning${s}\nReceived: ${warnings.length} warnings`)
					}
				} else if (warnings.length) {
					const areExpectedWarnings = warnings.every(
						warning => test.warnings === Object(test.warnings) && Object.keys(test.warnings).every(
							key => test.warnings[key] instanceof RegExp
								? test.warnings[key].test(warning[key])
							: test.warnings[key] === warning[key]
						)
					)

					if (!areExpectedWarnings) {
						const s = warnings.length !== 1 ? 's' : ''

						throw new Error(`Unexpected warning${s}:\n${warnings.join('\n')}`)
					}
				} else if (test.warnings) {
					throw new Error(`Expected a warning`)
				} else if (test.errors) {
					throw new Error(`Expected an error`)
				}

				if (Object(test.after) instanceof Function) {
					await test.after()
				}

				log.pass(pluginName, test.message, options.ci)
			} catch (error) {
				if ('error' in test) {
					const isObjectError = test.error === Object(test.error)

					if (isObjectError) {
						const isExpectedError = Object.keys(test.error).every(
							key => test.error[key] instanceof RegExp
								? test.error[key].test(Object(error)[key])
							: test.error[key] === Object(error)[key]
						)

						if (isExpectedError) {
							log.pass(pluginName, test.message, options.ci)
						} else {
							const reportedError = Object.keys(test.error).reduce(
								(reportedError, key) => Object.assign(reportedError, { [key]: Object(error)[key] }),
								{}
							)

							hadError = error

							log.fail(pluginName, test.message, `  Expected Error: ${JSON.stringify(test.error)}\n  Received Error: ${JSON.stringify(reportedError)}`, options.ci)
						}
					} else {
						const isExpectedError = typeof test.error === 'boolean' && test.error

						if (isExpectedError) {
							log.pass(pluginName, test.message, options.ci)
						} else {
							hadError = error

							log.fail(pluginName, test.message, `  Expected Error`, options.ci)
						}

						if (options.ci) {
							break
						}
					}
				} else {
					hadError = error

					log.fail(pluginName, test.message, getErrorMessage(error), options.ci)
				}
			}
		}

		if (hadError) {
			throw hadError
		}
	}
).then(exit.pass, exit.fail)

