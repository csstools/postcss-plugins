/**
 * @param {{ decl: import('postcss').Declaration, oninvalid: string, preserve: boolean, result: import('postcss').Result }} opts
 * @param {string} message
 * @param {import('postcss-values-parser').ChildNode} word
 */
module.exports = (opts, message, word) => {
	if (opts.oninvalid === 'warn') {
		opts.decl.warn(opts.result, message, { word: String(word) });
	} else if (opts.oninvalid === 'throw') {
		throw opts.decl.error(message, { word: String(word) });
	}
};
