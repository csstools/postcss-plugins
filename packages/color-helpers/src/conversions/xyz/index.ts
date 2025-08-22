import type { Color } from '../../types/color';
import { D50_to_D65 } from '../d50-to-d65';
import { D65_to_D50 } from '../d65-to-d50';
import { HSL_to_sRGB } from '../hsl-to-srgb';
import { HWB_to_sRGB } from '../hwb-to-srgb';
import { LCH_to_Lab } from '../lch-to-lab';
import { Lab_to_LCH } from '../lab-to-lch';
import { Lab_to_XYZ } from '../lab-to-xyz';
import { OKLCH_to_OKLab } from '../oklch-to-oklab';
import { OKLab_to_OKLCH } from '../oklab-to-oklch';
import { OKLab_to_XYZ } from '../oklab-to-xyz';
import { XYZ_to_Lab } from '../xyz-to-lab';
import { XYZ_to_OKLab } from '../xyz-to-oklab';
import { XYZ_to_lin_2020 } from '../xyz-to-lin-2020';
import { XYZ_to_lin_P3 } from '../xyz-to-lin-p3';
import { XYZ_to_lin_ProPhoto } from '../xyz-to-lin-pro-photo';
import { XYZ_to_lin_a98rgb } from '../xyz-to-lin-a98rgb';
import { XYZ_to_lin_sRGB } from '../xyz-to-lin-srgb';
import { gam_2020 } from '../gam-2020';
import { gam_P3 } from '../gam-p3';
import { gam_ProPhoto } from '../gam-pro-photo';
import { gam_a98rgb } from '../gam-a98rgb';
import { gam_sRGB } from '../gam-srgb';
import { lin_2020 } from '../lin-2020';
import { lin_2020_to_XYZ } from '../lin-2020-to-xyz';
import { lin_P3 } from '../lin-p3';
import { lin_P3_to_XYZ } from '../lin-p3-to-xyz';
import { lin_ProPhoto } from '../lin-pro-photo';
import { lin_ProPhoto_to_XYZ } from '../lin-pro-photo-to-xyz';
import { lin_a98rgb } from '../lin-a98rgb';
import { lin_a98rgb_to_XYZ } from '../lin-a98rgb-to-xyz';
import { lin_sRGB } from '../lin-srgb';
import { lin_sRGB_to_XYZ } from '../lin-srgb-to-xyz';
import { sRGB_to_HSL } from '../srgb-to-hsl';
import { sRGB_to_Hue } from '../srgb-to-hue';

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
 * @param {Color} color [x, y, z]
 * - X as number 0..1;
 * - Y as number 0..1;
 * - Z as number 0..1;
 * @return {Color} HSL [r, g, b]
 * - Hue as degrees 0..360;
 * - Saturation as number 0..100;
 * - Lightness as number 0..100;
 */
export function XYZ_D50_to_HSL(x: Color): Color {
	let y = x;
	y = D50_to_D65(y);
	y = XYZ_to_lin_sRGB(y);
	y = gam_sRGB(y);
	y = sRGB_to_HSL(y);
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
 * @param {Color} color [x, y, z]
 * - X as number 0..1;
 * - Y as number 0..1;
 * - Z as number 0..1;
 * @return {Color} HWB [r, g, b]
 * - Hue as degrees 0..360;
 * - Whiteness as number 0..100;
 * - Blackness as number 0..100;
 */
export function XYZ_D50_to_HWB(x: Color): Color {
	let y = x;
	y = D50_to_D65(y);
	y = XYZ_to_lin_sRGB(y);
	const srgb = gam_sRGB(y);

	const white = Math.min(srgb[0], srgb[1], srgb[2]);
	const black = 1 - Math.max(srgb[0], srgb[1], srgb[2]);
	return [sRGB_to_Hue(srgb), white * 100, black * 100];
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
 * @param {Color} color [x, y, z]
 * - X as number 0..1;
 * - Y as number 0..1;
 * - Z as number 0..1;
 * @return {Color} Lab [r, g, b]
 * - Lightness as number 0..100;
 * - a as number -160..160;
 * - b as number -160..160;
 */
export function XYZ_D50_to_Lab(x: Color): Color {
	let y = x;
	y = XYZ_to_Lab(y);
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
 * @param {Color} color [x, y, z]
 * - X as number 0..1;
 * - Y as number 0..1;
 * - Z as number 0..1;
 * @return {Color} LCH [r, g, b]
 * - Lightness as number 0..100;
 * - Chroma as number 0..230;
 * - Hue as degrees 0..360;
 */
export function XYZ_D50_to_LCH(x: Color): Color {
	let y = x;
	y = XYZ_to_Lab(y);
	y = Lab_to_LCH(y);
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
 * @param {Color} color [x, y, z]
 * - X as number 0..1;
 * - Y as number 0..1;
 * - Z as number 0..1;
 * @return {Color} OKLab [r, g, b]
 * - Lightness as number 0..1;
 * - a as number 0..0.5;
 * - b as number 0..0.5;
 */
export function XYZ_D50_to_OKLab(x: Color): Color {
	let y = x;
	y = D50_to_D65(y);
	y = XYZ_to_OKLab(y);
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
	y = D65_to_D50(y);
	return y;
}

/**
 * @param {Color} color [x, y, z]
 * - X as number 0..1;
 * - Y as number 0..1;
 * - Z as number 0..1;
 * @return {Color} OKLCH [r, g, b]
 * - Lightness as number 0..1;
 * - Chroma as number 0..0.5;
 * - Hue as degrees 0..360;
 */
export function XYZ_D50_to_OKLCH(x: Color): Color {
	let y = x;
	y = D50_to_D65(y);
	y = XYZ_to_OKLab(y);
	y = OKLab_to_OKLCH(y);
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
 * @param {Color} color [x, y, z]
 * - X as number 0..1;
 * - Y as number 0..1;
 * - Z as number 0..1;
 * @return {Color} linear sRGB [r, g, b]
 * - Red as number 0..1;
 * - Green as number 0..1;
 * - Blue as number 0..1;
 */
export function XYZ_D50_to_lin_sRGB(x: Color): Color {
	let y = x;
	y = D50_to_D65(y);
	y = XYZ_to_lin_sRGB(y);
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
 * @param {Color} color [x, y, z]
 * - X as number 0..1;
 * - Y as number 0..1;
 * - Z as number 0..1;
 * @return {Color} a98 sRGB [r, g, b]
 * - Red as number 0..1;
 * - Green as number 0..1;
 * - Blue as number 0..1;
 */
export function XYZ_D50_to_a98_RGB(x: Color): Color {
	let y = x;
	y = D50_to_D65(y);
	y = XYZ_to_lin_a98rgb(y);
	y = gam_a98rgb(y);
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
 * @param {Color} color [x, y, z]
 * - X as number 0..1;
 * - Y as number 0..1;
 * - Z as number 0..1;
 * @return {Color} P3 [r, g, b]
 * - R as number 0..1;
 * - G as number 0..1;
 * - B as number 0..1;
 */
export function XYZ_D50_to_P3(x: Color): Color {
	let y = x;
	y = D50_to_D65(y);
	y = XYZ_to_lin_P3(y);
	y = gam_P3(y);
	return y;
}

/**
 * @param {Color} color [r, g, b]
 * - Red as number 0..1;
 * - Green as number 0..1;
 * - Blue as number 0..1;
 * @return {Color} D50 XYZ [x, y, z]
 */
export function lin_P3_to_XYZ_D50(x: Color): Color {
	let y = x;
	y = lin_P3_to_XYZ(y);
	y = D65_to_D50(y);
	return y;
}

/**
 * @param {Color} color [x, y, z]
 * - X as number 0..1;
 * - Y as number 0..1;
 * - Z as number 0..1;
 * @return {Color} P3 [r, g, b]
 * - R as number 0..1;
 * - G as number 0..1;
 * - B as number 0..1;
 */
export function XYZ_D50_to_lin_P3(x: Color): Color {
	let y = x;
	y = D50_to_D65(y);
	y = XYZ_to_lin_P3(y);
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
 * @param {Color} color [x, y, z]
 * - X as number 0..1;
 * - Y as number 0..1;
 * - Z as number 0..1;
 * @return {Color} rec 2020 [r, g, b]
 * - Red as number 0..1;
 * - Green as number 0..1;
 * - Blue as number 0..1;
 */
export function XYZ_D50_to_rec_2020(x: Color): Color {
	let y = x;
	y = D50_to_D65(y);
	y = XYZ_to_lin_2020(y);
	y = gam_2020(y);
	return y;
}

/**
 * @param {Color} color [r, g, b]
 * - Red as number 0..1;
 * - Green as number 0..1;
 * - Blue as number 0..1;
 * @return {Color} D50 XYZ [x, y, z]
 */
export function ProPhoto_RGB_to_XYZ_D50(x: Color): Color {
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
 * @return {Color} ProPhoto [r, g, b]
 * - Red as number 0..1;
 * - Green as number 0..1;
 * - Blue as number 0..1;
 */
export function XYZ_D50_to_ProPhoto(x: Color): Color {
	let y = x;
	y = XYZ_to_lin_ProPhoto(y);
	y = gam_ProPhoto(y);
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
 * @return {Color} D65 XYZ [x, y, z]
 */
export function XYZ_D50_to_XYZ_D65(x: Color): Color {
	let y = x;
	y = D50_to_D65(y);
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
