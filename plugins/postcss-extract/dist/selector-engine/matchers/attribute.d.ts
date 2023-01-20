import type { NodeList } from '../../node-list';
export declare enum AttributeMatchingFlag {
    Exact = "",
    StartsWith = "^",
    EndsWith = "$",
    Contains = "*"
}
export declare function matchAttribute(list: NodeList, attributeName: string, attributeValue: string | null | undefined, flag: AttributeMatchingFlag, caseInsensitive?: boolean): NodeList;
