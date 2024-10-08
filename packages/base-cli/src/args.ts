export type Arguments = {
	stdin: boolean,
	stdout: boolean,
	inputs: Array<string>,
	output: string | undefined,
	outputDir: string | undefined,
	externalMap: boolean,
	inlineMap: boolean,
	replace: boolean,
	pluginOptions: Record<string, unknown>,
	debug: boolean,
}

export enum SignalValue {
	InvalidArguments = 'INVALID_ARGUMENTS'
}

export function parseArguments(args: Array<string>, allowedPluginOpts: Array<string>, helpLogger: () => void): Arguments | SignalValue {
	const flatArgs = args.map((x) => {
		return x.trim();
	}).filter((x) => {
		return !!x;
	});

	const parsedArgs: Arguments = {
		stdin: false,
		stdout: false,
		output: undefined,
		outputDir: undefined,
		inputs: [],
		inlineMap: true,
		externalMap: false,
		replace: false,
		pluginOptions: {},
		debug: false,
	};

	let pluginOpts = undefined;

	let encounteredFlagsOrArgs = false;

	// Stryker disable next-line UpdateOperator,EqualityOperator
	for (let i = 0; i < flatArgs.length; i++) {
		const arg = flatArgs[i];

		switch (arg) {
			case '-o':
			case '--output':
				parsedArgs.output = flatArgs[i + 1];
				// Stryker disable next-line UpdateOperator
				i++;
				encounteredFlagsOrArgs = true;
				break;

			case '-m':
			case '--map':
				parsedArgs.externalMap = true;
				parsedArgs.inlineMap = false;
				encounteredFlagsOrArgs = true;
				break;

			case '--no-map':
				parsedArgs.externalMap = false;
				parsedArgs.inlineMap = false;
				encounteredFlagsOrArgs = true;
				break;

			case '-r':
			case '--replace':
				parsedArgs.replace = true;
				encounteredFlagsOrArgs = true;
				break;

			case '--debug':
				parsedArgs.debug = true;
				encounteredFlagsOrArgs = true;
				break;

			case '-d':
			case '--dir':
				parsedArgs.outputDir = flatArgs[i + 1];
				// Stryker disable next-line UpdateOperator
				i++;
				encounteredFlagsOrArgs = true;
				break;

			case '-p':
			case '--plugin-options':
				pluginOpts = flatArgs[i + 1];
				// Stryker disable next-line UpdateOperator
				i++;
				encounteredFlagsOrArgs = true;
				break;

			default:
				if (arg.indexOf('-') === 0) {
					// Stryker disable next-line all
					console.warn(`[error] unknown argument : ${arg}\n`); // eslint-disable-line no-console
					// Stryker disable next-line all
					helpLogger();
					return SignalValue.InvalidArguments;
				}

				if (!encounteredFlagsOrArgs) {
					parsedArgs.inputs.push(arg);
					break;
				}

				// Stryker disable next-line all
				helpLogger();
				return SignalValue.InvalidArguments;
		}
	}

	if (parsedArgs.replace) {
		parsedArgs.output = undefined;
		parsedArgs.outputDir = undefined;
	}

	if (parsedArgs.outputDir) {
		parsedArgs.output = undefined;
	}

	if (parsedArgs.inputs.length > 1 && parsedArgs.output) {
		// Stryker disable next-line all
		console.warn('[error] omit "--output" when processing multiple inputs\n'); // eslint-disable-line no-console
		// Stryker disable next-line all
		helpLogger();
		return SignalValue.InvalidArguments;
	}

	if (parsedArgs.inputs.length === 0) {
		parsedArgs.stdin = true;
	}

	if (!parsedArgs.output && !parsedArgs.outputDir && !parsedArgs.replace) {
		parsedArgs.stdout = true;
	}

	if (parsedArgs.stdout) {
		parsedArgs.externalMap = false;
	}

	let parsedPluginOpts: Record<string, unknown> = {};
	// Stryker disable next-line ConditionalExpression
	if (pluginOpts) {
		try {
			parsedPluginOpts = JSON.parse(pluginOpts) as Record<string, unknown>;
		} catch {
			// Stryker disable next-line all
			console.warn('[error] plugin options must be valid JSON\n'); // eslint-disable-line no-console
			// Stryker disable next-line all
			helpLogger();
			return SignalValue.InvalidArguments;
		}
	}

	for (const key in parsedPluginOpts) {
		const value = parsedPluginOpts[key];
		if (allowedPluginOpts.includes(key)) {
			parsedArgs.pluginOptions[key] = value;
		} else {
			// Stryker disable next-line all
			console.warn(`[error] unknown plugin option: ${key}\n`); // eslint-disable-line no-console
			// Stryker disable next-line all
			helpLogger();
			return SignalValue.InvalidArguments;
		}
	}

	return parsedArgs;
}
