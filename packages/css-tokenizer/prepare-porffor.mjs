import fs from 'fs';
import path from 'path';

const moduleScript = fs.readFileSync(path.join('dist', 'index.mjs'), 'utf-8');
const globalScript = moduleScript.split('export{')[0];
const doStuff = `
;const tokens = tokenize({
	css: '.some { css: "rgb(120, calc(10 + 2), -30)"; }',
});

console.log(tokens);
`;

fs.writeFileSync(path.join('dist', 'porffor.mjs'), globalScript + doStuff, 'utf-8');

