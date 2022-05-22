
import { Token } from '../base/token';
import { extractStyleDictionaryV3Tokens, StyleDictionaryV3TokenGroup } from './v3/group';

export const latestStyleDictionaryVersion = '3';

export function extractStyleDictionaryTokens(version: string, node: unknown, filePath: string): Map<string, Token> {
	if (version === '3') {
		return extractStyleDictionaryV3Tokens(node as StyleDictionaryV3TokenGroup, filePath);
	}

	throw new Error('Unsupported version: ' + version);
}
