/**
 * Convert an array of CIE LCH values to CIE Lab, and then to XYZ, adapt from
 * D50 to D65, then convert XYZ to linear-light rec.2020 and finally to gamma
 * corrected rec.2020 for in-gamut colors, components are in the 0.0 to 1.0
 * range out of gamut colors may have negative components or components greater
 * than 1.0 so check for that :)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
 */
export declare function LCH_to_rec2020(LCH: Color): Color;
