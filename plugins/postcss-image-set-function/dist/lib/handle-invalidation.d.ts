import type { Declaration, Result } from 'postcss';
export declare const handleInvalidation: (opts: {
    oninvalid: 'warn' | 'throw' | unknown;
    decl: Declaration;
    result: Result;
}, message: string, word: string) => void;
