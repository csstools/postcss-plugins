import type valuesParser from 'postcss-value-parser';

import { promises as fsp } from 'fs';
import path from 'path';
import type { ExportOptions } from './options';

/* Write Custom Properties to CSS File
/* ========================================================================== */

async function writeCustomPropertiesToCssFile(to, customProperties) {
	const cssContent = Object.keys(customProperties).reduce((cssLines, name) => {
		cssLines.push(`\t${name}: ${customProperties[name]};`);

		return cssLines;
	}, []).join('\n');
	const css = `:root {\n${cssContent}\n}\n`;

	await fsp.writeFile(to, css);
}

/* Write Custom Properties to SCSS File
/* ========================================================================== */

async function writeCustomPropertiesToScssFile(to, customProperties) {
	const scssContent = Object.keys(customProperties).reduce((scssLines, name) => {
		const scssName = name.replace('--', '$');
		scssLines.push(`${scssName}: ${customProperties[name]};`);

		return scssLines;
	}, []).join('\n');
	const scss = `${scssContent}\n`;

	await fsp.writeFile(to, scss);
}

/* Write Custom Properties to JSON file
/* ========================================================================== */

async function writeCustomPropertiesToJsonFile(to, customProperties) {
	const jsonContent = JSON.stringify({
		'custom-properties': customProperties,
	}, null, '  ');
	const json = `${jsonContent}\n`;

	await fsp.writeFile(to, json);
}

/* Write Custom Properties to Common JS file
/* ========================================================================== */

async function writeCustomPropertiesToCjsFile(to, customProperties) {
	const jsContents = Object.keys(customProperties).reduce((jsLines, name) => {
		jsLines.push(`\t\t'${escapeForJS(name)}': '${escapeForJS(customProperties[name])}'`);

		return jsLines;
	}, []).join(',\n');
	const js = `module.exports = {\n\tcustomProperties: {\n${jsContents}\n\t}\n};\n`;

	await fsp.writeFile(to, js);
}

/* Write Custom Properties to Module JS file
/* ========================================================================== */

async function writeCustomPropertiesToMjsFile(to, customProperties) {
	const mjsContents = Object.keys(customProperties).reduce((mjsLines, name) => {
		mjsLines.push(`\t'${escapeForJS(name)}': '${escapeForJS(customProperties[name])}'`);

		return mjsLines;
	}, []).join(',\n');
	const mjs = `export const customProperties = {\n${mjsContents}\n};\n`;

	await fsp.writeFile(to, mjs);
}

/* Write Custom Properties to Exports
/* ========================================================================== */

export default function writeCustomPropertiesToExports(customProperties, destinations: Array<ExportOptions>) {
	return Promise.all(destinations.map(async destination => {
		if (destination instanceof Function) {
			await destination(defaultCustomPropertiesToJSONObject(customProperties));
			return;
		}

		if (typeof destination === 'string') {
			const toPath = path.resolve(destination);
			const type = path.extname(toPath).slice(1).toLowerCase();

			await writePropertiesToFile(toPath, type, defaultCustomPropertiesToJSONObject(customProperties));
			return;
		}

		// transformer for Custom Properties into a JSON-compatible object
		let customPropertiesAsJSONObject = {};
		if ('toJSON' in destination) {
			customPropertiesAsJSONObject = destination.toJSON(defaultCustomPropertiesToJSONObject(customProperties));
		} else {
			customPropertiesAsJSONObject = defaultCustomPropertiesToJSONObject(customProperties);
		}

		if ('to' in destination) {
			const toPath = path.resolve(destination.to);
			let type = destination.type;
			if (!type) {
				type = path.extname(toPath).slice(1).toLowerCase();
			}

			await writePropertiesToFile(toPath, type, customPropertiesAsJSONObject);
			return;
		}

		if ('customProperties' in destination) {
			// write directly to an object as customProperties
			destination.customProperties = customPropertiesAsJSONObject;
		} else if ('custom-properties' in destination) {
			// write directly to an object as custom-properties
			destination['custom-properties'] = customPropertiesAsJSONObject;
		}
	}));
}

async function writePropertiesToFile(to: string, type: string, customProperties: Record<string, string>) {
	if (type === 'css') {
		await writeCustomPropertiesToCssFile(to, customProperties);
	}

	if (type === 'scss') {
		await writeCustomPropertiesToScssFile(to, customProperties);
	}

	if (type === 'js') {
		await writeCustomPropertiesToCjsFile(to, customProperties);
	}

	if (type === 'json') {
		await writeCustomPropertiesToJsonFile(to, customProperties);
	}

	if (type === 'mjs') {
		await writeCustomPropertiesToMjsFile(to, customProperties);
	}
}

/* Helper utilities
/* ========================================================================== */

function defaultCustomPropertiesToJSONObject(customProperties: Map<string, valuesParser.ParsedValue>): Record<string, string> {
	const out = {};
	for (const [name, value] of customProperties.entries()) {
		out[name] = value.toString();
	}

	return out;
}

const escapeForJS = (string) => {
	return string.replace(/\\([\s\S])|(')/g, '\\$1$2').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
};
