declare const noopPlugin: {
    (): {
        postcssPlugin: string;
        Once(): void;
    };
    postcss: boolean;
};
export default noopPlugin;
