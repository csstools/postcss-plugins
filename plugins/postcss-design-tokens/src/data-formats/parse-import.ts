import valueParser from 'postcss-value-parser';
import { Token } from './base/token';
import { extractStyleDictionaryTokens } from './style-dictionary/style-dictionary';
import path from 'path';
import { promises as fsp } from 'fs';
import { DEFAULT_CONDITION } from '../constants';
import module from 'module';

const require = module.createRequire(import.meta.url);

function parseImport(statement: string): { filePath: string, format: string, conditions: Array<string> } {
	const importAST = valueParser(statement);

	const result = {
		filePath: '',
		format: 'standard',
		conditions: [DEFAULT_CONDITION],
	};

	importAST.walk((node) => {
		if (node.type === 'function' && node.value === 'url') {
			result.filePath = node.nodes[0].value;
		}

		if (node.type === 'function' && node.value === 'format') {
			result.format = node.nodes[0].value;
		}

		if (node.type === 'function' && node.value === 'when') {
			result.conditions = node.nodes.filter((child) => {
				return child.type === 'string';
			}).map((child) => child.value);
		}
	});

	if (!result.conditions.length) {
		result.conditions = [DEFAULT_CONDITION];
	}

	return result;
}

export async function tokensFromImport(buildIs: Array<string>, sourceFilePath: string, statement: string, alreadyImported: Set<string>): Promise<{ filePath: string, tokens: Map<string, Token> }|false> {
	const { filePath, format, conditions } = parseImport(statement);
	if (!conditions.every((condition) => buildIs.includes(condition))) {
		return false;
	}

	let resolvedPath = '';
	if (filePath.startsWith('node_modules://')) {
		try {
			resolvedPath = require.resolve(filePath.slice(15), {
				paths: [
					path.dirname(sourceFilePath),
				],
			});
		} catch (e) {
			throw new Error(`Failed to read ${filePath} with error ${(e as Error).message}`);
		}
	} else {
		resolvedPath = path.resolve(path.dirname(sourceFilePath), filePath);
	}

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
