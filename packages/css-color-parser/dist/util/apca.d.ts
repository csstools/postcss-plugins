/** @preserve
/////    SAPC APCA - Advanced Perceptual Contrast Algorithm
/////           Beta 0.1.9 W3 • contrast function only
/////           DIST: W3 • Revision date: July 3, 2022
/////    Function to parse color values and determine Lc contrast
/////    Copyright © 2019-2022 by Andrew Somers. All Rights Reserved.
/////    LICENSE: W3 LICENSE
/////    CONTACT: Please use the ISSUES or DISCUSSIONS tab at:
/////    https://github.com/Myndex/SAPC-APCA/
/////
// */
import type { Color } from '@csstools/color-helpers';
export declare function apca_contrast(txtY: number, bgY: number): number;
export declare function apca_sRGBtoY(rgb?: Color): number;
export declare function apca_displayP3toY(rgb?: Color): number;
export declare function apca_adobeRGBtoY(rgb?: Color): number;
