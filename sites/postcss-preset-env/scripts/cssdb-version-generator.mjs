import path from 'path';
import { URL } from 'url';
import fs from 'fs/promises';

const __dirname = new URL('.', import.meta.url).pathname;
const pkgPath = path.resolve(__dirname, '../package.json');
const pkg = await fs.readFile(pkgPath, 'utf8').then(JSON.parse);
const url = `https://unpkg.com/cssdb@${pkg.dependencies.cssdb.replace('^', '')}/cssdb.json`

const text = `const unpkgURL = '${url}';
export default unpkgURL;`;

await fs.writeFile(path.resolve(__dirname, '../src/utils/cssdb_url.mjs'), text);
