import type { Warning } from 'postcss';
export declare const dashesSeparator = "----------------------------------------";
export declare function formatCSSAssertError(testCaseLabel: any, testCaseOptions: any, err: any, forGithubAnnotation?: boolean): string;
export declare function formatWarningsAssertError(testCaseLabel: any, testCaseOptions: any, actual: Array<Warning>, expected: number, forGithubAnnotation?: boolean): string;
