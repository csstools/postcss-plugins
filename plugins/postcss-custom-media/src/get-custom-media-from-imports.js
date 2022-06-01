import fs from 'fs';
import path from 'path';
import { parse } from 'postcss';
import getMediaAstFromMediaString from './media-ast-from-string';
import getCustomMedia from './custom-media-from-root';

/* Get Custom Media from CSS File
/* ========================================================================== */

async function getCustomMediaFromCSSFile(from) {
	const css = await readFile(from);
	const root = parse(css, { from });

	return getCustomMedia(root, { preserve: true });
}

/* Get Custom Media from Object
/* ========================================================================== */

function getCustomMediaFromObject(object) {
	const customMedia = Object.assign(
		{},
		Object(object).customMedia,
		Object(object)['custom-media'],
	);

	for (const key in customMedia) {
		customMedia[key] = getMediaAstFromMediaString(customMedia[key]);
	}

	return customMedia;
}

/* Get Custom Media from JSON file
/* ========================================================================== */

async function getCustomMediaFromJSONFile(from) {
	const object = await readJSON(from);

	return getCustomMediaFromObject(object);
}

/* Get Custom Media from JS file
/* ========================================================================== */

async function getCustomMediaFromJSFile(from) {
	const object = await import(from);

	return getCustomMediaFromObject(object);
}

/* Get Custom Media from Sources
/* ========================================================================== */

export default function getCustomMediaFromSources(sources) {
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
			return opts;
		}

		// source pathname
		const from = path.resolve(String(opts.from || ''));

		// type of file being read from
		const type = (opts.type || path.extname(from).slice(1)).toLowerCase();

		return { type, from };
	}).reduce(async (customMedia, source) => {
		const { type, from } = await source;

		if (type === 'css' || type === 'pcss') {
			return Object.assign(await customMedia, await getCustomMediaFromCSSFile(from));
		}

		if (type === 'js') {
			return Object.assign(await customMedia, await getCustomMediaFromJSFile(from));
		}

		if (type === 'json') {
			return Object.assign(await customMedia, await getCustomMediaFromJSONFile(from));
		}

		return Object.assign(await customMedia, getCustomMediaFromObject(await source));
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
