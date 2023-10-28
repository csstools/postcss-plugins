import type { Document, Root } from 'postcss';
import { Stylesheet } from './statement';
export declare function applyStyles(stylesheet: Stylesheet, styles: Root | Document): void;
