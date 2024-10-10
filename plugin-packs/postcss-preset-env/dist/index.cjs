"use strict";var s=require("autoprefixer"),e=require("cssdb"),o=require("browserslist"),t=require("@csstools/postcss-initial"),i=require("postcss-pseudo-class-any-link"),r=require("css-blank-pseudo"),a=require("postcss-page-break"),c=require("@csstools/postcss-cascade-layers"),n=require("postcss-attribute-case-insensitive"),p=require("postcss-clamp"),l=require("@csstools/postcss-color-function"),u=require("postcss-color-functional-notation"),m=require("@csstools/postcss-color-mix-function"),d=require("@csstools/postcss-content-alt-text"),g=require("postcss-custom-media"),f=require("postcss-custom-properties"),h=require("postcss-custom-selectors"),b=require("postcss-dir-pseudo-class"),v=require("@csstools/postcss-normalize-display-values"),N=require("postcss-double-position-gradients"),k=require("@csstools/postcss-exponential-functions"),y=require("@csstools/postcss-logical-float-and-clear"),w=require("postcss-focus-visible"),q=require("postcss-focus-within"),x=require("@csstools/postcss-font-format-keywords"),F=require("postcss-font-variant"),$=require("@csstools/postcss-gamut-mapping"),O=require("postcss-gap-properties"),S=require("@csstools/postcss-gradients-interpolation-method"),C=require("css-has-pseudo"),P=require("postcss-color-hex-alpha"),E=require("@csstools/postcss-hwb-function"),I=require("@csstools/postcss-ic-unit"),A=require("postcss-image-set-function"),B=require("@csstools/postcss-is-pseudo-class"),L=require("postcss-lab-function"),_=require("@csstools/postcss-light-dark-function"),U=require("@csstools/postcss-logical-overflow"),j=require("@csstools/postcss-logical-overscroll-behavior"),M=require("postcss-logical"),z=require("@csstools/postcss-logical-resize"),D=require("@csstools/postcss-logical-viewport-units"),R=require("@csstools/postcss-media-queries-aspect-ratio-number-values"),T=require("@csstools/postcss-media-minmax"),V=require("@csstools/postcss-nested-calc"),H=require("postcss-nesting"),W=require("postcss-selector-not"),G=require("@csstools/postcss-oklab-function"),K=require("postcss-opacity-percentage"),Z=require("postcss-overflow-shorthand"),Q=require("postcss-replace-overflow-wrap"),J=require("postcss-place"),X=require("css-prefers-color-scheme"),Y=require("@csstools/postcss-progressive-custom-properties"),ss=require("postcss-color-rebeccapurple"),es=require("@csstools/postcss-relative-color-syntax"),os=require("@csstools/postcss-scope-pseudo-class"),ts=require("@csstools/postcss-stepped-value-functions"),is=require("@csstools/postcss-text-decoration-shorthand"),rs=require("@csstools/postcss-trigonometric-functions"),as=require("@csstools/postcss-unset-value");const cs={"blank-pseudo-class":"https://github.com/csstools/postcss-plugins/blob/main/plugins/css-blank-pseudo/README.md#browser","focus-visible-pseudo-class":"https://github.com/WICG/focus-visible","focus-within-pseudo-class":"https://github.com/csstools/postcss-plugins/blob/main/plugins/postcss-focus-within/README.md#browser","has-pseudo-class":"https://github.com/csstools/postcss-plugins/blob/main/plugins/css-has-pseudo/README.md#browser","prefers-color-scheme-query":"https://github.com/csstools/postcss-plugins/blob/main/plugins/css-prefers-color-scheme/README.md#browser"},ns=["blank-pseudo-class","focus-visible-pseudo-class","focus-within-pseudo-class","has-pseudo-class","prefers-color-scheme-query"];function logFeaturesList(s,e,o){if(e.debug){o.log("Enabling the following feature(s):");const t=[],i=[];!1!==e.autoprefixer&&i.push("  autoprefixer"),s.forEach((s=>{s.id.startsWith("before")||s.id.startsWith("after")?i.push(`  ${s.id} (injected via options)`):i.push(`  ${s.id}`),void 0!==cs[s.id]&&t.push(s.id)})),i.sort(((s,e)=>s.localeCompare(e))),t.sort(((s,e)=>s.localeCompare(e))),i.forEach((s=>o.log(s))),t.length&&(o.log("These feature(s) need a browser library to work:"),t.forEach((s=>o.log(`  ${s}: ${cs[s]}`))))}}function initializeSharedOptions(s){if("preserve"in s){const e={};return e.preserve=s.preserve,e}return!1}function clamp(s,e,o){return Math.max(s,Math.min(e,o))}function stageFromOptions(s,e){let o=2;if(void 0===s.stage)return e.log("Using features from Stage 2 (default)."),o;if(!1===s.stage)o=5;else{let e=parseInt(s.stage,10);Number.isNaN(e)&&(e=0),o=clamp(0,e,5)}return 5===o?e.log('Stage has been disabled, features will be handled via the "features" option.'):e.log(`Using features from Stage ${o}.`),o}const ps=Symbol("insertBefore"),ls=Symbol("insertAfter"),us=Symbol("insertOrder"),ms=Symbol("plugin");function getTransformedInsertions(s,e,o){if("insertBefore"!==o&&"insertAfter"!==o)return[];const t="insertBefore"===o?ps:ls,i=[];for(const o in e){if(!Object.hasOwnProperty.call(e,o))continue;if(!s.find((s=>s.id===o)))continue;let r=e[o];Array.isArray(r)||(r=[r]);for(let s=0;s<r.length;s++)i.push({id:o,[ms]:r[s],[us]:s,[t]:!0})}return i}var ds=["custom-media-queries","environment-variables","image-set-function","media-query-ranges","media-queries-aspect-ratio-number-values","prefers-color-scheme-query","nesting-rules","custom-selectors","any-link-pseudo-class","case-insensitive-attributes","focus-visible-pseudo-class","focus-within-pseudo-class","not-pseudo-class","logical-properties-and-values","float-clear-logical-values","logical-overflow","logical-overscroll-behavior","logical-resize","logical-viewport-units","dir-pseudo-class","all-property","gradients-interpolation-method","color-mix","relative-color-syntax","lab-function","oklab-function","color-function","hwb-function","color-functional-notation","rebeccapurple-color","hexadecimal-alpha-notation","light-dark-function","double-position-gradients","blank-pseudo-class","break-properties","font-variant-property","is-pseudo-class","scope-pseudo-class","has-pseudo-class","gap-properties","overflow-property","overflow-wrap-property","place-properties","system-ui-font-family","font-format-keywords","display-two-values","content-alt-text","ic-unit","opacity-percentage","text-decoration-shorthand","unset-value","stepped-value-functions","trigonometric-functions","exponential-functions","clamp","nested-calc","custom-properties","cascade-layers","progressive-custom-properties","gamut-mapping"];function featureIsLess(s,e){return s.id===e.id?s[ps]&&e[ps]||s[ls]&&e[ls]?clamp(-1,s[us]-e[us],1):s[ps]||e[ls]?-1:s[ls]||e[ps]?1:0:clamp(-1,ds.indexOf(s.id)-ds.indexOf(e.id),1)}function postcssSystemUiFont(){return{postcssPlugin:"postcss-system-ui-font",Declaration(s){gs.test(s.prop)&&(s.value.includes(bs)||(s.value=s.value.replace(vs,Ns)))}}}postcssSystemUiFont.postcss=!0;const gs=/(?:^(?:-|\\002d){2})|(?:^font(?:-family)?$)/i,fs="[\\f\\n\\r\\x09\\x20]",hs=["system-ui","-apple-system","Segoe UI","Roboto","Ubuntu","Cantarell","Noto Sans","sans-serif"],bs=hs.join(", "),vs=new RegExp(`(^|,|${fs}+)(?:system-ui${fs}*)(?:,${fs}*(?:${hs.join("|")})${fs}*)?(,|$)`,"i"),Ns=`$1${bs}$2`,ks=new Map([["all-property",t],["any-link-pseudo-class",i],["blank-pseudo-class",r],["break-properties",a],["cascade-layers",c],["case-insensitive-attributes",n],["clamp",p],["color-function",l],["color-functional-notation",u],["color-mix",m],["content-alt-text",d],["custom-media-queries",g],["custom-properties",f],["custom-selectors",h],["dir-pseudo-class",b],["display-two-values",v],["double-position-gradients",N],["exponential-functions",k],["float-clear-logical-values",y],["focus-visible-pseudo-class",w],["focus-within-pseudo-class",q],["font-format-keywords",x],["font-variant-property",F],["gamut-mapping",$],["gap-properties",O],["gradients-interpolation-method",S],["has-pseudo-class",C],["hexadecimal-alpha-notation",P],["hwb-function",E],["ic-unit",I],["image-set-function",A],["is-pseudo-class",B],["lab-function",L],["light-dark-function",_],["logical-overflow",U],["logical-overscroll-behavior",j],["logical-properties-and-values",M],["logical-resize",z],["logical-viewport-units",D],["media-queries-aspect-ratio-number-values",R],["media-query-ranges",T],["nested-calc",V],["nesting-rules",H],["not-pseudo-class",W],["oklab-function",G],["opacity-percentage",K],["overflow-property",Z],["overflow-wrap-property",Q],["place-properties",J],["prefers-color-scheme-query",X],["progressive-custom-properties",Y],["rebeccapurple-color",ss],["relative-color-syntax",es],["scope-pseudo-class",os],["stepped-value-functions",ts],["system-ui-font-family",postcssSystemUiFont],["text-decoration-shorthand",is],["trigonometric-functions",rs],["unset-value",as]]);function featureIsInsertedOrHasAPlugin(s){return!!s[ps]||(!!s[ls]||!!ks.has(s.id))}function prepareFeaturesList(s,e,o){return s.concat(getTransformedInsertions(s,e,"insertBefore"),getTransformedInsertions(s,o,"insertAfter")).filter((s=>featureIsInsertedOrHasAPlugin(s))).sort(((s,e)=>featureIsLess(s,e)))}function getOptionsForBrowsersByFeature(s,e,o,t){switch(e.id){case"is-pseudo-class":return{onComplexSelector:"warning"};case"any-link-pseudo-class":if(s.find((s=>s.startsWith("ie ")||"edge 12"===s||"edge 13"===s||"edge 14"===s||"edge 15"===s||"edge 16"===s||"edge 17"===s||"edge 18"===s)))return t.log("- 'any-link-pseudo-class' setting 'subFeatures: { areaHrefNeedsFixing: true }' due to lack of browser support for area[href] in Edge and IE."),{subFeatures:{areaHrefNeedsFixing:!0}};return{};case"logical-properties-and-values":case"float-clear-logical-values":case"logical-resize":case"logical-viewport-units":case"logical-overflow":case"logical-overscroll-behavior":return"logical"in o?o.logical:{};default:return{}}}const ys=["and_chr","and_ff","android","chrome","edge","firefox","ie","ios_saf","op_mini","op_mob","opera","safari","samsung"];function getUnsupportedBrowsersByFeature(s){if(!s)return[];if(!("browser_support"in s))return["> 0%"];const e=[];return ys.forEach((o=>{if("op_mini"===o&&void 0===s.browser_support[o])return void e.push("op_mini all");const t=s.browser_support[o];"string"==typeof t&&ws.test(t)?e.push(`${o} < ${s.browser_support[o]}`):e.push(`${o} >= 1`)})),e}const ws=/^[0-9|.]+$/;function formatPolyfillableFeature(s){const e=getUnsupportedBrowsersByFeature(s);if(s[ps]||s[ls]){let o=s.id;return o=s.insertBefore?`before-${o}`:`after-${o}`,{browsers:e,vendors_implementations:s.vendors_implementations,plugin:s[ms],id:o,stage:6}}return{browsers:e,vendors_implementations:s.vendors_implementations,plugin:ks.get(s.id),id:s.id,stage:s.stage}}function formatStagedFeature(s,e,o,t,i,r){let a,c;return a=getOptionsForBrowsersByFeature(s,o,i,r),a=t?Object.assign({},a,t,featureOptions(e,o.id)):Object.assign({},a,featureOptions(e,o.id)),"progressive-custom-properties"!==o.id&&(a.enableProgressiveCustomProperties=!1),"overflow-wrap-property"===o.id&&"preserve"in a&&(a.method=a.preserve?"copy":"replace"),c=o.plugin.postcss&&"function"==typeof o.plugin?o.plugin(a):o.plugin&&o.plugin.default&&"function"==typeof o.plugin.default&&o.plugin.default.postcss?o.plugin.default(a):o.plugin,{browsers:o.browsers,vendors_implementations:o.vendors_implementations,plugin:c,pluginOptions:a,id:o.id}}function featureOptions(s,e){if(!(e in s))return;const o=s[e];return Array.isArray(o)?o[1]:o}function intOrZero(s){const e=parseInt(s,10);return Number.isNaN(e)?0:e}const qs=new Set(["progressive-custom-properties"]);function listFeatures(s,e,t,i){const r=Object(e.features),a="enableClientSidePolyfills"in e&&e.enableClientSidePolyfills,c=Object(e.insertBefore),n=Object(e.insertAfter),p=e.browsers?void 0:e.env,l=e.browsers,u=clamp(0,intOrZero(e.minimumVendorImplementations),3);u>0&&i.log(`Using features with ${u} or more vendor implementations.`);const m=stageFromOptions(e,i),d=prepareFeaturesList([...s,{id:"progressive-custom-properties"}],c,n).map((s=>formatPolyfillableFeature(s))).filter((s=>!!qs.has(s.id)||(0===u||(!(!s[ps]&&!s[ls])||(u<=s.vendors_implementations||(!0===featureEnabledByOptions(r,s.id)?(i.log(`- '${s.id}' enabled manually even when it lacks the required interop (${s.vendors_implementations} out of ${u}).`),!0):(i.log(`- '${s.id}' disabled because it lacks the required interop (${s.vendors_implementations} out of ${u}).`),!1))))))),g=o(l,{env:p,ignoreUnknownVersions:!0}).filter((s=>ys.includes(s.split(" ")[0])));return d.filter((s=>{if(qs.has(s.id))return!0;const e=s.stage>=m,o=a||!ns.includes(s.id),t=featureEnabledByOptions(r,s.id),c=!1===t,n=!0===t||e&&o;return c?i.log(`- '${s.id}' disabled manually`):e?o||i.log(`- '${s.id}' disabled because 'enableClientSidePolyfills' is 'false'.`):n?i.log(`- '${s.id}' enabled manually even when it lacks the required stage (${s.stage} out of ${m}).`):i.log(`- '${s.id}' disabled because it lacks the required stage (${s.stage} out of ${m}).`),!c&&n})).map((s=>formatStagedFeature(g,r,s,t,e,i))).filter((s=>{if(qs.has(s.id))return!0;const e=featureEnabledByOptions(r,s.id);if(!0===e||!1===e)return e;const t=o(s.browsers,{ignoreUnknownVersions:!0}),a=g.filter((s=>t.some((e=>e===s))));return a.length>0?i.log(`- '${s.id}' enabled for:\n    ${a.join("\n    ")}`):i.log(`- '${s.id}' disabled because all targeted browsers support it.`),a.length>0}))}function featureEnabledByOptions(s,e){if(!(e in s))return"auto";const o=s[e];return Array.isArray(o)?!0===o[0]||!1!==o[0]&&"auto":Boolean(o)}class Logger{constructor(){this.logs=[]}log(s){this.logs.push(s)}resetLogger(){this.logs.length=0}emitLogs(s){s&&s.warn(this.logs.join("\n")),this.resetLogger()}}var xs=[{packageName:"css-blank-pseudo",id:"blank-pseudo-class",importName:"postcssBlankPseudo"},{packageName:"css-has-pseudo",id:"has-pseudo-class",importName:"postcssHasPseudo"},{packageName:"css-prefers-color-scheme",id:"prefers-color-scheme-query",importName:"postcssPrefersColorScheme"},{packageName:"postcss-attribute-case-insensitive",id:"case-insensitive-attributes",importName:"postcssAttributeCaseInsensitive"},{packageName:"postcss-clamp",id:"clamp",importName:"postcssClamp"},{packageName:"@csstools/postcss-color-mix-function",id:"color-mix",importName:"postcssColorMixFunction"},{packageName:"@csstools/postcss-color-function",id:"color-function",importName:"postcssColorFunction"},{packageName:"postcss-color-functional-notation",id:"color-functional-notation",importName:"postcssColorFunctionalNotation"},{packageName:"postcss-color-hex-alpha",id:"hexadecimal-alpha-notation",importName:"postcssColorHexAlpha"},{packageName:"@csstools/postcss-content-alt-text",id:"content-alt-text",importName:"postcssContentAltText"},{packageName:"postcss-color-rebeccapurple",id:"rebeccapurple-color",importName:"postcssColorRebeccapurple"},{packageName:"postcss-custom-media",id:"custom-media-queries",importName:"postcssCustomMedia"},{packageName:"postcss-custom-properties",id:"custom-properties",importName:"postcssCustomProperties"},{packageName:"postcss-custom-selectors",id:"custom-selectors",importName:"postcssCustomSelectors"},{packageName:"postcss-dir-pseudo-class",id:"dir-pseudo-class",importName:"postcssDirPseudoClass"},{packageName:"postcss-double-position-gradients",id:"double-position-gradients",importName:"postcssDoublePositionGradients"},{packageName:"@csstools/postcss-exponential-functions",id:"exponential-functions",importName:"postcssExponentialFunctions"},{packageName:"postcss-focus-visible",id:"focus-visible-pseudo-class",importName:"postcssFocusVisible"},{packageName:"postcss-focus-within",id:"focus-within-pseudo-class",importName:"postcssFocusWithin"},{packageName:"@csstools/postcss-font-format-keywords",id:"font-format-keywords",importName:"postcssFontFormatKeywords"},{packageName:"postcss-font-variant",id:"font-variant-property",importName:"postcssFontVariant"},{packageName:"@csstools/postcss-gamut-mapping",id:"gamut-mapping",importName:"postcssGamutMapping"},{packageName:"postcss-gap-properties",id:"gap-properties",importName:"postcssGapProperties"},{packageName:"@csstools/postcss-gradients-interpolation-method",id:"gradients-interpolation-method",importName:"postcssGradientsInterpolationMethod"},{packageName:"@csstools/postcss-hwb-function",id:"hwb-function",importName:"postcssHWBFunction"},{packageName:"@csstools/postcss-ic-unit",id:"ic-unit",importName:"postcssICUnit"},{packageName:"postcss-image-set-function",id:"image-set-function",importName:"postcssImageSetFunction"},{packageName:"@csstools/postcss-initial",id:"all-property",importName:"postcssInitial"},{packageName:"@csstools/postcss-is-pseudo-class",id:"is-pseudo-class",importName:"postcssIsPseudoClass"},{packageName:"@csstools/postcss-scope-pseudo-class",id:"scope-pseudo-class",importName:"postcssScopePseudoClass"},{packageName:"postcss-lab-function",id:"lab-function",importName:"postcssLabFunction"},{packageName:"@csstools/postcss-light-dark-function",id:"light-dark-function",importName:"postcssLightDarkFunction"},{packageName:"postcss-logical",id:"logical-properties-and-values",importName:"postcssLogical"},{packageName:"@csstools/postcss-logical-float-and-clear",id:"float-clear-logical-values",importName:"postcssLogicalFloatAndClear"},{packageName:"@csstools/postcss-logical-overflow",id:"logical-overflow",importName:"postcssLogicalOverflow"},{packageName:"@csstools/postcss-logical-overscroll-behavior",id:"logical-overscroll-behavior",importName:"postcssLogicalOverscrollBehavor"},{packageName:"@csstools/postcss-logical-resize",id:"logical-resize",importName:"postcssLogicalResize"},{packageName:"@csstools/postcss-logical-viewport-units",id:"logical-viewport-units",importName:"postcssLogicalViewportUnits"},{packageName:"@csstools/postcss-media-minmax",id:"media-query-ranges",importName:"postcssMediaMinmax"},{packageName:"@csstools/postcss-media-queries-aspect-ratio-number-values",id:"media-queries-aspect-ratio-number-values",importName:"postcssMediaQueriesAspectRatioNumberValues"},{packageName:"postcss-nesting",id:"nesting-rules",importName:"postcssNesting"},{packageName:"@csstools/postcss-normalize-display-values",id:"display-two-values",importName:"postcssNormalizeDisplayValues"},{packageName:"@csstools/postcss-oklab-function",id:"oklab-function",importName:"postcssOKLabFunction"},{packageName:"@csstools/postcss-relative-color-syntax",id:"relative-color-syntax",importName:"postcssRelativeColorSyntax"},{packageName:"postcss-opacity-percentage",id:"opacity-percentage",importName:"postcssOpacityPercentage"},{packageName:"postcss-overflow-shorthand",id:"overflow-property",importName:"postcssOverflowShorthand"},{packageName:"postcss-page-break",id:"break-properties",importName:"postcssPageBreak"},{packageName:"postcss-place",id:"place-properties",importName:"postcssPlace"},{packageName:"postcss-pseudo-class-any-link",id:"any-link-pseudo-class",importName:"postcssPseudoClassAnyLink"},{packageName:"postcss-replace-overflow-wrap",id:"overflow-wrap-property",importName:"postcssReplaceOverflowWrap"},{packageName:"postcss-selector-not",id:"not-pseudo-class",importName:"postcssSelectorNot"},{packageName:"@csstools/postcss-stepped-value-functions",id:"stepped-value-functions",importName:"postcssSteppedValueFunctions"},{packageName:"postcss-system-ui-font-family",importedPackage:"../patch/postcss-system-ui-font-family.mjs",id:"system-ui-font-family",importName:"postcssFontFamilySystemUI"},{packageName:"@csstools/postcss-unset-value",id:"unset-value",importName:"postcssUnsetValue"},{packageName:"@csstools/postcss-cascade-layers",id:"cascade-layers",importName:"postcssCascadeLayers"},{packageName:"@csstools/postcss-trigonometric-functions",id:"trigonometric-functions",importName:"postcssTrigonometricFunctions"},{packageName:"@csstools/postcss-nested-calc",id:"nested-calc",importName:"postcssNestedCalc"},{packageName:"@csstools/postcss-text-decoration-shorthand",id:"text-decoration-shorthand",importName:"postcssTextDecorationShorthand"},{packageName:"@csstools/postcss-progressive-custom-properties",id:"progressive-custom-properties",importName:"postcssProgressiveCustomProperties",omitTypedOptions:!0,omitDocs:!0}];function getPackageNamesToIds(){const s={};return xs.forEach((e=>{s[e.packageName]=e.id})),s}function pluginIdHelp(s,e,o){const t=xs.map((s=>s.id)),i=xs.map((s=>s.packageName)),r=getPackageNamesToIds();s.forEach((s=>{if(t.includes(s))return;const a=[...t.map((e=>[e,levenshteinDistance(s,e)])),...i.map((e=>[r[e],levenshteinDistance(s,e)]))].sort(((s,e)=>s[1]-e[1])).filter((s=>s[1]<10)),c=new Set;for(let s=0;s<a.length&&(c.add(a[s][0]),!(c.size>=3));s++);if(!c.size)return void e.warn(o,`Unknown feature: "${s}", see the list of features https://github.com/csstools/postcss-plugins/blob/main/plugin-packs/postcss-preset-env/FEATURES.md`);let n='"';n+=Array.from(c).join('", "'),n+='"',e.warn(o,`Unknown feature: "${s}", did you mean one of: ${n}`)}))}function levenshteinDistance(s,e){if(!s.length)return e.length;if(!e.length)return s.length;const o=[];for(let t=0;t<=e.length;t++){o[t]=[t];for(let i=1;i<=s.length;i++)o[t][i]=0===t?i:Math.min(o[t-1][i]+1,o[t][i-1]+1,o[t-1][i-1]+(s[i-1]===e[t-1]?0:1))}return o[e.length][s.length]}const creator=o=>{const t=new Logger,i=Object(o),r=Object.keys(Object(i.features)),a=i.browsers?void 0:i.env,c=i.browsers,n=initializeSharedOptions(i),p=listFeatures(e,i,n,t),l=p.map((s=>s.plugin));!1!==i.autoprefixer&&l.push(s(Object.assign({env:a,overrideBrowserslist:c},i.autoprefixer))),logFeaturesList(p,i,t);const internalPlugin=()=>({postcssPlugin:"postcss-preset-env",OnceExit(s,{result:e}){pluginIdHelp(r,s,e),i.debug&&t.emitLogs(e),t.resetLogger()}});return internalPlugin.postcss=!0,{postcssPlugin:"postcss-preset-env",plugins:[...l,internalPlugin()]}};creator.postcss=!0,module.exports=creator;
