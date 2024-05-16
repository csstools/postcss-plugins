import type { PluginCreator } from 'postcss';
import valuesParser from 'postcss-value-parser';
import { hasFallback } from '@csstools/utilities';

/** postcss-color-hex-alpha plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

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
		Declaration(decl): void {
			if (!HAS_HEX_ALPHA_REGEX.test(decl.value)) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			const { value: originalValue } = decl;

			// replace instances of hexa with rgba()
			const valueAST = valuesParser(originalValue);

			valueAST.walk((node) => {
				if (node.type === 'function' && node.value === 'url') {
					return false;
				}

				if (node.type === 'word' && IS_HEX_ALPHA_REGEX.test(node.value)) {
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

const HAS_HEX_ALPHA_REGEX = /#[0-9a-f]{4}(?:[0-9a-f]{4})?\b/i;

const IS_HEX_ALPHA_REGEX = /^#[0-9a-f]{4}(?:[0-9a-f]{4})?$/i;

/** Decimal precision. */
const alphaDecimalPrecision = 100000;

const HEX_ALPHA_REPLACER_REGEX = /[0-9a-f]/gi;

function hexa2rgba(node: valuesParser.Node): void {
	// hex is the node value
	const hex = node.value;

	// conditionally expand a hex
	const hex8 = `0x${hex.length === 5 ? hex.slice(1).replace(HEX_ALPHA_REPLACER_REGEX, '$&$&') : hex.slice(1)}`;

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
}
