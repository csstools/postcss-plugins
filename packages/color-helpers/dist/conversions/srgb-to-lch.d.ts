/**
 * Convert an array of gamma-corrected sRGB values in the 0.0 to 1.0 range to
 * linear-light sRGB, then to CIE XYZ, then adapt from D65 to D50, then
 * convert XYZ to CIE Lab and finally, convert to CIE LCH
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
 */
export declare function sRGB_to_LCH(RGB: Color): Color;
