import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import getCustomProperties from './get-custom-properties';
import valueParser from 'postcss-values-parser';

/* Import Custom Properties from CSS AST
/* ========================================================================== */

function importCustomPropertiesFromCSSAST(root) {
	return getCustomProperties(root, { preserve: true });
}

/* Import Custom Properties from CSS File
/* ========================================================================== */

async function importCustomPropertiesFromCSSFile(from) {
	const css = await readFile(from);
	const root = postcss.parse(css, { from });

	return importCustomPropertiesFromCSSAST(root);
}

/* Import Custom Properties from Object
/* ========================================================================== */

function importCustomPropertiesFromObject(object) {
	const customProperties = Object.assign(
		{},
		Object(object).customProperties || Object(object)['custom-properties']
	);

	for (const prop in customProperties) {
		customProperties[prop] = valueParser(customProperties[prop]).parse();
	}

	return customProperties;
}

/* Import Custom Properties from JSON file
/* ========================================================================== */

async function importCustomPropertiesFromJSONFile(from) {
	const object = await readJSON(from);

	return importCustomPropertiesFromObject(object);
}

/* Import Custom Properties from JS file
/* ========================================================================== */

async function importCustomPropertiesFromJSFile(from) {
	const object = await import(from);

	return importCustomPropertiesFromObject(object);
}

/* Import Custom Properties from Sources
/* ========================================================================== */

export default function importCustomPropertiesFromSources(sources) {
	return sources.map(source => {
		if (source instanceof Promise) {
			return source;
		} else if (source instanceof Function) {
			return source();
		}

		// read the source as an object
		const opts = source === Object(source) ? source : { from: String(source) };

		// skip objects with Custom Properties
		if (opts.customProperties || opts['custom-properties']) {
			return opts
		}

		// source pathname
		const from = path.resolve(String(opts.from || ''));

		// type of file being read from
		const type = (opts.type || path.extname(from).slice(1)).toLowerCase();

		return { type, from };
	}).reduce(async (customProperties, source) => {
		const { type, from } = await source;

		if (type === 'ast') {
			return Object.assign(await customProperties, importCustomPropertiesFromCSSAST(from));
		}

		if (type === 'css') {
			return Object.assign(await customProperties, await importCustomPropertiesFromCSSFile(from));
		}

		if (type === 'js') {
			return Object.assign(await customProperties, await importCustomPropertiesFromJSFile(from));
		}

		if (type === 'json') {
			return Object.assign(await customProperties, await importCustomPropertiesFromJSONFile(from));
		}

		return Object.assign(await customProperties, await importCustomPropertiesFromObject(await source));
	}, {});
}

/* Helper utilities
/* ========================================================================== */

const readFile = from => new Promise((resolve, reject) => {
	fs.readFile(from, 'utf8', (error, result) => {
		if (error) {
			reject(error);
		} else {
			resolve(result);
		}
	});
});

const readJSON = async from => JSON.parse(await readFile(from));
