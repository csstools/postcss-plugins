import pkg from './package.json'

export default {
	...pkg.rollup,
	plugins: pkg.rollup.plugins.map(plugin => ((plugin = [].concat(plugin)), require(plugin[0])(...plugin.slice(1)))),
	onwarn(warning, warn) {
		if (warning.code !== 'UNRESOLVED_IMPORT') warn(warning)
	}
}
