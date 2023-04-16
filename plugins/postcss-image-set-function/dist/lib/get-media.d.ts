import type { Declaration, Postcss } from 'postcss';
import type { Node } from 'postcss-value-parser';
export declare function getMedia(dpi: number | false, postcss: Postcss, decl: Declaration): false | import("postcss/lib/at-rule").default;
export declare function getMediaDPI(node: Node): number | false;
