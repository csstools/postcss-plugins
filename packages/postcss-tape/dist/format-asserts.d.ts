import type { Warning } from 'postcss';
import type { TestCaseOptions } from './test-case-options';
export declare const dashesSeparator = "----------------------------------------";
export declare function formatCSSAssertError(testCaseLabel: string, testCaseOptions: TestCaseOptions, err: Error, forGithubAnnotation?: boolean): string;
export declare function formatWarningsAssertError(testCaseLabel: string, testCaseOptions: TestCaseOptions, actual: Array<Warning>, expected: number, forGithubAnnotation?: boolean): string;
