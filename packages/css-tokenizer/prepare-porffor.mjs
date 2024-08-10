import fs from 'fs';
import path from 'path';

const moduleScript = fs.readFileSync(path.join('dist', 'index.mjs'), 'utf-8');
const globalScript = moduleScript.split(/export\s?\{/)[0];
const doStuff = `
;const tokens = tokenize({
	css: '.foo { color: rgb(10, calc(20 * 0.129), 15); }',
});

console.log(tokens);

const foo = "bar";
console.log(foo);
console.log(foo.valueOf().codePointAt(0));
`;

fs.writeFileSync(path.join('dist', 'porffor.mjs'), globalScript + doStuff, 'utf-8');
