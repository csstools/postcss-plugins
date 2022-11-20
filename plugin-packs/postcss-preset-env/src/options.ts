import type autoprefixer from 'autoprefixer';
import { pluginsOptions } from './plugins/plugins-options';

export type pluginOptions = {
	/**
	 * [Configure autoprefixer](https://github.com/postcss/autoprefixer#options)
	 */
	autoprefixer? : autoprefixer.Options,
	/**
	 * Determine which CSS features to polyfill,
	 * based upon their process in becoming web standards.
	 * default: 2
	*/
	stage?: number

	/**
	 * Determine which CSS features to polyfill,
	 * based their implementation status.
	 * default: 0
	*/
	minimumVendorImplementations?: number

	/**
	 * PostCSS Preset Env supports any standard browserslist configuration,
	 * which can be a `.browserslistrc` file,
	 * a `browserslist` key in `package.json`,
	 * or `browserslist` environment variables.
	 *
	 * The `browsers` option should only be used when a standard browserslist configuration is not available.
	 */
	browsers?: string | readonly string[] | null

	/**
	 * Enable or disable specific polyfills by ID.
	 * Passing `true` to a specific [feature ID](https://github.com/csstools/postcss-plugins/blob/main/plugin-packs/postcss-preset-env/FEATURES.md) will enable its polyfill,
	 * while passing `false` will disable it.
	 *
	 * Passing an object to a specific feature ID will both enable and configure it.
	 */
	features?: pluginsOptions

	/**
	 * Determine whether all plugins should receive a `preserve` option,
	 * which may preserve or remove the original and now polyfilled CSS.
	 * Each plugin has it's own default, some true, others false.
	 * default: _not set_
	 */
	preserve?: boolean

	/**
	 * Enable debugging messages to stdout giving insights into which features have been enabled/disabled and why.
	 * default: false
	 */
	debug?: boolean

	/**
	 * Enable any feature that would need an extra browser library to be loaded into the page for it to work.
	 * default: false
	 */
	enableClientSidePolyfills?: boolean
}
