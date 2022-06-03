import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import parser from 'postcss-selector-parser';
import getCustomSelectors from './custom-selectors-from-root';

/* Import Custom Selectors from CSS AST
/* ========================================================================== */

function importCustomSelectorsFromCSSAST(root) {
	return getCustomSelectors(root);
}

/* Import Custom Selectors from CSS File
/* ========================================================================== */

async function importCustomSelectorsFromCSSFile(from) {
	const css = await readFile(path.resolve(from));
	const root = postcss.parse(css, { from: path.resolve(from) });

	return importCustomSelectorsFromCSSAST(root);
}

/* Import Custom Selectors from Object
/* ========================================================================== */

function importCustomSelectorsFromObject(object) {
	const customSelectors = Object.assign(
		{},
		Object(object).customSelectors || Object(object)['custom-selectors'],
	);

	for (const key in customSelectors) {
		customSelectors[key] = parser().astSync(customSelectors[key]);
	}

	return customSelectors;
}

/* Import Custom Selectors from JSON file
/* ========================================================================== */

async function importCustomSelectorsFromJSONFile(from) {
	const object = await readJSON(path.resolve(from));

	return importCustomSelectorsFromObject(object);
}

/* Import Custom Selectors from JS file
/* ========================================================================== */

async function importCustomSelectorsFromJSFile(from) {
	const object = await import(path.resolve(from));

	return importCustomSelectorsFromObject(object);
}

/* Import Custom Selectors from Sources
/* ========================================================================== */

export default function importCustomSelectorsFromSources(sources) {
	return sources.map(source => {
		if (source instanceof Promise) {
			return source;
		} else if (source instanceof Function) {
			return source();
		}

		// read the source as an object
		const opts = source === Object(source) ? source : { from: String(source) };

		// skip objects with custom selectors
		if (Object(opts).customSelectors || Object(opts)['custom-selectors']) {
			return opts;
		}

		// source pathname
		const from = String(opts.from || '');

		// type of file being read from
		const type = (opts.type || path.extname(from).slice(1)).toLowerCase();

		return { type, from };
	}).reduce(async (customSelectorsPromise, source) => {
		const customSelectors = await customSelectorsPromise;
		const { type, from } = await source;

		if (type === 'ast') {
			return Object.assign(customSelectors, importCustomSelectorsFromCSSAST(from));
		}

		if (type === 'css') {
			return Object.assign(customSelectors, await importCustomSelectorsFromCSSFile(from));
		}

		if (type === 'js') {
			return Object.assign(customSelectors, await importCustomSelectorsFromJSFile(from));
		}

		if (type === 'json') {
			return Object.assign(customSelectors, await importCustomSelectorsFromJSONFile(from));
		}

		return Object.assign(customSelectors, importCustomSelectorsFromObject(await source));
	}, Promise.resolve({}));
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
