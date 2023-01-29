import type { Node } from 'postcss-value-parser';
export type ColorStop = {
    color: string;
    colorStopLength: string;
    colorHintBetween: Array<ColorStop>;
    nodes: Array<Node>;
};
export declare function colorStopList(nodes: Array<Node>, interpolationArguments: string): Array<ColorStop> | false;
