import type { Declaration } from 'postcss';
import type valuesParser from 'postcss-value-parser';

import { buildCustomPropertiesMap } from './build-custom-properties-map';
import { isDeclarationIgnored } from './is-ignored';

export default function getCustomPropertiesFromSiblings(decl: Declaration, inherited: Map<string, valuesParser.ParsedValue>, parsedValuesCache: Map<string, valuesParser.ParsedValue>): Map<string, valuesParser.ParsedValue> {
	if (!decl.parent) {
		return inherited;
	}

	const customProperties: Map<string, string> = new Map();

	decl.parent.each((siblingDecl) => {
		if (siblingDecl.type !== 'decl' || !siblingDecl.variable) {
			return;
		}

		if (decl === siblingDecl) {
			return;
		}

		if (isDeclarationIgnored(siblingDecl)) {
			return;
		}

		customProperties.set(siblingDecl.prop, siblingDecl.value);
	});

	if (!customProperties.size) {
		return inherited;
	}

	return buildCustomPropertiesMap(customProperties, inherited, parsedValuesCache);
}
