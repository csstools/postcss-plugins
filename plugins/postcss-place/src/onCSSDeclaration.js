import valueParser from 'postcss-value-parser';
import options from './options';

export default (decl, { result }) => {
	// alignment
	const alignment = decl.prop.toLowerCase().match(placeMatch)[1];

	// value ast and child nodes
	let value;

	try {
		value = valueParser(decl.value);
	} catch (error) {
		decl.warn(
			result,
			`Failed to parse value '${decl.value}'. Leaving the original value intact.`,
		);
	}

	if (typeof value === 'undefined') {
		return;
	}

	let alignmentValues = [];

	if (!value.nodes.length) {
		alignmentValues = [valueParser.stringify(value)];
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
};

export const placeMatch = /^place-(content|items|self)/;
