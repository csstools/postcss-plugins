const argRegExp = /^--([\w-]+)$/
const primativeRegExp = /^(false|null|true|undefined|(\d+\.)?\d+|\{.*\}|\[.*\])$/
const relaxedJsonPropRegExp = /(['"])?([a-z0-9A-Z_]+)\1:/g
const relaxedJsonValueRegExp = /("[a-z0-9A-Z_]+":\s*)(?!true|false|null|\d+)'?([A-z0-9]+)'?([,}])/g

/** Return an object of options from a CLI array of arguments. */
export const getOptionsFromArguments = (/** @type {object} */ defaultOptions) => process.argv.slice(2).reduce(
	(/** @type {object} */ args, /** @type {string} */ arg, /** @type {number} */ index, /** @type {object} */ argv) => {
		const nextIndex = index + 1
		const nextArg = argv[nextIndex]
		const argMatch = arg.match(argRegExp)

		if (argMatch) {
			const [, name] = argMatch

			if (!nextArg || argRegExp.test(nextArg)) {
				args[name] = true
			} else {
				args[name] = primativeRegExp.test(nextArg)
					? JSON.parse(
						nextArg
						.replace(relaxedJsonPropRegExp, '"$2": ')
						.replace(relaxedJsonValueRegExp, '$1"$2"$3')
					)
				: nextArg
			}
		}

		return args
	},
	Object.assign({}, defaultOptions)
)
