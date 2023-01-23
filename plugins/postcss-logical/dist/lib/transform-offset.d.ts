import type { Declaration } from 'postcss';
export declare function transformOffset(prop: string): (declaration: Declaration) => boolean;
export declare function transformOffsetShorthand(side: [string, string]): (declaration: Declaration) => boolean;
