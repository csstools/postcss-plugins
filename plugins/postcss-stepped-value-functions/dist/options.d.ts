/** postcss-stepped-value-functions plugin options */
export type pluginOptions = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
    /**
     * Set `warn` to get warnings when the usage of the functions is incorrect.
     * default: _not set_
     */
    onInvalid?: 'warn';
};
