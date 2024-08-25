import css from '@webref/css';
import { fork } from 'css-tree';
import { generate_set } from './generate-set.mjs';

const IGNORED_TYPES = new Set([
	'<an+b>',
]);

export async function generate_webref_sets() {
	const properties = Object(null);
	const values = Object(null);

	const parsedFiles = await css.listAll();
	for (const [, data] of Object.entries(parsedFiles)) {
		for (const property of data.properties) {
			if (property.value || property.newValues) {
				properties[property.name] = (property.newValues ? ' | ' + property.newValues : property.value);
			}

			// if (property.values) {
			// 	for (const value of property.values) {
			// 		if (value.type !== 'type') {
			// 			continue;
			// 		}

			// 		values[value.name] = value.value;
			// 	}
			// }
		}

		for (const value of data.values) {
			if (IGNORED_TYPES.has(value.name)) {
				continue;
			}

			if (value.value || value.newValues) {
				values[value.name] = (value.newValues ? ' | ' + value.newValues : value.value);
			}

			// if (value.values) {
			// 	for (const child_value of value.values) {
			// 		if (child_value.type !== 'type') {
			// 			continue;
			// 		}

			// 		values[child_value.name] = child_value.value;
			// 	}
			// }
		}
	}

	const forkedLexer = fork({
		properties: properties,
		types: values,
	}).lexer;

	return {
		properties: generate_set(forkedLexer.properties),
		types: generate_set(forkedLexer.types),
	};
}
