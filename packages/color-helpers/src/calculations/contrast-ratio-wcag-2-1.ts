import type { Color } from '../types/color';

function luminance(color: Color): number {
	// https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
	const [lumR, lumG, lumB] = color.map(component => {
		return component <= 0.04045
			? component / 12.92
			: Math.pow((component + 0.055) / 1.055, 2.4);
	});

	return 0.2126 * lumR + 0.7152 * lumG + 0.0722 * lumB;
}

/**
 * WCAG 2.1 contrast ratio
 */
export function contrast_ratio_wcag_2_1(color1: Color, color2: Color): number {
	// https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
	const color1luminance = luminance(color1);
	const color2luminance = luminance(color2);

	const l1 = Math.max(color1luminance, color2luminance);
	const l2 = Math.min(color1luminance, color2luminance);

	return (l1 + 0.05) / (l2 + 0.05);
}
