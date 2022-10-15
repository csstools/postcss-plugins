import type { AtRule, Declaration } from 'postcss';
import { parseConstituentProperties } from './parse-constituent-properties';
import { parseAllSyntaxDefinition } from './parse-syntax-definitions';
import { parseValuePresets, parseValues } from './parse-values';

export function shorthandPropertyFromAtRule(atRule: AtRule) {
	const syntaxDecl = atRule.nodes.find((x) => x.type === 'decl' && x.prop === 'syntax');
	const constituentPropertiesDecl = atRule.nodes.find((x) => x.type === 'decl' && x.prop === 'constituent-properties');
	const valuesDecl = atRule.nodes.find((x) => x.type === 'decl' && x.prop === 'values');

	if (!syntaxDecl || !constituentPropertiesDecl || !valuesDecl) {
		return;
	}

	const syntax = parseAllSyntaxDefinition((syntaxDecl as Declaration).value);
	if (syntax.find((x) => !x.valid)) {
		// TODO : this could warn
		return;
	}

	const constituentProperties = parseConstituentProperties((constituentPropertiesDecl as Declaration).value);
	if (constituentProperties.length !== syntax.length) {
		// TODO : this could warn
		return;
	}

	const valuePresets = parseValuePresets((valuesDecl as Declaration).value);

	const shorthand = new ShorthandProperty();
	shorthand.syntax = syntax;
	shorthand.constituentProperties = constituentProperties;
	shorthand.values = valuePresets;

	return shorthand;
}

export class ShorthandProperty {
	syntax: Array<{
		valid: boolean,
		buckets: number,
		definition: string
	}> = [];

	constituentProperties: Array<string>;

	values: Map<string, Array<string>>;

	get totalBuckets(): number {
		let counter = 0;

		this.syntax.forEach((x) => {
			counter += x.buckets;
		});

		return counter;
	}

	generate(decl: Declaration) {
		let values = parseValues(decl.value);
		if (values.length === 0) {
			return;
		}

		if (values.length === 1 && cssWideKeywords.includes(values[0].toLowerCase())) {
			for (const property of this.constituentProperties) {
				decl.cloneBefore({
					prop: property,
					value: values[0],
				});
			}

			decl.remove();
			return;
		}

		if (values.length === 1 && this.values.has(values[0])) {
			values = this.values.get(values[0]);
		}

		if (values.length !== this.totalBuckets) {
			return;
		}

		for (let i = 0; i < this.constituentProperties.length; i++) {
			const property = this.constituentProperties[i];
			const syntax = this.syntax[i];

			const value = values.slice(0, syntax.buckets);
			values = values.slice(syntax.buckets);

			decl.cloneBefore({
				prop: property,
				value: value.join('').trim(),
			});
		}

		decl.remove();
		return;
	}
}

const cssWideKeywords = [
	'inherit',
	'initial',
	'revert',
	'revert-layer',
	'unset',
];
