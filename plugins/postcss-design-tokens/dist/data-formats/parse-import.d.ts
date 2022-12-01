import { Token } from './base/token';
export declare function tokensFromImport(buildIs: Array<string>, sourceFilePath: string, statement: string, alreadyImported: Set<string>): Promise<{
    filePath: string;
    tokens: Map<string, Token>;
} | false>;
