/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/map-gamut.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
function clip(_){return _.map((_=>_<0?0:_>1?1:_))}
/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js
 */function OKLCH_to_OKLab(_){return[_[0],_[1]*Math.cos(_[2]*Math.PI/180),_[1]*Math.sin(_[2]*Math.PI/180)]}
/**
 * @description Calculate deltaE OK which is the simple root sum of squares
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/deltaEOK.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/deltaEOK.js
 */function deltaEOK(_,t){const[o,n,a]=_,[i,l,r]=t,u=o-i,s=n-l,L=a-r;return Math.sqrt(u**2+s**2+L**2)}
/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/map-gamut.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function binarySearchGamut(_,t,o){let n=0,a=_[1];const i=_;for(;a-n>1e-4;){const _=clip(t(i));deltaEOK(OKLCH_to_OKLab(i),OKLCH_to_OKLab(o(_)))-.02<1e-4?n=i[1]:a=i[1],i[1]=(a+n)/2}return clip(t([...i]))}
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
/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/map-gamut.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
function mapGamut(_,t,o){return binarySearchGamut(_,t,o)}
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
 */function multiplyMatrices(_,t){const o=_.length;let n,a;n=Array.isArray(_[0])?_:[_],Array.isArray(t[0])||(a=t.map((_=>[_])));const i=a[0].length,l=a[0].map(((_,t)=>a.map((_=>_[t]))));let r=n.map((_=>l.map((t=>Array.isArray(_)?_.reduce(((_,o,n)=>_+o*(t[n]||0)),0):t.reduce(((t,o)=>t+o*_),0)))));return 1===o&&(r=r[0]),1===i?r.map((_=>_[0])):r}
/**
 * Convert an array of linear-light sRGB values to CIE XYZ
 * using sRGB's own white, D65 (no chromatic adaptation)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function lin_sRGB_to_XYZ(_){return multiplyMatrices([[.41239079926595934,.357584339383878,.1804807884018343],[.21263900587151027,.715168678767756,.07219231536073371],[.01933081871559182,.11919477979462598,.9505321522496607]],_)}
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
 */function lin_sRGB(_){return _.map((function(_){const t=_<0?-1:1,o=Math.abs(_);return o<.04045?_/12.92:t*Math.pow((o+.055)/1.055,2.4)}))}
/**
 * Convert an array of gamma-corrected sRGB values in the 0.0 to 1.0 range
 * to linear-light sRGB, then to CIE XYZ and return luminance (the Y value)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
 */function sRGB_to_luminance(_){return lin_sRGB_to_XYZ(lin_sRGB(_))[1]}
/**
 * Return WCAG 2.1 contrast ratio for two sRGB values given as arrays
 *
 * of 0.0 to 1.0
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
 * @see https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */var _=Object.freeze({__proto__:null,binarySearchGamut:binarySearchGamut,contrast:function contrast(_,t){const o=sRGB_to_luminance(_),n=sRGB_to_luminance(t);return o>n?(o+.05)/(n+.05):(n+.05)/(o+.05)},deltaEOK:deltaEOK,mapGamut:mapGamut,multiplyMatrices:multiplyMatrices,polarPremultiply:function polarPremultiply(_,t,o){return _.map(((_,n)=>_*(o===n?1:t)))}});
/**
 * Convert an array of a98-rgb values in the range 0.0 - 1.0
 * to linear light (un-companded) form. Negative values are also now accepted
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function lin_a98rgb(_){return _.map((function(_){const t=_<0?-1:1,o=Math.abs(_);return t*Math.pow(o,563/256)}))}
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
 */function lin_a98rgb_to_XYZ(_){return multiplyMatrices([[.5766690429101305,.1855582379065463,.1882286462349947],[.29734497525053605,.6273635662554661,.07529145849399788],[.02703136138641234,.07068885253582723,.9913375368376388]],_)}
/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * XYZ <-> LMS matrices recalculated for consistent reference white
 * @see https://github.com/w3c/csswg-drafts/issues/6642#issuecomment-943521484
 */function XYZ_to_OKLab(_){const t=multiplyMatrices([[.8190224432164319,.3619062562801221,-.12887378261216414],[.0329836671980271,.9292868468965546,.03614466816999844],[.048177199566046255,.26423952494422764,.6335478258136937]],_);return multiplyMatrices([[.2104542553,.793617785,-.0040720468],[1.9779984951,-2.428592205,.4505937099],[.0259040371,.7827717662,-.808675766]],t.map((_=>Math.cbrt(_))))}
/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js
 */function OKLab_to_OKLCH(_){const t=180*Math.atan2(_[2],_[1])/Math.PI;return[_[0],Math.sqrt(_[1]**2+_[2]**2),t>=0?t:t+360]}
/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function XYZ_to_lin_sRGB(_){return multiplyMatrices([[3.2409699419045226,-1.537383177570094,-.4986107602930034],[-.9692436362808796,1.8759675015077202,.04155505740717559],[.05563007969699366,-.20397695888897652,1.0569715142428786]],_)}
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
 */function gam_sRGB(_){return _.map((function(_){const t=_<0?-1:1,o=Math.abs(_);return o>.0031308?t*(1.055*Math.pow(o,1/2.4)-.055):12.92*_}))}
/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/map-gamut.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function inGamut(_){const[t,o,n]=_;return t>=-1e-4&&t<=1.0001&&o>=-1e-4&&o<=1.0001&&n>=-1e-4&&n<=1.0001}
/**
 * Given OKLab, convert to XYZ relative to D65
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js
 */function OKLab_to_XYZ(_){const t=multiplyMatrices([[.9999999984505198,.39633779217376786,.2158037580607588],[1.0000000088817609,-.10556134232365635,-.06385417477170591],[1.0000000546724108,-.08948418209496575,-1.2914855378640917]],_);return multiplyMatrices([[1.2268798733741557,-.5578149965554813,.28139105017721583],[-.04057576262431372,1.1122868293970594,-.07171106666151701],[-.07637294974672142,-.4214933239627914,1.5869240244272418]],t.map((_=>_**3)))}
/**
 * Bradford chromatic adaptation from D50 to D65
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
function D50_to_D65(_){return multiplyMatrices([[.9554734527042182,-.023098536874261423,.0632593086610217],[-.028369706963208136,1.0099954580058226,.021041398966943008],[.012314001688319899,-.020507696433477912,1.3303659366080753]],_)}const t=[.3457/.3585,1,.2958/.3585];
/**
 * Bradford chromatic adaptation from D65 to D50
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html
 */
function D65_to_D50(_){return multiplyMatrices([[1.0479298208405488,.022946793341019088,-.05019222954313557],[.029627815688159344,.990434484573249,-.01707382502938514],[-.009243058152591178,.015055144896577895,.7518742899580008]],_)}
/**
 * Convert an array of linear-light rec2020 RGB  in the range 0.0-1.0
 * to gamma corrected form ITU-R BT.2020-2 p.4
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function gam_2020(_){const t=1.09929682680944;return _.map((function(_){const o=_<0?-1:1,n=Math.abs(_);return n>.018053968510807?o*(t*Math.pow(n,.45)-(t-1)):4.5*_}))}
/**
 * Convert an array of linear-light a98-rgb in the range 0.0-1.0
 * to gamma corrected form. Negative values are also now accepted
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
/**
 * Convert an array of linear-light display-p3 RGB in the range 0.0-1.0
 * to gamma corrected form
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
function gam_P3(_){return gam_sRGB(_)}
/**
 * Convert an array of linear-light prophoto-rgb in the range 0.0-1.0
 * to gamma corrected form.
 * Transfer curve is gamma 1.8 with a small linear portion.
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
 */
function hueToRGB(_,t,o){return o<0&&(o+=6),o>=6&&(o-=6),o<1?(t-_)*o+_:o<3?t:o<4?(t-_)*(4-o)+_:_}
/**
 * For simplicity, this algorithm assumes that the hue has been normalized to a
 * number in the half-open range [0, 6), and the saturation and lightness have
 * been normalized to the range [0, 1]. It returns an array of three numbers
 * representing the red, green, and blue channels of the colors, normalized
 * to the range [0, 1]
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
 */
/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
function Lab_to_LCH(_){const t=180*Math.atan2(_[2],_[1])/Math.PI;return[_[0],Math.sqrt(Math.pow(_[1],2)+Math.pow(_[2],2)),t>=0?t:t+360]}
/**
 * Convert Lab to D50-adapted XYZ
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 */function Lab_to_XYZ(_){const o=24389/27,n=216/24389,a=[];a[1]=(_[0]+16)/116,a[0]=_[1]/500+a[1],a[2]=a[1]-_[2]/200;return[Math.pow(a[0],3)>n?Math.pow(a[0],3):(116*a[0]-16)/o,_[0]>8?Math.pow((_[0]+16)/116,3):_[0]/o,Math.pow(a[2],3)>n?Math.pow(a[2],3):(116*a[2]-16)/o].map(((_,o)=>_*t[o]))}
/**
 * Convert XYZ to linear-light P3
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function XYZ_to_lin_P3(_){return multiplyMatrices([[2.493496911941425,-.9313836179191239,-.40271078445071684],[-.8294889695615747,1.7626640603183463,.023624685841943577],[.03584583024378447,-.07617238926804182,.9568845240076872]],_)}
/**
 * Convert an array of display-p3 RGB values in the range 0.0 - 1.0
 * to linear light (un-companded) form.
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function lin_P3(_){return lin_sRGB(_)}
/**
 * Convert an array of linear-light display-p3 values to CIE XYZ
 * using D65 (no chromatic adaptation)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 */function lin_P3_to_XYZ(_){return multiplyMatrices([[.4865709486482162,.26566769316909306,.1982172852343625],[.2289745640697488,.6917385218365064,.079286914093745],[0,.04511338185890264,1.043944368900976]],_)}
/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
function LCH_to_Lab(_){return[_[0],_[1]*Math.cos(_[2]*Math.PI/180),_[1]*Math.sin(_[2]*Math.PI/180)]}
/**
 * Convert XYZ to linear-light rec2020
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
function XYZ_to_lin_2020(_){return multiplyMatrices([[1.7166511879712674,-.35567078377639233,-.25336628137365974],[-.6666843518324892,1.6164812366349395,.01576854581391113],[.017639857445310783,-.042770613257808524,.9421031212354738]],_)}
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
/**
 * Convert an array of rec2020 RGB values in the range 0.0 - 1.0
 * to linear light (un-companded) form.
 * ITU-R BT.2020-2 p.4
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
function lin_2020(_){const t=1.09929682680944;return _.map((function(_){const o=_<0?-1:1,n=Math.abs(_);return n<.08124285829863151?_/4.5:o*Math.pow((n+t-1)/t,1/.45)}))}
/**
 * Convert an array of linear-light rec2020 values to CIE XYZ
 * using  D65 (no chromatic adaptation)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 */function lin_2020_to_XYZ(_){return multiplyMatrices([[.6369580483012914,.14461690358620832,.1688809751641721],[.2627002120112671,.6779980715188708,.05930171646986196],[0,.028072693049087428,1.060985057710791]],_)}
/**
 * Convert an array of prophoto-rgb values where in-gamut Colors are in the
 * range [0.0 - 1.0] to linear light (un-companded) form. Transfer curve is
 * gamma 1.8 with a small linear portion. Extended transfer function
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function lin_ProPhoto(_){return _.map((function(_){const t=_<0?-1:1;return Math.abs(_)<=.03125?_/16:t*Math.pow(_,1.8)}))}
/**
 * Convert an array of linear-light prophoto-rgb values to CIE XYZ
 * using D50 (so no chromatic adaptation needed afterwards)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 */function lin_ProPhoto_to_XYZ(_){return multiplyMatrices([[.7977604896723027,.13518583717574031,.0313493495815248],[.2880711282292934,.7118432178101014,8565396060525902e-20],[0,0,.8251046025104601]],_)}
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
/**
 * Assuming XYZ is relative to D50, convert to CIE Lab
 * from CIE standard, which now defines these as a rational fraction
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
function XYZ_to_Lab(_){const o=_.map(((_,o)=>_/t[o])).map((_=>_>.008856451679035631?Math.cbrt(_):(903.2962962962963*_+16)/116));return[116*o[1]-16,500*(o[0]-o[1]),200*(o[1]-o[2])]}
/**
 * Convert an array of gamma-corrected display-p3 values in the 0.0 to 1.0
 * range to linear-light display-p3, then to CIE XYZ, then adapt from D65
 * to D50, then convert XYZ to CIE Lab and finally, convert to CIE LCH
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
 */var o=Object.freeze({__proto__:null,D50:t,D50_to_D65:D50_to_D65,D65:[.3127/.329,1,.3583/.329],D65_to_D50:D65_to_D50,HSLToRGB:function HSLToRGB(_){const[t,o,n]=_;let a;a=n<=.5?n*(o+1):n+o-n*o;const i=2*n-a;return[hueToRGB(i,a,t+2),hueToRGB(i,a,t),hueToRGB(i,a,t-2)]},LCH_to_Lab:LCH_to_Lab,LCH_to_P3:function LCH_to_P3(_){const[t,o,n]=_;let a=[Math.max(t,0),o,n%360];a=LCH_to_Lab(a),a=Lab_to_XYZ(a);let i=a.slice();return i=D50_to_D65(i),i=XYZ_to_OKLab(i),i=OKLab_to_OKLCH(i),i[0]<1e-6&&(i=[0,0,0]),i[0]>.999999&&(i=[1,0,0]),a=D50_to_D65(a),a=XYZ_to_lin_P3(a),a=gam_P3(a),inGamut(a)?[clip(a),!0]:[mapGamut(i,(_=>gam_P3(_=XYZ_to_lin_P3(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_P3_to_XYZ(_=lin_P3(_)))))),!1]},LCH_to_rec2020:function LCH_to_rec2020(_){return gam_2020(XYZ_to_lin_2020(D50_to_D65(Lab_to_XYZ(LCH_to_Lab(_)))))},LCH_to_sRGB:function LCH_to_sRGB(_){const[t,o,n]=_;let a=[Math.max(t,0),o,n%360];a=LCH_to_Lab(a),a=Lab_to_XYZ(a);let i=a.slice();return i=D50_to_D65(i),i=XYZ_to_OKLab(i),i=OKLab_to_OKLCH(i),i[0]<1e-6&&(i=[0,0,0]),i[0]>.999999&&(i=[1,0,0]),a=D50_to_D65(a),a=XYZ_to_lin_sRGB(a),a=gam_sRGB(a),inGamut(a)?clip(a).map((_=>Math.round(255*_))):mapGamut(i,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_)))))).map((_=>Math.round(255*_)))},Lab_to_LCH:Lab_to_LCH,Lab_to_P3:function Lab_to_P3(_){const[t,o,n]=_;let a=[Math.max(t,0),Math.min(Math.max(o,-160),160),Math.min(Math.max(n,-160),160)];a=Lab_to_XYZ(a);let i=a.slice();return i=D50_to_D65(i),i=XYZ_to_OKLab(i),i=OKLab_to_OKLCH(i),i[0]<1e-6&&(i=[0,0,0]),i[0]>.999999&&(i=[1,0,0]),a=D50_to_D65(a),a=XYZ_to_lin_P3(a),a=gam_P3(a),inGamut(a)?[clip(a),!0]:[mapGamut(i,(_=>gam_P3(_=XYZ_to_lin_P3(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_P3_to_XYZ(_=lin_P3(_)))))),!1]},Lab_to_XYZ:Lab_to_XYZ,Lab_to_sRGB:function Lab_to_sRGB(_){const[t,o,n]=_;let a=[Math.max(t,0),Math.min(Math.max(o,-160),160),Math.min(Math.max(n,-160),160)];a=Lab_to_XYZ(a);let i=a.slice();return i=D50_to_D65(i),i=XYZ_to_OKLab(i),i=OKLab_to_OKLCH(i),i[0]<1e-6&&(i=[0,0,0]),i[0]>.999999&&(i=[1,0,0]),a=D50_to_D65(a),a=XYZ_to_lin_sRGB(a),a=gam_sRGB(a),inGamut(a)?clip(a).map((_=>Math.round(255*_))):mapGamut(i,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_)))))).map((_=>Math.round(255*_)))},OKLCH_to_OKLab:OKLCH_to_OKLab,OKLCH_to_P3:function OKLCH_to_P3(_){const[t,o,n]=_,a=[Math.max(t,0),o,n%360];let i=a;return i[0]<1e-6&&(i=[0,0,0]),i[0]>.999999&&(i=[1,0,0]),i=OKLCH_to_OKLab(i),i=OKLab_to_XYZ(i),i=XYZ_to_lin_P3(i),i=gam_P3(i),inGamut(i)?[clip(i),!0]:[mapGamut(a,(_=>gam_P3(_=XYZ_to_lin_P3(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_P3_to_XYZ(_=lin_P3(_)))))),!1]},OKLCH_to_sRGB:function OKLCH_to_sRGB(_){const[t,o,n]=_,a=[Math.max(t,0),o,n%360];let i=a;return i[0]<1e-6&&(i=[0,0,0]),i[0]>.999999&&(i=[1,0,0]),i=OKLCH_to_OKLab(i),i=OKLab_to_XYZ(i),i=XYZ_to_lin_sRGB(i),i=gam_sRGB(i),inGamut(i)?clip(i).map((_=>Math.round(255*_))):mapGamut(a,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_)))))).map((_=>Math.round(255*_)))},OKLab_to_OKLCH:OKLab_to_OKLCH,OKLab_to_P3:function OKLab_to_P3(_){const[t,o,n]=_;let a=[Math.max(t,0),o,n],i=OKLab_to_OKLCH(a);return i[0]<1e-6&&(i=[0,0,0]),i[0]>.999999&&(i=[1,0,0]),a=OKLab_to_XYZ(a),a=XYZ_to_lin_P3(a),a=gam_P3(a),inGamut(a)?[clip(a),!0]:[mapGamut(i,(_=>gam_P3(_=XYZ_to_lin_P3(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_P3_to_XYZ(_=lin_P3(_)))))),!1]},OKLab_to_XYZ:OKLab_to_XYZ,OKLab_to_sRGB:function OKLab_to_sRGB(_){const[t,o,n]=_;let a=[Math.max(t,0),o,n],i=OKLab_to_OKLCH(a);return i[0]<1e-6&&(i=[0,0,0]),i[0]>.999999&&(i=[1,0,0]),a=OKLab_to_XYZ(a),a=XYZ_to_lin_sRGB(a),a=gam_sRGB(a),inGamut(a)?clip(a).map((_=>Math.round(255*_))):mapGamut(i,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_)))))).map((_=>Math.round(255*_)))},P3_to_LCH:function P3_to_LCH(_){return Lab_to_LCH(XYZ_to_Lab(D65_to_D50(lin_P3_to_XYZ(lin_P3(_)))))},XYZ_to_Lab:XYZ_to_Lab,XYZ_to_OKLab:XYZ_to_OKLab,XYZ_to_lin_2020:XYZ_to_lin_2020,XYZ_to_lin_P3:XYZ_to_lin_P3,XYZ_to_lin_ProPhoto:
/**
 * Convert XYZ to linear-light prophoto-rgb
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 */
function XYZ_to_lin_ProPhoto(_){return multiplyMatrices([[1.3457989731028281,-.25558010007997534,-.05110628506753401],[-.5446224939028347,1.5082327413132781,.02053603239147973],[0,0,1.2119675456389454]],_)}
/**
 * Convert an array of three XYZ values to u*,v* chromaticity coordinates
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
 */,XYZ_to_lin_a98rgb:
/**
 * Convert XYZ to linear-light a98-rgb
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
function XYZ_to_lin_a98rgb(_){return multiplyMatrices([[2.0415879038107465,-.5650069742788596,-.34473135077832956],[-.9692436362808795,1.8759675015077202,.04155505740717557],[.013444280632031142,-.11836239223101838,1.0151749943912054]],_)},XYZ_to_lin_sRGB:XYZ_to_lin_sRGB,XYZ_to_uv:function XYZ_to_uv(_){const t=_[0],o=_[1],n=t+15*o+3*_[2];return[4*t/n,9*o/n]}
/**
 * Convert an array of three XYZ values to x,y chromaticity coordinates
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
 */,XYZ_to_xy:function XYZ_to_xy(_){const t=_[0],o=_[1],n=t+o+_[2];return[t/n,o/n]},a98_RGB_to_sRGB:function a98_RGB_to_sRGB(_){let t=_.slice();t=lin_a98rgb(t),t=lin_a98rgb_to_XYZ(t);let o=t.slice();return o=XYZ_to_OKLab(o),o=OKLab_to_OKLCH(o),o[0]<1e-6&&(o=[0,0,0]),o[0]>.999999&&(o=[1,0,0]),t=XYZ_to_lin_sRGB(t),t=gam_sRGB(t),inGamut(t)?clip(t):mapGamut(o,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_))))))},cie_XYZ_50_to_sRGB:function cie_XYZ_50_to_sRGB(_){let t=_.slice();t=D50_to_D65(t);let o=t.slice();return o=XYZ_to_OKLab(o),o=OKLab_to_OKLCH(o),o[0]<1e-6&&(o=[0,0,0]),o[0]>.999999&&(o=[1,0,0]),t=XYZ_to_lin_sRGB(t),t=gam_sRGB(t),inGamut(t)?clip(t):mapGamut(o,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_))))))},cie_XYZ_65_to_sRGB:function cie_XYZ_65_to_sRGB(_){let t=_.slice(),o=t.slice();return o=XYZ_to_OKLab(o),o=OKLab_to_OKLCH(o),o[0]<1e-6&&(o=[0,0,0]),o[0]>.999999&&(o=[1,0,0]),t=XYZ_to_lin_sRGB(t),t=gam_sRGB(t),inGamut(t)?clip(t):mapGamut(o,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_))))))},gam_2020:gam_2020,gam_P3:gam_P3,gam_ProPhoto:function gam_ProPhoto(_){return _.map((function(_){const t=_<0?-1:1,o=Math.abs(_);return o>=.001953125?t*Math.pow(o,1/1.8):16*_}))},gam_a98rgb:function gam_a98rgb(_){return _.map((function(_){const t=_<0?-1:1,o=Math.abs(_);return t*Math.pow(o,256/563)}))},gam_sRGB:gam_sRGB,hueToRGB:hueToRGB,lin_2020:lin_2020,lin_2020_to_XYZ:lin_2020_to_XYZ,lin_P3:lin_P3,lin_P3_to_XYZ:lin_P3_to_XYZ,lin_ProPhoto:lin_ProPhoto,lin_ProPhoto_to_XYZ:lin_ProPhoto_to_XYZ,lin_a98rgb:lin_a98rgb,lin_a98rgb_to_XYZ:lin_a98rgb_to_XYZ,lin_sRGB:lin_sRGB,lin_sRGB_to_XYZ:lin_sRGB_to_XYZ,naive_CMYK_to_sRGB:function naive_CMYK_to_sRGB(_){const t=_[0],o=_[1],n=_[2],a=_[3];return[1-Math.min(1,t*(1-a)+a),1-Math.min(1,o*(1-a)+a),1-Math.min(1,n*(1-a)+a)]},p3_to_sRGB:function p3_to_sRGB(_){let t=_.slice();t=lin_P3(t),t=lin_P3_to_XYZ(t);let o=t.slice();return o=XYZ_to_OKLab(o),o=OKLab_to_OKLCH(o),o[0]<1e-6&&(o=[0,0,0]),o[0]>.999999&&(o=[1,0,0]),t=XYZ_to_lin_sRGB(t),t=gam_sRGB(t),inGamut(t)?clip(t):mapGamut(o,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_))))))},proPhoto_RGB_to_sRGB:function proPhoto_RGB_to_sRGB(_){let t=_.slice();t=lin_ProPhoto(t),t=lin_ProPhoto_to_XYZ(t),t=D50_to_D65(t);let o=t.slice();return o=XYZ_to_OKLab(o),o=OKLab_to_OKLCH(o),o[0]<1e-6&&(o=[0,0,0]),o[0]>.999999&&(o=[1,0,0]),t=XYZ_to_lin_sRGB(t),t=gam_sRGB(t),inGamut(t)?clip(t):mapGamut(o,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_))))))}
/**
 * Convert an array of gamma-corrected rec.2020 values in the 0.0 to 1.0 range
 * to linear-light sRGB, then to CIE XYZ, then adapt from D65 to D50, then
 * convert XYZ to CIE Lab and finally, convert to CIE LCH
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
 */,rec_2020_to_LCH:function rec_2020_to_LCH(_){return Lab_to_LCH(XYZ_to_Lab(D65_to_D50(lin_2020_to_XYZ(lin_2020(_)))))},rec_2020_to_sRGB:function rec_2020_to_sRGB(_){let t=_.slice();t=lin_2020(t),t=lin_2020_to_XYZ(t);let o=t.slice();return o=XYZ_to_OKLab(o),o=OKLab_to_OKLCH(o),o[0]<1e-6&&(o=[0,0,0]),o[0]>.999999&&(o=[1,0,0]),t=XYZ_to_lin_sRGB(t),t=gam_sRGB(t),inGamut(t)?clip(t):mapGamut(o,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_))))))},sRGB_linear_to_sRGB:function sRGB_linear_to_sRGB(_){let t=_.slice();t=lin_sRGB_to_XYZ(t);let o=t.slice();return o=XYZ_to_OKLab(o),o=OKLab_to_OKLCH(o),o[0]<1e-6&&(o=[0,0,0]),o[0]>.999999&&(o=[1,0,0]),t=XYZ_to_lin_sRGB(t),t=gam_sRGB(t),inGamut(t)?clip(t):mapGamut(o,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_))))))}
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
 */,sRGB_to_LCH:function sRGB_to_LCH(_){return Lab_to_LCH(XYZ_to_Lab(D65_to_D50(lin_sRGB_to_XYZ(lin_sRGB(_)))))},sRGB_to_luminance:sRGB_to_luminance,sRGB_to_sRGB:function sRGB_to_sRGB(_){let t=_.slice();t=lin_sRGB(t),t=lin_sRGB_to_XYZ(t);let o=t.slice();return o=XYZ_to_OKLab(o),o=OKLab_to_OKLCH(o),o[0]<1e-6&&(o=[0,0,0]),o[0]>.999999&&(o=[1,0,0]),t=XYZ_to_lin_sRGB(t),t=gam_sRGB(t),inGamut(t)?clip(t):mapGamut(o,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_))))))}}),n=Object.freeze({__proto__:null,clip:clip,inGamut:inGamut});export{_ as calculations,o as conversions,n as utils};
