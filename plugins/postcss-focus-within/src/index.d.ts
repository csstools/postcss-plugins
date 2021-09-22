export type PluginOptions = {
	/** Defines whether the original selector should remain. */
	preserve?: boolean
	/** Defines the selector to replace `:focus-within`. */
	replaceWith?: string
}

export type Plugin = {
	(pluginOptions?: PluginOptions): {
		postcssPlugin: 'postcss-focus-within'
	}
	postcss: true
}

declare const plugin: Plugin

export default plugin
