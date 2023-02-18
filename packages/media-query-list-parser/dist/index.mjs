import{ComponentValueType as e,TokenNode as t,parseListOfComponentValues as i,isWhitespaceNode as a,isCommentNode as n,isTokenNode as r,isSimpleBlockNode as s,parseCommaSeparatedListOfComponentValues as o}from"@csstools/css-parser-algorithms";import{stringify as u,TokenType as d,mutateIdent as l,tokenizer as h,cloneTokens as m}from"@csstools/css-tokenizer";var f,c,M,p;!function(e){e.CustomMedia="custom-media",e.GeneralEnclosed="general-enclosed",e.MediaAnd="media-and",e.MediaCondition="media-condition",e.MediaConditionListWithAnd="media-condition-list-and",e.MediaConditionListWithOr="media-condition-list-or",e.MediaFeature="media-feature",e.MediaFeatureBoolean="mf-boolean",e.MediaFeatureName="mf-name",e.MediaFeaturePlain="mf-plain",e.MediaFeatureRangeNameValue="mf-range-name-value",e.MediaFeatureRangeValueName="mf-range-value-name",e.MediaFeatureRangeValueNameValue="mf-range-value-name-value",e.MediaFeatureValue="mf-value",e.MediaInParens="media-in-parens",e.MediaNot="media-not",e.MediaOr="media-or",e.MediaQueryWithType="media-query-with-type",e.MediaQueryWithoutType="media-query-without-type",e.MediaQueryInvalid="media-query-invalid"}(f||(f={}));class MediaCondition{type=f.MediaCondition;media;constructor(e){this.media=e}tokens(){return this.media.tokens()}toString(){return this.media.toString()}indexOf(e){return e===this.media?"media":-1}at(e){if("media"===e)return this.media}walk(e){return!1!==e({node:this.media,parent:this},"media")&&this.media.walk(e)}toJSON(){return{type:this.type,media:this.media.toJSON()}}isMediaCondition(){return MediaCondition.isMediaCondition(this)}static isMediaCondition(e){return!!e&&(e instanceof MediaCondition&&e.type===f.MediaCondition)}}class MediaInParens{type=f.MediaInParens;media;before;after;constructor(e,t=[],i=[]){this.media=e,this.before=t,this.after=i}tokens(){return[...this.before,...this.media.tokens(),...this.after]}toString(){return u(...this.before)+this.media.toString()+u(...this.after)}indexOf(e){return e===this.media?"media":-1}at(e){if("media"===e)return this.media}walk(e){return!1!==e({node:this.media,parent:this},"media")&&("walk"in this.media?this.media.walk(e):void 0)}toJSON(){return{type:this.type,media:this.media.toJSON(),before:this.before,after:this.after}}isMediaInParens(){return MediaInParens.isMediaInParens(this)}static isMediaInParens(e){return!!e&&(e instanceof MediaInParens&&e.type===f.MediaInParens)}}class MediaQueryWithType{type=f.MediaQueryWithType;modifier;mediaType;and=void 0;media=void 0;constructor(e,t,i,a){this.modifier=e,this.mediaType=t,i&&a&&(this.and=i,this.media=a)}getModifier(){if(!this.modifier.length)return"";for(let e=0;e<this.modifier.length;e++){const t=this.modifier[e];if(t[0]===d.Ident)return t[4].value}return""}negateQuery(){const e=new MediaQueryWithType([...this.modifier],[...this.mediaType],this.and,this.media);if(0===e.modifier.length)return e.modifier=[[d.Ident,"not",-1,-1,{value:"not"}],[d.Whitespace," ",-1,-1,void 0]],e;for(let t=0;t<e.modifier.length;t++){const i=e.modifier[t];if(i[0]===d.Ident&&"not"===i[4].value.toLowerCase()){e.modifier.splice(t,1);break}if(i[0]===d.Ident&&"only"===i[4].value.toLowerCase()){i[1]="not",i[4].value="not";break}}return e}getMediaType(){if(!this.mediaType.length)return"";for(let e=0;e<this.mediaType.length;e++){const t=this.mediaType[e];if(t[0]===d.Ident)return t[4].value}return""}tokens(){return this.and&&this.media?[...this.modifier,...this.mediaType,...this.and,...this.media.tokens()]:[...this.modifier,...this.mediaType]}toString(){return this.and&&this.media?u(...this.modifier)+u(...this.mediaType)+u(...this.and)+this.media.toString():u(...this.modifier)+u(...this.mediaType)}indexOf(e){return e===this.media?"media":-1}at(e){if("media"===e)return this.media}walk(e){if(this.media)return!1!==e({node:this.media,parent:this},"media")&&this.media.walk(e)}toJSON(){return{type:this.type,string:this.toString(),modifier:this.modifier,mediaType:this.mediaType,and:this.and,media:this.media}}isMediaQueryWithType(){return MediaQueryWithType.isMediaQueryWithType(this)}static isMediaQueryWithType(e){return!!e&&(e instanceof MediaQueryWithType&&e.type===f.MediaQueryWithType)}}class MediaQueryWithoutType{type=f.MediaQueryWithoutType;media;constructor(e){this.media=e}negateQuery(){let e=this.media;if(e.media.type===f.MediaNot)return new MediaQueryWithoutType(new MediaCondition(e.media.media));e.media.type===f.MediaConditionListWithOr&&(e=new MediaCondition(new MediaInParens(e,[[d.Whitespace," ",0,0,void 0],[d.OpenParen,"(",0,0,void 0]],[[d.CloseParen,")",0,0,void 0]])));return new MediaQueryWithType([[d.Ident,"not",0,0,{value:"not"}],[d.Whitespace," ",0,0,void 0]],[[d.Ident,"all",0,0,{value:"all"}],[d.Whitespace," ",0,0,void 0]],[[d.Ident,"and",0,0,{value:"and"}]],e)}tokens(){return this.media.tokens()}toString(){return this.media.toString()}indexOf(e){return e===this.media?"media":-1}at(e){if("media"===e)return this.media}walk(e){return!1!==e({node:this.media,parent:this},"media")&&this.media.walk(e)}toJSON(){return{type:this.type,string:this.toString(),media:this.media}}isMediaQueryWithoutType(){return MediaQueryWithoutType.isMediaQueryWithoutType(this)}static isMediaQueryWithoutType(e){return!!e&&(e instanceof MediaQueryWithoutType&&e.type===f.MediaQueryWithoutType)}}class MediaQueryInvalid{type=f.MediaQueryInvalid;media;constructor(e){this.media=e}negateQuery(){return new MediaQueryInvalid(this.media)}tokens(){return this.media.flatMap((e=>e.tokens()))}toString(){return this.media.map((e=>e.toString())).join("")}walk(e){let t=!1;if(this.media.forEach(((i,a)=>{t||(!1!==e({node:i,parent:this},a)?"walk"in i&&!1===i.walk(e)&&(t=!0):t=!0)})),t)return!1}toJSON(){return{type:this.type,string:this.toString(),media:this.media}}isMediaQueryInvalid(){return MediaQueryInvalid.isMediaQueryInvalid(this)}static isMediaQueryInvalid(e){return!!e&&(e instanceof MediaQueryInvalid&&e.type===f.MediaQueryInvalid)}}class GeneralEnclosed{type=f.GeneralEnclosed;value;constructor(e){this.value=e}tokens(){return this.value.tokens()}toString(){return this.value.toString()}indexOf(e){return e===this.value?"value":-1}at(e){if("value"===e)return this.value}walk(e){return!1!==e({node:this.value,parent:this},"value")&&("walk"in this.value?this.value.walk(e):void 0)}toJSON(){return{type:this.type,tokens:this.tokens()}}isGeneralEnclosed(){return GeneralEnclosed.isGeneralEnclosed(this)}static isGeneralEnclosed(e){return!!e&&(e instanceof GeneralEnclosed&&e.type===f.GeneralEnclosed)}}class MediaAnd{type=f.MediaAnd;modifier;media;constructor(e,t){this.modifier=e,this.media=t}tokens(){return[...this.modifier,...this.media.tokens()]}toString(){return u(...this.modifier)+this.media.toString()}indexOf(e){return e===this.media?"media":-1}at(e){return"media"===e?this.media:null}walk(e){return!1!==e({node:this.media,parent:this},"media")&&this.media.walk(e)}toJSON(){return{type:this.type,modifier:this.modifier,media:this.media.toJSON()}}isMediaAnd(){return MediaAnd.isMediaAnd(this)}static isMediaAnd(e){return!!e&&(e instanceof MediaAnd&&e.type===f.MediaAnd)}}class MediaConditionListWithAnd{type=f.MediaConditionListWithAnd;leading;list;before;after;constructor(e,t,i=[],a=[]){this.leading=e,this.list=t,this.before=i,this.after=a}tokens(){return[...this.before,...this.leading.tokens(),...this.list.flatMap((e=>e.tokens())),...this.after]}toString(){return u(...this.before)+this.leading.toString()+this.list.map((e=>e.toString())).join("")+u(...this.after)}indexOf(e){return e===this.leading?"leading":"media-and"===e.type?this.list.indexOf(e):-1}at(e){return"leading"===e?this.leading:"number"==typeof e?(e<0&&(e=this.list.length+e),this.list[e]):void 0}walk(e){if(!1===e({node:this.leading,parent:this},"leading"))return!1;if("walk"in this.leading&&!1===this.leading.walk(e))return!1;let t=!1;return this.list.forEach(((i,a)=>{t||(!1!==e({node:i,parent:this},a)?"walk"in i&&!1===i.walk(e)&&(t=!0):t=!0)})),!t&&void 0}toJSON(){return{type:this.type,leading:this.leading.toJSON(),list:this.list.map((e=>e.toJSON())),before:this.before,after:this.after}}isMediaConditionListWithAnd(){return MediaConditionListWithAnd.isMediaConditionListWithAnd(this)}static isMediaConditionListWithAnd(e){return!!e&&(e instanceof MediaConditionListWithAnd&&e.type===f.MediaConditionListWithAnd)}}class MediaConditionListWithOr{type=f.MediaConditionListWithOr;leading;list;before;after;constructor(e,t,i=[],a=[]){this.leading=e,this.list=t,this.before=i,this.after=a}tokens(){return[...this.before,...this.leading.tokens(),...this.list.flatMap((e=>e.tokens())),...this.after]}toString(){return u(...this.before)+this.leading.toString()+this.list.map((e=>e.toString())).join("")+u(...this.after)}indexOf(e){return e===this.leading?"leading":"media-or"===e.type?this.list.indexOf(e):-1}at(e){return"leading"===e?this.leading:"number"==typeof e?(e<0&&(e=this.list.length+e),this.list[e]):void 0}walk(e){if(!1===e({node:this.leading,parent:this},"leading"))return!1;if("walk"in this.leading&&!1===this.leading.walk(e))return!1;let t=!1;return this.list.forEach(((i,a)=>{t||(!1!==e({node:i,parent:this},a)?"walk"in i&&!1===i.walk(e)&&(t=!0):t=!0)})),!t&&void 0}toJSON(){return{type:this.type,leading:this.leading.toJSON(),list:this.list.map((e=>e.toJSON())),before:this.before,after:this.after}}isMediaConditionListWithOr(){return MediaConditionListWithOr.isMediaConditionListWithOr(this)}static isMediaConditionListWithOr(e){return!!e&&(e instanceof MediaConditionListWithOr&&e.type===f.MediaConditionListWithOr)}}function isNumber(t){return t.type===e.Token&&t.value[0]===d.Number||t.type===e.Function&&"calc"===t.name[4].value}function isDimension(t){return t.type===e.Token&&t.value[0]===d.Dimension}function isIdent(t){return t.type===e.Token&&t.value[0]===d.Ident}class MediaFeatureName{type=f.MediaFeatureName;name;before;after;constructor(e,t=[],i=[]){this.name=e,this.before=t,this.after=i}getName(){return this.name.value[4].value}getNameToken(){return this.name.value}tokens(){return[...this.before,...this.name.tokens(),...this.after]}toString(){return u(...this.before)+this.name.toString()+u(...this.after)}indexOf(e){return e===this.name?"name":-1}at(e){if("name"===e)return this.name}toJSON(){return{type:this.type,name:this.getName(),tokens:this.tokens()}}isMediaFeatureName(){return MediaFeatureName.isMediaFeatureName(this)}static isMediaFeatureName(e){return!!e&&(e instanceof MediaFeatureName&&e.type===f.MediaFeatureName)}}function parseMediaFeatureName(t){let i=-1;for(let a=0;a<t.length;a++){const n=t[a];if(n.type!==e.Whitespace&&n.type!==e.Comment){if(!isIdent(n))return!1;if(-1!==i)return!1;i=a}}return-1!==i&&new MediaFeatureName(t[i],t.slice(0,i).flatMap((e=>e.tokens())),t.slice(i+1).flatMap((e=>e.tokens())))}class MediaFeatureBoolean{type=f.MediaFeatureBoolean;name;constructor(e){this.name=e}getName(){return this.name.getName()}getNameToken(){return this.name.getNameToken()}tokens(){return this.name.tokens()}toString(){return this.name.toString()}indexOf(e){return e===this.name?"name":-1}at(e){if("name"===e)return this.name}toJSON(){return{type:this.type,name:this.name.toJSON(),tokens:this.tokens()}}isMediaFeatureBoolean(){return MediaFeatureBoolean.isMediaFeatureBoolean(this)}static isMediaFeatureBoolean(e){return!!e&&(e instanceof MediaFeatureBoolean&&e.type===f.MediaFeatureBoolean)}}function parseMediaFeatureBoolean(e){const t=parseMediaFeatureName(e);return!1===t?t:new MediaFeatureBoolean(t)}class MediaFeatureValue{type=f.MediaFeatureValue;value;before;after;constructor(e,t=[],i=[]){Array.isArray(e)&&1===e.length?this.value=e[0]:this.value=e,this.before=t,this.after=i}tokens(){return Array.isArray(this.value)?[...this.before,...this.value.flatMap((e=>e.tokens())),...this.after]:[...this.before,...this.value.tokens(),...this.after]}toString(){return Array.isArray(this.value)?u(...this.before)+this.value.map((e=>e.toString())).join("")+u(...this.after):u(...this.before)+this.value.toString()+u(...this.after)}indexOf(e){return e===this.value?"value":-1}at(e){if("value"===e)return this.value}walk(e){return!1!==e({node:this.value,parent:this},"value")&&("walk"in this.value?this.value.walk(e):void 0)}toJSON(){return Array.isArray(this.value)?{type:this.type,value:this.value.map((e=>e.toJSON())),tokens:this.tokens()}:{type:this.type,value:this.value.toJSON(),tokens:this.tokens()}}isMediaFeatureValue(){return MediaFeatureValue.isMediaFeatureValue(this)}static isMediaFeatureValue(e){return!!e&&(e instanceof MediaFeatureValue&&e.type===f.MediaFeatureValue)}}function parseMediaFeatureValue(t){let i=-1,a=-1;for(let n=0;n<t.length;n++){const r=t[n];if(r.type!==e.Whitespace&&r.type!==e.Comment){if(-1!==i)return!1;if(isNumber(r)){const e=matchesRatioExactly(t.slice(n));if(-1!==e){i=e[0]+n,a=e[1]+n,n+=e[1]-e[0];continue}i=n,a=n}else if(isDimension(r))i=n,a=n;else{if(!isIdent(r))return!1;i=n,a=n}}}return-1!==i&&new MediaFeatureValue(t.slice(i,a+1),t.slice(0,i).flatMap((e=>e.tokens())),t.slice(a+1).flatMap((e=>e.tokens())))}function matchesRatioExactly(e){let t=-1,i=-1;const a=matchesRatio(e);if(-1===a)return-1;t=a[0],i=a[1];for(let t=i+1;t<e.length;t++){const i=e[t];if("whitespace"!==i.type&&"comment"!==i.type)return-1}return[t,i]}function matchesRatio(e){let t=-1,i=-1;for(let a=0;a<e.length;a++){const n=e[a];if("whitespace"!==n.type&&"comment"!==n.type){if("token"===n.type){const e=n.value;if(e[0]===d.Delim&&"/"===e[4].value){if(-1===t)return-1;if(-1!==i)return-1;i=a;continue}}if(!isNumber(n))return-1;if(-1!==i)return[t,a];if(-1!==t)return-1;t=a}}return-1}class MediaFeaturePlain{type=f.MediaFeaturePlain;name;colon;value;constructor(e,t,i){this.name=e,this.colon=t,this.value=i}getName(){return this.name.getName()}getNameToken(){return this.name.getNameToken()}tokens(){return[...this.name.tokens(),this.colon,...this.value.tokens()]}toString(){return this.name.toString()+u(this.colon)+this.value.toString()}indexOf(e){return e===this.name?"name":e===this.value?"value":-1}at(e){return"name"===e?this.name:"value"===e?this.value:void 0}walk(e){return!1!==e({node:this.value,parent:this},"value")&&this.value.walk(e)}toJSON(){return{type:this.type,name:this.name.toJSON(),value:this.value.toJSON(),tokens:this.tokens()}}isMediaFeaturePlain(){return MediaFeaturePlain.isMediaFeaturePlain(this)}static isMediaFeaturePlain(e){return!!e&&(e instanceof MediaFeaturePlain&&e.type===f.MediaFeaturePlain)}}function parseMediaFeaturePlain(t){let i=[],a=[],n=null;for(let r=0;r<t.length;r++){const s=t[r];if(s.type===e.Token){const e=s.value;if(e[0]===d.Colon){i=t.slice(0,r),a=t.slice(r+1),n=e;break}}}if(!i.length||!a.length||!n)return!1;const r=parseMediaFeatureName(i);if(!1===r)return!1;const s=parseMediaFeatureValue(a);return!1!==s&&new MediaFeaturePlain(r,n,s)}function matchesComparison(t){let i=-1;for(let a=0;a<t.length;a++){const n=t[a];if(n.type===e.Token){const e=n.value;if(e[0]===d.Delim){if(e[4].value===p.EQ){if(-1!==i)return[i,a];i=a;continue}if(e[4].value===c.LT){i=a;continue}if(e[4].value===M.GT){i=a;continue}}}break}return-1!==i&&[i,i]}function comparisonFromTokens(e){if(0===e.length||e.length>2)return!1;if(e[0][0]!==d.Delim)return!1;if(1===e.length)switch(e[0][4].value){case p.EQ:return p.EQ;case c.LT:return c.LT;case M.GT:return M.GT;default:return!1}if(e[1][0]!==d.Delim)return!1;if(e[1][4].value!==p.EQ)return!1;switch(e[0][4].value){case c.LT:return c.LT_OR_EQ;case M.GT:return M.GT_OR_EQ;default:return!1}}function invertComparison(e){switch(e){case p.EQ:return p.EQ;case c.LT:return M.GT;case c.LT_OR_EQ:return M.GT_OR_EQ;case M.GT:return c.LT;case M.GT_OR_EQ:return c.LT_OR_EQ;default:return!1}}!function(e){e.LT="<",e.LT_OR_EQ="<="}(c||(c={})),function(e){e.GT=">",e.GT_OR_EQ=">="}(M||(M={})),function(e){e.EQ="="}(p||(p={}));class MediaFeatureRangeNameValue{type=f.MediaFeatureRangeNameValue;name;operator;value;constructor(e,t,i){this.name=e,this.operator=t,this.value=i}operatorKind(){return comparisonFromTokens(this.operator)}getName(){return this.name.getName()}getNameToken(){return this.name.getNameToken()}tokens(){return[...this.name.tokens(),...this.operator,...this.value.tokens()]}toString(){return this.name.toString()+u(...this.operator)+this.value.toString()}indexOf(e){return e===this.name?"name":e===this.value?"value":-1}at(e){return"name"===e?this.name:"value"===e?this.value:void 0}walk(e){return!1!==e({node:this.value,parent:this},"value")&&("walk"in this.value?this.value.walk(e):void 0)}toJSON(){return{type:this.type,name:this.name.toJSON(),value:this.value.toJSON(),tokens:this.tokens()}}isMediaFeatureRangeNameValue(){return MediaFeatureRangeNameValue.isMediaFeatureRangeNameValue(this)}static isMediaFeatureRangeNameValue(e){return!!e&&(e instanceof MediaFeatureRangeNameValue&&e.type===f.MediaFeatureRangeNameValue)}}class MediaFeatureRangeValueName{type=f.MediaFeatureRangeValueName;name;operator;value;constructor(e,t,i){this.name=e,this.operator=t,this.value=i}operatorKind(){return comparisonFromTokens(this.operator)}getName(){return this.name.getName()}getNameToken(){return this.name.getNameToken()}tokens(){return[...this.value.tokens(),...this.operator,...this.name.tokens()]}toString(){return this.value.toString()+u(...this.operator)+this.name.toString()}indexOf(e){return e===this.name?"name":e===this.value?"value":-1}at(e){return"name"===e?this.name:"value"===e?this.value:void 0}walk(e){return!1!==e({node:this.value,parent:this},"value")&&("walk"in this.value?this.value.walk(e):void 0)}toJSON(){return{type:this.type,name:this.name.toJSON(),value:this.value.toJSON(),tokens:this.tokens()}}isMediaFeatureRangeValueName(){return MediaFeatureRangeValueName.isMediaFeatureRangeValueName(this)}static isMediaFeatureRangeValueName(e){return!!e&&(e instanceof MediaFeatureRangeValueName&&e.type===f.MediaFeatureRangeValueName)}}class MediaFeatureRangeValueNameValue{type=f.MediaFeatureRangeValueNameValue;name;valueOne;valueOneOperator;valueTwo;valueTwoOperator;constructor(e,t,i,a,n){this.name=e,this.valueOne=t,this.valueOneOperator=i,this.valueTwo=a,this.valueTwoOperator=n}valueOneOperatorKind(){return comparisonFromTokens(this.valueOneOperator)}valueTwoOperatorKind(){return comparisonFromTokens(this.valueTwoOperator)}getName(){return this.name.getName()}getNameToken(){return this.name.getNameToken()}tokens(){return[...this.valueOne.tokens(),...this.valueOneOperator,...this.name.tokens(),...this.valueTwoOperator,...this.valueTwo.tokens()]}toString(){return this.valueOne.toString()+u(...this.valueOneOperator)+this.name.toString()+u(...this.valueTwoOperator)+this.valueTwo.toString()}indexOf(e){return e===this.name?"name":e===this.valueOne?"valueOne":e===this.valueTwo?"valueTwo":-1}at(e){return"name"===e?this.name:"valueOne"===e?this.valueOne:"valueTwo"===e?this.valueTwo:void 0}walk(e){return!1!==e({node:this.valueOne,parent:this},"valueOne")&&((!("walk"in this.valueOne)||!1!==this.valueOne.walk(e))&&(!1!==e({node:this.valueTwo,parent:this},"valueTwo")&&((!("walk"in this.valueTwo)||!1!==this.valueTwo.walk(e))&&void 0)))}toJSON(){return{type:this.type,name:this.name.toJSON(),valueOne:this.valueOne.toJSON(),valueTwo:this.valueTwo.toJSON(),tokens:this.tokens()}}isMediaFeatureRangeValueNameValue(){return MediaFeatureRangeValueNameValue.isMediaFeatureRangeValueNameValue(this)}static isMediaFeatureRangeValueNameValue(e){return!!e&&(e instanceof MediaFeatureRangeValueNameValue&&e.type===f.MediaFeatureRangeValueNameValue)}}function parseMediaFeatureRange(t){let i=!1,a=!1;for(let n=0;n<t.length;n++){const r=t[n];if(r.type===e.Token){if(r.value[0]===d.Delim){const e=matchesComparison(t.slice(n));if(!1!==e){if(!1!==i){a=[e[0]+n,e[1]+n];break}i=[e[0]+n,e[1]+n],n+=e[1]}}}}if(!1===i)return!1;const n=[t[i[0]].value];if(i[0]!==i[1]&&n.push(t[i[1]].value),!1===a){const e=t.slice(0,i[0]),a=t.slice(i[1]+1),r=parseMediaFeatureName(e),s=parseMediaFeatureName(a);if(!r&&!s)return!1;if(r&&!s||r&&y.has(r.getName().toLowerCase())){const e=parseMediaFeatureValue(a);return!!e&&new MediaFeatureRangeNameValue(r,n,e)}if(!r&&s||s&&y.has(s.getName().toLowerCase())){const t=parseMediaFeatureValue(e);return!!t&&new MediaFeatureRangeValueName(s,n,t)}return!1}const r=[t[a[0]].value];a[0]!==a[1]&&r.push(t[a[1]].value);const s=t.slice(0,i[0]),o=t.slice(i[1]+1,a[0]),u=t.slice(a[1]+1),l=parseMediaFeatureValue(s),h=parseMediaFeatureName(o),m=parseMediaFeatureValue(u);if(!l||!h||!m)return!1;{const e=comparisonFromTokens(n);if(!1===e||e===p.EQ)return!1;const t=comparisonFromTokens(r);if(!1===t||t===p.EQ)return!1;if(!(e!==c.LT&&e!==c.LT_OR_EQ||t!==M.GT&&t!==M.GT_OR_EQ))return!1;if(!(e!==M.GT&&e!==M.GT_OR_EQ||t!==c.LT&&t!==c.LT_OR_EQ))return!1}return new MediaFeatureRangeValueNameValue(h,l,n,m,r)}const y=new Set(["any-hover","any-pointer","aspect-ratio","color","color-gamut","color-index","device-aspect-ratio","device-height","device-width","display-mode","dynamic-range","environment-blending","forced-colors","grid","height","horizontal-viewport-segments","hover","inverted-colors","monochrome","nav-controls","orientation","overflow-block","overflow-inline","pointer","prefers-color-scheme","prefers-contrast","prefers-reduced-data","prefers-reduced-motion","prefers-reduced-transparency","resolution","scan","scripting","update","vertical-viewport-segments","video-color-gamut","video-dynamic-range","width"]);class MediaFeature{type=f.MediaFeature;feature;before;after;constructor(e,t=[],i=[]){this.feature=e,this.before=t,this.after=i}getName(){return this.feature.getName()}getNameToken(){return this.feature.getNameToken()}tokens(){return[...this.before,...this.feature.tokens(),...this.after]}toString(){return u(...this.before)+this.feature.toString()+u(...this.after)}indexOf(e){return e===this.feature?"feature":-1}at(e){if("feature"===e)return this.feature}walk(e){return!1!==e({node:this.feature,parent:this},"feature")&&("walk"in this.feature?this.feature.walk(e):void 0)}toJSON(){return{type:this.type,feature:this.feature.toJSON(),before:this.before,after:this.after}}isMediaFeature(){return MediaFeature.isMediaFeature(this)}static isMediaFeature(e){return!!e&&(e instanceof MediaFeature&&e.type===f.MediaFeature)}}function parseMediaFeature(e,t=[],i=[]){if(e.startToken[0]!==d.OpenParen)return!1;const a=parseMediaFeatureBoolean(e.value);if(!1!==a)return new MediaFeature(a,t,i);const n=parseMediaFeaturePlain(e.value);if(!1!==n)return new MediaFeature(n,t,i);const r=parseMediaFeatureRange(e.value);return!1!==r&&new MediaFeature(r,t,i)}function newMediaFeatureBoolean(e){const i=[d.Ident,"",-1,-1,{value:""}];return l(i,e),new MediaFeature(new MediaFeatureBoolean(new MediaFeatureName(new t(i))),[[d.OpenParen,"(",-1,-1,void 0]],[[d.CloseParen,")",-1,-1,void 0]])}function newMediaFeaturePlain(e,...a){const n=[d.Ident,"",-1,-1,{value:""}];l(n,e);const r=i(a);return new MediaFeature(new MediaFeaturePlain(new MediaFeatureName(new t(n)),[d.Colon,":",-1,-1,void 0],new MediaFeatureValue(1===r.length?r[0]:r)),[[d.OpenParen,"(",-1,-1,void 0]],[[d.CloseParen,")",-1,-1,void 0]])}class MediaNot{type=f.MediaNot;modifier;media;constructor(e,t){this.modifier=e,this.media=t}tokens(){return[...this.modifier,...this.media.tokens()]}toString(){return u(...this.modifier)+this.media.toString()}indexOf(e){return e===this.media?"media":-1}at(e){if("media"===e)return this.media}walk(e){return!1!==e({node:this.media,parent:this},"media")&&this.media.walk(e)}toJSON(){return{type:this.type,modifier:this.modifier,media:this.media.toJSON()}}isMediaNot(){return MediaNot.isMediaNot(this)}static isMediaNot(e){return!!e&&(e instanceof MediaNot&&e.type===f.MediaNot)}}class MediaOr{type=f.MediaOr;modifier;media;constructor(e,t){this.modifier=e,this.media=t}tokens(){return[...this.modifier,...this.media.tokens()]}toString(){return u(...this.modifier)+this.media.toString()}indexOf(e){return e===this.media?"media":-1}at(e){if("media"===e)return this.media}walk(e){return!1!==e({node:this.media,parent:this},"media")&&this.media.walk(e)}toJSON(){return{type:this.type,modifier:this.modifier,media:this.media.toJSON()}}isMediaOr(){return MediaOr.isMediaOr(this)}static isMediaOr(e){return!!e&&(e instanceof MediaOr&&e.type===f.MediaOr)}}var v,g;function modifierFromToken(e){if(e[0]!==d.Ident)return!1;switch(e[4].value.toLowerCase()){case v.Not:return v.Not;case v.Only:return v.Only;default:return!1}}function parseMediaQuery(e){{const t=parseMediaCondition(e);if(!1!==t)return new MediaQueryWithoutType(t)}{let t=-1,i=-1,s=-1;for(let o=0;o<e.length;o++){const u=e[o];if(!a(u)&&!n(u)){if(r(u)){const a=u.value;if(-1===t&&a[0]===d.Ident&&modifierFromToken(a)){t=o;continue}if(-1===i&&a[0]===d.Ident&&!modifierFromToken(a)){i=o;continue}if(-1===s&&a[0]===d.Ident&&"and"===a[4].value.toLowerCase()){s=o;if(!1===parseMediaConditionWithoutOr(e.slice(o+1)))return!1;break}return!1}return!1}}let o=[],u=[];-1!==t?(o=e.slice(0,t+1).flatMap((e=>e.tokens())),-1!==i&&(u=e.slice(t+1,i+1).flatMap((e=>e.tokens())))):-1!==i&&(u=e.slice(0,i+1).flatMap((e=>e.tokens())));const l=parseMediaConditionWithoutOr(e.slice(Math.max(t,i,s)+1));return!1===l?new MediaQueryWithType(o,[...u,...e.slice(i+1).flatMap((e=>e.tokens()))]):new MediaQueryWithType(o,u,e.slice(i+1,s+1).flatMap((e=>e.tokens())),l)}}function parseMediaConditionListWithOr(t){let i=!1;const a=[];let n=-1,r=-1;for(let o=0;o<t.length;o++){if(i){const e=parseMediaOr(t.slice(o));if(!1!==e){o+=e.advance,a.push(e.node),r=o;continue}}const u=t[o];if(u.type!==e.Whitespace&&u.type!==e.Comment){if(i)return!1;if(!1!==i||!s(u))return!1;if(u.normalize(),i=parseMediaInParensFromSimpleBlock(u),!1===i)return!1;n=o}}return!(!i||!a.length)&&new MediaConditionListWithOr(i,a,t.slice(0,n).flatMap((e=>e.tokens())),t.slice(r+1).flatMap((e=>e.tokens())))}function parseMediaConditionListWithAnd(t){let i=!1;const a=[];let n=-1,r=-1;for(let o=0;o<t.length;o++){if(i){const e=parseMediaAnd(t.slice(o));if(!1!==e){o+=e.advance,a.push(e.node),r=o;continue}}const u=t[o];if(u.type!==e.Whitespace&&u.type!==e.Comment){if(i)return!1;if(!1!==i||!s(u))return!1;if(u.normalize(),i=parseMediaInParensFromSimpleBlock(u),!1===i)return!1;n=o}}return!(!i||!a.length)&&new MediaConditionListWithAnd(i,a,t.slice(0,n).flatMap((e=>e.tokens())),t.slice(r+1).flatMap((e=>e.tokens())))}function parseMediaCondition(e){const t=parseMediaNot(e);if(!1!==t)return new MediaCondition(t);const i=parseMediaConditionListWithAnd(e);if(!1!==i)return new MediaCondition(i);const a=parseMediaConditionListWithOr(e);if(!1!==a)return new MediaCondition(a);const n=parseMediaInParens(e);return!1!==n&&new MediaCondition(n)}function parseMediaConditionWithoutOr(e){const t=parseMediaNot(e);if(!1!==t)return new MediaCondition(t);const i=parseMediaConditionListWithAnd(e);if(!1!==i)return new MediaCondition(i);const a=parseMediaInParens(e);return!1!==a&&new MediaCondition(a)}function parseMediaInParens(t){let i=-1;for(let a=0;a<t.length;a++){const n=t[a];if(n.type!==e.Whitespace&&n.type!==e.Comment){if(!s(n))return!1;if(-1!==i)return!1;i=a}}if(-1===i)return!1;const a=t[i];if(a.startToken[0]!==d.OpenParen)return!1;a.normalize();const n=[...t.slice(0,i).flatMap((e=>e.tokens())),a.startToken],r=[a.endToken,...t.slice(i+1).flatMap((e=>e.tokens()))],o=parseMediaFeature(a,n,r);if(!1!==o)return new MediaInParens(o);const u=parseMediaCondition(a.value);return!1!==u?new MediaInParens(u,n,r):new MediaInParens(new GeneralEnclosed(a),t.slice(0,i).flatMap((e=>e.tokens())),t.slice(i+1).flatMap((e=>e.tokens())))}function parseMediaInParensFromSimpleBlock(e){if(e.startToken[0]!==d.OpenParen)return!1;const t=parseMediaFeature(e,[e.startToken],[e.endToken]);if(!1!==t)return new MediaInParens(t);const i=parseMediaCondition(e.value);return!1!==i?new MediaInParens(i,[e.startToken],[e.endToken]):new MediaInParens(new GeneralEnclosed(e))}function parseMediaNot(t){let i=!1,a=null;for(let n=0;n<t.length;n++){const r=t[n];if(r.type!==e.Whitespace&&r.type!==e.Comment){if(isIdent(r)){if("not"===r.value[4].value.toLowerCase()){if(i)return!1;i=!0;continue}return!1}if(!i||!s(r))return!1;{r.normalize();const e=parseMediaInParensFromSimpleBlock(r);if(!1===e)return!1;a=new MediaNot(t.slice(0,n).flatMap((e=>e.tokens())),e)}}}return a||!1}function parseMediaOr(t){let i=!1;for(let a=0;a<t.length;a++){const n=t[a];if(n.type!==e.Whitespace&&n.type!==e.Comment){if(isIdent(n)){if("or"===n.value[4].value.toLowerCase()){if(i)return!1;i=!0;continue}return!1}if(i&&s(n)){n.normalize();const e=parseMediaInParensFromSimpleBlock(n);return!1!==e&&{advance:a,node:new MediaOr(t.slice(0,a).flatMap((e=>e.tokens())),e)}}return!1}}return!1}function parseMediaAnd(t){let i=!1;for(let a=0;a<t.length;a++){const n=t[a];if(n.type!==e.Whitespace&&n.type!==e.Comment){if(isIdent(n)){if("and"===n.value[4].value.toLowerCase()){if(i)return!1;i=!0;continue}return!1}if(i&&s(n)){n.normalize();const e=parseMediaInParensFromSimpleBlock(n);return!1!==e&&{advance:a,node:new MediaAnd(t.slice(0,a).flatMap((e=>e.tokens())),e)}}return!1}}return!1}function parseFromTokens(e,t){const i=o(e,{onParseError:null==t?void 0:t.onParseError});return i.map(((e,a)=>{const n=parseMediaQuery(e);return 0==n&&!0===(null==t?void 0:t.preserveInvalidMediaQueries)?new MediaQueryInvalid(i[a]):n})).filter((e=>!!e))}function parse(e,t){const i=h({css:e},{onParseError:null==t?void 0:t.onParseError}),a=[];for(;!i.endOfFile();)a.push(i.nextToken());return a.push(i.nextToken()),parseFromTokens(a,t)}!function(e){e.Not="not",e.Only="only"}(v||(v={}));class CustomMedia{type=f.CustomMedia;name;mediaQueryList=null;trueOrFalseKeyword=null;constructor(e,t,i){this.name=e,this.mediaQueryList=t,this.trueOrFalseKeyword=i??null}getName(){for(let e=0;e<this.name.length;e++){const t=this.name[e];if(t[0]===d.Ident)return t[4].value}return""}getNameToken(){for(let e=0;e<this.name.length;e++){const t=this.name[e];if(t[0]===d.Ident)return t}return null}hasMediaQueryList(){return!!this.mediaQueryList}hasTrueKeyword(){if(!this.trueOrFalseKeyword)return!1;for(let e=0;e<this.trueOrFalseKeyword.length;e++){const t=this.trueOrFalseKeyword[e];if(t[0]!==d.Comment&&t[0]!==d.Whitespace)return t[0]===d.Ident&&"true"===t[4].value.toLowerCase()}return!1}hasFalseKeyword(){if(!this.trueOrFalseKeyword)return!1;for(let e=0;e<this.trueOrFalseKeyword.length;e++){const t=this.trueOrFalseKeyword[e];if(t[0]!==d.Comment&&t[0]!==d.Whitespace)return t[0]===d.Ident&&"false"===t[4].value.toLowerCase()}return!1}tokens(){if(this.trueOrFalseKeyword)return[...this.name,...this.trueOrFalseKeyword];if(!this.mediaQueryList)return[...this.name];const e=[];for(let t=0;t<this.mediaQueryList.length;t++){const i=this.mediaQueryList[t];0!==t&&e.push([d.Comma,",",-1,-1,void 0]),e.push(...i.tokens())}return[...this.name,...e]}toString(){return u(...this.tokens())}toJSON(){var e;return{type:this.type,string:this.toString(),nameValue:this.getName(),name:this.name,hasFalseKeyword:this.hasFalseKeyword(),hasTrueKeyword:this.hasTrueKeyword(),trueOrFalseKeyword:this.trueOrFalseKeyword,mediaQueryList:null==(e=this.mediaQueryList)?void 0:e.map((e=>e.toJSON()))}}isCustomMedia(){return CustomMedia.isCustomMedia(this)}static isCustomMedia(e){return!!e&&(e instanceof CustomMedia&&e.type===f.CustomMedia)}}function parseCustomMediaFromTokens(e,t){let i=[],a=e;for(let t=0;t<e.length;t++)if(e[t][0]!==d.Comment&&e[t][0]!==d.Whitespace){if(e[t][0]===d.Ident){if(e[t][4].value.startsWith("--")){i=e.slice(0,t+1),a=e.slice(t+1);break}}return!1}let n=!0;for(let e=0;e<a.length;e++)if(a[e][0]!==d.Comment&&a[e][0]!==d.Whitespace){if(a[e][0]===d.Ident){const t=a[e][4].value.toLowerCase();if("false"===t)continue;if("true"===t)continue}if(a[e][0]===d.EOF)break;n=!1}return n?new CustomMedia(i,null,a):new CustomMedia(i,parseFromTokens(m(a),t))}function parseCustomMedia(e,t){const i=h({css:e},{onParseError:null==t?void 0:t.onParseError}),a=[];for(;!i.endOfFile();)a.push(i.nextToken());return a.push(i.nextToken()),parseCustomMediaFromTokens(a,t)}function isCustomMedia(e){return CustomMedia.isCustomMedia(e)}function isGeneralEnclosed(e){return GeneralEnclosed.isGeneralEnclosed(e)}function isMediaAnd(e){return MediaAnd.isMediaAnd(e)}function isMediaConditionList(e){return isMediaConditionListWithAnd(e)||isMediaConditionListWithOr(e)}function isMediaConditionListWithAnd(e){return MediaConditionListWithAnd.isMediaConditionListWithAnd(e)}function isMediaConditionListWithOr(e){return MediaConditionListWithOr.isMediaConditionListWithOr(e)}function isMediaCondition(e){return MediaCondition.isMediaCondition(e)}function isMediaFeatureBoolean(e){return MediaFeatureBoolean.isMediaFeatureBoolean(e)}function isMediaFeatureName(e){return MediaFeatureName.isMediaFeatureName(e)}function isMediaFeatureValue(e){return MediaFeatureValue.isMediaFeatureValue(e)}function isMediaFeaturePlain(e){return MediaFeaturePlain.isMediaFeaturePlain(e)}function isMediaFeatureRange(e){return isMediaFeatureRangeNameValue(e)||isMediaFeatureRangeValueName(e)||isMediaFeatureRangeValueNameValue(e)}function isMediaFeatureRangeNameValue(e){return MediaFeatureRangeNameValue.isMediaFeatureRangeNameValue(e)}function isMediaFeatureRangeValueName(e){return MediaFeatureRangeValueName.isMediaFeatureRangeValueName(e)}function isMediaFeatureRangeValueNameValue(e){return MediaFeatureRangeValueNameValue.isMediaFeatureRangeValueNameValue(e)}function isMediaFeature(e){return MediaFeature.isMediaFeature(e)}function isMediaInParens(e){return MediaInParens.isMediaInParens(e)}function isMediaNot(e){return MediaNot.isMediaNot(e)}function isMediaOr(e){return MediaOr.isMediaOr(e)}function isMediaQuery(e){return isMediaQueryWithType(e)||isMediaQueryWithoutType(e)||isMediaQueryInvalid(e)}function isMediaQueryWithType(e){return MediaQueryWithType.isMediaQueryWithType(e)}function isMediaQueryWithoutType(e){return MediaQueryWithoutType.isMediaQueryWithoutType(e)}function isMediaQueryInvalid(e){return MediaQueryInvalid.isMediaQueryInvalid(e)}function typeFromToken(e){if(e[0]!==d.Ident)return!1;switch(e[4].value.toLowerCase()){case g.All:return g.All;case g.Print:return g.Print;case g.Screen:return g.Screen;case g.Tty:return g.Tty;case g.Tv:return g.Tv;case g.Projection:return g.Projection;case g.Handheld:return g.Handheld;case g.Braille:return g.Braille;case g.Embossed:return g.Embossed;case g.Aural:return g.Aural;case g.Speech:return g.Speech;default:return!1}}function cloneMediaQuery(e){const t=m(e.tokens()),i=parseFromTokens(t,{preserveInvalidMediaQueries:!0})[0];if(!i)throw new Error(`Failed to clone media query for : "${u(...t)}"`);if(isMediaQueryInvalid(e)&&isMediaQueryInvalid(i))return i;if(isMediaQueryWithType(e)&&isMediaQueryWithType(i))return i;if(isMediaQueryWithoutType(e)&&isMediaQueryWithoutType(i))return i;throw new Error(`Failed to clone media query for : "${u(...t)}"`)}!function(e){e.All="all",e.Print="print",e.Screen="screen",e.Tty="tty",e.Tv="tv",e.Projection="projection",e.Handheld="handheld",e.Braille="braille",e.Embossed="embossed",e.Aural="aural",e.Speech="speech"}(g||(g={}));export{CustomMedia,GeneralEnclosed,MediaAnd,MediaCondition,MediaConditionListWithAnd,MediaConditionListWithOr,MediaFeature,MediaFeatureBoolean,p as MediaFeatureEQ,M as MediaFeatureGT,c as MediaFeatureLT,MediaFeatureName,MediaFeaturePlain,MediaFeatureRangeNameValue,MediaFeatureRangeValueName,MediaFeatureRangeValueNameValue,MediaFeatureValue,MediaInParens,MediaNot,MediaOr,MediaQueryInvalid,v as MediaQueryModifier,MediaQueryWithType,MediaQueryWithoutType,g as MediaType,f as NodeType,cloneMediaQuery,comparisonFromTokens,invertComparison,isCustomMedia,isGeneralEnclosed,isMediaAnd,isMediaCondition,isMediaConditionList,isMediaConditionListWithAnd,isMediaConditionListWithOr,isMediaFeature,isMediaFeatureBoolean,isMediaFeatureName,isMediaFeaturePlain,isMediaFeatureRange,isMediaFeatureRangeNameValue,isMediaFeatureRangeValueName,isMediaFeatureRangeValueNameValue,isMediaFeatureValue,isMediaInParens,isMediaNot,isMediaOr,isMediaQuery,isMediaQueryInvalid,isMediaQueryWithType,isMediaQueryWithoutType,matchesComparison,matchesRatio,matchesRatioExactly,modifierFromToken,newMediaFeatureBoolean,newMediaFeaturePlain,parse,parseCustomMedia,parseCustomMediaFromTokens,parseFromTokens,typeFromToken};
