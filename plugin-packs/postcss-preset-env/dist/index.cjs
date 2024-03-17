"use strict";var s=require("autoprefixer"),e=require("cssdb"),o=require("browserslist"),t=require("@csstools/postcss-initial"),i=require("postcss-pseudo-class-any-link"),r=require("css-blank-pseudo"),a=require("postcss-page-break"),c=require("@csstools/postcss-cascade-layers"),n=require("postcss-attribute-case-insensitive"),p=require("postcss-clamp"),l=require("@csstools/postcss-color-function"),u=require("postcss-color-functional-notation"),m=require("@csstools/postcss-color-mix-function"),d=require("postcss-custom-media"),g=require("postcss-custom-properties"),f=require("postcss-custom-selectors"),b=require("postcss-dir-pseudo-class"),h=require("@csstools/postcss-normalize-display-values"),v=require("postcss-double-position-gradients"),N=require("@csstools/postcss-exponential-functions"),y=require("@csstools/postcss-logical-float-and-clear"),k=require("postcss-focus-visible"),w=require("postcss-focus-within"),q=require("@csstools/postcss-font-format-keywords"),x=require("postcss-font-variant"),F=require("@csstools/postcss-gamut-mapping"),O=require("postcss-gap-properties"),$=require("@csstools/postcss-gradients-interpolation-method"),S=require("css-has-pseudo"),P=require("postcss-color-hex-alpha"),C=require("@csstools/postcss-hwb-function"),I=require("@csstools/postcss-ic-unit"),B=require("postcss-image-set-function"),E=require("@csstools/postcss-is-pseudo-class"),A=require("postcss-lab-function"),L=require("@csstools/postcss-light-dark-function"),U=require("@csstools/postcss-logical-overflow"),_=require("@csstools/postcss-logical-overscroll-behavior"),j=require("postcss-logical"),D=require("@csstools/postcss-logical-resize"),M=require("@csstools/postcss-logical-viewport-units"),z=require("@csstools/postcss-media-queries-aspect-ratio-number-values"),R=require("@csstools/postcss-media-minmax"),V=require("@csstools/postcss-nested-calc"),T=require("postcss-nesting"),H=require("postcss-selector-not"),W=require("@csstools/postcss-oklab-function"),G=require("postcss-opacity-percentage"),K=require("postcss-overflow-shorthand"),Z=require("postcss-replace-overflow-wrap"),Q=require("postcss-place"),J=require("css-prefers-color-scheme"),X=require("@csstools/postcss-progressive-custom-properties"),Y=require("postcss-color-rebeccapurple"),ss=require("@csstools/postcss-relative-color-syntax"),es=require("@csstools/postcss-scope-pseudo-class"),os=require("@csstools/postcss-stepped-value-functions"),ts=require("@csstools/postcss-text-decoration-shorthand"),is=require("@csstools/postcss-trigonometric-functions"),rs=require("@csstools/postcss-unset-value");const as={"blank-pseudo-class":"https://github.com/csstools/postcss-plugins/blob/main/plugins/css-blank-pseudo/README.md#browser","focus-visible-pseudo-class":"https://github.com/WICG/focus-visible","focus-within-pseudo-class":"https://github.com/csstools/postcss-plugins/blob/main/plugins/postcss-focus-within/README.md#browser","has-pseudo-class":"https://github.com/csstools/postcss-plugins/blob/main/plugins/css-has-pseudo/README.md#browser","prefers-color-scheme-query":"https://github.com/csstools/postcss-plugins/blob/main/plugins/css-prefers-color-scheme/README.md#browser"},cs=["blank-pseudo-class","focus-visible-pseudo-class","focus-within-pseudo-class","has-pseudo-class","prefers-color-scheme-query"];function logFeaturesList(s,e,o){if(e.debug){o.log("Enabling the following feature(s):");const t=[],i=[];!1!==e.autoprefixer&&i.push("  autoprefixer"),s.forEach((s=>{s.id.startsWith("before")||s.id.startsWith("after")?i.push(`  ${s.id} (injected via options)`):i.push(`  ${s.id}`),void 0!==as[s.id]&&t.push(s.id)})),i.sort(((s,e)=>s.localeCompare(e))),t.sort(((s,e)=>s.localeCompare(e))),i.forEach((s=>o.log(s))),t.length&&(o.log("These feature(s) need a browser library to work:"),t.forEach((s=>o.log(` ${s}: ${as[s]}`))))}}function initializeSharedOptions(s){if("preserve"in s){const e={};return e.preserve=s.preserve,e}return!1}function clamp(s,e,o){return Math.max(s,Math.min(e,o))}const ns=2,ps=5;function stageFromOptions(s,e){let o=ns;if(void 0===s.stage)return e.log(`Using features from Stage ${o} (default)`),o;if(!1===s.stage)o=ps;else{let e=parseInt(s.stage,10);Number.isNaN(e)&&(e=0),o=clamp(0,e,ps)}return o===ps?e.log('Stage has been disabled, features will be handled via the "features" option.'):e.log(`Using features from Stage ${o}`),o}const ls=Symbol("insertBefore"),us=Symbol("insertAfter"),ms=Symbol("insertOrder"),ds=Symbol("plugin");function getTransformedInsertions(s,e,o){if("insertBefore"!==o&&"insertAfter"!==o)return[];const t="insertBefore"===o?ls:us,i=[];for(const o in e){if(!Object.hasOwnProperty.call(e,o))continue;if(!s.find((s=>s.id===o)))continue;let r=e[o];Array.isArray(r)||(r=[r]);for(let s=0;s<r.length;s++)i.push({id:o,[ds]:r[s],[ms]:s,[t]:!0})}return i}var gs=["custom-media-queries","environment-variables","image-set-function","media-query-ranges","media-queries-aspect-ratio-number-values","prefers-color-scheme-query","nesting-rules","custom-selectors","any-link-pseudo-class","case-insensitive-attributes","focus-visible-pseudo-class","focus-within-pseudo-class","not-pseudo-class","logical-properties-and-values","float-clear-logical-values","logical-overflow","logical-overscroll-behavior","logical-resize","logical-viewport-units","dir-pseudo-class","all-property","gradients-interpolation-method","color-mix","relative-color-syntax","lab-function","oklab-function","color-function","hwb-function","color-functional-notation","rebeccapurple-color","hexadecimal-alpha-notation","light-dark-function","double-position-gradients","blank-pseudo-class","break-properties","font-variant-property","is-pseudo-class","scope-pseudo-class","has-pseudo-class","gap-properties","overflow-property","overflow-wrap-property","place-properties","system-ui-font-family","font-format-keywords","display-two-values","ic-unit","opacity-percentage","text-decoration-shorthand","unset-value","stepped-value-functions","trigonometric-functions","exponential-functions","clamp","nested-calc","custom-properties","cascade-layers","progressive-custom-properties","gamut-mapping"];function featureIsLess(s,e){return s.id===e.id?s[ls]&&e[ls]||s[us]&&e[us]?clamp(-1,s[ms]-e[ms],1):s[ls]||e[us]?-1:s[us]||e[ls]?1:0:clamp(-1,gs.indexOf(s.id)-gs.indexOf(e.id),1)}function postcssSystemUiFont(){return{postcssPlugin:"postcss-system-ui-font",Declaration(s){fs.test(s.prop)&&(s.value.includes(vs)||(s.value=s.value.replace(Ns,ys)))}}}postcssSystemUiFont.postcss=!0;const fs=/(?:^(?:-|\\002d){2})|(?:^font(?:-family)?$)/i,bs="[\\f\\n\\r\\x09\\x20]",hs=["system-ui","-apple-system","Segoe UI","Roboto","Ubuntu","Cantarell","Noto Sans","sans-serif"],vs=hs.join(", "),Ns=new RegExp(`(^|,|${bs}+)(?:system-ui${bs}*)(?:,${bs}*(?:${hs.join("|")})${bs}*)?(,|$)`,"i"),ys=`$1${vs}$2`,ks=new Map([["all-property",t],["any-link-pseudo-class",i],["blank-pseudo-class",r],["break-properties",a],["cascade-layers",c],["case-insensitive-attributes",n],["clamp",p],["color-function",l],["color-functional-notation",u],["color-mix",m],["custom-media-queries",d],["custom-properties",g],["custom-selectors",f],["dir-pseudo-class",b],["display-two-values",h],["double-position-gradients",v],["exponential-functions",N],["float-clear-logical-values",y],["focus-visible-pseudo-class",k],["focus-within-pseudo-class",w],["font-format-keywords",q],["font-variant-property",x],["gamut-mapping",F],["gap-properties",O],["gradients-interpolation-method",$],["has-pseudo-class",S],["hexadecimal-alpha-notation",P],["hwb-function",C],["ic-unit",I],["image-set-function",B],["is-pseudo-class",E],["lab-function",A],["light-dark-function",L],["logical-overflow",U],["logical-overscroll-behavior",_],["logical-properties-and-values",j],["logical-resize",D],["logical-viewport-units",M],["media-queries-aspect-ratio-number-values",z],["media-query-ranges",R],["nested-calc",V],["nesting-rules",T],["not-pseudo-class",H],["oklab-function",W],["opacity-percentage",G],["overflow-property",K],["overflow-wrap-property",Z],["place-properties",Q],["prefers-color-scheme-query",J],["progressive-custom-properties",X],["rebeccapurple-color",Y],["relative-color-syntax",ss],["scope-pseudo-class",es],["stepped-value-functions",os],["system-ui-font-family",postcssSystemUiFont],["text-decoration-shorthand",ts],["trigonometric-functions",is],["unset-value",rs]]);function featureIsInsertedOrHasAPlugin(s){return!!s[ls]||(!!s[us]||!!ks.has(s.id))}function prepareFeaturesList(s,e,o){return s.concat(getTransformedInsertions(s,e,"insertBefore"),getTransformedInsertions(s,o,"insertAfter")).filter((s=>featureIsInsertedOrHasAPlugin(s))).sort(((s,e)=>featureIsLess(s,e)))}const ws=["and_chr","and_ff","android","chrome","edge","firefox","ie","ios_saf","op_mini","op_mob","opera","safari","samsung"];function getUnsupportedBrowsersByFeature(s){if(!s)return[];if(!("browser_support"in s))return["> 0%"];const e=[];return ws.forEach((o=>{if("op_mini"===o&&void 0===s.browser_support[o])return void e.push("op_mini all");const t=s.browser_support[o];"string"==typeof t&&qs.test(t)?e.push(`${o} < ${s.browser_support[o]}`):e.push(`${o} >= 1`)})),e}const qs=/^[0-9|.]+$/;function getOptionsForBrowsersByFeature(s,e,o,t,i){switch(e.id){case"is-pseudo-class":return{onComplexSelector:"warning"};case"nesting-rules":if(needsOptionFor(o.find((s=>"is-pseudo-class"===s.id)),s))return i.log('Disabling :is on "nesting-rules" due to lack of browser support.'),{noIsPseudoSelector:!0};return{};case"any-link-pseudo-class":if(s.find((s=>s.startsWith("ie ")||s.startsWith("edge "))))return i.log('Adding area[href] fallbacks for ":any-link" support in Edge and IE.'),{subFeatures:{areaHrefNeedsFixing:!0}};return{};case"logical-properties-and-values":case"float-clear-logical-values":case"logical-resize":case"logical-viewport-units":case"logical-overflow":case"logical-overscroll-behavior":return"logical"in t?t.logical:{};default:return{}}}function needsOptionFor(s,e){const t=getUnsupportedBrowsersByFeature(s),i=o(t,{ignoreUnknownVersions:!0});return!!e.some((s=>i.some((e=>e===s))))}function formatPolyfillableFeature(s){const e=getUnsupportedBrowsersByFeature(s);if(s[ls]||s[us]){let o=s.id;return o=s.insertBefore?`before-${o}`:`after-${o}`,{browsers:e,vendors_implementations:s.vendors_implementations,plugin:s[ds],id:o,stage:ps+1}}return{browsers:e,vendors_implementations:s.vendors_implementations,plugin:ks.get(s.id),id:s.id,stage:s.stage}}function formatStagedFeature(s,e,o,t,i,r,a){let c,n;return c=getOptionsForBrowsersByFeature(e,t,s,r,a),c=i?Object.assign({},c,i,featureOptions(o,t.id)):Object.assign({},c,featureOptions(o,t.id)),"progressive-custom-properties"!==t.id&&(c.enableProgressiveCustomProperties=!1),"overflow-wrap-property"===t.id&&"preserve"in c&&(c.method=c.preserve?"copy":"replace"),n=t.plugin.postcss&&"function"==typeof t.plugin?t.plugin(c):t.plugin&&t.plugin.default&&"function"==typeof t.plugin.default&&t.plugin.default.postcss?t.plugin.default(c):t.plugin,{browsers:t.browsers,vendors_implementations:t.vendors_implementations,plugin:n,pluginOptions:c,id:t.id}}function featureOptions(s,e){if(!(e in s))return;const o=s[e];return Array.isArray(o)?o[1]:o}function intOrZero(s){const e=parseInt(s,10);return Number.isNaN(e)?0:e}const xs=new Set(["progressive-custom-properties"]);function listFeatures(s,e,t,i){const r=Object(e.features),a="enableClientSidePolyfills"in e&&e.enableClientSidePolyfills,c=Object(e.insertBefore),n=Object(e.insertAfter),p=e.browsers?void 0:e.env,l=e.browsers,u=clamp(0,intOrZero(e.minimumVendorImplementations),3);u>0&&i.log(`Using features with ${u} or more vendor implementations`);const m=stageFromOptions(e,i),d=prepareFeaturesList([...s,{id:"progressive-custom-properties"}],c,n).map((s=>formatPolyfillableFeature(s))).filter((s=>!!xs.has(s.id)||(0===u||(!(!s[ls]&&!s[us])||(u<=s.vendors_implementations||(!0===featureEnabledByOptions(r,s.id)?(i.log(`  ${s.id} does not meet the required vendor implementations but has been enabled by options`),!0):(i.log(`  ${s.id} with ${s.vendors_implementations} vendor implementations has been disabled`),!1))))))),g=o(l,{env:p,ignoreUnknownVersions:!0}).filter((s=>ws.includes(s.split(" ")[0])));return d.filter((s=>{if(xs.has(s.id))return!0;const e=s.stage>=m,o=a||!cs.includes(s.id),t=featureEnabledByOptions(r,s.id),c=!1===t,n=!0===t||e&&o;return c?i.log(`  ${s.id} has been disabled by options`):e?o||i.log(`  ${s.id} has been disabled by "enableClientSidePolyfills: false".`):n?i.log(`  ${s.id} does not meet the required stage but has been enabled by options`):i.log(`  ${s.id} with stage ${s.stage} has been disabled`),!c&&n})).map((o=>formatStagedFeature(s,g,r,o,t,e,i))).filter((s=>{if(xs.has(s.id))return!0;const e=featureEnabledByOptions(r,s.id);if(!0===e||!1===e)return e;const t=o(s.browsers,{ignoreUnknownVersions:!0}),a=g.some((s=>t.some((e=>e===s))));return a||i.log(`${s.id} disabled due to browser support`),a}))}function featureEnabledByOptions(s,e){if(!(e in s))return"auto";const o=s[e];return Array.isArray(o)?!0===o[0]||!1!==o[0]&&"auto":Boolean(o)}class Logger{constructor(){this.logs=[]}log(s){this.logs.push(s)}resetLogger(){this.logs.length=0}dumpLogs(s){s&&s.warn(this.logs.join("\n")),this.resetLogger()}}var Fs=[{packageName:"css-blank-pseudo",id:"blank-pseudo-class",importName:"postcssBlankPseudo"},{packageName:"css-has-pseudo",id:"has-pseudo-class",importName:"postcssHasPseudo"},{packageName:"css-prefers-color-scheme",id:"prefers-color-scheme-query",importName:"postcssPrefersColorScheme"},{packageName:"postcss-attribute-case-insensitive",id:"case-insensitive-attributes",importName:"postcssAttributeCaseInsensitive"},{packageName:"postcss-clamp",id:"clamp",importName:"postcssClamp"},{packageName:"@csstools/postcss-color-mix-function",id:"color-mix",importName:"postcssColorMixFunction"},{packageName:"@csstools/postcss-color-function",id:"color-function",importName:"postcssColorFunction"},{packageName:"postcss-color-functional-notation",id:"color-functional-notation",importName:"postcssColorFunctionalNotation"},{packageName:"postcss-color-hex-alpha",id:"hexadecimal-alpha-notation",importName:"postcssColorHexAlpha"},{packageName:"postcss-color-rebeccapurple",id:"rebeccapurple-color",importName:"postcssColorRebeccapurple"},{packageName:"postcss-custom-media",id:"custom-media-queries",importName:"postcssCustomMedia"},{packageName:"postcss-custom-properties",id:"custom-properties",importName:"postcssCustomProperties"},{packageName:"postcss-custom-selectors",id:"custom-selectors",importName:"postcssCustomSelectors"},{packageName:"postcss-dir-pseudo-class",id:"dir-pseudo-class",importName:"postcssDirPseudoClass"},{packageName:"postcss-double-position-gradients",id:"double-position-gradients",importName:"postcssDoublePositionGradients"},{packageName:"@csstools/postcss-exponential-functions",id:"exponential-functions",importName:"postcssExponentialFunctions"},{packageName:"postcss-focus-visible",id:"focus-visible-pseudo-class",importName:"postcssFocusVisible"},{packageName:"postcss-focus-within",id:"focus-within-pseudo-class",importName:"postcssFocusWithin"},{packageName:"@csstools/postcss-font-format-keywords",id:"font-format-keywords",importName:"postcssFontFormatKeywords"},{packageName:"postcss-font-variant",id:"font-variant-property",importName:"postcssFontVariant"},{packageName:"@csstools/postcss-gamut-mapping",id:"gamut-mapping",importName:"postcssGamutMapping"},{packageName:"postcss-gap-properties",id:"gap-properties",importName:"postcssGapProperties"},{packageName:"@csstools/postcss-gradients-interpolation-method",id:"gradients-interpolation-method",importName:"postcssGradientsInterpolationMethod"},{packageName:"@csstools/postcss-hwb-function",id:"hwb-function",importName:"postcssHWBFunction"},{packageName:"@csstools/postcss-ic-unit",id:"ic-unit",importName:"postcssICUnit"},{packageName:"postcss-image-set-function",id:"image-set-function",importName:"postcssImageSetFunction"},{packageName:"@csstools/postcss-initial",id:"all-property",importName:"postcssInitial"},{packageName:"@csstools/postcss-is-pseudo-class",id:"is-pseudo-class",importName:"postcssIsPseudoClass"},{packageName:"@csstools/postcss-scope-pseudo-class",id:"scope-pseudo-class",importName:"postcssScopePseudoClass"},{packageName:"postcss-lab-function",id:"lab-function",importName:"postcssLabFunction"},{packageName:"@csstools/postcss-light-dark-function",id:"light-dark-function",importName:"postcssLightDarkFunction"},{packageName:"postcss-logical",id:"logical-properties-and-values",importName:"postcssLogical"},{packageName:"@csstools/postcss-logical-float-and-clear",id:"float-clear-logical-values",importName:"postcssLogicalFloatAndClear"},{packageName:"@csstools/postcss-logical-overflow",id:"logical-overflow",importName:"postcssLogicalOverflow"},{packageName:"@csstools/postcss-logical-overscroll-behavior",id:"logical-overscroll-behavior",importName:"postcssLogicalOverscrollBehavor"},{packageName:"@csstools/postcss-logical-resize",id:"logical-resize",importName:"postcssLogicalResize"},{packageName:"@csstools/postcss-logical-viewport-units",id:"logical-viewport-units",importName:"postcssLogicalViewportUnits"},{packageName:"@csstools/postcss-media-minmax",id:"media-query-ranges",importName:"postcssMediaMinmax"},{packageName:"@csstools/postcss-media-queries-aspect-ratio-number-values",id:"media-queries-aspect-ratio-number-values",importName:"postcssMediaQueriesAspectRatioNumberValues"},{packageName:"postcss-nesting",id:"nesting-rules",importName:"postcssNesting"},{packageName:"@csstools/postcss-normalize-display-values",id:"display-two-values",importName:"postcssNormalizeDisplayValues"},{packageName:"@csstools/postcss-oklab-function",id:"oklab-function",importName:"postcssOKLabFunction"},{packageName:"@csstools/postcss-relative-color-syntax",id:"relative-color-syntax",importName:"postcssRelativeColorSyntax"},{packageName:"postcss-opacity-percentage",id:"opacity-percentage",importName:"postcssOpacityPercentage"},{packageName:"postcss-overflow-shorthand",id:"overflow-property",importName:"postcssOverflowShorthand"},{packageName:"postcss-page-break",id:"break-properties",importName:"postcssPageBreak"},{packageName:"postcss-place",id:"place-properties",importName:"postcssPlace"},{packageName:"postcss-pseudo-class-any-link",id:"any-link-pseudo-class",importName:"postcssPseudoClassAnyLink"},{packageName:"postcss-replace-overflow-wrap",id:"overflow-wrap-property",importName:"postcssReplaceOverflowWrap"},{packageName:"postcss-selector-not",id:"not-pseudo-class",importName:"postcssSelectorNot"},{packageName:"@csstools/postcss-stepped-value-functions",id:"stepped-value-functions",importName:"postcssSteppedValueFunctions"},{packageName:"postcss-system-ui-font-family",importedPackage:"../patch/postcss-system-ui-font-family.mjs",id:"system-ui-font-family",importName:"postcssFontFamilySystemUI"},{packageName:"@csstools/postcss-unset-value",id:"unset-value",importName:"postcssUnsetValue"},{packageName:"@csstools/postcss-cascade-layers",id:"cascade-layers",importName:"postcssCascadeLayers"},{packageName:"@csstools/postcss-trigonometric-functions",id:"trigonometric-functions",importName:"postcssTrigonometricFunctions"},{packageName:"@csstools/postcss-nested-calc",id:"nested-calc",importName:"postcssNestedCalc"},{packageName:"@csstools/postcss-text-decoration-shorthand",id:"text-decoration-shorthand",importName:"postcssTextDecorationShorthand"},{packageName:"@csstools/postcss-progressive-custom-properties",id:"progressive-custom-properties",importName:"postcssProgressiveCustomProperties",omitTypedOptions:!0,omitDocs:!0}];function getPackageNamesToIds(){const s={};return Fs.forEach((e=>{s[e.packageName]=e.id})),s}function pluginIdHelp(s,e,o){const t=Fs.map((s=>s.id)),i=Fs.map((s=>s.packageName)),r=getPackageNamesToIds();s.forEach((s=>{if(t.includes(s))return;const a=[...t.map((e=>[e,levenshteinDistance(s,e)])),...i.map((e=>[r[e],levenshteinDistance(s,e)]))].sort(((s,e)=>s[1]-e[1])).filter((s=>s[1]<10)),c=new Set;for(let s=0;s<a.length&&(c.add(a[s][0]),!(c.size>=3));s++);if(!c.size)return void e.warn(o,`Unknown feature: "${s}", see the list of features https://github.com/csstools/postcss-plugins/blob/main/plugin-packs/postcss-preset-env/FEATURES.md`);let n='"';n+=Array.from(c).join('", "'),n+='"',e.warn(o,`Unknown feature: "${s}", did you mean one of: ${n}`)}))}function levenshteinDistance(s,e){if(!s.length)return e.length;if(!e.length)return s.length;const o=[];for(let t=0;t<=e.length;t++){o[t]=[t];for(let i=1;i<=s.length;i++)o[t][i]=0===t?i:Math.min(o[t-1][i]+1,o[t][i-1]+1,o[t-1][i-1]+(s[i-1]===e[t-1]?0:1))}return o[e.length][s.length]}const creator=o=>{const t=new Logger,i=Object(o),r=Object.keys(Object(i.features)),a=i.browsers?void 0:i.env,c=i.browsers,n=initializeSharedOptions(i),p=listFeatures(e,i,n,t),l=p.map((s=>s.plugin));!1!==i.autoprefixer&&l.push(s(Object.assign({env:a,overrideBrowserslist:c},i.autoprefixer))),logFeaturesList(p,i,t);const internalPlugin=()=>({postcssPlugin:"postcss-preset-env",OnceExit(s,{result:e}){pluginIdHelp(r,s,e),i.debug&&t.dumpLogs(e),t.resetLogger()}});return internalPlugin.postcss=!0,{postcssPlugin:"postcss-preset-env",plugins:[...l,internalPlugin()]}};creator.postcss=!0,module.exports=creator;
