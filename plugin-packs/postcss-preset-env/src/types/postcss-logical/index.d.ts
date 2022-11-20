declare module 'postcss-logical' {
	/** postcss-logical plugin options */
	export type pluginOptions = {
		/** Preserve the original notation. default: false */
		preserve?: boolean,
		/** Assume a direction for the document. default: null */
		dir?: 'ltr' | 'rtl'
	};
}
