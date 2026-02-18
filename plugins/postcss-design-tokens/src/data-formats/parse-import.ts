import valueParser from 'postcss-value-parser';
import type { Token } from './base/token';
import { extractStyleDictionaryTokens } from './style-dictionary/style-dictionary';
import path from 'node:path';
import fs from 'node:fs/promises';
import { DEFAULT_CONDITION } from '../constants';
import module from 'node:module';
import type { Helpers, Root } from 'postcss';

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

export async function tokensFromImport(root: Root, postcssHelpers: Helpers, buildIs: Array<string>, sourceFilePath: string, statement: string, alreadyImported: Set<string>): Promise<{ filePath: string, tokens: Map<string, Token> }|false> {
	const { filePath, format, conditions } = parseImport(statement);
	if (!conditions.every((condition) => buildIs.includes(condition))) {
		return false;
	}

	let resolvedPath;

	try {
		if (filePath.startsWith('node_modules://')) {
			const require = module.createRequire(path.dirname(sourceFilePath));

			resolvedPath = require.resolve(filePath.slice(15));
		} else if (filePath.startsWith('node_modules:')) {
			const require = module.createRequire(path.dirname(sourceFilePath));

			resolvedPath = require.resolve(filePath.slice(13));
		} else {
			resolvedPath = path.resolve(path.dirname(sourceFilePath), filePath);
		}
	} catch (err) {
		throw new Error(`Failed to read ${filePath} with error ${(err instanceof Error) ? err.message : err}`, {
			cause: err
		});
	}

	if (alreadyImported.has(resolvedPath)) {
		return false;
	}

	postcssHelpers.result.messages.push({
		type: 'dependency',
		plugin: 'postcss-design-tokens',
		file: resolvedPath,
		parent: root.source?.input?.file,
	});

	alreadyImported.add(resolvedPath);

	const fileContents = await fs.readFile(resolvedPath, 'utf8');
	const tokenContents: unknown = JSON.parse(fileContents);

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
