import fs from 'fs';
import path from 'path';

/* Import Custom Selectors from CSS File
/* ========================================================================== */

async function exportCustomSelectorsToCssFile(to, customSelectors) {
	const cssContent = Object.keys(customSelectors).reduce((cssLines, name) => {
		cssLines.push(`@custom-selector ${name} ${customSelectors[name]};`);

		return cssLines;
	}, []).join('\n');
	const css = `${cssContent}\n`;

	await writeFile(to, css);
}

/* Import Custom Selectors from JSON file
/* ========================================================================== */

async function exportCustomSelectorsToJsonFile(to, customSelectors) {
	const jsonContent = JSON.stringify({
		'custom-selectors': customSelectors
	}, null, '  ');
	const json = `${jsonContent}\n`;

	await writeFile(to, json);
}

/* Import Custom Selectors from Common JS file
/* ========================================================================== */

async function exportCustomSelectorsToCjsFile(to, customSelectors) {
	const jsContents = Object.keys(customSelectors).reduce((jsLines, name) => {
		jsLines.push(`\t\t'${escapeForJS(name)}': '${escapeForJS(customSelectors[name])}'`);

		return jsLines;
	}, []).join(',\n');
	const js = `module.exports = {\n\tcustomSelectors: {\n${jsContents}\n\t}\n};\n`;

	await writeFile(to, js);
}

/* Import Custom Selectors from Module JS file
/* ========================================================================== */

async function exportCustomSelectorsToMjsFile(to, customSelectors) {
	const mjsContents = Object.keys(customSelectors).reduce((mjsLines, name) => {
		mjsLines.push(`\t'${escapeForJS(name)}': '${escapeForJS(customSelectors[name])}'`);

		return mjsLines;
	}, []).join(',\n');
	const mjs = `export const customSelectors = {\n${mjsContents}\n};\n`;

	await writeFile(to, mjs);
}

/* Export Custom Selectors to Destinations
/* ========================================================================== */

export default function exportCustomSelectorsToDestinations(customSelectors, destinations) {
	return Promise.all(destinations.map(async destination => {
		if (destination instanceof Function) {
			await destination(defaultCustomSelectorsToJSON(customSelectors));
		} else {
			// read the destination as an object
			const opts = destination === Object(destination) ? destination : { to: String(destination) };

			// transformer for custom selectors into a JSON-compatible object
			const toJSON = opts.toJSON || defaultCustomSelectorsToJSON;

			if ('customSelectors' in opts) {
				// write directly to an object as customSelectors
				opts.customSelectors = toJSON(customSelectors);
			} else if ('custom-selectors' in opts) {
				// write directly to an object as custom-selectors
				opts['custom-selectors'] = toJSON(customSelectors);
			} else {
				// destination pathname
				const to = String(opts.to || '');

				// type of file being written to
				const type = (opts.type || path.extname(opts.to).slice(1)).toLowerCase();

				// transformed custom selectors
				const customSelectorsJSON = toJSON(customSelectors);

				if (type === 'css') {
					await exportCustomSelectorsToCssFile(to, customSelectorsJSON);
				}

				if (type === 'js') {
					await exportCustomSelectorsToCjsFile(to, customSelectorsJSON);
				}

				if (type === 'json') {
					await exportCustomSelectorsToJsonFile(to, customSelectorsJSON);
				}

				if (type === 'mjs') {
					await exportCustomSelectorsToMjsFile(to, customSelectorsJSON);
				}
			}
		}
	}));
}

/* Helper utilities
/* ========================================================================== */

const defaultCustomSelectorsToJSON = customSelectors => {
	return Object.keys(customSelectors).reduce((customSelectorsJSON, key) => {
		customSelectorsJSON[key] = String(customSelectors[key]);

		return customSelectorsJSON;
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
