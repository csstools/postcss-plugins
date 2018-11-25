export default function getOptionsFromArguments(defaultOptions) {
	// argument option matcher
	const fileRegExp = /^[\w\/.]+$/;
	const argRegExp = /^--(\w+)=("|')?(.+)\2$/;
	const primativeRegExp = /^(false|null|true|undefined|\d+|\{.*\}|\[.*\])$/;
	const relaxedJsonPropRegExp = /(['"])?([a-z0-9A-Z_]+)\1:/g;
	const relaxedJsonValueRegExp = /("[a-z0-9A-Z_]+":\s*)(?!true|false|null|\d+)'?([A-z0-9]+)'?([,}])/g;
	const argNames = {};

	return process.argv.slice(2).reduce(
		(options, arg) => {
			const argMatch = arg.match(argRegExp);
			const fileMatch = arg.match(fileRegExp);

			if (argMatch) {
				const name = argMatch[1];
				const value = name !== 'from' && name !== 'to' && primativeRegExp.test(argMatch[3])
					? JSON.parse(
						argMatch[3]
						.replace(relaxedJsonPropRegExp, '"$2": ')
						.replace(relaxedJsonValueRegExp, '$1"$2"$3')
					)
				: argMatch[3];

				options[name] = argNames[name]
					? [].concat(options[name], value)
				: value;

				argNames[name] = true;
			} else if (fileMatch) {
				if (options.from === '<stdin>') {
					options.from = arg;
				} else if (options.to === '<stdout>') {
					options.to = arg;
				}
			}

			return options;
		},
		Object.assign({}, defaultOptions)
	);
}
