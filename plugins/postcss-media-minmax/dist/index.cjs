"use strict";var e=require("@csstools/css-parser-algorithms"),i=require("@csstools/css-tokenizer"),n=require("@csstools/media-query-list-parser"),a=require("@csstools/css-calc");const t=/[A-Z]/g;const r={width:"px",height:"px","device-width":"px","device-height":"px","aspect-ratio":"","device-aspect-ratio":"",color:"","color-index":"",monochrome:"",resolution:"dpi"},o={width:!1,height:!1,"device-width":!1,"device-height":!1,"aspect-ratio":!1,"device-aspect-ratio":!1,color:!0,"color-index":!0,monochrome:!0,resolution:"dpi"};function featureNamePrefix(e){return e===n.MediaFeatureLT.LT||e===n.MediaFeatureLT.LT_OR_EQ?"max-":e===n.MediaFeatureGT.GT||e===n.MediaFeatureGT.GT_OR_EQ?"min-":""}const s={">":1,"<":-1},u=.001,d=.02;function transformSingleNameValuePair(t,l,p,c){let T=p.before,v=p.after;if(c||(T=p.after,v=p.before),!c){const e=n.invertComparison(l);if(!1===e)return;l=e}if(l===n.MediaFeatureEQ.EQ||l===n.MediaFeatureLT.LT_OR_EQ||l===n.MediaFeatureGT.GT_OR_EQ)return Array.isArray(p.value)?n.newMediaFeaturePlain(featureNamePrefix(l)+t,...T,...p.value.flatMap((e=>e.tokens())),...v):n.newMediaFeaturePlain(featureNamePrefix(l)+t,...T,...p.value.tokens(),...v);let m,f,y=!1;if(Array.isArray(p.value)){if(!n.matchesRatioExactly(p.value))return;if("aspect-ratio"!==t&&"device-aspect-ratio"!==t)return;const e=n.matchesRatio(p.value);if(-1===e)return;y=!0,m=p.value[e[0]],f=p.value.slice(e[0]+1)}else m=p.value,f=[];const k=r[t.toLowerCase()];if(e.isFunctionNode(m)&&"calc"===m.getName().toLowerCase()){const[[r]]=a.calcFromComponentValues([[m]],{precision:5,toCanonicalUnits:!0});if(!r||!e.isTokenNode(r)||r.value[0]!==i.TokenType.Number&&r.value[0]!==i.TokenType.Percentage&&r.value[0]!==i.TokenType.Dimension||!Number.isInteger(r.value[4].value)){let e;if(void 0!==k){const n=s[l]*("px"===k?d:u);e=[i.TokenType.Dimension,`${n.toString()}${k}`,-1,-1,{value:n,unit:k,type:i.NumberType.Integer}]}else if(!0===o[t]){const n=s[l];e=[i.TokenType.Number,n.toString(),-1,-1,{value:n,type:i.NumberType.Integer}]}else if(y){const n=s[l]*u;e=[i.TokenType.Number,n.toString(),-1,-1,{value:n,type:i.NumberType.Integer}]}else{const n=s[l];e=[i.TokenType.Number,n.toString(),-1,-1,{value:n,type:i.NumberType.Integer}]}return y?n.newMediaFeaturePlain(featureNamePrefix(l)+t,...T,[i.TokenType.Function,"calc(",-1,-1,{value:"calc("}],[i.TokenType.OpenParen,"(",-1,-1,void 0],...m.tokens().slice(1),[i.TokenType.Whitespace," ",-1,-1,void 0],[i.TokenType.Delim,"+",-1,-1,{value:"+"}],[i.TokenType.Whitespace," ",-1,-1,void 0],e,[i.TokenType.CloseParen,")",-1,-1,void 0],[i.TokenType.Whitespace," ",-1,-1,void 0],...f.flatMap((e=>e.tokens())),...v):n.newMediaFeaturePlain(featureNamePrefix(l)+t,...T,[i.TokenType.Function,"calc(",-1,-1,{value:"calc("}],[i.TokenType.OpenParen,"(",-1,-1,void 0],...m.tokens().slice(1),[i.TokenType.Whitespace," ",-1,-1,void 0],[i.TokenType.Delim,"+",-1,-1,{value:"+"}],[i.TokenType.Whitespace," ",-1,-1,void 0],e,[i.TokenType.CloseParen,")",-1,-1,void 0],...v)}m=r}if(e.isTokenNode(m)){let e,a=m.value,r="";if(void 0!==k&&a[0]===i.TokenType.Number&&0===a[4].value)e=s[l],r=k;else if(a[0]===i.TokenType.Number&&0===a[4].value)e=s[l],r="";else if(a[0]===i.TokenType.Dimension&&0===a[4].value)e=s[l],r=a[4].unit;else if(a[0]===i.TokenType.Number&&!0===o[t])e=a[4].value+s[l];else if(a[0]===i.TokenType.Dimension&&"px"===a[4].unit&&a[4].type===i.NumberType.Integer)e=Number(Math.round(Number(a[4].value+d*s[l]+"e6"))+"e-6");else{if(a[0]!==i.TokenType.Dimension&&a[0]!==i.TokenType.Number)return;e=Number(Math.round(Number(a[4].value+u*s[l]+"e6"))+"e-6")}return r&&(a=[i.TokenType.Dimension,a[1],a[2],a[3],{value:a[4].value,unit:r,type:a[4].type}]),a[4].value=e,a[0]===i.TokenType.Dimension?a[1]=a[4].value.toString()+a[4].unit:a[1]=a[4].value.toString(),y?n.newMediaFeaturePlain(featureNamePrefix(l)+t,...T,a,[i.TokenType.Whitespace," ",-1,-1,void 0],...f.flatMap((e=>e.tokens())),...v):n.newMediaFeaturePlain(featureNamePrefix(l)+t,...T,a,...v)}}const l=new Set(["aspect-ratio","color","color-index","device-aspect-ratio","device-height","device-width","height","horizontal-viewport-segments","monochrome","resolution","vertical-viewport-segments","width"]);function transform(a){return a.map(((a,r)=>{const o=e.gatherNodeAncestry(a);a.walk((e=>{const r=e.node;if(!n.isMediaFeatureRange(r))return;const s=e.parent;if(!n.isMediaFeature(s))return;const u=r.name.getName().replace(t,(e=>String.fromCharCode(e.charCodeAt(0)+32)));if(!l.has(u))return;if(n.isMediaFeatureRangeNameValue(r)||n.isMediaFeatureRangeValueName(r)){const e=r.operatorKind();if(!1===e)return;const i=transformSingleNameValuePair(u,e,r.value,n.isMediaFeatureRangeNameValue(r));return void(i&&(s.feature=i.feature))}const d=o.get(s);if(!n.isMediaInParens(d))return;let p=null,c=null;{const e=r.valueOneOperatorKind();if(!1===e)return;const i=transformSingleNameValuePair(u,e,r.valueOne,!1);if(!i)return;e===n.MediaFeatureLT.LT||e===n.MediaFeatureLT.LT_OR_EQ?(p=i,p.before=s.before):(c=i,c.after=s.after)}{const e=r.valueTwoOperatorKind();if(!1===e)return;const i=transformSingleNameValuePair(u,e,r.valueTwo,!0);if(!i)return;e===n.MediaFeatureLT.LT||e===n.MediaFeatureLT.LT_OR_EQ?(c=i,c.before=s.before):(p=i,p.after=s.after)}if(!p||!c)return;const T=new n.MediaInParens(p),v=new n.MediaInParens(c),m=getMediaConditionListWithAndFromAncestry(d,o);if(m)return m.leading===d?(m.leading=T,void(m.list=[new n.MediaAnd([[i.TokenType.Whitespace," ",-1,-1,void 0],[i.TokenType.Ident,"and",-1,-1,{value:"and"}],[i.TokenType.Whitespace," ",-1,-1,void 0]],v),...m.list])):void m.list.splice(m.indexOf(o.get(d)),1,new n.MediaAnd([[i.TokenType.Whitespace," ",-1,-1,void 0],[i.TokenType.Ident,"and",-1,-1,{value:"and"}],[i.TokenType.Whitespace," ",-1,-1,void 0]],T),new n.MediaAnd([[i.TokenType.Whitespace," ",-1,-1,void 0],[i.TokenType.Ident,"and",-1,-1,{value:"and"}],[i.TokenType.Whitespace," ",-1,-1,void 0]],v));const f=new n.MediaConditionListWithAnd(T,[new n.MediaAnd([[i.TokenType.Whitespace," ",-1,-1,void 0],[i.TokenType.Ident,"and",-1,-1,{value:"and"}],[i.TokenType.Whitespace," ",-1,-1,void 0]],v)],[[i.TokenType.Whitespace," ",-1,-1,void 0]]),y=getMediaConditionInShallowMediaQueryFromAncestry(d,a,o);y?y.media=f:d.media=new n.MediaCondition(new n.MediaInParens(new n.MediaCondition(f),[[i.TokenType.Whitespace," ",-1,-1,void 0],[i.TokenType.OpenParen,"(",-1,-1,void 0]],[[i.TokenType.CloseParen,")",-1,-1,void 0]]))}));const s=a.tokens();return i.stringify(...s.filter(((e,n)=>(0!==n||0!==r||e[0]!==i.TokenType.Whitespace)&&(e[0]!==i.TokenType.Whitespace||!s[n+1]||s[n+1][0]!==i.TokenType.Whitespace))))})).join(",")}function getMediaConditionListWithAndFromAncestry(e,i){let a=e;if(a){if(a=i.get(a),n.isMediaConditionListWithAnd(a))return a;if(n.isMediaAnd(a))return a=i.get(a),n.isMediaConditionListWithAnd(a)?a:void 0}}function getMediaConditionInShallowMediaQueryFromAncestry(e,i,a){let t=e;if(!t)return;if(t=a.get(t),!n.isMediaCondition(t))return;const r=t;return t=a.get(t),n.isMediaQuery(t)&&t===i?r:void 0}const creator=()=>({postcssPlugin:"postcss-media-minmax",AtRule:{media:e=>{if(!(e.params.includes("<")||e.params.includes(">")||e.params.includes("=")))return;const i=transform(n.parse(e.params,{preserveInvalidMediaQueries:!0,onParseError:()=>{throw e.error(`Unable to parse media query "${e.params}"`)}}));e.params!==i&&(e.params=i)}}});creator.postcss=!0,module.exports=creator;
