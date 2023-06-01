function decodeCSS(e){if("csstools-has-"!==e.slice(0,13))return"";for(var t=(e=e.slice(13)).split("-"),r="",o=0;o<t.length;o++)r+=String.fromCharCode(parseInt(t[o],36));return r}function extractEncodedSelectors(e){for(var t,r,o=[],n=0,s=!1,l=!1,i=0;i<e.length;i++){var c=e[i];switch(c){case"[":if(s){t+=c;continue}0===n?t="":t+=c,n++;continue;case"]":if(s){t+=c;continue}if(0===--n){var a=decodeCSS(t);l&&o.push(a)}else t+=c;continue;case"\\":t+=e[i],t+=e[i+1],i++;continue;case'"':case"'":if(s&&c===r){s=!1;continue}if(s){t+=c;continue}s=!0,r=c;continue;default:""===t&&1===n&&"csstools-has-"===e.slice(i,i+13)&&(l=!0),t+=c;continue}}for(var u=[],p=0;p<o.length;p++)-1===u.indexOf(o[p])&&u.push(o[p]);return u}function encodeCSS(e){if(""===e)return"";for(var t,r="",o=0;o<e.length;o++)t=e.charCodeAt(o).toString(36),r+=0===o?t:"-"+t;return"csstools-has-"+r}function hasNativeSupport(){try{if(!("CSS"in self)||!("supports"in self.CSS)||!self.CSS.supports("selector(:has(div))"))return!1}catch(e){return!1}return!0}function cssHasPseudo(e,t){t||(t={}),(t={hover:!!t.hover||!1,debug:!!t.debug||!1,observedAttributes:t.observedAttributes||[],forcePolyfill:!!t.forcePolyfill||!1}).mustPolyfill=t.forcePolyfill||!hasNativeSupport(),Array.isArray(t.observedAttributes)||(t.observedAttributes=[]),t.observedAttributes=t.observedAttributes.filter((function(e){return"string"==typeof e})),t.observedAttributes=t.observedAttributes.concat(["accept","accept-charset","accesskey","action","align","allow","alt","async","autocapitalize","autocomplete","autofocus","autoplay","buffered","capture","challenge","charset","checked","cite","class","code","codebase","cols","colspan","content","contenteditable","contextmenu","controls","coords","crossorigin","csp","data","datetime","decoding","default","defer","dir","dirname","disabled","download","draggable","enctype","enterkeyhint","for","form","formaction","formenctype","formmethod","formnovalidate","formtarget","headers","hidden","high","href","hreflang","http-equiv","icon","id","importance","integrity","intrinsicsize","inputmode","ismap","itemprop","keytype","kind","label","lang","language","list","loop","low","manifest","max","maxlength","minlength","media","method","min","multiple","muted","name","novalidate","open","optimum","pattern","ping","placeholder","poster","preload","radiogroup","readonly","referrerpolicy","rel","required","reversed","rows","rowspan","sandbox","scope","scoped","selected","shape","size","sizes","slot","span","spellcheck","src","srcdoc","srclang","srcset","start","step","summary","tabindex","target","title","translate","type","usemap","value","width","wrap"]);var r=[],o=e.createElement("x");if([].forEach.call(e.styleSheets,walkStyleSheet),t.mustPolyfill){if(transformObservedItemsThrottled(),"MutationObserver"in self)new MutationObserver((function(t){t.forEach((function(t){[].forEach.call(t.addedNodes||[],(function(e){1===e.nodeType&&e.sheet&&walkStyleSheet(e.sheet)})),[].push.apply(r,r.splice(0).filter((function(t){return t.rule.parentStyleSheet&&t.rule.parentStyleSheet.ownerNode&&e.documentElement.contains(t.rule.parentStyleSheet.ownerNode)}))),transformObservedItemsThrottled()}))})).observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:t.observedAttributes});if(e.addEventListener("focus",transformObservedItemsThrottled,!0),e.addEventListener("blur",transformObservedItemsThrottled,!0),e.addEventListener("input",transformObservedItemsThrottled),e.addEventListener("change",transformObservedItemsThrottled,!0),t.hover&&("onpointerenter"in e?(e.addEventListener("pointerenter",transformObservedItemsThrottled,!0),e.addEventListener("pointerleave",transformObservedItemsThrottled,!0)):(e.addEventListener("mouseover",transformObservedItemsThrottled,!0),e.addEventListener("mouseout",transformObservedItemsThrottled,!0))),"defineProperty"in Object&&"getOwnPropertyDescriptor"in Object&&"hasOwnProperty"in Object)try{var n=function observeProperty(e,t){if(e.hasOwnProperty(t)){var r=Object.getOwnPropertyDescriptor(e,t);r&&r.configurable&&"set"in r&&Object.defineProperty(e,t,{configurable:r.configurable,enumerable:r.enumerable,get:function get(){return r.get.apply(this,arguments)},set:function set(){r.set.apply(this,arguments);try{transformObservedItemsThrottled()}catch(e){}}})}};"HTMLElement"in self&&HTMLElement.prototype&&n(HTMLElement.prototype,"disabled"),["checked","selected","readOnly","required"].forEach((function(e){["HTMLButtonElement","HTMLFieldSetElement","HTMLInputElement","HTMLMeterElement","HTMLOptGroupElement","HTMLOptionElement","HTMLOutputElement","HTMLProgressElement","HTMLSelectElement","HTMLTextAreaElement"].forEach((function(t){t in self&&self[t].prototype&&n(self[t].prototype,e)}))}))}catch(l){t.debug&&console.error(l)}var s=!1}function transformObservedItemsThrottled(){s&&cancelAnimationFrame(s),s=requestAnimationFrame((function(){r.forEach((function(r){var n=[],s=[];try{s=e.querySelectorAll(r.selector)}catch(l){return void(t.debug&&console.error(l))}[].forEach.call(s,(function(t){n.push(t),o.innerHTML="<x "+r.attributeName+">",t.setAttributeNode(o.children[0].attributes[0].cloneNode()),e.documentElement.style.zoom=1,e.documentElement.style.zoom=null})),r.nodes.forEach((function(t){-1===n.indexOf(t)&&(t.removeAttribute(r.attributeName),e.documentElement.style.zoom=1,e.documentElement.style.zoom=null)})),r.nodes=n}))}))}function walkStyleSheet(e){try{[].forEach.call(e.cssRules||[],(function(o,n){if(o.selectorText){o.selectorText=o.selectorText.replace(/\.js-has-pseudo\s/g,"");try{var s=extractEncodedSelectors(o.selectorText.toString());if(0===s.length)return;if(!t.mustPolyfill)return void e.deleteRule(n);for(var i=0;i<s.length;i++){var c=s[i];r.push({rule:o,selector:c,attributeName:encodeCSS(c),nodes:[]})}}catch(l){t.debug&&console.error(l)}}else walkStyleSheet(o)}))}catch(l){t.debug&&console.error(l)}}}!function(e){try{if(e.document.querySelector(":has(*, :does-not-exist, > *)"),!e.document.querySelector(":has(:scope *)")&&CSS.supports("selector(:has(div))"))return}catch(a){}var t=polyfill(e.Element.prototype.querySelector);e.Element.prototype.querySelector=function querySelector(e){return t.apply(this,arguments)};var r=polyfill(e.Element.prototype.querySelectorAll);if(e.Element.prototype.querySelectorAll=function querySelectorAll(e){return r.apply(this,arguments)},e.Element.prototype.matches){var o=polyfill(e.Element.prototype.matches);e.Element.prototype.matches=function matches(e){return o.apply(this,arguments)}}if(e.Element.prototype.closest){var n=polyfill(e.Element.prototype.closest);e.Element.prototype.closest=function closest(e){return n.apply(this,arguments)}}if("Document"in e&&"prototype"in e.Document){var s=polyfill(e.Document.prototype.querySelector);e.Document.prototype.querySelector=function querySelector(e){return s.apply(this,arguments)};var l=polyfill(e.Document.prototype.querySelectorAll);if(e.Document.prototype.querySelectorAll=function querySelectorAll(e){return l.apply(this,arguments)},e.Document.prototype.matches){var i=polyfill(e.Document.prototype.matches);e.Document.prototype.matches=function matches(e){return i.apply(this,arguments)}}if(e.Document.prototype.closest){var c=polyfill(e.Document.prototype.closest);e.Document.prototype.closest=function closest(e){return c.apply(this,arguments)}}}function pseudoClassHasInnerQuery(e){for(var t="",r=0,o=0,n=!1,s=!1,l=!1,i=!1,c=0;c<e.length;c++){var a=e[c];if(n)t+=a,n=!1;else if(s)a===l&&(s=!1),t+=a;else switch(":has("!==t.toLowerCase()||i||(i=!0,r=c,t=""),a){case":":i||(t=""),t+=a;continue;case"(":i&&o++,t+=a;continue;case")":if(i){if(0===o)return{innerQuery:t,start:r,end:c-1};o--}t+=a;continue;case"\\":t+=a,n=!0;continue;case'"':case"'":t+=a,s=!0,l=a;continue;default:t+=a;continue}}return!1}function replaceScopeWithAttr(e,t){for(var r=[],o="",n=!1,s=!1,l=!1,i=0,c=0;c<e.length;c++){var a=e[c];if(n)o+=a,n=!1;else if(s)a===l&&(s=!1),o+=a;else switch(":scope"===o.toLowerCase()&&!i&&/^[\[\.\:\\"\s|+>~#&,)]/.test(a||"")&&(r.push(o.slice(0,o.length-6)),r.push("["+t+"]"),o=""),a){case":":r.push(o),o="",o+=a;continue;case"\\":o+=a,n=!0;continue;case'"':case"'":o+=a,s=!0,l=a;continue;case"[":o+=a,i++;continue;case"]":o+=a,i>0&&i--;continue;default:o+=a;continue}}return":scope"===o.toLowerCase()&&(r.push(o.slice(0,o.length-6)),r.push("["+t+"]"),o=""),0===r.length?e:r.join("")+o}function splitSelector(e){for(var t,r,o=[],n="",s=!1,l=!1,i=!1,c=!1,a=0,u=0;u<e.length;u++){var p=e[u];if(s)n+=p,s=!1;else switch(p){case",":if(l){n+=p;continue}if(a>0){n+=p;continue}o.push(n),n="";continue;case"\\":n+=p,s=!0;continue;case'"':case"'":if(l&&p===i){n+=p,l=!1;continue}n+=p,l=!0,i=p;continue;case"(":case")":case"[":case"]":if(l){n+=p;continue}if(t=p,"("===(r=c)&&")"===t||"["===r&&"]"===t){n+=p,0===--a&&(c=!1);continue}if(p===c){n+=p,a++;continue}n+=p,a++,c=p;continue;default:n+=p;continue}}return o.push(n),o}function replaceAllWithTempAttr(e,t,r){var o=pseudoClassHasInnerQuery(e);if(!o)return e;if(t)return!1;var n=o.innerQuery,s="q-has"+(Math.floor(9e6*Math.random())+1e6),l="["+s+"]",i=e;if(o.innerQuery.toLowerCase().indexOf(":has(")>-1){for(var c=splitSelector(o.innerQuery),a=[],u=0;u<c.length;u++){var p=c[u];if(!replaceAllWithTempAttr(p,!0,(function(){})))throw new Error("Nested :has() is not supported");a.push(p)}var f=i.substring(0,o.start-5),d=i.substring(o.end+2);return f+a.join(", ")+d}f=i.substring(0,o.start-5),d=i.substring(o.end+2);if(i=f+l+d,r(n,s),i.toLowerCase().indexOf(":has(")>-1){var h=replaceAllWithTempAttr(i,!1,r);if(h)return h}return i}function walkNode(e,t){if("setAttribute"in e&&"querySelector"in e&&t(e),e.hasChildNodes())for(var r=e.childNodes,o=0;o<r.length;++o)walkNode(r[o],t)}function polyfill(t){return function(r){if(!r)return t.apply(this,arguments);var o,n=String(r);if(!n||-1===n.toLowerCase().indexOf(":has(")||!pseudoClassHasInnerQuery(n))return t.apply(this,arguments);if("getRootNode"in this)o=this.getRootNode();else for(var s=this;s;)o=s,s=s.parentNode;var l=this;l===e.document&&(l=e.document.documentElement);var i="q-has-scope"+(Math.floor(9e6*Math.random())+1e6);l.setAttribute(i,"");try{n=replaceScopeWithAttr(n,i);var c=[i],u=replaceAllWithTempAttr(n,!1,(function(e,t){c.push(t);for(var r=splitSelector(e),n=0;n<r.length;n++){var s=r[n].trim(),l=s;l=">"===s[0]||"+"===s[0]||"~"===s[0]?s.slice(1).trim():":scope "+s,walkNode(o,(function(e){if(e.querySelector(l))switch(s[0]){case"~":case"+":for(var r=e.childNodes,o=0;o<r.length;o++){var n=r[o];if("setAttribute"in n){var i="q-has-id"+(Math.floor(9e6*Math.random())+1e6);n.setAttribute(i,""),e.querySelector(":scope ["+i+"] "+s)&&n.setAttribute(t,""),n.removeAttribute(i)}}break;case">":i="q-has-id"+(Math.floor(9e6*Math.random())+1e6);e.setAttribute(i,""),e.querySelector(":scope["+i+"] "+s)&&e.setAttribute(t,""),e.removeAttribute(i);break;default:e.setAttribute(t,"")}}))}}));arguments[0]=u;var p=t.apply(this,arguments);if(l.removeAttribute(i),c.length>0){for(var f=[],d=0;d<c.length;d++)f.push("["+c[d]+"]");for(var h=e.document.querySelectorAll(f.join(",")),m=0;m<h.length;m++)for(var y=h[m],v=0;v<c.length;v++)y.removeAttribute(c[v])}return p}catch(g){if(l.removeAttribute(i),c.length>0){for(f=[],d=0;d<c.length;d++)f.push("["+c[d]+"]");for(h=e.document.querySelectorAll(f.join(",")),m=0;m<h.length;m++)for(y=h[m],v=0;v<c.length;v++)y.removeAttribute(c[v])}var b="";try{t.apply(this,[":core-web-does-not-exist"])}catch(S){b=S.message,b&&(b=b.replace(":core-web-does-not-exist",n))}b||(b="Failed to execute 'querySelector' on 'Document': '"+n+"' is not a valid selector.");try{throw new DOMException(b)}catch(a){throw new Error(b)}}}}}(self);export{cssHasPseudo as default};
//# sourceMappingURL=browser.mjs.map
