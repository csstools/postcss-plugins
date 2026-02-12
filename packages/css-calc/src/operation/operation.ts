import type { TokenNode } from '@csstools/css-parser-algorithms';
import type { conversionOptions } from '../options';

export type Operation = (inputs: Array<TokenNode>, options: conversionOptions) => TokenNode | -1
