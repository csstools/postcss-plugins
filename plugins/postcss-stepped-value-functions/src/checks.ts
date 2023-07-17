const functionNames = [
	'mod',
	'rem',
	'round',
];

export const FUNCTION_NAME_REGEXP = new RegExp(`^(${functionNames.join('|')})$`, 'i');
export const FUNCTION_CALL_REGEXP = new RegExp(`(${functionNames.join('|')})\\(`, 'i');
