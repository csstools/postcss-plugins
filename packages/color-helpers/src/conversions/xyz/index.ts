import type { Color } from 'types/color';
import { D65_to_D50 } from 'conversions/d65-to-d50';
import { HSL_to_sRGB } from 'conversions/hsl-to-srgb';
import { HWB_to_sRGB } from 'conversions/hwb-to-srgb';
import { LCH_to_Lab } from 'conversions/lch-to-lab';
import { Lab_to_XYZ } from 'conversions/lab-to-xyz';
import { OKLCH_to_OKLab } from 'conversions/oklch-to-oklab';
import { OKLab_to_XYZ } from 'conversions/oklab-to-xyz';
import { lin_2020 } from 'conversions/lin-2020';
import { lin_2020_to_XYZ } from 'conversions/lin-2020-to-xyz';
import { lin_P3 } from 'conversions/lin-p3';
import { lin_P3_to_XYZ } from 'conversions/lin-p3-to-xyz';
import { lin_ProPhoto } from 'conversions/lin-pro-photo';
import { lin_ProPhoto_to_XYZ } from 'conversions/lin-pro-photo-to-xyz';
import { lin_a98rgb } from 'conversions/lin-a98rgb';
import { lin_a98rgb_to_XYZ } from 'conversions/lin-a98rgb-to-xyz';
import { lin_sRGB } from 'conversions/lin-srgb';
import { lin_sRGB_to_XYZ } from 'conversions/lin-srgb-to-xyz';
import { D50_to_D65 } from 'conversions/d50-to-d65';
import { XYZ_to_lin_sRGB } from 'conversions/xyz-to-lin-srgb';
import { gam_sRGB } from 'conversions/gam-srgb';

/**
 * @param {Color} color [h, s, l]
 * - Hue as degrees 0..360;
 * - Saturation as number 0..100;
 * - Lightness as number 0..100;
 * @return {Color} D50 XYZ [x, y, z]
 */
export function HSL_to_XYZ_D50(x: Color): Color {
	let y = x;
	y = HSL_to_sRGB(y);
	y = lin_sRGB(y);
	y = lin_sRGB_to_XYZ(y);
	y = D65_to_D50(y);
	return y;
}

/**
 * @param {Color} color [h, w, b]
 * - Hue as degrees 0..360;
 * - Whiteness as number 0..100;
 * - Blackness as number 0..100;
 * @return {Color} D50 XYZ [x, y, z]
 */
export function HWB_to_XYZ_D50(x: Color): Color {
	let y = x;
	y = HWB_to_sRGB(y);
	y = lin_sRGB(y);
	y = lin_sRGB_to_XYZ(y);
	y = D65_to_D50(y);
	return y;
}

/**
 * @param {Color} color [l, a, b]
 * - Lightness as number 0..100;
 * - a as number -160..160;
 * - b as number -160..160;
 * @return {Color} D50 XYZ [x, y, z]
 */
export function Lab_to_XYZ_D50(x: Color): Color {
	let y = x;
	y = Lab_to_XYZ(y);
	return y;
}

/**
 * @param {Color} color [l, c, h]
 * - Lightness as number 0..100;
 * - Chroma as number 0..230;
 * - Hue as degrees 0..360;
 * @return {Color} D50 XYZ [x, y, z]
 */
export function LCH_to_XYZ_D50(x: Color): Color {
	let y = x;
	y = LCH_to_Lab(y);
	y = Lab_to_XYZ(y);
	return y;
}

/**
 * @param {Color} color [l, a, b]
 * - Lightness as number 0..1;
 * - a as number 0..0.5;
 * - b as number 0..0.5;
 * @return {Color} D50 XYZ [x, y, z]
 */
export function OKLab_to_XYZ_D50(x: Color): Color {
	let y = x;
	y = OKLab_to_XYZ(y);
	y = D65_to_D50(y);
	return y;
}

/**
 * @param {Color} color [l, c, h]
 * - Lightness as number 0..1;
 * - Chroma as number 0..0.5;
 * - Hue as degrees 0..360;
 * @return {Color} D50 XYZ [x, y, z]
 */
export function OKLCH_to_XYZ_D50(x: Color): Color {
	let y = x;
	y = OKLCH_to_OKLab(y);
	y = OKLab_to_XYZ(y);
	return y;
}

/**
 * @param {Color} color [r, g, b]
 * - Red as number 0..1;
 * - Green as number 0..1;
 * - Blue as number 0..1;
 * @return {Color} D50 XYZ [x, y, z]
 */
export function sRGB_to_XYZ_D50(x: Color): Color {
	let y = x;
	y = lin_sRGB(y);
	y = lin_sRGB_to_XYZ(y);
	y = D65_to_D50(y);
	return y;
}

/**
 * @param {Color} color [r, g, b]
 * - Red as number 0..1;
 * - Green as number 0..1;
 * - Blue as number 0..1;
 * @return {Color} D50 XYZ [x, y, z]
 */
export function lin_sRGB_to_XYZ_D50(x: Color): Color {
	let y = x;
	y = lin_sRGB_to_XYZ(y);
	y = D65_to_D50(y);
	return y;
}

/**
 * @param {Color} color [r, g, b]
 * - Red as number 0..1;
 * - Green as number 0..1;
 * - Blue as number 0..1;
 * @return {Color} D50 XYZ [x, y, z]
 */
export function a98_RGB_to_XYZ_D50(x: Color): Color {
	let y = x;
	y = lin_a98rgb(y);
	y = lin_a98rgb_to_XYZ(y);
	y = D65_to_D50(y);
	return y;
}

/**
 * @param {Color} color [r, g, b]
 * - Red as number 0..1;
 * - Green as number 0..1;
 * - Blue as number 0..1;
 * @return {Color} D50 XYZ [x, y, z]
 */
export function P3_to_XYZ_D50(x: Color): Color {
	let y = x;
	y = lin_P3(y);
	y = lin_P3_to_XYZ(y);
	y = D65_to_D50(y);
	return y;
}

/**
 * @param {Color} color [r, g, b]
 * - Red as number 0..1;
 * - Green as number 0..1;
 * - Blue as number 0..1;
 * @return {Color} D50 XYZ [x, y, z]
 */
export function rec_2020_to_XYZ_D50(x: Color): Color {
	let y = x;
	y = lin_2020(y);
	y = lin_2020_to_XYZ(y);
	y = D65_to_D50(y);
	return y;
}

/**
 * @param {Color} color [r, g, b]
 * - Red as number 0..1;
 * - Green as number 0..1;
 * - Blue as number 0..1;
 * @return {Color} D50 XYZ [x, y, z]
 */
export function proPhoto_RGB_to_XYZ_D50(x: Color): Color {
	let y = x;
	y = lin_ProPhoto(y);
	y = lin_ProPhoto_to_XYZ(y);
	return y;
}

/**
 * @param {Color} color [x, y, z]
 * - X as number 0..1;
 * - Y as number 0..1;
 * - Z as number 0..1;
 * @return {Color} D50 XYZ [x, y, z]
 */
export function XYZ_D65_to_XYZ_D50(x: Color): Color {
	let y = x;
	y = D65_to_D50(y);
	return y;
}

/**
 * @param {Color} color [x, y, z]
 * - X as number 0..1;
 * - Y as number 0..1;
 * - Z as number 0..1;
 * @return {Color} D50 XYZ [x, y, z]
 */
export function XYZ_D50_to_XYZ_D50(x: Color): Color {
	return x;
}

/**
 * @param {Color} color [x, y, z]
 * - X as number 0..1;
 * - Y as number 0..1;
 * - Z as number 0..1;
 * @return {Color} sRGB [r, g, b]
 * - Red as number 0..1;
 * - Green as number 0..1;
 * - Blue as number 0..1;
 */
export function XYZ_D50_to_sRGB(x: Color): Color {
	let y = x;
	y = D50_to_D65(y);
	y = XYZ_to_lin_sRGB(y);
	y = gam_sRGB(y);
	return y;
}
