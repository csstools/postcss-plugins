declare namespace calculations {
    type Color = [
        number,
        number,
        number
    ];
    function binarySearchGamut(startOKLCH: Color, toDestination: (x: Color) => Color, fromDestination: (x: Color) => Color): Color;
    function mapGamut(startOKLCH: Color, toDestination: (x: Color) => Color, fromDestination: (x: Color) => Color): Color;
    /**
     * @description Calculate deltaE OK which is the simple root sum of squares
     * @param {number[]} reference - Array of OKLab values: L as 0..1, a and b as -1..1
     * @param {number[]} sample - Array of OKLab values: L as 0..1, a and b as -1..1
     * @return {number} How different a color sample is from reference
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/deltaEOK.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/deltaEOK.js
     */
    function deltaEOK(reference: Color, sample: Color): number;
    function contrast(RGB1: Color, RGB2: Color): number;
    /**
     * Simple matrix (and vector) multiplication
     * Warning: No error handling for incompatible dimensions!
     * @author Lea Verou 2020 MIT License
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/multiply-matrices.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/multiply-matrices.js
     */
    // A is m x n. B is n x p. product is m x p.
    function multiplyMatrices(a: Array<Array<number>> | Array<number>, b: Array<Array<number>> | Array<number>): Array<Array<number>> | Array<number>;
}
declare namespace conversions {
    // standard white points, defined by 4-figure CIE x,y chromaticities
    const D50: number[];
    const D65: number[];
    type Color = [
        number,
        number,
        number
    ];
    /**
     * Bradford chromatic adaptation from D50 to D65
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     */
    function D50_to_D65(XYZ: Color): Color;
    /**
     * Bradford chromatic adaptation from D65 to D50
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html
     */
    function D65_to_D50(XYZ: Color): Color;
    /**
     * Convert an array of linear-light rec2020 RGB  in the range 0.0-1.0
     * to gamma corrected form ITU-R BT.2020-2 p.4
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     */
    function gam_2020(RGB: Color): Color;
    /**
     * Convert an array of linear-light a98-rgb in the range 0.0-1.0
     * to gamma corrected form. Negative values are also now accepted
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     */
    function gam_a98rgb(RGB: Color): Color;
    /**
     * Convert an array of linear-light display-p3 RGB in the range 0.0-1.0
     * to gamma corrected form
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     */
    function gam_P3(RGB: Color): Color;
    /**
     * Convert an array of linear-light prophoto-rgb in the range 0.0-1.0
     * to gamma corrected form.
     * Transfer curve is gamma 1.8 with a small linear portion.
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     */
    function gam_ProPhoto(RGB: Color): Color;
    function foo(): void;
    /**
     * Convert an array of linear-light sRGB values in the range 0.0-1.0 to gamma corrected form
     * Extended transfer function:
     *  For negative values, linear portion extends on reflection
     *  of axis, then uses reflected pow below that
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see https://en.wikipedia.org/wiki/SRGB
     */
    function gam_sRGB(RGB: Color): Color;
    /**
     * @param {number} hue - Hue as degrees 0..360
     * @param {number} sat - Saturation as percentage 0..100
     * @param {number} light - Lightness as percentage 0..100
     * @return {number[]} Array of RGB components 0..1
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/hslToRgb.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/hslToRgb.js
     */
    function HSL_to_sRGB(HSL: Color): Color;
    /**
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
     */
    function hueToRGB(t1: number, t2: number, hue: number): number;
    /**
     * @param {number} hue -  Hue as degrees 0..360
     * @param {number} white -  Whiteness as percentage 0..100
     * @param {number} black -  Blackness as percentage 0..100
     * @return {number[]} Array of RGB components 0..1
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/hwbToRgb.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/hwbToRgb.js
     */
    function HWB_to_sRGB(HWB: Color): Color;
    /**
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     */
    function Lab_to_LCH(Lab: Color): Color;
    function Lab_to_XYZ(Lab: Color): Color;
    /**
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     */
    function LCH_to_Lab(LCH: Color): Color;
    /**
     * Convert an array of rec2020 RGB values in the range 0.0 - 1.0
     * to linear light (un-companded) form.
     * ITU-R BT.2020-2 p.4
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     */
    function lin_2020(RGB: Color): Color;
    /**
     * Convert an array of linear-light rec2020 values to CIE XYZ
     * using  D65 (no chromatic adaptation)
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
     */
    function lin_2020_to_XYZ(rgb: Color): Color;
    /**
     * Convert an array of a98-rgb values in the range 0.0 - 1.0
     * to linear light (un-companded) form. Negative values are also now accepted
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     */
    function lin_a98rgb(RGB: Color): Color;
    /**
     * Convert an array of linear-light a98-rgb values to CIE XYZ
     * http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
     * has greater numerical precision than section 4.3.5.3 of
     * https://www.adobe.com/digitalimag/pdfs/AdobeRGB1998.pdf
     * but the values below were calculated from first principles
     * from the chromaticity coordinates of R G B W
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
     * @see https://www.adobe.com/digitalimag/pdfs/AdobeRGB1998.pdf
     * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/matrixmaker.html
     */
    function lin_a98rgb_to_XYZ(rgb: Color): Color;
    /**
     * Convert an array of display-p3 RGB values in the range 0.0 - 1.0
     * to linear light (un-companded) form.
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     */
    function lin_P3(RGB: Color): Color;
    /**
     * Convert an array of linear-light display-p3 values to CIE XYZ
     * using D65 (no chromatic adaptation)
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
     */
    function lin_P3_to_XYZ(rgb: Color): Color;
    /**
     * Convert an array of prophoto-rgb values where in-gamut Colors are in the
     * range [0.0 - 1.0] to linear light (un-companded) form. Transfer curve is
     * gamma 1.8 with a small linear portion. Extended transfer function
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     */
    function lin_ProPhoto(RGB: Color): Color;
    /**
     * Convert an array of linear-light prophoto-rgb values to CIE XYZ
     * using D50 (so no chromatic adaptation needed afterwards)
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
     */
    function lin_ProPhoto_to_XYZ(rgb: Color): Color;
    /**
     * Convert an array of of sRGB values where in-gamut values are in the range
     * [0 - 1] to linear light (un-companded) form.
     * Extended transfer function:
     *  For negative values, linear portion is extended on reflection of axis,
     *  then reflected power function is used.
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see https://en.wikipedia.org/wiki/SRGB
     */
    function lin_sRGB(RGB: Color): Color;
    /**
     * Convert an array of linear-light sRGB values to CIE XYZ
     * using sRGB's own white, D65 (no chromatic adaptation)
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     */
    function lin_sRGB_to_XYZ(rgb: Color): Color;
    /**
     * CMYK is an array of four values in the range [0.0, 1.0] the output is an
     * array of [RGB] also in the [0.0, 1.0] range because the naive algorithm
     * does not generate out of gamut colors neither does it generate accurate
     * simulations of practical CMYK colors
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
     */
    function naive_CMYK_to_sRGB(CMYK: [
        number,
        number,
        number,
        number
    ]): Color;
    /**
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js
     */
    function OKLab_to_OKLCH(OKLab: Color): Color;
    function OKLab_to_XYZ(OKLab: Color): Color;
    /**
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js
     */
    function OKLCH_to_OKLab(OKLCH: Color): Color;
    /**
     * Convert an array of gamma-corrected sRGB values in the 0.0 to 1.0 range to HSL.
     *
     * @param {Color} RGB [r, g, b]
     * - Red component 0..1
     * - Green component 0..1
     * - Blue component 0..1
     * @return {number[]} Array of HSL values: Hue as degrees 0..360, Saturation and Lightness as percentages 0..100
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/rgbToHsl.js
     */
    function sRGB_to_HSL(RGB: Color): Color;
    /**
     * Convert an array of gamma-corrected sRGB values in the 0.0 to 1.0 range to HWB.
     *
     * @param {Color} RGB [r, g, b]
     * - Red component 0..1
     * - Green component 0..1
     * - Blue component 0..1
     * @return {number[]} Array of HWB values
     */
    function sRGB_to_HWB(RGB: Color): Color;
    /**
     * Convert an array of gamma-corrected sRGB values in the 0.0 to 1.0 range
     * to linear-light sRGB, then to CIE XYZ and return luminance (the Y value)
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
     */
    function sRGB_to_luminance(RGB: Color): number;
    function XYZ_to_Lab(XYZ: Color): Color;
    /**
     * Convert XYZ to linear-light rec2020
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     */
    function XYZ_to_lin_2020(XYZ: Color): Color;
    /**
     * Convert XYZ to linear-light a98-rgb
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     */
    function XYZ_to_lin_a98rgb(XYZ: Color): Color;
    /**
     * Convert XYZ to linear-light P3
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     */
    function XYZ_to_lin_P3(XYZ: Color): Color;
    /**
     * Convert XYZ to linear-light prophoto-rgb
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
     */
    function XYZ_to_lin_ProPhoto(XYZ: Color): Color;
    /**
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     */
    function XYZ_to_lin_sRGB(XYZ: Color): Color;
    /**
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * XYZ <-> LMS matrices recalculated for consistent reference white
     * @see https://github.com/w3c/csswg-drafts/issues/6642#issuecomment-943521484
     */
    function XYZ_to_OKLab(XYZ: Color): Color;
    /**
     * Convert an array of three XYZ values to u*,v* chromaticity coordinates
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
     */
    function XYZ_to_uv(XYZ: Color): [
        number,
        number
    ];
    /**
     * Convert an array of three XYZ values to x,y chromaticity coordinates
     *
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     *
     * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
     */
    function XYZ_to_xy(XYZ: Color): [
        number,
        number
    ];
}
declare namespace utils {
    type Color = [
        number,
        number,
        number
    ];
    /**
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/map-gamut.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     */
    function clip(color: Color): Color;
    /**
     * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/map-gamut.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
     */
    function inGamut(x: Color): boolean;
}
declare namespace xyz {
    type Color = [
        number,
        number,
        number
    ];
    /**
     * @param {Color} color [r, g, b]
     * - Red as number 0..1;
     * - Green as number 0..1;
     * - Blue as number 0..1;
     * @return {Color} D50 XYZ [x, y, z]
     */
    function sRGB_to_XYZ_D50(x: Color): Color;
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
    function XYZ_D50_to_sRGB(x: Color): Color;
    /**
     * @param {Color} color [h, s, l]
     * - Hue as degrees 0..360;
     * - Saturation as number 0..100;
     * - Lightness as number 0..100;
     * @return {Color} D50 XYZ [x, y, z]
     */
    function HSL_to_XYZ_D50(x: Color): Color;
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
    function XYZ_D50_to_HSL(x: Color): Color;
    /**
     * @param {Color} color [h, w, b]
     * - Hue as degrees 0..360;
     * - Whiteness as number 0..100;
     * - Blackness as number 0..100;
     * @return {Color} D50 XYZ [x, y, z]
     */
    function HWB_to_XYZ_D50(x: Color): Color;
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
    function XYZ_D50_to_HWB(x: Color): Color;
    /**
     * @param {Color} color [l, a, b]
     * - Lightness as number 0..100;
     * - a as number -160..160;
     * - b as number -160..160;
     * @return {Color} D50 XYZ [x, y, z]
     */
    function Lab_to_XYZ_D50(x: Color): Color;
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
    function XYZ_D50_to_Lab(x: Color): Color;
    /**
     * @param {Color} color [l, c, h]
     * - Lightness as number 0..100;
     * - Chroma as number 0..230;
     * - Hue as degrees 0..360;
     * @return {Color} D50 XYZ [x, y, z]
     */
    function LCH_to_XYZ_D50(x: Color): Color;
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
    function XYZ_D50_to_LCH(x: Color): Color;
    /**
     * @param {Color} color [l, a, b]
     * - Lightness as number 0..1;
     * - a as number 0..0.5;
     * - b as number 0..0.5;
     * @return {Color} D50 XYZ [x, y, z]
     */
    function OKLab_to_XYZ_D50(x: Color): Color;
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
    function XYZ_D50_to_OKLab(x: Color): Color;
    /**
     * @param {Color} color [l, c, h]
     * - Lightness as number 0..1;
     * - Chroma as number 0..0.5;
     * - Hue as degrees 0..360;
     * @return {Color} D50 XYZ [x, y, z]
     */
    function OKLCH_to_XYZ_D50(x: Color): Color;
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
    function XYZ_D50_to_OKLCH(x: Color): Color;
    /**
     * @param {Color} color [r, g, b]
     * - Red as number 0..1;
     * - Green as number 0..1;
     * - Blue as number 0..1;
     * @return {Color} D50 XYZ [x, y, z]
     */
    function lin_sRGB_to_XYZ_D50(x: Color): Color;
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
    function XYZ_D50_to_lin_sRGB(x: Color): Color;
    /**
     * @param {Color} color [r, g, b]
     * - Red as number 0..1;
     * - Green as number 0..1;
     * - Blue as number 0..1;
     * @return {Color} D50 XYZ [x, y, z]
     */
    function a98_RGB_to_XYZ_D50(x: Color): Color;
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
    function XYZ_D50_to_a98_RGB(x: Color): Color;
    /**
     * @param {Color} color [r, g, b]
     * - Red as number 0..1;
     * - Green as number 0..1;
     * - Blue as number 0..1;
     * @return {Color} D50 XYZ [x, y, z]
     */
    function P3_to_XYZ_D50(x: Color): Color;
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
    function XYZ_D50_to_P3(x: Color): Color;
    /**
     * @param {Color} color [r, g, b]
     * - Red as number 0..1;
     * - Green as number 0..1;
     * - Blue as number 0..1;
     * @return {Color} D50 XYZ [x, y, z]
     */
    function rec_2020_to_XYZ_D50(x: Color): Color;
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
    function XYZ_D50_to_rec_2020(x: Color): Color;
    /**
     * @param {Color} color [r, g, b]
     * - Red as number 0..1;
     * - Green as number 0..1;
     * - Blue as number 0..1;
     * @return {Color} D50 XYZ [x, y, z]
     */
    function ProPhoto_RGB_to_XYZ_D50(x: Color): Color;
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
    function XYZ_D50_to_ProPhoto(x: Color): Color;
    /**
     * @param {Color} color [x, y, z]
     * - X as number 0..1;
     * - Y as number 0..1;
     * - Z as number 0..1;
     * @return {Color} D50 XYZ [x, y, z]
     */
    function XYZ_D65_to_XYZ_D50(x: Color): Color;
    /**
     * @param {Color} color [x, y, z]
     * - X as number 0..1;
     * - Y as number 0..1;
     * - Z as number 0..1;
     * @return {Color} D65 XYZ [x, y, z]
     */
    function XYZ_D50_to_XYZ_D65(x: Color): Color;
    /**
     * @param {Color} color [x, y, z]
     * - X as number 0..1;
     * - Y as number 0..1;
     * - Z as number 0..1;
     * @return {Color} D50 XYZ [x, y, z]
     */
    function XYZ_D50_to_XYZ_D50(x: Color): Color;
}
type Color = [
    number,
    number,
    number
];
// https://www.w3.org/TR/css-color-4/#named-colors
declare const namedColors: Record<string, Color>;
export { calculations, conversions, utils, xyz, namedColors };
export type { Color };
