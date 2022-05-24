export interface TokenTransformOptions {
	pluginOptions: {
		rootFontSize: number;
	};
	toUnit?: string;
}

export interface Token {
	cssValue(opts?: TokenTransformOptions): string
}
