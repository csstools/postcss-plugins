"use strict";var s=require("autoprefixer"),e=require("cssdb"),o=require("@csstools/postcss-progressive-custom-properties"),t=require("browserslist"),i=require("postcss-initial"),r=require("postcss-pseudo-class-any-link"),a=require("css-blank-pseudo"),c=require("postcss-page-break"),n=require("@csstools/postcss-cascade-layers"),p=require("postcss-attribute-case-insensitive"),l=require("postcss-clamp"),u=require("@csstools/postcss-color-function"),m=require("postcss-color-functional-notation"),d=require("@csstools/postcss-color-mix-function"),g=require("postcss-custom-media"),f=require("postcss-custom-properties"),b=require("postcss-custom-selectors"),h=require("postcss-dir-pseudo-class"),N=require("@csstools/postcss-normalize-display-values"),v=require("postcss-double-position-gradients"),y=require("@csstools/postcss-logical-float-and-clear"),k=require("postcss-focus-visible"),w=require("postcss-focus-within"),q=require("@csstools/postcss-font-format-keywords"),F=require("postcss-font-variant"),x=require("postcss-gap-properties"),S=require("@csstools/postcss-gradients-interpolation-method"),$=require("css-has-pseudo"),O=require("postcss-color-hex-alpha"),P=require("@csstools/postcss-hwb-function"),C=require("@csstools/postcss-ic-unit"),I=require("postcss-image-set-function"),U=require("@csstools/postcss-is-pseudo-class"),_=require("postcss-lab-function"),E=require("postcss-logical"),L=require("@csstools/postcss-logical-resize"),B=require("@csstools/postcss-logical-viewport-units"),A=require("@csstools/postcss-media-queries-aspect-ratio-number-values"),j=require("@csstools/postcss-media-minmax"),M=require("@csstools/postcss-nested-calc"),z=require("postcss-nesting"),D=require("postcss-selector-not"),R=require("@csstools/postcss-oklab-function"),V=require("postcss-opacity-percentage"),T=require("postcss-overflow-shorthand"),H=require("postcss-replace-overflow-wrap"),W=require("postcss-place"),G=require("css-prefers-color-scheme"),K=require("postcss-color-rebeccapurple"),Z=require("@csstools/postcss-relative-color-syntax"),Q=require("@csstools/postcss-scope-pseudo-class"),J=require("postcss-src"),X=require("@csstools/postcss-stepped-value-functions"),Y=require("@csstools/postcss-text-decoration-shorthand"),ss=require("@csstools/postcss-trigonometric-functions"),es=require("@csstools/postcss-unset-value");const os={"blank-pseudo-class":"https://github.com/csstools/postcss-plugins/blob/main/plugins/css-blank-pseudo/README.md#browser","focus-visible-pseudo-class":"https://github.com/WICG/focus-visible","focus-within-pseudo-class":"https://github.com/csstools/postcss-plugins/blob/main/plugins/postcss-focus-within/README.md#browser","has-pseudo-class":"https://github.com/csstools/postcss-plugins/blob/main/plugins/css-has-pseudo/README.md#browser","prefers-color-scheme-query":"https://github.com/csstools/postcss-plugins/blob/main/plugins/css-prefers-color-scheme/README.md#browser"},ts=["blank-pseudo-class","focus-visible-pseudo-class","focus-within-pseudo-class","has-pseudo-class","prefers-color-scheme-query"];function logFeaturesList(s,e,o){if(e.debug){o.log("Enabling the following feature(s):");const t=[],i=[];!1!==e.autoprefixer&&i.push("  autoprefixer"),s.forEach((s=>{s.id.startsWith("before")||s.id.startsWith("after")?i.push(`  ${s.id} (injected via options)`):i.push(`  ${s.id}`),void 0!==os[s.id]&&t.push(s.id)})),i.sort(((s,e)=>s.localeCompare(e))),t.sort(((s,e)=>s.localeCompare(e))),i.forEach((s=>o.log(s))),t.length&&(o.log("These feature(s) need a browser library to work:"),t.forEach((s=>o.log(` ${s}: ${os[s]}`))))}}function initializeSharedOptions(s){if("preserve"in s){const e={};return e.preserve=s.preserve,e}return!1}function clamp(s,e,o){return Math.max(s,Math.min(e,o))}const is=2,rs=5;function stageFromOptions(s,e){let o=is;if(void 0===s.stage)return e.log(`Using features from Stage ${o} (default)`),o;if(!1===s.stage)o=rs;else{let e=parseInt(s.stage,10);Number.isNaN(e)&&(e=0),o=clamp(0,e,rs)}return o===rs?e.log('Stage has been disabled, features will be handled via the "features" option.'):e.log(`Using features from Stage ${o}`),o}const as=Symbol("insertBefore"),cs=Symbol("insertAfter"),ns=Symbol("insertOrder"),ps=Symbol("plugin");function getTransformedInsertions(s,e,o){if("insertBefore"!==o&&"insertAfter"!==o)return[];const t="insertBefore"===o?as:cs,i=[];for(const o in e){if(!Object.hasOwnProperty.call(e,o))continue;if(!s.find((s=>s.id===o)))continue;let r=e[o];Array.isArray(r)||(r=[r]);for(let s=0;s<r.length;s++)i.push({id:o,[ps]:r[s],[ns]:s,[t]:!0})}return i}var ls=["custom-media-queries","environment-variables","image-set-function","media-query-ranges","media-queries-aspect-ratio-number-values","prefers-color-scheme-query","nesting-rules","custom-selectors","any-link-pseudo-class","case-insensitive-attributes","focus-visible-pseudo-class","focus-within-pseudo-class","not-pseudo-class","logical-properties-and-values","float-clear-logical-values","logical-resize","logical-viewport-units","dir-pseudo-class","all-property","gradients-interpolation-method","color-mix","relative-color-syntax","lab-function","oklab-function","color-function","hwb-function","color-functional-notation","rebeccapurple-color","hexadecimal-alpha-notation","double-position-gradients","blank-pseudo-class","break-properties","font-variant-property","is-pseudo-class","scope-pseudo-class","has-pseudo-class","gap-properties","overflow-property","overflow-wrap-property","place-properties","system-ui-font-family","font-format-keywords","display-two-values","ic-unit","opacity-percentage","text-decoration-shorthand","unset-value","src-function","stepped-value-functions","trigonometric-functions","clamp","nested-calc","custom-properties","cascade-layers"];function featureIsLess(s,e){return s.id===e.id?s[as]&&e[as]||s[cs]&&e[cs]?clamp(-1,s[ns]-e[ns],1):s[as]||e[cs]?-1:s[cs]||e[as]?1:0:clamp(-1,ls.indexOf(s.id)-ls.indexOf(e.id),1)}function postcssSystemUiFont(){return{postcssPlugin:"postcss-system-ui-font",Declaration(s){us.test(s.prop)&&(s.value.includes(ds.join(", "))||(s.value=s.value.replace(gs,fs)))}}}postcssSystemUiFont.postcss=!0;const us=/(?:^(?:-|\\002d){2})|(?:^font(?:-family)?$)/i,ms="[\\f\\n\\r\\x09\\x20]",ds=["system-ui","-apple-system","Segoe UI","Roboto","Ubuntu","Cantarell","Noto Sans","sans-serif"],gs=new RegExp(`(^|,|${ms}+)(?:system-ui${ms}*)(?:,${ms}*(?:${ds.join("|")})${ms}*)?(,|$)`,"i"),fs=`$1${ds.join(", ")}$2`,bs=new Map([["all-property",i],["any-link-pseudo-class",r],["blank-pseudo-class",a],["break-properties",c],["cascade-layers",n],["case-insensitive-attributes",p],["clamp",l],["color-function",u],["color-functional-notation",m],["color-mix",d],["custom-media-queries",g],["custom-properties",f],["custom-selectors",b],["dir-pseudo-class",h],["display-two-values",N],["double-position-gradients",v],["float-clear-logical-values",y],["focus-visible-pseudo-class",k],["focus-within-pseudo-class",w],["font-format-keywords",q],["font-variant-property",F],["gap-properties",x],["gradients-interpolation-method",S],["has-pseudo-class",$],["hexadecimal-alpha-notation",O],["hwb-function",P],["ic-unit",C],["image-set-function",I],["is-pseudo-class",U],["lab-function",_],["logical-properties-and-values",E],["logical-resize",L],["logical-viewport-units",B],["media-queries-aspect-ratio-number-values",A],["media-query-ranges",j],["nested-calc",M],["nesting-rules",z],["not-pseudo-class",D],["oklab-function",R],["opacity-percentage",V],["overflow-property",T],["overflow-wrap-property",H],["place-properties",W],["prefers-color-scheme-query",G],["rebeccapurple-color",K],["relative-color-syntax",Z],["scope-pseudo-class",Q],["src-function",J],["stepped-value-functions",X],["system-ui-font-family",postcssSystemUiFont],["text-decoration-shorthand",Y],["trigonometric-functions",ss],["unset-value",es]]);function featureIsInsertedOrHasAPlugin(s){return!!s[as]||(!!s[cs]||!!bs.has(s.id))}function prepareFeaturesList(s,e,o){return s.concat(getTransformedInsertions(s,e,"insertBefore"),getTransformedInsertions(s,o,"insertAfter")).filter((s=>featureIsInsertedOrHasAPlugin(s))).sort(((s,e)=>featureIsLess(s,e)))}const hs=["and_chr","and_ff","and_qq","and_uc","android","baidu","chrome","edge","firefox","ie","ie_mob","ios_saf","kaios","op_mini","op_mob","opera","safari","samsung"];function getUnsupportedBrowsersByFeature(s){if(!s)return[];if(!("browser_support"in s))return["> 0%"];const e=[];return hs.forEach((o=>{if("op_mini"===o&&void 0===s.browser_support[o])return void e.push("op_mini all");const t=s.browser_support[o];"string"==typeof t&&/^[0-9|.]+$/.test(t)?e.push(`${o} < ${s.browser_support[o]}`):e.push(`${o} >= 1`)})),e}function getOptionsForBrowsersByFeature(s,e,o,i,r){const a=t(s,{ignoreUnknownVersions:!0});switch(e.id){case"is-pseudo-class":return{onComplexSelector:"warning"};case"nesting-rules":if(needsOptionFor(o.find((s=>"is-pseudo-class"===s.id)),a))return r.log('Disabling :is on "nesting-rules" due to lack of browser support.'),{noIsPseudoSelector:!0};return{};case"any-link-pseudo-class":if(a.find((s=>s.startsWith("ie ")||s.startsWith("edge "))))return r.log('Adding area[href] fallbacks for ":any-link" support in Edge and IE.'),{subFeatures:{areaHrefNeedsFixing:!0}};return{};case"logical-properties-and-values":case"float-clear-logical-values":case"logical-resize":case"logical-viewport-units":return"logical"in i?i.logical:{};default:return{}}}function needsOptionFor(s,e){const o=getUnsupportedBrowsersByFeature(s);return!!e.some((s=>t(o,{ignoreUnknownVersions:!0}).some((e=>e===s))))}function formatPolyfillableFeature(s){const e=getUnsupportedBrowsersByFeature(s);if(s[as]||s[cs]){let o=s.id;return o=s.insertBefore?`before-${o}`:`after-${o}`,{browsers:e,vendors_implementations:s.vendors_implementations,plugin:s[ps],id:o,stage:rs+1}}return{browsers:e,vendors_implementations:s.vendors_implementations,plugin:bs.get(s.id),id:s.id,stage:s.stage}}function formatStagedFeature(s,e,o,t,i,r,a){let c,n;return c=getOptionsForBrowsersByFeature(e,t,s,r,a),!0===o[t.id]?i&&(c=Object.assign({},c,i)):c=i?Object.assign({},c,i,o[t.id]):Object.assign({},c,o[t.id]),c.enableProgressiveCustomProperties=!1,"all-property"===t.id&&"preserve"in c&&(c.replace=c.preserve),"overflow-wrap-property"===t.id&&"preserve"in c&&(c.method=c.preserve?"copy":"replace"),n=t.plugin.postcss&&"function"==typeof t.plugin?t.plugin(c):t.plugin&&t.plugin.default&&"function"==typeof t.plugin.default&&t.plugin.default.postcss?t.plugin.default(c):t.plugin,{browsers:t.browsers,vendors_implementations:t.vendors_implementations,plugin:n,pluginOptions:c,id:t.id}}function intOrZero(s){const e=parseInt(s,10);return Number.isNaN(e)?0:e}function listFeatures(s,e,o,i){const r=Object(e.features),a="enableClientSidePolyfills"in e&&e.enableClientSidePolyfills,c=Object(e.insertBefore),n=Object(e.insertAfter),p=e.browsers,l=clamp(0,intOrZero(e.minimumVendorImplementations),3);l>0&&i.log(`Using features with ${l} or more vendor implementations`);const u=stageFromOptions(e,i),m=prepareFeaturesList(s,c,n).map((s=>formatPolyfillableFeature(s))).filter((s=>0===l||(!(!s[as]&&!s[cs])||(l<=s.vendors_implementations||(r[s.id]?(i.log(`  ${s.id} does not meet the required vendor implementations but has been enabled by options`),!0):(i.log(`  ${s.id} with ${s.vendors_implementations} vendor implementations has been disabled`),!1)))))).filter((s=>{const e=s.stage>=u,o=a||!ts.includes(s.id),t=!1===r[s.id],c=r[s.id]?r[s.id]:e&&o;return t?i.log(`  ${s.id} has been disabled by options`):e?o||i.log(`  ${s.id} has been disabled by "enableClientSidePolyfills: false".`):c?i.log(`  ${s.id} does not meet the required stage but has been enabled by options`):i.log(`  ${s.id} with stage ${s.stage} has been disabled`),c})).map((t=>formatStagedFeature(s,p,r,t,o,e,i))),d=t(p,{ignoreUnknownVersions:!0});return m.filter((s=>{if(s.id in r)return r[s.id];const e=t(s.browsers,{ignoreUnknownVersions:!0}),o=d.some((s=>e.some((e=>e===s))));return o||i.log(`${s.id} disabled due to browser support`),o}))}class Logger{constructor(){this.logs=[]}log(s){this.logs.push(s)}resetLogger(){this.logs.length=0}dumpLogs(s){s&&s.warn(this.logs.join("\n")),this.resetLogger()}}var Ns=[{packageName:"css-blank-pseudo",id:"blank-pseudo-class",importName:"postcssBlankPseudo"},{packageName:"css-has-pseudo",id:"has-pseudo-class",importName:"postcssHasPseudo"},{packageName:"css-prefers-color-scheme",id:"prefers-color-scheme-query",importName:"postcssPrefersColorScheme"},{packageName:"postcss-attribute-case-insensitive",id:"case-insensitive-attributes",importName:"postcssAttributeCaseInsensitive"},{packageName:"postcss-clamp",id:"clamp",importName:"postcssClamp"},{packageName:"@csstools/postcss-color-mix-function",id:"color-mix",importName:"postcssColorMixFunction"},{packageName:"@csstools/postcss-color-function",id:"color-function",importName:"postcssColorFunction"},{packageName:"postcss-color-functional-notation",id:"color-functional-notation",importName:"postcssColorFunctionalNotation"},{packageName:"postcss-color-hex-alpha",id:"hexadecimal-alpha-notation",importName:"postcssColorHexAlpha"},{packageName:"postcss-color-rebeccapurple",id:"rebeccapurple-color",importName:"postcssColorRebeccapurple"},{packageName:"postcss-custom-media",id:"custom-media-queries",importName:"postcssCustomMedia"},{packageName:"postcss-custom-properties",id:"custom-properties",importName:"postcssCustomProperties"},{packageName:"postcss-custom-selectors",id:"custom-selectors",importName:"postcssCustomSelectors"},{packageName:"postcss-dir-pseudo-class",id:"dir-pseudo-class",importName:"postcssDirPseudoClass"},{packageName:"postcss-double-position-gradients",id:"double-position-gradients",importName:"postcssDoublePositionGradients"},{packageName:"postcss-focus-visible",id:"focus-visible-pseudo-class",importName:"postcssFocusVisible"},{packageName:"postcss-focus-within",id:"focus-within-pseudo-class",importName:"postcssFocusWithin"},{packageName:"@csstools/postcss-font-format-keywords",id:"font-format-keywords",importName:"postcssFontFormatKeywords"},{packageName:"postcss-font-variant",id:"font-variant-property",importName:"postcssFontVariant"},{packageName:"postcss-gap-properties",id:"gap-properties",importName:"postcssGapProperties"},{packageName:"@csstools/postcss-gradients-interpolation-method",id:"gradients-interpolation-method",importName:"postcssGradientsInterpolationMethod"},{packageName:"@csstools/postcss-hwb-function",id:"hwb-function",importName:"postcssHWBFunction"},{packageName:"@csstools/postcss-ic-unit",id:"ic-unit",importName:"postcssICUnit"},{packageName:"postcss-image-set-function",id:"image-set-function",importName:"postcssImageSetFunction"},{packageName:"postcss-initial",id:"all-property",importName:"postcssInitial"},{packageName:"@csstools/postcss-is-pseudo-class",id:"is-pseudo-class",importName:"postcssIsPseudoClass"},{packageName:"@csstools/postcss-scope-pseudo-class",id:"scope-pseudo-class",importName:"postcssScopePseudoClass"},{packageName:"postcss-lab-function",id:"lab-function",importName:"postcssLabFunction"},{packageName:"postcss-logical",id:"logical-properties-and-values",importName:"postcssLogical"},{packageName:"@csstools/postcss-logical-float-and-clear",id:"float-clear-logical-values",importName:"postcssLogicalFloatAndClear"},{packageName:"@csstools/postcss-logical-resize",id:"logical-resize",importName:"postcssLogicalResize"},{packageName:"@csstools/postcss-logical-viewport-units",id:"logical-viewport-units",importName:"postcssLogicalViewportUnits"},{packageName:"@csstools/postcss-media-minmax",id:"media-query-ranges",importName:"postcssMediaMinmax"},{packageName:"@csstools/postcss-media-queries-aspect-ratio-number-values",id:"media-queries-aspect-ratio-number-values",importName:"postcssMediaQueriesAspectRatioNumberValues"},{packageName:"postcss-nesting",id:"nesting-rules",importName:"postcssNesting"},{packageName:"@csstools/postcss-normalize-display-values",id:"display-two-values",importName:"postcssNormalizeDisplayValues"},{packageName:"@csstools/postcss-oklab-function",id:"oklab-function",importName:"postcssOKLabFunction"},{packageName:"@csstools/postcss-relative-color-syntax",id:"relative-color-syntax",importName:"postcssRelativeColorSyntax"},{packageName:"postcss-opacity-percentage",id:"opacity-percentage",importName:"postcssOpacityPercentage"},{packageName:"postcss-overflow-shorthand",id:"overflow-property",importName:"postcssOverflowShorthand"},{packageName:"postcss-page-break",id:"break-properties",importName:"postcssPageBreak"},{packageName:"postcss-place",id:"place-properties",importName:"postcssPlace"},{packageName:"postcss-pseudo-class-any-link",id:"any-link-pseudo-class",importName:"postcssPseudoClassAnyLink"},{packageName:"postcss-replace-overflow-wrap",id:"overflow-wrap-property",importName:"postcssReplaceOverflowWrap"},{packageName:"postcss-selector-not",id:"not-pseudo-class",importName:"postcssSelectorNot"},{packageName:"@csstools/postcss-stepped-value-functions",id:"stepped-value-functions",importName:"postcssSteppedValueFunctions"},{packageName:"postcss-system-ui-font-family",importedPackage:"../patch/postcss-system-ui-font-family.mjs",id:"system-ui-font-family",importName:"postcssFontFamilySystemUI"},{packageName:"@csstools/postcss-unset-value",id:"unset-value",importName:"postcssUnsetValue"},{packageName:"@csstools/postcss-cascade-layers",id:"cascade-layers",importName:"postcssCascadeLayers"},{packageName:"@csstools/postcss-trigonometric-functions",id:"trigonometric-functions",importName:"postcssTrigonometricFunctions"},{packageName:"@csstools/postcss-nested-calc",id:"nested-calc",importName:"postcssNestedCalc"},{packageName:"@csstools/postcss-text-decoration-shorthand",id:"text-decoration-shorthand",importName:"postcssTextDecorationShorthand"},{packageName:"postcss-src",id:"src-function",importName:"postcssSrc"}];function getPackageNamesToIds(){const s={};return Ns.forEach((e=>{s[e.packageName]=e.id})),s}function pluginIdHelp(s,e,o){const t=Ns.map((s=>s.id)),i=Ns.map((s=>s.packageName)),r=getPackageNamesToIds();s.forEach((s=>{if(t.includes(s))return;const a=mostSimilar(s,t),c=mostSimilar(s,i);Math.min(a.distance,c.distance)>10?e.warn(o,`Unknown feature: "${s}", see the list of features https://github.com/csstools/postcss-plugins/blob/main/plugin-packs/postcss-preset-env/FEATURES.md`):a.distance<c.distance?e.warn(o,`Unknown feature: "${s}", did you mean: "${a.mostSimilar}"`):e.warn(o,`Unknown feature: "${s}", did you mean: "${r[c.mostSimilar]}"`)}))}function mostSimilar(s,e){let o="unknown",t=1/0;for(let i=0;i<e.length;i++){const r=levenshteinDistance(s,e[i]);r<t&&(t=r,o=e[i])}return{mostSimilar:o,distance:t}}function levenshteinDistance(s,e){if(!s.length)return e.length;if(!e.length)return s.length;const o=[];for(let t=0;t<=e.length;t++){o[t]=[t];for(let i=1;i<=s.length;i++)o[t][i]=0===t?i:Math.min(o[t-1][i]+1,o[t][i-1]+1,o[t-1][i-1]+(s[i-1]===e[t-1]?0:1))}return o[e.length][s.length]}const creator=t=>{const i=new Logger,r=Object(t),a=Object.keys(Object(r.features)),c=r.browsers,n=initializeSharedOptions(r),p=listFeatures(e,r,n,i),l=p.map((s=>s.plugin));!1!==r.autoprefixer&&l.push(s(Object.assign({overrideBrowserslist:c},r.autoprefixer))),l.push(o()),logFeaturesList(p,r,i);const internalPlugin=()=>({postcssPlugin:"postcss-preset-env",OnceExit:function(s,{result:e}){pluginIdHelp(a,s,e),r.debug&&i.dumpLogs(e),i.resetLogger()}});return internalPlugin.postcss=!0,{postcssPlugin:"postcss-preset-env",plugins:[...l,internalPlugin()]}};creator.postcss=!0,module.exports=creator;
