import fs from 'fs';
import path from 'path';

/**
 * Import Custom Properties from Object
 * @param {{environmentVariables: Record<string, string>, 'environment-variables': Record<string, string>}} object
 * @returns {Object}
 */
function importEnvironmentVariablesFromObject(object) {
	return Object.assign(
		{},
		Object(object).environmentVariables || Object(object)['environment-variables'],
	);
}

/**
 * Import Custom Properties from JSON file
 * @param {string} from
 * @returns {Promise<Record<string, import('postcss-values-parser').Root>>}
 */
async function importEnvironmentVariablesFromJSONFile(from) {
	const object = await readJSON(path.resolve(from));

	return importEnvironmentVariablesFromObject(object);
}

/**
 * Import Custom Properties from JS file
 * @param {string} from
 * @returns {Promise<Record<string, import('postcss-values-parser').Root>>}
 */
async function importEnvironmentVariablesFromJSFile(from) {
	const object = await import(path.resolve(from));

	return importEnvironmentVariablesFromObject(object);
}

/**
 * Import Custom Properties from Sources
 * @param {(string|Function|Promise|{type:string,environmentVariables: Record<string, string>, 'environment-variables': Record<string, string>})[]} sources
 * @returns {Promise<Record<string, import('postcss-values-parser').Root>>}
 */
export default function importEnvironmentVariablesFromSources(sources) {
	return sources.map(source => {
		if (source instanceof Promise) {
			return source;
		} else if (source instanceof Function) {
			return source();
		}

		// read the source as an object
		const opts = source === Object(source) ? source : { from: String(source) };

		// skip objects with Custom Properties
		if (opts.environmentVariables || opts['environment-variables']) {
			return opts;
		}

		// source pathname
		const from = String(opts.from || '');

		// type of file being read from
		const type = (opts.type || path.extname(from).slice(1)).toLowerCase();

		return { type, from };
	}).reduce(async (environmentVariables, source) => {
		const { type, from } = await source;

		if (type === 'js' || type === 'cjs') {
			return Object.assign(environmentVariables, await importEnvironmentVariablesFromJSFile(from));
		}

		if (type === 'json') {
			return Object.assign(environmentVariables, await importEnvironmentVariablesFromJSONFile(from));
		}

		return Object.assign(environmentVariables, importEnvironmentVariablesFromObject(await source));
	}, {});
}

/* Helper utilities
/* ========================================================================== */

/**
 * @param {string} from
 * @returns {Promise<string>}
 */
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
