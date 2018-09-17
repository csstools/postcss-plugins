import fs from 'fs';
import path from 'path';
import postcss from 'postcss';

/* Import Custom Properties from CSS AST
/* ========================================================================== */

export function importCustomPropertiesFromCSSAST(root) {
	// custom properties can be written on html or :root
	const htmlCustomProperties = {};
	const rootCustomProperties = {};

	// for each html and :root rule
	Object(root.nodes).filter(isHtmlOrRootRule).forEach(({ nodes, selector }) => {
		// for each custom property
		Object(nodes).filter(isCustomPropertyDecl).forEach(({ prop, value }) => {
			// write to the custom properties from either html or :root
			const customProperties = matchHtml.test(selector) ? htmlCustomProperties : rootCustomProperties;

			customProperties[prop] = value;
		});
	});

	// return all html and :root custom properties, where :root prevails
	return Object.assign({}, htmlCustomProperties, rootCustomProperties);
}

/* Import Custom Properties from CSS File
/* ========================================================================== */

async function importCustomPropertiesFromCSSFile(from) {
	const css = await readFile(path.resolve(from));
	const root = postcss.parse(css, { from: path.resolve(from) });

	return importCustomPropertiesFromCSSAST(root);
}

/* Import Custom Properties from Object
/* ========================================================================== */

function importCustomPropertiesFromObject(object) {
	const customProperties = Object.assign({}, Object(object).customProperties || Object(object)['custom-properties']);

	return customProperties;
}

/* Import Custom Properties from JSON file
/* ========================================================================== */

async function importCustomPropertiesFromJSONFile(from) {
	const object = await readJSON(path.resolve(from));

	return importCustomPropertiesFromObject(object);
}

/* Import Custom Properties from JS file
/* ========================================================================== */

async function importCustomPropertiesFromJSFile(from) {
	const object = await import(path.resolve(from));

	return importCustomPropertiesFromObject(object);
}

/* Import Custom Properties from Sources
/* ========================================================================== */

export function importCustomPropertiesFromSources(sources) {
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
	}).reduce(async (customProperties, source) => {
		const type = source[0];
		const from = source[1];

		if (type === 'ast') {
			return Object.assign(customProperties, importCustomPropertiesFromCSSAST(from));
		}

		if (type === 'css') {
			return Object.assign(customProperties, await importCustomPropertiesFromCSSFile(from));
		}

		if (type === 'js') {
			return Object.assign(customProperties, await importCustomPropertiesFromJSFile(from));
		}

		if (type === 'json') {
			return Object.assign(customProperties, await importCustomPropertiesFromJSONFile(from));
		}

		return Object.assign(customProperties, importCustomPropertiesFromObject(source));
	}, {});
}

/* Helper utilities
/* ========================================================================== */

const matchCustomProperty = /^--\w/;
const matchHtml = /^html$/i;
const matchHtmlOrRoot = /^(html|:root)$/i;
const matchCSSPath = /\.\w*css/i;
const matchJSPath = /\.\w*js/i;
const matchJSONPath = /\.\w*json/i;

const isCustomPropertyDecl = node => Object(node).type === 'decl' && matchCustomProperty.test(node.prop);
const isHtmlOrRootRule = node => Object(node).type === 'rule' && matchHtmlOrRoot.test(node.selector);
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
