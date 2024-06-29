const GRADIENT_FUNCTION_REGEX = /(?:repeating-)?(?:linear|radial|conic)-gradient\(/i;
const IN_KEYWORD_REGEX = /\bin\b/i;

export const IS_GRADIENT_FUNCTION = {
	test(v: string): boolean {
		return GRADIENT_FUNCTION_REGEX.test(v) && IN_KEYWORD_REGEX.test(v);
	},
};

export const GRADIENT_NAME_REGEX = /^(repeating-)?(linear|radial|conic)-gradient$/i;
