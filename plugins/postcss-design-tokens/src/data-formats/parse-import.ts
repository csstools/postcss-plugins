import valueParser from 'postcss-value-parser';
import { Token } from './base/token';
import { extractStyleDictionaryTokens, latestStyleDictionaryVersion } from './style-dictionary/style-dictionary';
import path from 'path';
import { promises as fsp } from 'fs';

function parseImport(statement: string): { filePath: string, vendor: string, version: string, variants: Array<string> } {
	const importAST = valueParser(statement);

	const result = {
		filePath: '',
		vendor: 'standard',
		version: '',
		variants: ['default'],
	};

	importAST.walk((node) => {
		if (node.type === 'function' && node.value === 'url') {
			result.filePath = node.nodes[0].value;
		}

		if (node.type === 'function' && node.value === 'vendor') {
			result.vendor = node.nodes[0].value;
		}

		if (node.type === 'function' && node.value === 'version') {
			result.version = node.nodes[0].value;
		}

		if (node.type === 'function' && node.value === 'variants') {
			result.variants = node.nodes.filter((child) => child.type === 'string').map((child) => child.value);
		}
	});

	if (!result.variants.length) {
		result.variants = ['default'];
	}

	if (!result.version) {
		switch (result.vendor) {
			case 'standard':
				result.version = '0.0.1';
				break;

			case 'style-dictionary':
				result.version = latestStyleDictionaryVersion;
				break;

			default:
				break;
		}
	}

	return result;
}

export async function tokensFromImport(currentVariants: Array<string>, sourceFilePath: string, statement: string): Promise<{ filePath: string, tokens: Map<string, Token> }|false> {
	const { filePath, vendor, version, variants } = parseImport(statement);
	if (!currentVariants.every((variant) => variants.includes(variant))) {
		return false;
	}

	const resolvedPath = path.resolve(path.dirname(sourceFilePath), filePath);
	const fileContents = await fsp.readFile(resolvedPath, 'utf8');
	const tokenContents = JSON.parse(fileContents);

	switch (vendor) {
		case 'style-dictionary':
			return {
				filePath: path.resolve(filePath),
				tokens: extractStyleDictionaryTokens(version, tokenContents, resolvedPath),
			};

		default:
			break;
	}

	throw new Error('Unsupported vendor: ' + vendor);
}
