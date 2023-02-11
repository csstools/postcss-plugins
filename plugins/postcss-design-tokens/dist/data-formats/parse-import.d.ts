import { Token } from './base/token';
import type { Helpers, Root } from 'postcss';
export declare function tokensFromImport(root: Root, postcssHelpers: Helpers, buildIs: Array<string>, sourceFilePath: string, statement: string, alreadyImported: Set<string>): Promise<{
    filePath: string;
    tokens: Map<string, Token>;
} | false>;
