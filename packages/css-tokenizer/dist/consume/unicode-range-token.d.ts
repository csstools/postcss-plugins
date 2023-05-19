import { CodePointReader } from '../interfaces/code-point-reader';
import { Context } from '../interfaces/context';
import { TokenUnicodeRange } from '../interfaces/token';
export declare function consumeUnicodeRangeToken(ctx: Context, reader: CodePointReader): TokenUnicodeRange;
