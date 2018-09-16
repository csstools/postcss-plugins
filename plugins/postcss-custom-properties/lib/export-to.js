import fs from 'fs';
import path from 'path';

/* Export Custom Properties to CSS File
/* ========================================================================== */

async function exportCustomPropertiesToCssFile(to, customProperties) {
	const cssContent = Object.keys(customProperties).reduce((cssLines, name) => {
		cssLines.push(`\t${name}: ${customProperties[name]};`);

		return cssLines;
	}, []).join('\n');
	const css = `:root {\n${cssContent}\n}\n`;

	await writeFile(to, css);
}

/* Export Custom Properties to JSON file
/* ========================================================================== */

async function exportCustomPropertiesToJsonFile(to, customProperties) {
	const jsonContent = JSON.stringify({
		'custom-properties': customProperties
	}, null, '  ');
	const json = `${jsonContent}\n`;

	await writeFile(to, json);
}

/* Export Custom Properties to Common JS file
/* ========================================================================== */

async function exportCustomPropertiesToCjsFile(to, customProperties) {
	const jsContents = Object.keys(customProperties).reduce((jsLines, name) => {
		jsLines.push(`\t\t'${escapeForJS(name)}': '${escapeForJS(customProperties[name])}'`);

		return jsLines;
	}, []).join(',\n');
	const js = `module.exports = {\n\tcustomProperties: {\n${jsContents}\n\t}\n};\n`;

	await writeFile(to, js);
}

/* Export Custom Properties to Module JS file
/* ========================================================================== */

async function exportCustomPropertiesToMjsFile(to, customProperties) {
	const mjsContents = Object.keys(customProperties).reduce((mjsLines, name) => {
		mjsLines.push(`\t'${escapeForJS(name)}': '${escapeForJS(customProperties[name])}'`);

		return mjsLines;
	}, []).join(',\n');
	const mjs = `export const customProperties = {\n${mjsContents}\n};\n`;

	await writeFile(to, mjs);
}

/* Export Custom Properties to Destinations
/* ========================================================================== */

export default function exportCustomPropertiesToDestinations(customProperties, destinations) {
	return Promise.all(destinations.map(async destination => {
		if (destination instanceof Function) {
			await destination(defaultCustomPropertiesToJSON(customProperties));
		} else {
			// read the destination as an object
			const opts = destination === Object(destination) ? destination : { to: String(destination) };

			// transformer for Custom Properties into a JSON-compatible object
			const toJSON = opts.toJSON || defaultCustomPropertiesToJSON;

			if ('customProperties' in opts) {
				// write directly to an object as customProperties
				opts.customProperties = toJSON(customProperties);
			} else if ('custom-properties' in opts) {
				// write directly to an object as custom-properties
				opts['custom-properties'] = toJSON(customProperties);
			} else {
				// destination pathname
				const to = String(opts.to || '');

				// type of file being written to
				const type = (opts.type || path.extname(opts.to).slice(1)).toLowerCase();

				// transformed Custom Properties
				const customPropertiesJSON = toJSON(customProperties);

				if (type === 'css') {
					await exportCustomPropertiesToCssFile(to, customPropertiesJSON);
				}

				if (type === 'js') {
					await exportCustomPropertiesToCjsFile(to, customPropertiesJSON);
				}

				if (type === 'json') {
					await exportCustomPropertiesToJsonFile(to, customPropertiesJSON);
				}

				if (type === 'mjs') {
					await exportCustomPropertiesToMjsFile(to, customPropertiesJSON);
				}
			}
		}
	}));
}

/* Helper utilities
/* ========================================================================== */

const defaultCustomPropertiesToJSON = customProperties => {
	return Object.keys(customProperties).reduce((customPropertiesJSON, key) => {
		customPropertiesJSON[key] = String(customProperties[key]);

		return customPropertiesJSON;
	}, {});
};

const writeFile = (to, text) => new Promise((resolve, reject) => {
	fs.writeFile(to, text, error => {
		if (error) {
			reject(error);
		} else {
			resolve();
		}
	});
});

const escapeForJS = string => string.replace(/\\([\s\S])|(')/g, '\\$1$2').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
