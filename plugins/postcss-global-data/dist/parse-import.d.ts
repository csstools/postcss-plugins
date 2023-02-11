import type { Postcss } from 'postcss';
export declare function parseImport(postcss: Postcss, filePath: string, alreadyImported: Set<string>): false | import("postcss").Root;
