import{tokenize as e}from"@csstools/css-tokenizer";import{replaceComponentValues as o,parseCommaSeparatedListOfComponentValues as t,isFunctionNode as s,stringify as a}from"@csstools/css-parser-algorithms";import{color as n,SyntaxFlag as r,colorDataFitsRGB_Gamut as l,colorDataFitsDisplayP3_Gamut as i,serializeRGB as c}from"@csstools/css-color-parser";const p=/\bcolor-gamut\b/i;function hasConditionalAncestor(e){let o=e.parent;for(;o;)if("atrule"===o.type){if("media"===o.name.toLowerCase()&&p.test(o.params))return!0;o=o.parent}else o=o.parent;return!1}function sameProperty(e){const o=e.prop.toLowerCase(),t=[],s=e.parent?.nodes??[];for(let e=0;e<s.length;e++){const a=s[e];"decl"===a.type&&a.prop.toLowerCase()===o&&t.push(a)}return t}const d=/\b(?:color|lab|lch|oklab|oklch)\(/i,u=/^(?:color|lab|lch|oklab|oklch)$/i,creator=()=>({postcssPlugin:"postcss-gamut-mapping",prepare(){const p=new WeakMap,m=new WeakSet;return{postcssPlugin:"postcss-gamut-mapping",OnceExit(f,{postcss:h}){f.walkDecls((f=>{if(m.has(f))return;if(!d.test(f.value))return;if(!f.parent||hasConditionalAncestor(f))return;const g=sameProperty(f).map(((p,d)=>{m.add(p);let f=!1;const h=p.value,g=o(t(e({css:h})),(e=>{if(!s(e)||!u.test(e.getName()))return;const o=n(e);return!o||o.syntaxFlags.has(r.HasNoneKeywords)||l(o)?void 0:(f||i(o)||(f=!0),c(o,!0))})),v=a(g);return{isRec2020:f,matchesOriginal:v===h,modifiedValue:v,hasFallback:d>0,item:p}})),v=[];g.reverse();for(const e of g){if(e.matchesOriginal)break;v.push(e)}v.reverse(),v.forEach((({isRec2020:e,modifiedValue:o,hasFallback:t,item:s})=>{const a=s.parent;if(!a)return;const n=p.get(a)||{conditionalRules:[],propNames:new Set,lastConditionParams:{media:void 0},lastConditionalRule:void 0};p.set(a,n);const r=`(color-gamut: ${e?"rec2020":"p3"})`;if(n.lastConditionParams.media!==r&&(n.lastConditionalRule=void 0),!t){const e=s.cloneBefore({value:o});m.add(e)}if(n.lastConditionalRule){const e=s.clone();return n.lastConditionalRule.append(e),m.add(e),void s.remove()}const l=h.atRule({name:"media",params:r,source:a.source,raws:{before:"\n\n",after:"\n"}}),i=a.clone();i.removeAll(),i.raws.before="\n";const c=s.clone();i.append(c),s.remove(),m.add(c),n.lastConditionParams.media=l.params,n.lastConditionalRule=i,l.append(i),n.conditionalRules.push(l)}))})),f.walk((e=>{const o=p.get(e);o&&0!==o.conditionalRules.length&&o.conditionalRules.reverse().forEach((o=>{e.after(o)}))}))}}}});creator.postcss=!0;export{creator as default};
