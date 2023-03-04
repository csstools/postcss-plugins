import { ComponentValue } from '@csstools/css-parser-algorithms';
import { ColorData } from './color-data';
export type ColorParser = (x: ComponentValue) => ColorData | false;
