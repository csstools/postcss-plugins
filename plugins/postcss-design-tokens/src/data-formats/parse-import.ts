import valueParser from 'postcss-value-parser';
import { Token } from './base/token';
import { extractStyleDictionaryTokens } from './style-dictionary/style-dictionary';
import path from 'path';
import { promises as fsp } from 'fs';

function parseImport(statement: string): { filePath: string, format: string, variants: Array<string> } {
	const importAST = valueParser(statement);

	const result = {
		filePath: '',
		format: 'standard',
		variants: ['default'],
	};

	importAST.walk((node) => {
		if (node.type === 'function' && node.value === 'url') {
			result.filePath = node.nodes[0].value;
		}

		if (node.type === 'function' && node.value === 'format') {
			result.format = node.nodes[0].value;
		}

		if (node.type === 'function' && node.value === 'variants') {
			result.variants = node.nodes.filter((child) => {
				return child.type === 'string';
			}).map((child) => child.value);
		}
	});

	if (!result.variants.length) {
		result.variants = ['default'];
	}

	return result;
}

export async function tokensFromImport(currentVariants: Array<string>, sourceFilePath: string, statement: string, alreadyImported: Set<string>): Promise<{ filePath: string, tokens: Map<string, Token> }|false> {
	const { filePath, format, variants } = parseImport(statement);
	if (!variants.every((variant) => currentVariants.includes(variant))) {
		return false;
	}

	const resolvedPath = path.resolve(path.dirname(sourceFilePath), filePath);
	if (alreadyImported.has(resolvedPath)) {
		return false;
	}

	alreadyImported.add(resolvedPath);

	const fileContents = await fsp.readFile(resolvedPath, 'utf8');
	const tokenContents = JSON.parse(fileContents);

	switch (format) {
		case 'style-dictionary3':
			return {
				filePath: path.resolve(filePath),
				tokens: extractStyleDictionaryTokens('3', tokenContents, resolvedPath),
			};

		default:
			break;
	}

	throw new Error('Unsupported format: ' + format);
}
