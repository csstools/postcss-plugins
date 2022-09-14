import type { PluginCreator } from 'postcss';
import valuesParser from 'postcss-value-parser';

type pluginOptions = { preserve?: boolean };

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			preserve: false,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-color-hex-alpha',
		Declaration(decl) {
			if (!hasAlphaHex(decl)) {
				return;
			}

			const { value: originalValue } = decl;

			// replace instances of hexa with rgba()
			const valueAST = valuesParser(originalValue);

			valueAST.walk((node) => {
				if (node.type === 'function' && node.value === 'url') {
					return false;
				}

				if (isAlphaHex(node)) {
					hexa2rgba(node);
				}
			});

			const modifiedValue = valueAST.toString();
			if (modifiedValue === originalValue) {
				return;
			}

			decl.cloneBefore({ value: modifiedValue });

			if (options.preserve) {
				return;
			}

			decl.remove();
		},
	};
};

creator.postcss = true;

export default creator;


/** Returns whether a node has a hexa. */
function hasAlphaHex(node) {
	/** Expresssion to match any hexa */
	return /#([0-9A-Fa-f]{4}(?:[0-9A-Fa-f]{4})?)\b/.test(node.value);
}

/** Returns whether a node matches a hexa node. */
function isAlphaHex(node) {
	/** Expresssion to match an exact hexa */
	return node.type === 'word' && /^#([0-9A-Fa-f]{4}(?:[0-9A-Fa-f]{4})?)$/.test(node.value);
}

/** Decimal precision. */
const alphaDecimalPrecision = 100000;

const hexa2rgba = (node) => {
	// hex is the node value
	const hex = node.value;

	// conditionally expand a hex
	const hex8 = `0x${hex.length === 5 ? hex.slice(1).replace(/[0-9A-Fa-f]/g, '$&$&') : hex.slice(1)}`;

	// extract the red, blue, green, and alpha values from the hex
	const [r, g, b, a] = [
		parseInt(hex8.slice(2, 4), 16),
		parseInt(hex8.slice(4, 6), 16),
		parseInt(hex8.slice(6, 8), 16),
		Math.round(
			(parseInt(hex8.slice(8, 10), 16) / 255) * alphaDecimalPrecision,
		) / alphaDecimalPrecision,
	];

	node.value = `rgba(${r},${g},${b},${a})`;
};
