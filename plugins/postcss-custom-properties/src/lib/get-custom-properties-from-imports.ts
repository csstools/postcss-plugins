import { promises as fsp } from 'fs';
import path from 'path';
import { parse } from 'postcss';
import valuesParser from 'postcss-value-parser';
import getCustomPropertiesFromRoot from './get-custom-properties-from-root';
import type { ImportCustomProperties, ImportOptions } from './options';

/* Get Custom Properties from CSS File
/* ========================================================================== */

async function getCustomPropertiesFromCSSFile(from) {
	const css = await fsp.readFile(from);
	const root = parse(css, { from : from.toString() });

	return getCustomPropertiesFromRoot(root, { preserve: true });
}

/* Get Custom Properties from Object
/* ========================================================================== */

function getCustomPropertiesFromObject(object: ImportCustomProperties): Map<string, valuesParser.ParsedValue> {
	const out: Map<string, valuesParser.ParsedValue> = new Map();

	if ('customProperties' in object) {
		for (const [name, value] of Object.entries(object.customProperties)) {
			out.set(name, valuesParser(value.toString()));
		}
	}

	if ('custom-properties' in object) {
		for (const [name, value] of Object.entries(object['custom-properties'])) {
			out.set(name, valuesParser(value.toString()));
		}
	}

	return out;
}

/* Get Custom Properties from JSON file
/* ========================================================================== */

async function getCustomPropertiesFromJSONFile(from): Promise<Map<string, valuesParser.ParsedValue>> {
	const object = await readJSON(from);

	return getCustomPropertiesFromObject(object);
}

/* Get Custom Properties from JS file
/* ========================================================================== */

async function getCustomPropertiesFromJSFile(from): Promise<Map<string, valuesParser.ParsedValue>> {
	const object = await import(from);

	return getCustomPropertiesFromObject(object);
}

/* Get Custom Properties from Imports
/* ========================================================================== */

export default async function getCustomPropertiesFromImports(sources: Array<ImportOptions>): Promise<Map<string, valuesParser.ParsedValue>> {
	const sourceData = (await Promise.all(sources.map(async (source) => {
		if (source instanceof Promise) {
			source = await source;
		} else if (source instanceof Function) {
			source = await source();
		}

		if (typeof source === 'string') {
			const fromPath = path.resolve(source);
			const type = path.extname(fromPath).slice(1).toLowerCase();

			return {
				type: type,
				from: fromPath,
			};
		}

		if ('customProperties' in source && Object(source.customProperties) === source.customProperties) {
			return source;
		}

		if ('custom-properties' in source && Object(source['custom-properties']) === source['custom-properties']) {
			return source;
		}

		if ('from' in source) {
			const fromPath = path.resolve(source.from);
			let type = source.type;
			if (!type) {
				type = path.extname(fromPath).slice(1).toLowerCase();
			}
			return {
				type: type,
				from: fromPath,
			};
		}

		if (Object.keys(source).length === 0) {
			// Empty `importFrom` object.
			return null;
		}

		throw new Error(`Invalid source object: ${source}`);
	}))).filter((x) => {
		return !!x;
	});

	const data: Array<Map<string, valuesParser.ParsedValue>> = await Promise.all(sourceData.map(async (partialData) => {
		if (('type' in partialData) && ('from' in partialData)) {
			if (partialData.type === 'css' || partialData.type === 'pcss' || partialData.type === 'postcss') {
				return await getCustomPropertiesFromCSSFile(partialData.from);
			}

			if (partialData.type === 'js') {
				return await getCustomPropertiesFromJSFile(partialData.from);
			}

			if (partialData.type === 'json') {
				return await getCustomPropertiesFromJSONFile(partialData.from);
			}

			throw new Error('Invalid source type: ' + partialData.type);
		}

		return getCustomPropertiesFromObject(partialData);
	}));

	const out: Map<string, valuesParser.ParsedValue> = new Map();
	data.forEach((partialData) => {
		for (const [name, value] of partialData.entries()) {
			out.set(name, value);
		}
	});

	return out;
}

/* Helper utilities
/* ========================================================================== */

const readJSON = async from => JSON.parse((await fsp.readFile(from)).toString());
