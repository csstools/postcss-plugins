import { ColorData } from './color-data';
import { ComponentValue } from '@csstools/css-parser-algorithms';
export { ColorNotation } from './color-notation';
export { SyntaxFlag } from './color-data';
export { serializeRGB } from './serialize/rgb';
export declare function color(colorNode: ComponentValue): ColorData | false;
