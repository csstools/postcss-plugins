export enum ColorNotation {
	/** Adobe 1999, expressed through `color(a98-rgb 0 0 0)` */
	A98_RGB = 'a98-rgb',
	/** Display P3, expressed through `color(display-p3 0 0 0)` */
	Display_P3 = 'display-p3',
	/** Display P3, expressed through `color(display-p3-linear 0 0 0)` */
	Linear_Display_P3 = 'display-p3-linear',
	/** Hex, expressed through `#000` */
	HEX = 'hex',
	/** HSL, expressed through `hsl(0 0% 0%)` */
	HSL = 'hsl',
	/** HWB, expressed through `hwb(0 0% 0%)` */
	HWB = 'hwb',
	/** LCH, expressed through `lch(0 0% 0deg)` */
	LCH = 'lch',
	/** Lab, expressed through `lab(0 0 0)` */
	Lab = 'lab',
	/** Linear sRGB, expressed through `color(linear-srgb 0 0 0)` */
	Linear_sRGB = 'srgb-linear',
	/** Oklch, expressed through `oklch(0 0% 0deg)` */
	OKLCH = 'oklch',
	/** Oklab, expressed through `oklab(0 0 0)` */
	OKLab = 'oklab',
	/** ProPhoto RGB, expressed through `color(prophoto-rgb 0 0 0)` */
	ProPhoto_RGB = 'prophoto-rgb',
	/** RGB, expressed through `rgb(0 0 0)` */
	RGB = 'rgb',
	/** sRGB, expressed through `color(srgb 0 0 0)` */
	sRGB = 'srgb',
	/** Rec. 2020, expressed through `color(rec2020 0 0 0)` */
	Rec2020 = 'rec2020',
	/** XYZ, expressed through `color(xyz-d50 0 0 0)` */
	XYZ_D50 = 'xyz-d50',
	/** XYZ, expressed through `color(xyz-d65 0 0 0)` */
	XYZ_D65 = 'xyz-d65',
}
