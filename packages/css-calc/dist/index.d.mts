import { TokenDimension, TokenNumber, TokenPercentage } from "@csstools/css-tokenizer";
import { ComponentValue } from '@csstools/css-parser-algorithms';
type GlobalsWithStrings = Map<string, TokenDimension | TokenNumber | TokenPercentage | string>;
type conversionOptions = {
    /**
     * Pass global values as a map of key value pairs.
     */
    globals?: GlobalsWithStrings;
    /**
     * The default precision is fairly high.
     * It aims to be high enough to make rounding unnoticeable in the browser.
     * You can set it to a lower number to suite your needs.
     */
    precision?: number;
    /**
     * By default this package will try to preserve units.
     * The heuristic to do this is very simplistic.
     * We take the first unit we encounter and try to convert other dimensions to that unit.
     *
     * This better matches what users expect from a CSS dev tool.
     *
     * If you want to have outputs that are closes to CSS serialized values you can set `true`.
     */
    toCanonicalUnits?: boolean;
};
declare function calc(css: string, options?: conversionOptions): string;
declare function calcFromComponentValues(componentValuesList: Array<Array<ComponentValue>>, options?: conversionOptions): ComponentValue[][];
declare const mathFunctionNames: Set<string>;
export type { conversionOptions };
export { calc, calcFromComponentValues, mathFunctionNames };
