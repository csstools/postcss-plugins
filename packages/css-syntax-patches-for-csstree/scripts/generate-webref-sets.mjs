import css from '@webref/css';
import { fork } from 'css-tree';
import { generate_set } from './generate-set.mjs';
import { trim_lt_gt } from './trim-lt-gt.mjs';

const IGNORED_TYPES = new Set([
	'<an+b>',
]);

// TODO : some properties or values might have duplicates and currently we always erase and only preserve the last encountered prop
// need to either keep all or somehow merge.

export async function generate_webref_sets() {
	const properties = Object(null);
	const values = Object(null);

	const parsedFiles = await css.listAll();
	for (const [, data] of Object.entries(parsedFiles)) {
		for (const property of data.properties) {
			if (property.value || property.newValues) {
				properties[property.name] = (property.newValues ? ' | ' + property.newValues : property.value);
			}

			if (property.values) {
				for (const value of property.values) {
					if (value.type === 'type' && value.value) {
						values[trim_lt_gt(value.name)] = value.value;
					}
				}
			}
		}

		for (const value of data.values) {
			if (IGNORED_TYPES.has(value.name)) {
				continue;
			}

			if (value.value || value.newValues) {
				values[trim_lt_gt(value.name)] = (value.newValues ? ' | ' + value.newValues : value.value);
			}

			if (value.values) {
				for (const child_value of value.values) {
					if (child_value.type === 'type' && child_value.value) {
						values[trim_lt_gt(child_value.name)] = child_value.value;
					}
				}
			}
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
