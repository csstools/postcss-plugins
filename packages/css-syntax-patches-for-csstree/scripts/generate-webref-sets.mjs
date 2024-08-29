import css from '@webref/css';
import { fork, definitionSyntax } from 'css-tree';
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
	const entries = Array.from(Object.entries(parsedFiles));

	entries.sort((a, b) => {
		const name_a = a[0].replace(/-\d+$/, '');
		const name_b = b[0].replace(/-\d+$/, '');

		if (name_a !== name_b) {
			return name_a.localeCompare(name_b);
		}

		const level_a = parseInt((a[0].match(/-(\d+)$/) ?? [])[1] ?? '0', 10);
		const level_b = parseInt((b[0].match(/-(\d+)$/) ?? [])[1] ?? '0', 10);

		return level_a - level_b;
	});

	for (const [, data] of entries) {
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

					if (child_value.type === 'function' && child_value.value) {
						values[trim_lt_gt(child_value.name)] = child_value.value;
					}
				}
			}

			if (!value.value && value.values?.length > 0) {
				values[trim_lt_gt(value.name)] = value.values.map(x => x.value).join(' | ');
			}
		}
	}

	const forkedLexer = fork({
		properties: properties,
		types: values,
	}).lexer;

	const properties_set = generate_set(forkedLexer.properties);
	const types_set = generate_set(forkedLexer.types);

	const used = new Set();

	for (const [, definition] of Object.entries(types_set)) {
		definitionSyntax.walk(
			definitionSyntax.parse(definition.syntax),
			{
				enter(node) {
					if (node.type === 'Type') {
						used.add(node.name);
					}
				},
			},
		);
	}

	for (const [name, definition] of Object.entries(properties_set)) {
		used.add(name);

		definitionSyntax.walk(
			definitionSyntax.parse(definition.syntax),
			{
				enter(node) {
					if (node.type === 'Type') {
						used.add(node.name);
					}
				},
			},
		);
	}

	return {
		properties: properties_set,
		types: types_set,
	};
}
