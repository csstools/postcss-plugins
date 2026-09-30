import type { ComponentValue } from '@csstools/css-parser-algorithms';
import { isFunctionNode, isSimpleBlockNode, isTokenNode, parseListOfComponentValues } from '@csstools/css-parser-algorithms';
import { isTokenDimension, isTokenIdent, isTokenPercentage, tokenize } from '@csstools/css-tokenizer';

const CSS_WIDE_KEYWORDS = new Set(['initial', 'inherit', 'unset', 'revert', 'revert-layer']);

// Units that depend on the element, its container or the viewport.
const RELATIVE_UNITS = new Set([
	// font relative
	'em', 'rem', 'ex', 'rex', 'cap', 'rcap', 'ch', 'rch', 'ic', 'ric', 'lh', 'rlh',
	// viewport relative
	'vw', 'vh', 'vi', 'vb', 'vmin', 'vmax',
	'svw', 'svh', 'svi', 'svb', 'svmin', 'svmax',
	'lvw', 'lvh', 'lvi', 'lvb', 'lvmin', 'lvmax',
	'dvw', 'dvh', 'dvi', 'dvb', 'dvmin', 'dvmax',
	// container relative
	'cqw', 'cqh', 'cqi', 'cqb', 'cqmin', 'cqmax',
	// flex
	'fr',
]);

// Functions that depend on context or other values.
const NON_INDEPENDENT_FUNCTIONS = new Set([
	'var',
	'env',
	'attr',
	'light-dark',
	'image-set',
	'-webkit-image-set',
	// Anchoring
	'anchor',
	'anchor-size',
	// DOM dependent
	'sibling-index',
	'sibling-count',
	// Non deterministic
	'random',
	'random-item',
	// State dependent
	'toggle',
	'state',
	'running',
	// Viewport / container dependent
	'progress',
	'media-progress',
	'container-progress',
	// Element size dependent
	'calc-size',
	'paint',
	'element',
	// Cascade / parent dependent
	'inherit',
	'first-valid',
	'if',
	// Scroll driven
	'scroll',
	'view',
]);

// Inside these functions a percentage is an absolute component, not a relative length.
const COLOR_FUNCTIONS = new Set([
	'rgb', 'rgba', 'hsl', 'hsla', 'hwb',
	'lab', 'lch', 'oklab', 'oklch',
	'color', 'color-mix', 'color-contrast', 'device-cmyk',
]);

/**
 * Whether a value is computationally independent.
 *
 * `@property` initial values must be computationally independent. This is a
 * conservative check: when in doubt the value is rejected.
 *
 * https://drafts.css-houdini.org/css-properties-values-api-1/#computationally-independent
 */
export function isComputationallyIndependent(value: string): boolean {
	const componentValues = parseListOfComponentValues(tokenize({ css: value }));

	return areComponentsIndependent(componentValues, false);
}

function areComponentsIndependent(componentValues: Array<ComponentValue>, inColor: boolean): boolean {
	for (const componentValue of componentValues) {
		if (isFunctionNode(componentValue)) {
			const name = componentValue.getName().toLowerCase();
			if (NON_INDEPENDENT_FUNCTIONS.has(name)) {
				return false;
			}

			if (!areComponentsIndependent(componentValue.value, inColor || COLOR_FUNCTIONS.has(name))) {
				return false;
			}

			continue;
		}

		if (isSimpleBlockNode(componentValue)) {
			if (!areComponentsIndependent(componentValue.value, inColor)) {
				return false;
			}

			continue;
		}

		if (!isTokenNode(componentValue)) {
			continue;
		}

		const token = componentValue.value;

		if (isTokenDimension(token)) {
			if (RELATIVE_UNITS.has(token[4].unit.toLowerCase())) {
				return false;
			}

			continue;
		}

		if (isTokenPercentage(token)) {
			if (!inColor) {
				return false;
			}

			continue;
		}

		if (isTokenIdent(token)) {
			const name = token[4].value.toLowerCase();
			if (name === 'currentcolor' || CSS_WIDE_KEYWORDS.has(name)) {
				return false;
			}
		}
	}

	return true;
}
