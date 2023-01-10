import type { Declaration } from 'postcss';
import { DirectionConfig, Direction } from './types';
export declare function transformValue(config: DirectionConfig): (declaration: Declaration) => boolean;
export declare function transformValueWithSingleDirection(direction: Direction, config: DirectionConfig): (declaration: Declaration) => boolean;
