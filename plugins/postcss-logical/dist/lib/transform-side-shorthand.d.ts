import type { Declaration } from 'postcss';
export declare function transformSideShorthand(prop: string, side: [string, string]): (declaration: Declaration) => void;
