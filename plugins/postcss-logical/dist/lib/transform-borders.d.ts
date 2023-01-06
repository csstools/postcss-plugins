import type { Declaration } from 'postcss';
export declare function transformBorder(borderSetting: string, side: string): (declaration: Declaration) => boolean;
export declare function transformBorderProperty(borderSetting: string, side: [string, string]): (declaration: Declaration) => boolean;
export declare function transformBorderShorthand(side: [string] | [string, string]): (declaration: Declaration) => boolean;
export declare function transformBorderRadius(start: string, end: string): (declaration: Declaration) => boolean;
