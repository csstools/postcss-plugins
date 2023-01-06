import type { Declaration } from 'postcss';
export declare function transformSide(prop: string, side: string): (declaration: Declaration) => boolean;
export declare function transformSideShorthand(prop: string, side: [string, string]): (declaration: Declaration) => boolean;
