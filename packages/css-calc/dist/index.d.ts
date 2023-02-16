import { ComponentValue } from '@csstools/css-parser-algorithms';
import type { conversionOptions } from './options';
export type { conversionOptions } from './options';
export declare function calc(css: string, options?: conversionOptions): string;
export declare function calcFromComponentValues(componentValuesList: Array<Array<ComponentValue>>, options?: conversionOptions): ComponentValue[][];
