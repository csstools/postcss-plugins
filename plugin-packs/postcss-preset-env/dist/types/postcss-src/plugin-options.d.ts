/** postcss-src plugin options */
export type pluginOptions = {
    /**
     * If a `src()` function is encountered that can not be safely convert to a `url()` function an error will be thrown.
     * example: `src(var(--foo))`
     *
     * If this is set to `true`, it will emit the `src()` unchanged instead.
     */
    allowNativeSrc?: boolean;
};
