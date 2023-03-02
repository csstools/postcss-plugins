import { CSSToken, TokenNumber } from '@csstools/css-tokenizer';
import { ColorData } from '../color-data';

export type normalizeChannelValuesFn = (tokens: Array<CSSToken>, colorData: ColorData) => Array<TokenNumber> | -1;
