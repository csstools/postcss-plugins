import type { Declaration } from 'postcss';
export declare function hasOverrideOrFallback(node: Declaration): {
    hasOverride: boolean;
    hasFallback: boolean;
};
