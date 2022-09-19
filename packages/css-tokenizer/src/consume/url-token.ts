import { CodePointReader } from '../interfaces/code-point-reader';
import { TokenBadURL, TokenURL } from '../interfaces/token';

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-url-token
export function consumeUrlToken(reader: CodePointReader): TokenURL|TokenBadURL {
	throw new Error('unimplemented');
}
