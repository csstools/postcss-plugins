import type { PluginCreator } from 'postcss';
/** postcss-bundle plugin options */
export type pluginOptions = {
    /** plugin options for `@csstools/postcss-rebase-url` */
    rebaseURL: never;
    /** plugin options for `postcss-import` */
    import: {
        /**
         * Only transform imports for which the test function returns true.
         * Imports for which the test function returns false will be left as is.
         * The function gets the path to import as an argument and should return a boolean.
         */
        filter: (path: string) => boolean;
        /**
         * Default: process.cwd() or dirname of the postcss from
         *
         * Define the root where to resolve path (eg: place where node_modules are). Should not be used that much.
         * Note: nested @import will additionally benefit of the relative dirname of imported files.
         */
        root: string;
        /**
         * A string or an array of paths in where to look for files.
         */
        path: string | Array<string>;
        /**
         * An array of plugins to be applied on each imported files.
         */
        plugins: Array<any>;
        /**
         * You can provide a custom path resolver with this option.
         * This function gets (id, basedir, importOptions) arguments and should return a path, an array of paths or a promise resolving to the path(s).
         * If you do not return an absolute path, your path will be resolved to an absolute path using the default resolver.
         * You can use resolve for this.
         */
        resolve: (id: string, basedir: string, importOptions: any) => string | Array<string> | Promise<string | Array<string>>;
        /**
         * You can overwrite the default loading way by setting this option.
         * This function gets (filename, importOptions) arguments and returns content or promised content.
         */
        load: (filename: string, importOptions: any) => string | Promise<string>;
        /**
         * By default, similar files (based on the same content) are not skipped.
         * It's to optimize output and skip similar files like normalize.css for example.
         * If this behavior is not what you want, just set this option to true to enable it.
         */
        skipDuplicates: boolean;
        /**
         * An array of folder names to add to Node's resolver.
         * Values will be appended to the default resolve directories: ["node_modules", "web_modules"].
         *
         * This option is only for adding additional directories to default resolver.
         * If you provide your own resolver via the resolve configuration option above, then this value will be ignored.
         */
        addModulesDirectories: Array<string>;
        /**
         * You can provide a custom naming function for anonymous layers (@import 'baz.css' layer;).
         * This function gets (index, rootFilename) arguments and should return a unique string.
         *
         * This option only influences imports without a layer name.
         * Without this option the plugin will warn on anonymous layers.
         */
        nameLayer: (index: number, rootFilename: string) => string;
        /**
         * By default `postcss-import` warns when an empty file is imported.
         * Set this option to `false` to disable this warning.
         */
        warnOnEmpty: boolean;
    };
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;
