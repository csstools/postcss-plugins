import type { Declaration, Result } from 'postcss';
import valueParser from 'postcss-value-parser';

export function onCSSDeclaration(decl: Declaration, result: Result , options: { preserve: boolean }): void {
	// alignment
	const alignment = decl.prop.match(PLACE_MATCH_REGEX)?.[1].toLowerCase();
	if (!alignment) {
		return;
	}

	// value ast and child nodes
	let value;

	try {
		value = valueParser(decl.value);
	} catch (_) {
		decl.warn(
			result,
			`Failed to parse value '${decl.value}'. Leaving the original value intact.`,
		);
	}

	if (typeof value === 'undefined') {
		return;
	}

	let alignmentValues: Array<string> = [];

	if (!value.nodes.length) {
		alignmentValues = [valueParser.stringify(value.nodes)];
	} else {
		alignmentValues = value.nodes.filter((node) => {
			return node.type === 'word' || node.type === 'function';
		}).map((node) => {
			return valueParser.stringify(node);
		});
	}

	decl.cloneBefore({
		prop: `align-${alignment}`,
		value: alignmentValues[0],
	});

	decl.cloneBefore({
		prop: `justify-${alignment}`,
		value: alignmentValues[1] || alignmentValues[0],
	});

	// conditionally remove place-[alignment]
	if (!options.preserve) {
		decl.remove();
	}
}

export const PLACE_MATCH_REGEX = /^place-(content|items|self)/i;
