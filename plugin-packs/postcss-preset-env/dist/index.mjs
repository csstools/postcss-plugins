import s from"autoprefixer";import e from"cssdb";import o from"@csstools/postcss-progressive-custom-properties";import t from"browserslist";import i from"postcss-initial";import a from"postcss-pseudo-class-any-link";import r from"css-blank-pseudo";import p from"postcss-page-break";import c from"@csstools/postcss-cascade-layers";import n from"postcss-attribute-case-insensitive";import l from"postcss-clamp";import m from"@csstools/postcss-color-function";import u from"postcss-color-functional-notation";import d from"@csstools/postcss-color-mix-function";import f from"postcss-custom-media";import g from"postcss-custom-properties";import b from"postcss-custom-selectors";import h from"postcss-dir-pseudo-class";import N from"@csstools/postcss-normalize-display-values";import k from"postcss-double-position-gradients";import v from"@csstools/postcss-logical-float-and-clear";import y from"postcss-focus-visible";import w from"postcss-focus-within";import F from"@csstools/postcss-font-format-keywords";import S from"postcss-font-variant";import x from"postcss-gap-properties";import O from"@csstools/postcss-gradients-interpolation-method";import $ from"css-has-pseudo";import P from"postcss-color-hex-alpha";import C from"@csstools/postcss-hwb-function";import I from"@csstools/postcss-ic-unit";import E from"postcss-image-set-function";import B from"@csstools/postcss-is-pseudo-class";import U from"postcss-lab-function";import _ from"postcss-logical";import L from"@csstools/postcss-logical-resize";import q from"@csstools/postcss-logical-viewport-units";import A from"@csstools/postcss-media-queries-aspect-ratio-number-values";import R from"postcss-media-minmax";import j from"@csstools/postcss-nested-calc";import M from"postcss-nesting";import D from"postcss-selector-not";import V from"@csstools/postcss-oklab-function";import W from"postcss-opacity-percentage";import z from"postcss-overflow-shorthand";import T from"postcss-replace-overflow-wrap";import H from"postcss-place";import G from"css-prefers-color-scheme";import K from"postcss-color-rebeccapurple";import Z from"@csstools/postcss-scope-pseudo-class";import Q from"@csstools/postcss-stepped-value-functions";import J from"@csstools/postcss-text-decoration-shorthand";import X from"@csstools/postcss-trigonometric-functions";import Y from"@csstools/postcss-unset-value";const ss={"blank-pseudo-class":"https://github.com/csstools/postcss-plugins/blob/main/plugins/css-blank-pseudo/README-BROWSER.md","focus-visible-pseudo-class":"https://github.com/WICG/focus-visible","focus-within-pseudo-class":"https://github.com/jsxtools/focus-within/blob/master/README-BROWSER.md","has-pseudo-class":"https://github.com/csstools/postcss-plugins/blob/main/plugins/css-has-pseudo/README-BROWSER.md","prefers-color-scheme-query":"https://github.com/csstools/postcss-plugins/blob/main/plugins/css-prefers-color-scheme/README-BROWSER.md"},es=["blank-pseudo-class","focus-visible-pseudo-class","focus-within-pseudo-class","has-pseudo-class","prefers-color-scheme-query"];function logFeaturesList(s,e,o){if(e.debug){o.log("Enabling the following feature(s):");const t=[],i=[];!1!==e.autoprefixer&&i.push("  autoprefixer"),s.forEach((s=>{s.id.startsWith("before")||s.id.startsWith("after")?i.push(`  ${s.id} (injected via options)`):i.push(`  ${s.id}`),void 0!==ss[s.id]&&t.push(s.id)})),i.sort(((s,e)=>s.localeCompare(e))),t.sort(((s,e)=>s.localeCompare(e))),i.forEach((s=>o.log(s))),t.length&&(o.log("These feature(s) need a browser library to work:"),t.forEach((s=>o.log(` ${s}: ${ss[s]}`))))}}function initializeSharedOptions(s){if("preserve"in s){const e={};return e.preserve=s.preserve,e}return!1}function clamp(s,e,o){return Math.max(s,Math.min(e,o))}const os=2,ts=5;function stageFromOptions(s,e){let o=os;if(void 0===s.stage)return e.log(`Using features from Stage ${o} (default)`),o;if(!1===s.stage)o=ts;else{let e=parseInt(s.stage,10);Number.isNaN(e)&&(e=0),o=clamp(0,e,ts)}return o===ts?e.log('Stage has been disabled, features will be handled via the "features" option.'):e.log(`Using features from Stage ${o}`),o}const is=Symbol("insertBefore"),as=Symbol("insertAfter"),rs=Symbol("insertOrder"),ps=Symbol("plugin");function getTransformedInsertions(s,e,o){if("insertBefore"!==o&&"insertAfter"!==o)return[];const t="insertBefore"===o?is:as,i=[];for(const o in e){if(!Object.hasOwnProperty.call(e,o))continue;if(!s.find((s=>s.id===o)))continue;let a=e[o];Array.isArray(a)||(a=[a]);for(let s=0;s<a.length;s++)i.push({id:o,[ps]:a[s],[rs]:s,[t]:!0})}return i}var cs=["custom-media-queries","custom-properties","environment-variables","image-set-function","media-query-ranges","media-queries-aspect-ratio-number-values","prefers-color-scheme-query","nesting-rules","custom-selectors","any-link-pseudo-class","case-insensitive-attributes","focus-visible-pseudo-class","focus-within-pseudo-class","not-pseudo-class","logical-properties-and-values","dir-pseudo-class","all-property","gradients-interpolation-method","color-mix","color-functional-notation","double-position-gradients","hexadecimal-alpha-notation","hwb-function","lab-function","rebeccapurple-color","blank-pseudo-class","break-properties","font-variant-property","is-pseudo-class","scope-pseudo-class","has-pseudo-class","gap-properties","overflow-property","overflow-wrap-property","place-properties","system-ui-font-family","stepped-value-functions","trigonometric-functions","cascade-layers"];function featureIsLess(s,e){return s.id===e.id?s[is]&&e[is]||s[as]&&e[as]?clamp(-1,s[rs]-e[rs],1):s[is]||e[as]?-1:s[as]||e[is]?1:0:clamp(-1,cs.indexOf(s.id)-cs.indexOf(e.id),1)}function postcssSystemUiFont(){return{postcssPlugin:"postcss-system-ui-font",Declaration(s){ns.test(s.prop)&&(s.value.includes(ms.join(", "))||(s.value=s.value.replace(us,ds)))}}}postcssSystemUiFont.postcss=!0;const ns=/(?:^(?:-|\\002d){2})|(?:^font(?:-family)?$)/i,ls="[\\f\\n\\r\\x09\\x20]",ms=["system-ui","-apple-system","Segoe UI","Roboto","Ubuntu","Cantarell","Noto Sans","sans-serif"],us=new RegExp(`(^|,|${ls}+)(?:system-ui${ls}*)(?:,${ls}*(?:${ms.join("|")})${ls}*)?(,|$)`,"i"),ds=`$1${ms.join(", ")}$2`,fs=new Map([["all-property",i],["any-link-pseudo-class",a],["blank-pseudo-class",r],["break-properties",p],["cascade-layers",c],["case-insensitive-attributes",n],["clamp",l],["color-function",m],["color-functional-notation",u],["color-mix",d],["custom-media-queries",f],["custom-properties",g],["custom-selectors",b],["dir-pseudo-class",h],["display-two-values",N],["double-position-gradients",k],["float-clear-logical-values",v],["focus-visible-pseudo-class",y],["focus-within-pseudo-class",w],["font-format-keywords",F],["font-variant-property",S],["gap-properties",x],["gradients-interpolation-method",O],["has-pseudo-class",$],["hexadecimal-alpha-notation",P],["hwb-function",C],["ic-unit",I],["image-set-function",E],["is-pseudo-class",B],["lab-function",U],["logical-properties-and-values",_],["logical-resize",L],["logical-viewport-units",q],["media-queries-aspect-ratio-number-values",A],["media-query-ranges",R],["nested-calc",j],["nesting-rules",M],["not-pseudo-class",D],["oklab-function",V],["opacity-percentage",W],["overflow-property",z],["overflow-wrap-property",T],["place-properties",H],["prefers-color-scheme-query",G],["rebeccapurple-color",K],["scope-pseudo-class",Z],["stepped-value-functions",Q],["system-ui-font-family",postcssSystemUiFont],["text-decoration-shorthand",J],["trigonometric-functions",X],["unset-value",Y]]);function featureIsInsertedOrHasAPlugin(s){return!!s[is]||(!!s[as]||!!fs.has(s.id))}function prepareFeaturesList(s,e,o){return s.concat(getTransformedInsertions(s,e,"insertBefore"),getTransformedInsertions(s,o,"insertAfter")).filter((s=>featureIsInsertedOrHasAPlugin(s))).sort(((s,e)=>featureIsLess(s,e)))}const gs=["and_chr","and_ff","and_qq","and_uc","android","baidu","chrome","edge","firefox","ie","ie_mob","ios_saf","kaios","op_mini","op_mob","opera","safari","samsung"];function getUnsupportedBrowsersByFeature(s){if(!s)return[];if(!("browser_support"in s))return["> 0%"];const e=[];return gs.forEach((o=>{if("op_mini"===o&&void 0===s.browser_support[o])return void e.push("op_mini all");const t=s.browser_support[o];"string"==typeof t&&/^[0-9|.]+$/.test(t)?e.push(`${o} < ${s.browser_support[o]}`):e.push(`${o} >= 1`)})),e}function getOptionsForBrowsersByFeature(s,e,o,i,a){const r=t(s,{ignoreUnknownVersions:!0});switch(e.id){case"is-pseudo-class":return{onComplexSelector:"warning"};case"nesting-rules":if(needsOptionFor(o.find((s=>"is-pseudo-class"===s.id)),r))return a.log('Disabling :is on "nesting-rules" due to lack of browser support.'),{noIsPseudoSelector:!0};return{};case"any-link-pseudo-class":if(r.find((s=>s.startsWith("ie ")||s.startsWith("edge "))))return a.log('Adding area[href] fallbacks for ":any-link" support in Edge and IE.'),{subFeatures:{areaHrefNeedsFixing:!0}};return{};case"logical-properties-and-values":case"float-clear-logical-values":case"logical-resize":case"logical-viewport-units":return"logical"in i?i.logical:{};default:return{}}}function needsOptionFor(s,e){const o=getUnsupportedBrowsersByFeature(s);return!!e.some((s=>t(o,{ignoreUnknownVersions:!0}).some((e=>e===s))))}function formatPolyfillableFeature(s){const e=getUnsupportedBrowsersByFeature(s);if(s[is]||s[as]){let o=s.id;return o=s.insertBefore?`before-${o}`:`after-${o}`,{browsers:e,vendors_implementations:s.vendors_implementations,plugin:s[ps],id:o,stage:ts+1}}return{browsers:e,vendors_implementations:s.vendors_implementations,plugin:fs.get(s.id),id:s.id,stage:s.stage}}function formatStagedFeature(s,e,o,t,i,a,r){let p,c;return p=getOptionsForBrowsersByFeature(e,t,s,a,r),!0===o[t.id]?i&&(p=Object.assign({},p,i)):p=i?Object.assign({},p,i,o[t.id]):Object.assign({},p,o[t.id]),p.enableProgressiveCustomProperties=!1,"all-property"===t.id&&"preserve"in p&&(p.replace=p.preserve),"overflow-wrap-property"===t.id&&"preserve"in p&&(p.method=p.preserve?"copy":"replace"),c=t.plugin.postcss&&"function"==typeof t.plugin?t.plugin(p):t.plugin&&t.plugin.default&&"function"==typeof t.plugin.default&&t.plugin.default.postcss?t.plugin.default(p):t.plugin,{browsers:t.browsers,vendors_implementations:t.vendors_implementations,plugin:c,pluginOptions:p,id:t.id}}function intOrZero(s){const e=parseInt(s,10);return Number.isNaN(e)?0:e}function listFeatures(s,e,o,i){const a=Object(e.features),r="enableClientSidePolyfills"in e&&e.enableClientSidePolyfills,p=Object(e.insertBefore),c=Object(e.insertAfter),n=e.browsers,l=clamp(0,intOrZero(e.minimumVendorImplementations),3);l>0&&i.log(`Using features with ${l} or more vendor implementations`);const m=stageFromOptions(e,i),u=prepareFeaturesList(s,p,c).map((s=>formatPolyfillableFeature(s))).filter((s=>0===l||(!(!s[is]&&!s[as])||(l<=s.vendors_implementations||(a[s.id]?(i.log(`  ${s.id} does not meet the required vendor implementations but has been enabled by options`),!0):(i.log(`  ${s.id} with ${s.vendors_implementations} vendor implementations has been disabled`),!1)))))).filter((s=>{const e=s.stage>=m,o=r||!es.includes(s.id),t=!1===a[s.id],p=a[s.id]?a[s.id]:e&&o;return t?i.log(`  ${s.id} has been disabled by options`):e?o||i.log(`  ${s.id} has been disabled by "enableClientSidePolyfills: false".`):p?i.log(`  ${s.id} does not meet the required stage but has been enabled by options`):i.log(`  ${s.id} with stage ${s.stage} has been disabled`),p})).map((t=>formatStagedFeature(s,n,a,t,o,e,i))),d=t(n,{ignoreUnknownVersions:!0});return u.filter((s=>{if(s.id in a)return a[s.id];const e=t(s.browsers,{ignoreUnknownVersions:!0}),o=d.some((s=>e.some((e=>e===s))));return o||i.log(`${s.id} disabled due to browser support`),o}))}class Logger{constructor(){this.logs=[]}log(s){this.logs.push(s)}resetLogger(){this.logs.length=0}dumpLogs(s){s&&s.warn(this.logs.join("\n")),this.resetLogger()}}var bs=[{packageName:"css-blank-pseudo",id:"blank-pseudo-class",importName:"postcssBlankPseudo"},{packageName:"css-has-pseudo",id:"has-pseudo-class",importName:"postcssHasPseudo"},{packageName:"css-prefers-color-scheme",id:"prefers-color-scheme-query",importName:"postcssPrefersColorScheme"},{packageName:"postcss-attribute-case-insensitive",id:"case-insensitive-attributes",importName:"postcssAttributeCaseInsensitive"},{packageName:"postcss-clamp",id:"clamp",importName:"postcssClamp"},{packageName:"@csstools/postcss-color-mix-function",id:"color-mix",importName:"postcssColorMixFunction"},{packageName:"@csstools/postcss-color-function",id:"color-function",importName:"postcssColorFunction"},{packageName:"postcss-color-functional-notation",id:"color-functional-notation",importName:"postcssColorFunctionalNotation"},{packageName:"postcss-color-hex-alpha",id:"hexadecimal-alpha-notation",importName:"postcssColorHexAlpha"},{packageName:"postcss-color-rebeccapurple",id:"rebeccapurple-color",importName:"postcssColorRebeccapurple"},{packageName:"postcss-custom-media",id:"custom-media-queries",importName:"postcssCustomMedia"},{packageName:"postcss-custom-properties",id:"custom-properties",importName:"postcssCustomProperties"},{packageName:"postcss-custom-selectors",id:"custom-selectors",importName:"postcssCustomSelectors"},{packageName:"postcss-dir-pseudo-class",id:"dir-pseudo-class",importName:"postcssDirPseudoClass"},{packageName:"postcss-double-position-gradients",id:"double-position-gradients",importName:"postcssDoublePositionGradients"},{packageName:"postcss-focus-visible",id:"focus-visible-pseudo-class",importName:"postcssFocusVisible"},{packageName:"postcss-focus-within",id:"focus-within-pseudo-class",importName:"postcssFocusWithin"},{packageName:"@csstools/postcss-font-format-keywords",id:"font-format-keywords",importName:"postcssFontFormatKeywords"},{packageName:"postcss-font-variant",id:"font-variant-property",importName:"postcssFontVariant"},{packageName:"postcss-gap-properties",id:"gap-properties",importName:"postcssGapProperties"},{packageName:"@csstools/postcss-gradients-interpolation-method",id:"gradients-interpolation-method",importName:"postcssGradientsInterpolationMethod"},{packageName:"@csstools/postcss-hwb-function",id:"hwb-function",importName:"postcssHWBFunction"},{packageName:"@csstools/postcss-ic-unit",id:"ic-unit",importName:"postcssICUnit"},{packageName:"postcss-image-set-function",id:"image-set-function",importName:"postcssImageSetFunction"},{packageName:"postcss-initial",id:"all-property",importName:"postcssInitial"},{packageName:"@csstools/postcss-is-pseudo-class",id:"is-pseudo-class",importName:"postcssIsPseudoClass"},{packageName:"@csstools/postcss-scope-pseudo-class",id:"scope-pseudo-class",importName:"postcssScopePseudoClass"},{packageName:"postcss-lab-function",id:"lab-function",importName:"postcssLabFunction"},{packageName:"postcss-logical",id:"logical-properties-and-values",importName:"postcssLogical"},{packageName:"@csstools/postcss-logical-float-and-clear",id:"float-clear-logical-values",importName:"postcssLogicalFloatAndClear"},{packageName:"@csstools/postcss-logical-resize",id:"logical-resize",importName:"postcssLogicalResize"},{packageName:"@csstools/postcss-logical-viewport-units",id:"logical-viewport-units",importName:"postcssLogicalViewportUnits"},{packageName:"postcss-media-minmax",id:"media-query-ranges",importName:"postcssMediaMinmax"},{packageName:"@csstools/postcss-media-queries-aspect-ratio-number-values",id:"media-queries-aspect-ratio-number-values",importName:"postcssMediaQueriesAspectRatioNumberValues"},{packageName:"postcss-nesting",id:"nesting-rules",importName:"postcssNesting"},{packageName:"@csstools/postcss-normalize-display-values",id:"display-two-values",importName:"postcssNormalizeDisplayValues"},{packageName:"@csstools/postcss-oklab-function",id:"oklab-function",importName:"postcssOKLabFunction"},{packageName:"postcss-opacity-percentage",id:"opacity-percentage",importName:"postcssOpacityPercentage"},{packageName:"postcss-overflow-shorthand",id:"overflow-property",importName:"postcssOverflowShorthand"},{packageName:"postcss-page-break",id:"break-properties",importName:"postcssPageBreak"},{packageName:"postcss-place",id:"place-properties",importName:"postcssPlace"},{packageName:"postcss-pseudo-class-any-link",id:"any-link-pseudo-class",importName:"postcssPseudoClassAnyLink"},{packageName:"postcss-replace-overflow-wrap",id:"overflow-wrap-property",importName:"postcssReplaceOverflowWrap"},{packageName:"postcss-selector-not",id:"not-pseudo-class",importName:"postcssSelectorNot"},{packageName:"@csstools/postcss-stepped-value-functions",id:"stepped-value-functions",importName:"postcssSteppedValueFunctions"},{packageName:"postcss-system-ui-font-family",importedPackage:"../patch/postcss-system-ui-font-family.mjs",id:"system-ui-font-family",importName:"postcssFontFamilySystemUI"},{packageName:"@csstools/postcss-unset-value",id:"unset-value",importName:"postcssUnsetValue"},{packageName:"@csstools/postcss-cascade-layers",id:"cascade-layers",importName:"postcssCascadeLayers"},{packageName:"@csstools/postcss-trigonometric-functions",id:"trigonometric-functions",importName:"postcssTrigonometricFunctions"},{packageName:"@csstools/postcss-nested-calc",id:"nested-calc",importName:"postcssNestedCalc"},{packageName:"@csstools/postcss-text-decoration-shorthand",id:"text-decoration-shorthand",importName:"postcssTextDecorationShorthand"}];function getPackageNamesToIds(){const s={};return bs.forEach((e=>{s[e.packageName]=e.id})),s}function pluginIdHelp(s,e,o){const t=bs.map((s=>s.id)),i=bs.map((s=>s.packageName)),a=getPackageNamesToIds();s.forEach((s=>{if(t.includes(s))return;const r=mostSimilar(s,t),p=mostSimilar(s,i);Math.min(r.distance,p.distance)>10?e.warn(o`Unknown feature: "${s}", see the list of features https://github.com/csstools/postcss-plugins/blob/main/plugin-packs/postcss-preset-env/FEATURES.md`):r.distance<p.distance?e.warn(o,`Unknown feature: "${s}", did you mean: "${r.mostSimilar}"`):e.warn(o,`Unknown feature: "${s}", did you mean: "${a[p.mostSimilar]}"`)}))}function mostSimilar(s,e){let o="unknown",t=1/0;for(let i=0;i<e.length;i++){const a=levenshteinDistance(s,e[i]);a<t&&(t=a,o=e[i])}return{mostSimilar:o,distance:t}}function levenshteinDistance(s,e){if(!s.length)return e.length;if(!e.length)return s.length;const o=[];for(let t=0;t<=e.length;t++){o[t]=[t];for(let i=1;i<=s.length;i++)o[t][i]=0===t?i:Math.min(o[t-1][i]+1,o[t][i-1]+1,o[t-1][i-1]+(s[i-1]===e[t-1]?0:1))}return o[e.length][s.length]}const creator=t=>{const i=new Logger,a=Object(t),r=Object.keys(Object(a.features)),p=a.browsers,c=initializeSharedOptions(a),n=listFeatures(e,a,c,i),l=n.map((s=>s.plugin));!1!==a.autoprefixer&&l.push(s(Object.assign({overrideBrowserslist:p},a.autoprefixer))),l.push(o()),logFeaturesList(n,a,i);const internalPlugin=()=>({postcssPlugin:"postcss-preset-env",OnceExit:function(s,{result:e}){pluginIdHelp(r,s,e),a.debug&&i.dumpLogs(e),i.resetLogger()}});return internalPlugin.postcss=!0,{postcssPlugin:"postcss-preset-env",plugins:[...l,internalPlugin()]}};creator.postcss=!0;export{creator as default};
