/** postcss-src plugin options */
export type pluginOptions = {
    /**
     * If postcss-src encounters a `src()` that it can't safely convert to a `url()` it will throw an error.
     * example: `src(var(--foo))`
     *
     * If this is `true`, it will emit the `src()` unchanged instead.
     */
    allowNativeSrc?: boolean;
};
