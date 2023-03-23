import type { ComponentValue } from '@csstools/css-parser-algorithms';
import { TokenNode } from '@csstools/css-parser-algorithms';
export type ColorStop = {
    color: ComponentValue;
    position: ComponentValue;
};
export declare function interpolateColorsInColorStopsList(colorStops: Array<ColorStop>, colorSpace: TokenNode, hueInterpolationMethod: TokenNode | null): Array<ComponentValue> | false;
