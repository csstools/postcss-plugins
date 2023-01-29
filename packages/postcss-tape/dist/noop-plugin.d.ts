declare const noopPlugin: {
    (): {
        postcssPlugin: string;
        Rule(): void;
    };
    postcss: boolean;
};
export default noopPlugin;
