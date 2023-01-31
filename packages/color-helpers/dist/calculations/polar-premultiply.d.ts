/**
 * Given a color in a cylindical polar colorspace and an alpha value
 * return the premultiplied form. The index says which entry in the
 * color array corresponds to hue angle for example, in OKLCH it
 * would be 2 while in HSL it would be 0
 *
 * @param color
 * @param alpha
 * @param hueIndex
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export declare function polarPremultiply(color: Color, alpha: number, hueIndex: number): Color;
