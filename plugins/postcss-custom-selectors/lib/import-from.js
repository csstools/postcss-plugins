import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import getSelectorsAstFromSelectorsString from './selectors-ast-from-selectors-string';
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
		Object(object).customSelectors || Object(object)['custom-selectors']
	);

	for (const key in customSelectors) {
		customSelectors[key] = getSelectorsAstFromSelectorsString(customSelectors[key]);
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
		if (typeof source === 'string') {
			if (isCSSPath(source)) {
				return [ 'css', source ]
			} else if (isJSPath(source)) {
				return [ 'js', source ]
			} else if (isJSONPath(source)) {
				return [ 'json', source ]
			}
		}

		return Object(source);
	}).reduce(async (customSelectors, source) => {
		const type = source[0];
		const from = source[1];

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

		return Object.assign(customSelectors, importCustomSelectorsFromObject(source));
	}, {});
}

/* Helper utilities
/* ========================================================================== */

const matchCSSPath = /\.\w*css/i;
const matchJSPath = /\.\w*js/i;
const matchJSONPath = /\.\w*json/i;

const isCSSPath = from => matchCSSPath.test(from);
const isJSPath = from => matchJSPath.test(from);
const isJSONPath = from => matchJSONPath.test(from);

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
