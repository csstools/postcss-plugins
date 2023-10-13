import type { Declaration } from 'postcss';
import { DirectionConfig } from './types';
export declare function transformAxes(directionConfig: DirectionConfig): (declaration: Declaration) => Array<Declaration>;
