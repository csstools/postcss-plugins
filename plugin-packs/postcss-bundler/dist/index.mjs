import s from"postcss-import";import t from"@csstools/postcss-rebase-url";import r from"crypto";function hashLayerName(s,t){return t?`import-anon-layer-${r.createHash("sha256").update(`${s}-${t}`).digest("hex").slice(0,12)}`:`import-anon-layer-${s}`}const creator=r=>{const o=Object.assign({skipDuplicates:!1,nameLayer:hashLayerName,warnOnEmpty:!1},(null==r?void 0:r.import)||{});return{postcssPlugin:"postcss-bundler",plugins:[s(o),t()]}};creator.postcss=!0;export{creator as default};
