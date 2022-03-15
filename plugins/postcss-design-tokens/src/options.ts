// Public API vs. Internal usage.
// The public API has a lot of optional parameters and simpler typing like "Array".
// This is compatible with JSON.
//
// The internal usage typings do not have any optional parameters and use more powerful types like "Map" and "Set".

// Public API
type TokenOptions = {
	name: string,
	value: string,
	deprecated?: boolean,
}

export type AtMediaOptions = TokenOptions;
export type AtSupportsOptions = TokenOptions;
export type SelectorOptions = TokenOptions;

export type ValueOptions = {
	name: string,
	value: string,
	deprecated?: boolean,
	allowedProperties?: Array<string>,
	blockedProperties?: Array<string>,
}

// Internal usage
type TokenConfig = {
	name: string,
	value: string,
	deprecated: boolean,
}

export type AtMediaConfig = TokenConfig;
export type AtSupportsConfig = TokenConfig;
export type SelectorConfig = TokenConfig;

export type ValueConfig = {
	name: string,
	value: string,
	deprecated: boolean,
	allowedProperties: Set<string>,
	blockedProperties: Set<string>,
}

function validateSubOptions(rawSubOptions: unknown): { name: string, value: string, deprecated: boolean } {
	const subOptions = Object(rawSubOptions);
	return {
		name: (typeof subOptions.name === 'string') ? subOptions.name : '',
		value: (typeof subOptions.value === 'string') ? subOptions.value : '',
		deprecated: (typeof subOptions.deprecated === 'boolean') ? subOptions.deprecated : false,
	};
}

export type Config = {
	requiresDesignTokens: {
		properties: Set<string>,
	},
	designTokens: {
		atMedia: Map<string, AtMediaConfig>,
		atSupports: Map<string, AtSupportsConfig>,
		selectors: Map<string, SelectorConfig>,
		values: Map<string, ValueConfig>
	}
};

export function validateOptions(rawOptions: unknown) {
	const config: Config = {
		requiresDesignTokens: {
			properties: new Set(),
		},
		designTokens: {
			atMedia: new Map(),
			atSupports: new Map(),
			selectors: new Map(),
			values: new Map(),
		},
	};

	const requiresDesignTokens = Object(rawOptions).requiresDesignTokens;
	if (requiresDesignTokens && Array.isArray(Object(requiresDesignTokens).properties)) {
		requiresDesignTokens.properties.forEach((x) => {
			if (typeof x === 'string') {
				config.requiresDesignTokens.properties.add(x);
			}
		});
	}

	const designTokens = Object(rawOptions).designTokens;
	if (designTokens) {
		if (Array.isArray(Object(designTokens).atMedia)) {
			designTokens.atMedia.map((x) => {
				return validateSubOptions(x);
			}).filter((x: TokenConfig) => {
				return x.name !== '' && x.value !== '';
			}).forEach((x: TokenConfig) => {
				config.designTokens.atMedia.set(x.name, x);
			});
		}

		if (Array.isArray(Object(designTokens).atSupports)) {
			designTokens.atSupports.map((x) => {
				return validateSubOptions(x);
			}).filter((x: TokenConfig) => {
				return x.name !== '' && x.value !== '';
			}).forEach((x: TokenConfig) => {
				config.designTokens.atSupports.set(x.name, x);
			});
		}

		if (Array.isArray(Object(designTokens).selectors)) {
			designTokens.selectors.map((x) => {
				return validateSubOptions(x);
			}).filter((x: TokenConfig) => {
				return x.name !== '' && x.value !== '';
			}).forEach((x: TokenConfig) => {
				config.designTokens.selectors.set(x.name, x);
			});
		}

		if (Array.isArray(Object(designTokens).values)) {
			designTokens.values.map((x) => {
				const allowedProperties : Array<string> = (Array.isArray(Object(x).allowedProperties)) ? x.allowedProperties.filter((y) => {
					return typeof y === 'string';
				}) : [];
				const blockedProperties: Array<string> = (Array.isArray(Object(x).blockedProperties)) ? x.blockedProperties.filter((y) => {
					return typeof y === 'string';
				}) : [];

				const xx: ValueConfig = {
					...validateSubOptions(x),
					allowedProperties: new Set(allowedProperties),
					blockedProperties: new Set(blockedProperties),
				};

				return xx;
			}).filter((x: ValueConfig) => {
				return x.name !== '' && x.value !== '';
			}).forEach((x: ValueConfig) => {
				config.designTokens.values.set(x.name, x);
			});
		}
	}

	return config;
}
