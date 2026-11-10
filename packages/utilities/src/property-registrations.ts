import type { AtRule, Helpers } from 'postcss';
import type { ComponentValue } from '@csstools/css-parser-algorithms';
import { isFunctionNode, isTokenNode, isWhiteSpaceOrCommentNode, parseCommaSeparatedListOfComponentValues, parseListOfComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { isTokenColon, isTokenIdent, isTokenString, tokenize } from '@csstools/css-tokenizer';

/**
 * A single registration described by an `@property` rule.
 *
 * The longhand form describes the descriptors with a block, the shorthand form
 * describes the type and the initial value in the prelude.
 */
type PropertyDefinition = {
	name: string,
	// Only set for the shorthand form.
	shorthand: { type: string | null, initialValue: string | null } | null,
};

/**
 * Expand a single `@property` rule into one longhand `@property` rule per
 * registered property name.
 *
 * The longhand form accepts a comma separated prelude list:
 *
 * ```css
 * @property --a, --b { syntax: "<length>"; }
 * ```
 *
 * The shorthand form describes exactly one property and may contain commas in
 * its initial value:
 *
 * ```css
 * @property --a <length>: 1em;
 * @property --b type(<color>#): red, blue;
 * ```
 *
 * Returns `null` when the rule is invalid.
 */
export function expandPropertyRule(atRule: AtRule, postcss: Helpers): Array<AtRule> | null {
	const definitions = propertyDefinitions(atRule);
	if (!definitions) {
		return null;
	}

	return definitions.map((definition) => {
		if (!definition.shorthand) {
			// The longhand form describes all descriptors with a block, which is
			// identical for every name in the prelude list.
			return atRule.clone({ params: definition.name });
		}

		const { type, initialValue } = definition.shorthand;

		return postcss.atRule({
			name: 'property',
			params: definition.name,
			nodes: [
				postcss.decl({ prop: 'inherits', value: 'true', source: atRule.source }),
				...(type === null ? [] : [postcss.decl({ prop: 'syntax', value: type, source: atRule.source })]),
				...(initialValue === null ? [] : [postcss.decl({ prop: 'initial-value', value: initialValue, source: atRule.source })]),
			],
			source: atRule.source,
		});
	});
}

/** The names of every property registered by an `@property` rule. */
export function registeredPropertyNames(atRule: AtRule): Array<string> {
	return propertyDefinitions(atRule)?.map((definition) => definition.name) ?? [];
}

function propertyDefinitions(atRule: AtRule): Array<PropertyDefinition> | null {
	if (atRule.nodes) {
		const names = propertyNames(atRule.params);
		if (!names) {
			return null;
		}

		return names.map((name) => ({
			name,
			shorthand: null,
		}));
	}

	const definition = shorthandDefinition(parseListOfComponentValues(tokenize({ css: atRule.params })));

	return definition ? [definition] : null;
}

/** Parse the comma separated list of custom property names of a longhand rule. */
function propertyNames(params: string): Array<string> | null {
	const list = parseCommaSeparatedListOfComponentValues(tokenize({ css: params }));
	const names: Array<string> = [];

	for (const values of list) {
		const meaningful = values.filter((value) => !isWhiteSpaceOrCommentNode(value));
		if (meaningful.length !== 1) {
			return null;
		}

		const name = customPropertyName(meaningful[0]);
		if (name === null) {
			return null;
		}

		names.push(name);
	}

	return names.length ? names : null;
}

/** Parse the prelude of a shorthand rule. */
function shorthandDefinition(values: Array<ComponentValue>): PropertyDefinition | null {
	const meaningful = values.filter((value) => !isWhiteSpaceOrCommentNode(value));
	if (!meaningful.length) {
		return null;
	}

	const name = customPropertyName(meaningful[0]);
	if (name === null) {
		return null;
	}

	let colonIndex = -1;
	for (let i = 1; i < meaningful.length; i++) {
		const value = meaningful[i];
		if (isTokenNode(value) && isTokenColon(value.value)) {
			colonIndex = i;
			break;
		}
	}

	const typeValues = meaningful.slice(1, colonIndex === -1 ? meaningful.length : colonIndex);
	const initialValueValues = colonIndex === -1 ? [] : meaningful.slice(colonIndex + 1);

	const type = syntaxFor(typeValues);
	if (type === null) {
		return null;
	}

	return {
		name,
		shorthand: {
			type,
			initialValue: colonIndex === -1 ? null : stringify([initialValueValues]).trim(),
		},
	};
}

/**
 * Serialize the type of a shorthand registration to the value of a `syntax`
 * descriptor.
 *
 * A single `<syntax-component>` is used as-is, `type()` is unwrapped and a
 * quoted syntax string is preserved for compatibility with the longhand form.
 */
function syntaxFor(values: Array<ComponentValue>): string | null {
	if (!values.length) {
		return '"*"';
	}

	if (values.length === 1 && isTokenNode(values[0]) && isTokenString(values[0].value)) {
		return values[0].value[1];
	}

	if (values.length === 1 && isFunctionNode(values[0]) && values[0].getName().toLowerCase() === 'type') {
		const syntax = stringify([values[0].value]).trim();
		return syntax ? JSON.stringify(syntax) : null;
	}

	const syntax = stringify([values]).trim();
	return syntax ? JSON.stringify(syntax) : null;
}

function customPropertyName(value: ComponentValue | undefined): string | null {
	if (!value || !isTokenNode(value) || !isTokenIdent(value.value)) {
		return null;
	}

	const name = value.value[4].value;
	if (name === '--' || !name.startsWith('--')) {
		return null;
	}

	return name;
}
