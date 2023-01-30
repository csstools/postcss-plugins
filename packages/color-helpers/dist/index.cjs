"use strict";
/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/map-gamut.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function clip(_){return _.map((_=>_<0?0:_>1?1:_))}
/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js
 */function OKLCH_to_OKLab(_){return[_[0],_[1]*Math.cos(_[2]*Math.PI/180),_[1]*Math.sin(_[2]*Math.PI/180)]}
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
 */function deltaEOK(_,t){const[o,a,n]=_,[i,e,l]=t,r=o-i,s=a-e,u=n-l;return Math.sqrt(r**2+s**2+u**2)}function binarySearchGamut(_,t,o){let a=0,n=_[1];const i=_;for(;n-a>1e-4;){const _=clip(t(i));deltaEOK(OKLCH_to_OKLab(i),OKLCH_to_OKLab(o(_)))-.02<1e-4?a=i[1]:n=i[1],i[1]=(n+a)/2}return clip(t([...i]))}
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
 */function mapGamut(_,t,o){return binarySearchGamut(_,t,o)}
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
 */function multiplyMatrices(_,t){const o=_.length;let a,n;a=Array.isArray(_[0])?_:[_],Array.isArray(t[0])||(n=t.map((_=>[_])));const i=n[0].length,e=n[0].map(((_,t)=>n.map((_=>_[t]))));let l=a.map((_=>e.map((t=>Array.isArray(_)?_.reduce(((_,o,a)=>_+o*(t[a]||0)),0):t.reduce(((t,o)=>t+o*_),0)))));return 1===o&&(l=l[0]),1===i?l.map((_=>_[0])):l}
/**
 * Convert an array of linear-light sRGB values to CIE XYZ
 * using sRGB's own white, D65 (no chromatic adaptation)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function lin_sRGB_to_XYZ(_){return multiplyMatrices([[506752/1228815,87881/245763,12673/70218],[87098/409605,175762/245763,12673/175545],[7918/409605,87881/737289,1001167/1053270]],_)}
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
 */var _=Object.freeze({__proto__:null,binarySearchGamut:binarySearchGamut,contrast:function contrast(_,t){const o=sRGB_to_luminance(_),a=sRGB_to_luminance(t);return o>a?(o+.05)/(a+.05):(a+.05)/(o+.05)},deltaEOK:deltaEOK,mapGamut:mapGamut,multiplyMatrices:multiplyMatrices,polarPremultiply:function polarPremultiply(_,t,o){return _.map(((_,a)=>_*(o===a?1:t)))}});
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
 */function lin_a98rgb_to_XYZ(_){return multiplyMatrices([[573536/994567,263643/1420810,187206/994567],[591459/1989134,6239551/9945670,374412/4972835],[53769/1989134,351524/4972835,4929758/4972835]],_)}
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
 */function XYZ_to_lin_sRGB(_){return multiplyMatrices([[12831/3959,-329/214,-1974/3959],[-851781/878810,1648619/878810,36519/878810],[705/12673,-2585/12673,705/667]],_)}
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
 */function inGamut(_){const[t,o,a]=_;return t>=-1e-4&&t<=1.0001&&o>=-1e-4&&o<=1.0001&&a>=-1e-4&&a<=1.0001}
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
 */function gam_2020(_){const t=1.09929682680944;return _.map((function(_){const o=_<0?-1:1,a=Math.abs(_);return a>.018053968510807?o*(t*Math.pow(a,.45)-(t-1)):4.5*_}))}
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
function HSL_to_sRGB(_){let t=_[0],o=_[1],a=_[2];function f(_){const n=(_+t/30)%12,i=o*Math.min(a,1-a);return a-i*Math.max(-1,Math.min(n-3,9-n,1))}return t%=360,t<0&&(t+=360),o/=100,a/=100,[f(0),f(8),f(4)]}
/**
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
 */function Lab_to_XYZ(_){const o=24389/27,a=216/24389,n=[];n[1]=(_[0]+16)/116,n[0]=_[1]/500+n[1],n[2]=n[1]-_[2]/200;return[Math.pow(n[0],3)>a?Math.pow(n[0],3):(116*n[0]-16)/o,_[0]>8?Math.pow((_[0]+16)/116,3):_[0]/o,Math.pow(n[2],3)>a?Math.pow(n[2],3):(116*n[2]-16)/o].map(((_,o)=>_*t[o]))}
/**
 * Convert XYZ to linear-light P3
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function XYZ_to_lin_P3(_){return multiplyMatrices([[446124/178915,-333277/357830,-72051/178915],[-14852/17905,63121/35810,423/17905],[11844/330415,-50337/660830,316169/330415]],_)}
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
 */function lin_P3_to_XYZ(_){return multiplyMatrices([[608311/1250200,189793/714400,198249/1000160],[35783/156275,247089/357200,198249/2500400],[0,32229/714400,5220557/5000800]],_)}
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
function XYZ_to_lin_2020(_){return multiplyMatrices([[30757411/17917100,-6372589/17917100,-4539589/17917100],[-.666684351832489,1.616481236634939,467509/29648200],[792561/44930125,-1921689/44930125,.942103121235474]],_)}
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
function lin_2020(_){const t=1.09929682680944;return _.map((function(_){const o=_<0?-1:1,a=Math.abs(_);return a<.08124285829863151?_/4.5:o*Math.pow((a+t-1)/t,1/.45)}))}
/**
 * Convert an array of linear-light rec2020 values to CIE XYZ
 * using  D65 (no chromatic adaptation)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 */function lin_2020_to_XYZ(_){return multiplyMatrices([[63426534/99577255,20160776/139408157,47086771/278816314],[26158966/99577255,.677998071518871,8267143/139408157],[0,19567812/697040785,1.0609850577107909]],_)}
/**
 * Convert an array of prophoto-rgb values where in-gamut Colors are in the
 * range [0.0 - 1.0] to linear light (un-companded) form. Transfer curve is
 * gamma 1.8 with a small linear portion. Extended transfer function
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */function lin_ProPhoto(_){return _.map((function(_){const t=_<0?-1:1,o=Math.abs(_);return o<=.03125?_/16:t*Math.pow(o,1.8)}))}
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
 */var o=Object.freeze({__proto__:null,D50:t,D50_to_D65:D50_to_D65,D65:[.3127/.329,1,.3583/.329],D65_to_D50:D65_to_D50,HSL_to_sRGB:HSL_to_sRGB,HWB_to_sRGB:
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
function HWB_to_sRGB(_){const t=_[0];let o=_[1],a=_[2];if(o/=100,a/=100,o+a>=1){const _=o/(o+a);return[_,_,_]}const n=HSL_to_sRGB([t,100,50]);for(let _=0;_<3;_++)n[_]*=1-o-a,n[_]+=o;return n},LCH_to_Lab:LCH_to_Lab,LCH_to_P3:function LCH_to_P3(_){const[t,o,a]=_;let n=[Math.max(t,0),o,a%360];n=LCH_to_Lab(n),n=Lab_to_XYZ(n);let i=n.slice();return i=D50_to_D65(i),i=XYZ_to_OKLab(i),i=OKLab_to_OKLCH(i),i[0]<1e-6&&(i=[0,0,0]),i[0]>.999999&&(i=[1,0,0]),n=D50_to_D65(n),n=XYZ_to_lin_P3(n),n=gam_P3(n),inGamut(n)?[clip(n),!0]:[mapGamut(i,(_=>gam_P3(_=XYZ_to_lin_P3(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_P3_to_XYZ(_=lin_P3(_)))))),!1]},LCH_to_rec2020:function LCH_to_rec2020(_){return gam_2020(XYZ_to_lin_2020(D50_to_D65(Lab_to_XYZ(LCH_to_Lab(_)))))},LCH_to_sRGB:function LCH_to_sRGB(_){const[t,o,a]=_;let n=[Math.max(t,0),o,a%360];n=LCH_to_Lab(n),n=Lab_to_XYZ(n);let i=n.slice();return i=D50_to_D65(i),i=XYZ_to_OKLab(i),i=OKLab_to_OKLCH(i),i[0]<1e-6&&(i=[0,0,0]),i[0]>.999999&&(i=[1,0,0]),n=D50_to_D65(n),n=XYZ_to_lin_sRGB(n),n=gam_sRGB(n),inGamut(n)?clip(n).map((_=>Math.round(255*_))):mapGamut(i,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_)))))).map((_=>Math.round(255*_)))},Lab_to_LCH:Lab_to_LCH,Lab_to_P3:function Lab_to_P3(_){const[t,o,a]=_;let n=[Math.max(t,0),Math.min(Math.max(o,-160),160),Math.min(Math.max(a,-160),160)];n=Lab_to_XYZ(n);let i=n.slice();return i=D50_to_D65(i),i=XYZ_to_OKLab(i),i=OKLab_to_OKLCH(i),i[0]<1e-6&&(i=[0,0,0]),i[0]>.999999&&(i=[1,0,0]),n=D50_to_D65(n),n=XYZ_to_lin_P3(n),n=gam_P3(n),inGamut(n)?[clip(n),!0]:[mapGamut(i,(_=>gam_P3(_=XYZ_to_lin_P3(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_P3_to_XYZ(_=lin_P3(_)))))),!1]},Lab_to_XYZ:Lab_to_XYZ,Lab_to_sRGB:function Lab_to_sRGB(_){const[t,o,a]=_;let n=[Math.max(t,0),Math.min(Math.max(o,-160),160),Math.min(Math.max(a,-160),160)];n=Lab_to_XYZ(n);let i=n.slice();return i=D50_to_D65(i),i=XYZ_to_OKLab(i),i=OKLab_to_OKLCH(i),i[0]<1e-6&&(i=[0,0,0]),i[0]>.999999&&(i=[1,0,0]),n=D50_to_D65(n),n=XYZ_to_lin_sRGB(n),n=gam_sRGB(n),inGamut(n)?clip(n).map((_=>Math.round(255*_))):mapGamut(i,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_)))))).map((_=>Math.round(255*_)))},OKLCH_to_OKLab:OKLCH_to_OKLab,OKLCH_to_P3:function OKLCH_to_P3(_){const[t,o,a]=_,n=[Math.max(t,0),o,a%360];let i=n;return i[0]<1e-6&&(i=[0,0,0]),i[0]>.999999&&(i=[1,0,0]),i=OKLCH_to_OKLab(i),i=OKLab_to_XYZ(i),i=XYZ_to_lin_P3(i),i=gam_P3(i),inGamut(i)?[clip(i),!0]:[mapGamut(n,(_=>gam_P3(_=XYZ_to_lin_P3(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_P3_to_XYZ(_=lin_P3(_)))))),!1]},OKLCH_to_sRGB:function OKLCH_to_sRGB(_){const[t,o,a]=_,n=[Math.max(t,0),o,a%360];let i=n;return i[0]<1e-6&&(i=[0,0,0]),i[0]>.999999&&(i=[1,0,0]),i=OKLCH_to_OKLab(i),i=OKLab_to_XYZ(i),i=XYZ_to_lin_sRGB(i),i=gam_sRGB(i),inGamut(i)?clip(i).map((_=>Math.round(255*_))):mapGamut(n,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_)))))).map((_=>Math.round(255*_)))},OKLab_to_OKLCH:OKLab_to_OKLCH,OKLab_to_P3:function OKLab_to_P3(_){const[t,o,a]=_;let n=[Math.max(t,0),o,a],i=OKLab_to_OKLCH(n);return i[0]<1e-6&&(i=[0,0,0]),i[0]>.999999&&(i=[1,0,0]),n=OKLab_to_XYZ(n),n=XYZ_to_lin_P3(n),n=gam_P3(n),inGamut(n)?[clip(n),!0]:[mapGamut(i,(_=>gam_P3(_=XYZ_to_lin_P3(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_P3_to_XYZ(_=lin_P3(_)))))),!1]},OKLab_to_XYZ:OKLab_to_XYZ,OKLab_to_sRGB:function OKLab_to_sRGB(_){const[t,o,a]=_;let n=[Math.max(t,0),o,a],i=OKLab_to_OKLCH(n);return i[0]<1e-6&&(i=[0,0,0]),i[0]>.999999&&(i=[1,0,0]),n=OKLab_to_XYZ(n),n=XYZ_to_lin_sRGB(n),n=gam_sRGB(n),inGamut(n)?clip(n).map((_=>Math.round(255*_))):mapGamut(i,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_)))))).map((_=>Math.round(255*_)))},P3_to_LCH:function P3_to_LCH(_){return Lab_to_LCH(XYZ_to_Lab(D65_to_D50(lin_P3_to_XYZ(lin_P3(_)))))},XYZ_to_Lab:XYZ_to_Lab,XYZ_to_OKLab:XYZ_to_OKLab,XYZ_to_lin_2020:XYZ_to_lin_2020,XYZ_to_lin_P3:XYZ_to_lin_P3,XYZ_to_lin_ProPhoto:
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
function XYZ_to_lin_a98rgb(_){return multiplyMatrices([[1829569/896150,-506331/896150,-308931/896150],[-851781/878810,1648619/878810,36519/878810],[16779/1248040,-147721/1248040,1266979/1248040]],_)},XYZ_to_lin_sRGB:XYZ_to_lin_sRGB,XYZ_to_uv:function XYZ_to_uv(_){const t=_[0],o=_[1],a=t+15*o+3*_[2];return[4*t/a,9*o/a]}
/**
 * Convert an array of three XYZ values to x,y chromaticity coordinates
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
 */,XYZ_to_xy:function XYZ_to_xy(_){const t=_[0],o=_[1],a=t+o+_[2];return[t/a,o/a]},a98_RGB_to_sRGB:function a98_RGB_to_sRGB(_){let t=_.slice();t=lin_a98rgb(t),t=lin_a98rgb_to_XYZ(t);let o=t.slice();return o=XYZ_to_OKLab(o),o=OKLab_to_OKLCH(o),o[0]<1e-6&&(o=[0,0,0]),o[0]>.999999&&(o=[1,0,0]),t=XYZ_to_lin_sRGB(t),t=gam_sRGB(t),inGamut(t)?clip(t):mapGamut(o,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_))))))},cie_XYZ_50_to_sRGB:function cie_XYZ_50_to_sRGB(_){let t=_.slice();t=D50_to_D65(t);let o=t.slice();return o=XYZ_to_OKLab(o),o=OKLab_to_OKLCH(o),o[0]<1e-6&&(o=[0,0,0]),o[0]>.999999&&(o=[1,0,0]),t=XYZ_to_lin_sRGB(t),t=gam_sRGB(t),inGamut(t)?clip(t):mapGamut(o,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_))))))},cie_XYZ_65_to_sRGB:function cie_XYZ_65_to_sRGB(_){let t=_.slice(),o=t.slice();return o=XYZ_to_OKLab(o),o=OKLab_to_OKLCH(o),o[0]<1e-6&&(o=[0,0,0]),o[0]>.999999&&(o=[1,0,0]),t=XYZ_to_lin_sRGB(t),t=gam_sRGB(t),inGamut(t)?clip(t):mapGamut(o,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_))))))},gam_2020:gam_2020,gam_P3:gam_P3,gam_ProPhoto:function gam_ProPhoto(_){return _.map((function(_){const t=_<0?-1:1,o=Math.abs(_);return o>=.001953125?t*Math.pow(o,1/1.8):16*_}))},gam_a98rgb:function gam_a98rgb(_){return _.map((function(_){const t=_<0?-1:1,o=Math.abs(_);return t*Math.pow(o,256/563)}))},gam_sRGB:gam_sRGB,hueToRGB:function hueToRGB(_,t,o){return o<0&&(o+=6),o>=6&&(o-=6),o<1?(t-_)*o+_:o<3?t:o<4?(t-_)*(4-o)+_:_},lin_2020:lin_2020,lin_2020_to_XYZ:lin_2020_to_XYZ,lin_P3:lin_P3,lin_P3_to_XYZ:lin_P3_to_XYZ,lin_ProPhoto:lin_ProPhoto,lin_ProPhoto_to_XYZ:lin_ProPhoto_to_XYZ,lin_a98rgb:lin_a98rgb,lin_a98rgb_to_XYZ:lin_a98rgb_to_XYZ,lin_sRGB:lin_sRGB,lin_sRGB_to_XYZ:lin_sRGB_to_XYZ,naive_CMYK_to_sRGB:function naive_CMYK_to_sRGB(_){const t=_[0],o=_[1],a=_[2],n=_[3];return[1-Math.min(1,t*(1-n)+n),1-Math.min(1,o*(1-n)+n),1-Math.min(1,a*(1-n)+n)]},p3_to_sRGB:function p3_to_sRGB(_){let t=_.slice();t=lin_P3(t),t=lin_P3_to_XYZ(t);let o=t.slice();return o=XYZ_to_OKLab(o),o=OKLab_to_OKLCH(o),o[0]<1e-6&&(o=[0,0,0]),o[0]>.999999&&(o=[1,0,0]),t=XYZ_to_lin_sRGB(t),t=gam_sRGB(t),inGamut(t)?clip(t):mapGamut(o,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_))))))},proPhoto_RGB_to_sRGB:function proPhoto_RGB_to_sRGB(_){let t=_.slice();t=lin_ProPhoto(t),t=lin_ProPhoto_to_XYZ(t),t=D50_to_D65(t);let o=t.slice();return o=XYZ_to_OKLab(o),o=OKLab_to_OKLCH(o),o[0]<1e-6&&(o=[0,0,0]),o[0]>.999999&&(o=[1,0,0]),t=XYZ_to_lin_sRGB(t),t=gam_sRGB(t),inGamut(t)?clip(t):mapGamut(o,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_))))))}
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
 */,sRGB_to_LCH:function sRGB_to_LCH(_){return Lab_to_LCH(XYZ_to_Lab(D65_to_D50(lin_sRGB_to_XYZ(lin_sRGB(_)))))},sRGB_to_luminance:sRGB_to_luminance,sRGB_to_sRGB:function sRGB_to_sRGB(_){let t=_.slice();t=lin_sRGB(t),t=lin_sRGB_to_XYZ(t);let o=t.slice();return o=XYZ_to_OKLab(o),o=OKLab_to_OKLCH(o),o[0]<1e-6&&(o=[0,0,0]),o[0]>.999999&&(o=[1,0,0]),t=XYZ_to_lin_sRGB(t),t=gam_sRGB(t),inGamut(t)?clip(t):mapGamut(o,(_=>gam_sRGB(_=XYZ_to_lin_sRGB(_=OKLab_to_XYZ(_=OKLCH_to_OKLab(_))))),(_=>OKLab_to_OKLCH(_=XYZ_to_OKLab(_=lin_sRGB_to_XYZ(_=lin_sRGB(_))))))}}),a=Object.freeze({__proto__:null,clip:clip,inGamut:inGamut});exports.calculations=_,exports.conversions=o,exports.namedColors={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]},exports.utils=a;
