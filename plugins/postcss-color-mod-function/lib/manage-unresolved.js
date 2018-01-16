export default function manageUnresolved(node, opts, word, message) { // eslint-disable-line max-params
	if ('warn' === opts.unresolved) {
		opts.decl.warn(opts.result, message, { word });
	} else if ('ignore' !== opts.unresolved) {
		throw opts.decl.error(message, { word });
	}
}
