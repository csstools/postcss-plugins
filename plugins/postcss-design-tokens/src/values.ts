import type { Declaration, Result } from 'postcss';
import valuesParser from 'postcss-value-parser';
import { Config } from './options';

export function onCSSValue(config: Config, result: Result, decl: Declaration) {
	const valueAST = valuesParser(decl.value);

	valueAST.walk(node => {
		if (node.type !== 'function' || node.value !== 'design-token') {
			return;
		}

		if (!node.nodes || node.nodes.length !== 1) {
			decl.warn(result, 'Expected a single keyword for the design-token function.');
			return;
		}

		if (node.nodes[0].type !== 'word') {
			decl.warn(result, 'Expected a single keyword for the design-token function.');
			return;
		}

		const replacement = config.designTokens.values.get(node.nodes[0].value);
		if (!replacement) {
			return;
		}

		if (replacement.deprecated) {
			decl.warn(result, `design-token: "${replacement.name}" is deprecated.`);
		}

		if (replacement.allowedProperties.size && !replacement.allowedProperties.has(decl.prop)) {
			decl.warn(result, `design-token: "${replacement.name}" is not allowed for "${decl.prop}".`);
			return;
		}

		if (replacement.blockedProperties.size && replacement.blockedProperties.has(decl.prop)) {
			decl.warn(result, `design-token: "${replacement.name}" is not allowed for "${decl.prop}".`);
			return;
		}

		node.value = replacement.value;
		node.nodes = undefined;
	});

	return String(valueAST);
}

export function onCSSValueRequiredDesignToken(config: Config, result: Result, decl: Declaration) {
	const valueAST = valuesParser(decl.value);

	let hasNonDesignTokens = false;

	valueAST.nodes.forEach((node) => {
		// Allowed, even when the property requires design tokens.
		if (node.type === 'comment' || node.type === 'space' || node.type === 'div') {
			return;
		}

		if (node.type !== 'function' || node.value !== 'design-token') {
			hasNonDesignTokens = true;
			return;
		}

		if (!node.nodes || node.nodes.length !== 1) {
			decl.warn(result, 'Expected a single keyword for the design-token function.');
			return false;
		}

		if (node.nodes[0].type !== 'word') {
			decl.warn(result, 'Expected a single keyword for the design-token function.');
			return false;
		}

		const replacement = config.designTokens.values.get(node.nodes[0].value);
		if (!replacement) {
			return;
		}

		if (replacement.deprecated) {
			decl.warn(result, `design-token: "${replacement.name}" is deprecated.`);
		}

		if (replacement.allowedProperties.size && !replacement.allowedProperties.has(decl.prop)) {
			decl.warn(result, `design-token: "${replacement.name}" is not allowed for "${decl.prop}".`);
			return false;
		}

		if (replacement.blockedProperties.size && replacement.blockedProperties.has(decl.prop)) {
			decl.warn(result, `design-token: "${replacement.name}" is not allowed for "${decl.prop}".`);
			return false;
		}

		node.value = replacement.value;
		node.nodes = undefined;
	});

	if (hasNonDesignTokens) {
		return false;
	}

	return String(valueAST);
}

export function onCSSValueUnknownDesignToken(config: Config, result: Result, decl: Declaration) {
	const valueAST = valuesParser(decl.value);

	valueAST.walk(node => {
		if (node.type !== 'function' || node.value !== 'design-token') {
			return;
		}

		if (!node.nodes || node.nodes.length !== 1) {
			return;
		}

		if (node.nodes[0].type !== 'word') {
			return;
		}

		decl.warn(result, `design-token: "${node.nodes[0].value}" is not configured.`);
	});
}
