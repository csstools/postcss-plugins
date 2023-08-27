/* eslint-disable @typescript-eslint/no-loss-of-precision */
// https://github.com/Myndex/apca-w3/blob/0216410d119f4c99a61f144d9cd42e3962bb84bc/src/apca-w3.js
///////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////

import type { Color } from '@csstools/color-helpers';

////////////////////////////////////////////////////////////////////////////////
/////
/////                  SAPC Method and APCA Algorithm
/////   W3 Licensed Version: https://github.com/Myndex/apca-w3
/////   GITHUB MAIN REPO: https://github.com/Myndex/SAPC-APCA
/////   DEVELOPER SITE: https://git.myndex.com/
/////
/////   Acknowledgments and Thanks To:
/////   • This project references the research & work of M.Fairchild, R.W.Hunt,
/////     Drs. Bailey/Lovie-Kitchin, G.Legge, A.Arditi, M.Stone, C.Poynton,
/////     L.Arend, M.Luo, E.Burns, R.Blackwell, P.Barton, M.Brettel, and many
/////     others — see refs at https://www.myndex.com/WEB/WCAG_CE17polarity
/////   • Bruce Bailey of USAccessBoard for his encouragement, ideas, & feedback
/////   • Chris Lilly of W3C for continued review, examination, & oversight
/////   • Chris Loiselle of Oracle for getting us back on track in a pandemic
/////   • The many volunteer test subjects for participating in the studies.
/////   • The many early adopters, beta testers, and code/issue contributors
/////   • Principal research conducted at Myndex by A.Somers.
/////
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
/////
/////   *****  SAPC BLOCK  *****
/////
/////   For Evaluations, refer to this as: SAPC-8, 0.0.98G-series constant 4g
/////            SAPC • S-LUV Advanced Predictive Color
/////
/////   SIMPLE VERSION — Only the basic APCA contrast predictor.
/////
/////   Included Extensions & Model Features in this file:
/////       • SAPC-8 Core Contrast (Base APCA, non-clinical use only)
/////       • G series constants, group "G-4g" using a 2.4 monitor exponent
/////       • sRGB to Y, parses numeric sRGB color to luminance
/////       • SoftToe black level soft clamp and flare compensation.
/////
/////
////////////////////////////////////////////////////////////////////////////////
/////
/////               DISCLAIMER AND LIMITATIONS OF USE
/////     APCA is an embodiment of certain suprathreshold contrast
/////     prediction technologies and it is licensed to the W3 on a
/////     limited basis for use in certain specific accessibility
/////     guidelines for web content only. APCA may be used for
/////     predicting colors for web content use without royalty.
/////
/////     However, Any such license excludes other use cases
/////     not related to web content. Prohibited uses include
/////     medical, clinical evaluation, human safety related,
/////     aerospace, transportation, military applications,
/////     and uses which are not specific to web based content
/////     presented on self-illuminated displays or devices.
/////
////////////////////////////////////////////////////////////////////////////////

//////////   APCA 0.1.9  G 4g USAGE  ///////////////////////////////////////////
///
///  The API for "APCA 0.1.9" is trivially simple.
///  Send text and background sRGB numeric values to the sRGBtoY() function,
///  and send the resulting text-Y and background-Y to the APCAcontrast function
///  it returns a signed float with the numeric Lc contrast result.
///
///  The two inputs are TEXT color and BACKGROUND color in that order.
///  Each must be a numeric NOT a string, as this simple version has
///  no string parsing utilities. EXAMPLE:
///  ________________________________________________________________________
///
///     txtColor = colorParsley(0x123456); // color of the text
///     bgColor  = colorParsley(0xabcdef); // color for the background
///
///     contrastLc = APCAcontrast( sRGBtoY(txtColor) , sRGBtoY(bgColor) );
///  ________________________________________________________________________
///
///                  **********   QUICK START   **********
///
///  Each color must be a 24bit color (8 bit per channel) as a single integer
///  (or 0x) sRGB encoded color, i.e. White is either the integer 16777216 or
///  the hex 0xffffff. A float is returned with a positive or negative value.
///  Negative values mean light text and a dark background, positive values
///  mean dark text and a light background. 60.0, or -60.0 is a contrast
///  "sort of like" the old WCAG 2's 4.5:1. NOTE: the total range is now less
///  than ± 110, so output can be rounded to a signed INT but DO NOT output
///  an absolute value - light text on dark BG should return a negative number.
///
///     *****  IMPORTANT: Do Not Mix Up Text and Background inputs.  *****
///     ****************   APCA is polarity sensitive!   *****************
///
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
/////    BEGIN APCA  0.1.9  BLOCK       \/////////////////////////////////////
////                                     \///////////////////////////////////
///                                       \/////////////////////////////////
//                                         \///////////////////////////////



/////  Module Scope Object Containing Constants  /////
/////   APCA   0.0.98G - 4g - W3 Compatible Constants

/////  𝒦 SA98G  ///////////////////////////////////
const SA98G = {

	mainTRC: 2.4, // 2.4 exponent for emulating actual monitor perception

	// For reverseAPCA
	get mainTRCencode() {
		return 1 / this.mainTRC;
	},

	// sRGB coefficients
	sRco: 0.2126729,
	sGco: 0.7151522,
	sBco: 0.0721750,

	// G-4g constants for use with 2.4 exponent
	normBG: 0.56,
	normTXT: 0.57,
	revTXT: 0.62,
	revBG: 0.65,

	// G-4g Clamps and Scalers
	blkThrs: 0.022,
	blkClmp: 1.414,
	scaleBoW: 1.14,
	scaleWoB: 1.14,
	loBoWoffset: 0.027,
	loWoBoffset: 0.027,
	deltaYmin: 0.0005,
	loClip: 0.1,

	///// MAGIC NUMBERS for UNCLAMP, for use with 0.022 & 1.414 /////
	// Magic Numbers for reverseAPCA
	mFactor: 1.94685544331710,
	get mFactInv() {
		return 1 / this.mFactor;
	},
	mOffsetIn: 0.03873938165714010,
	mExpAdj: 0.2833433964208690,
	get mExp() {
		return this.mExpAdj / this.blkClmp;
	},
	mOffsetOut: 0.3128657958707580,
};


//////////////////////////////////////////////////////////////////////////////
//////////  APCA CALCULATION FUNCTIONS \/////////////////////////////////////

//////////  ƒ  APCAcontrast()  ////////////////////////////////////////////
export function apca_contrast(txtY: number, bgY: number): number {
	// send linear Y (luminance) for text and background.
	// txtY and bgY must be between 0.0-1.0
	// IMPORTANT: Do not swap, polarity is important.

	const icp = [0.0, 1.1];     // input range clamp / input error check

	if (isNaN(txtY) || isNaN(bgY) || Math.min(txtY, bgY) < icp[0] ||
		Math.max(txtY, bgY) > icp[1]) {
		return 0.0;  // return zero on error
		// return 'error'; // optional string return for error
	}

	//////////   SAPC LOCAL VARS   /////////////////////////////////////////

	let SAPC = 0.0;            // For raw SAPC values
	let outputContrast = 0.0; // For weighted final values

	// TUTORIAL

	// Use Y for text and BG, and soft clamp black,
	// return 0 for very close luminances, determine
	// polarity, and calculate SAPC raw contrast
	// Then scale for easy to remember levels.

	// Note that reverse contrast (white text on black)
	// intentionally returns a negative number
	// Proper polarity is important!

	//////////   BLACK SOFT CLAMP   ////////////////////////////////////////

	// Soft clamps Y for either color if it is near black.
	txtY = (txtY > SA98G.blkThrs) ? txtY :
		txtY + Math.pow(SA98G.blkThrs - txtY, SA98G.blkClmp);
	bgY = (bgY > SA98G.blkThrs) ? bgY :
		bgY + Math.pow(SA98G.blkThrs - bgY, SA98G.blkClmp);

	///// Return 0 Early for extremely low ∆Y
	if (Math.abs(bgY - txtY) < SA98G.deltaYmin) {
		return 0.0;
	}


	//////////   APCA/SAPC CONTRAST - LOW CLIP (W3 LICENSE)  ///////////////

	if (bgY > txtY) {  // For normal polarity, black text on white (BoW)

		// Calculate the SAPC contrast value and scale
		SAPC = (Math.pow(bgY, SA98G.normBG) -
			Math.pow(txtY, SA98G.normTXT)) * SA98G.scaleBoW;

		// Low Contrast smooth rollout to prevent polarity reversal
		// and also a low-clip for very low contrasts
		outputContrast = (SAPC < SA98G.loClip) ? 0.0 : SAPC - SA98G.loBoWoffset;

	} else {  // For reverse polarity, light text on dark (WoB)
		// WoB should always return negative value.

		SAPC = (Math.pow(bgY, SA98G.revBG) -
			Math.pow(txtY, SA98G.revTXT)) * SA98G.scaleWoB;

		outputContrast = (SAPC > -SA98G.loClip) ? 0.0 : SAPC + SA98G.loWoBoffset;
	}

	return outputContrast * 100.0;
} // End APCAcontrast()


//////////////////////////////////////////////////////////////////////////////
//////////  LUMINANCE CONVERTERS  |//////////////////////////////////////////


//////////  ƒ  sRGBtoY()  //////////////////////////////////////////////////
export function apca_sRGBtoY(rgb: Color = [0, 0, 0]): number { // send sRGB 8bpc (0xFFFFFF) or string

	// NOTE: Currently expects 0-1

	/////   APCA   0.0.98G - 4g - W3 Compatible Constants   ////////////////////
	/*
	const mainTRC = 2.4; // 2.4 exponent emulates actual monitor perception

	const sRco = 0.2126729,
				sGco = 0.7151522,
				sBco = 0.0721750; // sRGB coefficients
				*/
	// Future:
	// 0.2126478133913640	0.7151791475336150	0.0721730390750208
	// Derived from:
	// xW	yW	K	xR	yR	xG	yG	xB	yB
	// 0.312720	0.329030	6504	0.640	0.330	0.300	0.600	0.150	0.060

	// linearize r, g, or b then apply coefficients
	// and sum then return the resulting luminance

	function simpleExp(chan: number) {
		return Math.pow(chan, SA98G.mainTRC);
	}

	return SA98G.sRco * simpleExp(rgb[0]) +
		SA98G.sGco * simpleExp(rgb[1]) +
		SA98G.sBco * simpleExp(rgb[2]);

} // End sRGBtoY()


//////////  ƒ  displayP3toY()  /////////////////////////////////////////////
export function apca_displayP3toY(rgb: Color = [0, 0, 0]): number { // send rgba array

	// NOTE: Currently Apple has the tuple as 0.0 to 1.0, NOT 255

	/////   APCA   0.0.98G - 4g - W3 Compatible Constants   ////////////////////

	const mainTRC = 2.4; // 2.4 exponent emulates actual monitor perception
	// Pending evaluation, because, Apple...

	const sRco = 0.2289829594805780,
		sGco = 0.6917492625852380,
		sBco = 0.0792677779341829; // displayP3 coefficients

	// Derived from:
	// xW	yW	K	xR	yR	xG	yG	xB	yB
	// 0.312720	0.329030	6504	0.680	0.320	0.265	0.690	0.150	0.060

	// linearize r, g, or b then apply coefficients
	// and sum then return the resulting luminance

	function simpleExp(chan: number) {
		return Math.pow(chan, mainTRC);
	}

	return sRco * simpleExp(rgb[0]) +
		sGco * simpleExp(rgb[1]) +
		sBco * simpleExp(rgb[2]);

} // End displayP3toY()


//////////  ƒ  adobeRGBtoY()  /////////////////////////////////////////////
export function apca_adobeRGBtoY(rgb: Color = [0, 0, 0]): number { // send rgba array

	// NOTE: Currently expects 0-1

	/////   APCA   0.0.98G - 4g - W3 Compatible Constants   ////////////////////

	const mainTRC = 2.35; // 2.35 exponent emulates actual monitor perception
	// Pending evaluation...

	const sRco = 0.2973550227113810,
		sGco = 0.6273727497145280,
		sBco = 0.0752722275740913; // adobeRGB coefficients

	// Derived from:
	// xW	yW	K	xR	yR	xG	yG	xB	yB
	// 0.312720	0.329030	6504	0.640	0.330	0.210	0.710	0.150	0.060

	// linearize r, g, or b then apply coefficients
	// and sum then return the resulting luminance

	function simpleExp(chan: number) {
		return Math.pow(chan, mainTRC);
	}

	return sRco * simpleExp(rgb[0]) +
		sGco * simpleExp(rgb[1]) +
		sBco * simpleExp(rgb[2]);

} // End displayP3toY()

//\                                     ////////////////////////////////////////
///\                                   ////////////////////////////////////////
////\                                 ////////////////////////////////////////
/////\  END APCA 0.1.9  G-4g  BLOCK  ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
