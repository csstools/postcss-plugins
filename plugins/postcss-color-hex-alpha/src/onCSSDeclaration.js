import valuesParser from 'postcss-value-parser';
import options from './options';

/** @type {(decl: CSSDeclaration) => void} Transform 4 & 8 character hex color notation in CSS Declarations. */
const onCSSDeclaration = (decl) => {
	if (hasAlphaHex(decl)) {
		const { value: originalValue } = decl;

		// replace instances of hexa with rgba()
		const valueAST = valuesParser(originalValue);

		valueAST.walk((node) => {
			if (isAlphaHex(node)) {
				hexa2rgba(node);
			}
		});

		const modifiedValue = valueAST.toString();

		if (modifiedValue !== originalValue) {
			if (options.preserve) decl.cloneBefore({ value: modifiedValue });
			else decl.value = modifiedValue;
		}
	}
};

/** Expresssion to match an exact hexa */
const alphaHexValueRegExp = /^#([0-9A-Fa-f]{4}(?:[0-9A-Fa-f]{4})?)$/;

/** Expresssion to match any hexa */
const alphaHexRegExp = /#([0-9A-Fa-f]{4}(?:[0-9A-Fa-f]{4})?)\b/;

/** Returns whether a node has a hexa. */
const hasAlphaHex = (node) => alphaHexRegExp.test(node.value);

/** Returns whether a node matches a hexa node. */
const isAlphaHex = (node) =>
	node.type === 'word' && alphaHexValueRegExp.test(node.value);

/** Decimal precision. */
const alphaDecimalPrecision = 100000;

const hexa2rgba = (node) => {
	// hex is the node value
	const hex = node.value;

	// conditionally expand a hex
	const hex8 = `0x${
		hex.length === 5 ? hex.slice(1).replace(/[0-9A-f]/g, '$&$&') : hex.slice(1)
	}`;

	// extract the red, blue, green, and alpha values from the hex
	const [r, g, b, a] = [
		parseInt(hex8.slice(2, 4), 16),
		parseInt(hex8.slice(4, 6), 16),
		parseInt(hex8.slice(6, 8), 16),
		Math.round(
			(parseInt(hex8.slice(8, 10), 16) / 255) * alphaDecimalPrecision
		) / alphaDecimalPrecision,
	];

	node.value = `rgba(${r},${g},${b},${a})`;
};

export default onCSSDeclaration;

/** @typedef {import('postcss').Declaration} CSSDeclaration */
