import fs from 'node:fs/promises';
import path from 'node:path';
import { generateDeclarationTestCases } from './declaration.mjs';
import { generatePropertyTestCases } from './property.mjs';
import { generateSelectorClassFunctionTestCases } from './selector-class-function.mjs';
import { generateSelectorTestCases } from './selector.mjs';
import { generateValueTestCases } from './value.mjs';

export async function generate(genType, pluginDir, seedList) {
	switch (genType) {
		case 'selector':
			await fs.writeFile(path.join(pluginDir, 'test', 'generated-selector-cases.css'), seedList.map((selector) => {
				return generateSelectorTestCases(selector);
			}).join('\n'));
			break;

		case 'selector-class-function':
			await fs.writeFile(path.join(pluginDir, 'test', 'generated-selector-class-function-cases.css'), seedList.map((selector) => {
				return generateSelectorClassFunctionTestCases(selector);
			}).join('\n'));
			break;

		case 'value':
			await fs.writeFile(path.join(pluginDir, 'test', 'generated-value-cases.css'), seedList.map((value) => {
				return generateValueTestCases(value);
			}).join('\n'));
			break;

		case 'property':
			await fs.writeFile(path.join(pluginDir, 'test', 'generated-property-cases.css'), seedList.map((value) => {
				return generatePropertyTestCases(value);
			}).join('\n'));
			break;

		case 'declaration':
			await fs.writeFile(path.join(pluginDir, 'test', 'generated-declaration-cases.css'), seedList.map((pair) => {
				return generateDeclarationTestCases(pair[0], pair[1]);
			}).join('\n'));
			break;

		default:
			break;
	}
}
