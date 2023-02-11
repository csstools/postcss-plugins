import type { Helpers, Root } from 'postcss';
export declare function parseImport(root: Root, postcssHelpers: Helpers, filePath: string, alreadyImported: Set<string>): false | Root;
