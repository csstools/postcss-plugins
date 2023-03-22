import type { Declaration } from 'postcss';
import { DirectionConfig } from './types';
export declare function transformTransition(directionConfig: DirectionConfig): (declaration: Declaration) => boolean;
