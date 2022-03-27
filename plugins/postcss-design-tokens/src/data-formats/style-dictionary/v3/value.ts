export type StyleDictionaryV3TokenValue = {
	cssValue(): string
	// The value of the design token. This can be any type of data, a hex string, an integer, a file path to a file, even an object or array.
	value: unknown
	// Usually the name for a design token is generated with a name transform, but you can write your own if you choose. By default Style Dictionary will add a default name which is the key of the design token object.
	name?: string
	// The comment attribute will show up in a code comment in output files if the format supports it.
	comment?: string
	// This is used in formats that support override-able or themeable values like the !default flag in Sass.
	themeable?: boolean
	// Extra information about the design token you want to include. Attribute transforms will modify this object so be careful
	attributes?: unknown

	// Set by the token parser
	metadata?: {
		// A default name of the design token that is set to the key of the design token. This is only added if you do not provide one.
		name?: string
		// The object path of the design token.
		path: Array<string>
		// The file path of the file the token is defined in. This file path is derived from the source or include file path arrays defined in the configuration.
		filePath: string
		// If the token is from a file defined in the source array as opposed to include in the configuration.
		isSource: boolean
	}
}

export function extractStyleDictionaryV3Token(node: unknown, key: string, path: Array<string>, filePath: string): StyleDictionaryV3TokenValue {
	if (typeof node['value'] === 'undefined') {
		throw new Error('Token value is undefined : ' + path.join('.'));
	}

	const value = node['value'] ?? undefined;

	return {
		value: value,
		cssValue: () => {
			return value ?? '';
		},
		name: node['name'] ?? key,
		comment: node['comment'] ?? undefined,
		metadata: {
			name: node['name'] ? key : undefined,
			path: [...path, key],
			filePath: filePath,
			isSource: true,
		},
	};
}
