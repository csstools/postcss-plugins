import type { ColorData } from '../color-data';
import { CSSToken } from '@csstools/css-tokenizer';
export type normalizeChannelValuesFn = (token: CSSToken, index: number, colorData: ColorData) => CSSToken | false;
