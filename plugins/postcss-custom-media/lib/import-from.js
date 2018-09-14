import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import getMediaAstFromMediaString from './media-ast-from-string';
import getCustomMedia from './custom-media-from-root';

/* Import Custom Media from CSS AST
/* ========================================================================== */

function importCustomMediaFromCSSAST(root) {
	return getCustomMedia(root, { preserve: true });
}

/* Import Custom Media from CSS File
/* ========================================================================== */

async function importCustomMediaFromCSSFile(from) {
	const css = await readFile(path.resolve(from));
	const root = postcss.parse(css, { from: path.resolve(from) });

	return importCustomMediaFromCSSAST(root);
}

/* Import Custom Media from Object
/* ========================================================================== */

function importCustomMediaFromObject(object) {
	const customMedia = Object.assign(
		{},
		Object(object).customMedia || Object(object)['custom-media']
	);

	for (const key in customMedia) {
		customMedia[key] = getMediaAstFromMediaString(customMedia[key]);
	}

	return customMedia;
}

/* Import Custom Media from JSON file
/* ========================================================================== */

async function importCustomMediaFromJSONFile(from) {
	const object = await readJSON(path.resolve(from));

	return importCustomMediaFromObject(object);
}

/* Import Custom Media from JS file
/* ========================================================================== */

async function importCustomMediaFromJSFile(from) {
	const object = await import(path.resolve(from));

	return importCustomMediaFromObject(object);
}

/* Import Custom Media from Sources
/* ========================================================================== */

export default function importCustomMediaFromSources(sources) {
	return sources.map(source => {
		if (source instanceof Promise) {
			return source;
		} else if (source instanceof Function) {
			return source();
		}

		// read the source as an object
		const opts = source === Object(source) ? source : { from: String(source) };

		// skip objects with custom media
		if (Object(opts).customMedia || Object(opts)['custom-media']) {
			return opts
		}

		// source pathname
		const from = String(opts.from || '');

		// type of file being read from
		const type = (opts.type || path.extname(opts.from).slice(1)).toLowerCase();

		return { type, from };
	}).reduce(async (customMedia, source) => {
		const { type, from } = await source;

		if (type === 'ast') {
			return Object.assign(customMedia, importCustomMediaFromCSSAST(from));
		}

		if (type === 'css') {
			return Object.assign(customMedia, await importCustomMediaFromCSSFile(from));
		}

		if (type === 'js') {
			return Object.assign(customMedia, await importCustomMediaFromJSFile(from));
		}

		if (type === 'json') {
			return Object.assign(customMedia, await importCustomMediaFromJSONFile(from));
		}

		return Object.assign(customMedia, importCustomMediaFromObject(await source));
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
