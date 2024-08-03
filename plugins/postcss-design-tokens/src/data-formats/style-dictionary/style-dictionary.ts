
import type { Token } from '../base/token';
import type { StyleDictionaryV3TokenGroup } from './v3/group';
import { extractStyleDictionaryV3Tokens } from './v3/group';

export function extractStyleDictionaryTokens(version: string, node: unknown, filePath: string): Map<string, Token> {
	if (version === '3') {
		return extractStyleDictionaryV3Tokens(node as StyleDictionaryV3TokenGroup, filePath);
	}

	throw new Error('Unsupported version: ' + version);
}
