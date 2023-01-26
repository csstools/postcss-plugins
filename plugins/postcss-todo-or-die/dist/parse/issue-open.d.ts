import { FunctionNode } from '@csstools/css-parser-algorithms';
export type IssueOpenCondition = {
    repository: string;
    issue: number;
};
export declare function parseIssueOpenCondition(componentValue: FunctionNode): IssueOpenCondition | false;
