import { GlobalsWithStrings } from './util/globals';
export type options = {
    globals?: GlobalsWithStrings;
    precision: number;
};
export declare function convert(css: string, options?: options): string;
