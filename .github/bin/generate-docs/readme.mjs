import { promises as fsp } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const template = await fsp.readFile(path.join('docs', './README.md'), 'utf8');
const corsTemplate = await fsp.readFile(path.join(path.dirname(fileURLToPath(import.meta.url)), './cors-template.md'), 'utf8');
const packageJSONInfo = JSON.parse(await fsp.readFile('./package.json', 'utf8'));

let exampleFilePaths = [];

try {
	exampleFilePaths = await fsp.readdir(path.join('test', 'examples'));
} catch(error) {
	// No examples
}

let readmeDoc = template.toString();

// Cleanup docs instructions
readmeDoc = readmeDoc.replace(`<!-- Available Variables: -->
<!-- <humanReadableName> PostCSS Your Plugin -->
<!-- <exportName> postcssYourPlugin -->
<!-- <packageName> @csstools/postcss-your-plugin -->
<!-- <packageVersion> 1.0.0 -->
<!-- <packagePath> plugins/postcss-your-plugin -->
<!-- <cssdbId> your-feature -->
<!-- <specUrl> https://www.w3.org/TR/css-color-4/#funcdef-color -->
<!-- <example.css> file contents for examples/example.css -->
<!-- <header> -->
<!-- <usage> usage instructions -->
<!-- <envSupport> -->
<!-- <corsWarning> -->
<!-- <linkList> -->
<!-- to generate : npm run docs -->

`, '');

// Insert sub-templates
readmeDoc = readmeDoc.replaceAll('<corsWarning>', corsTemplate);

// Insert "Header" section
readmeDoc = readmeDoc.replace('<header>', `# <humanReadableName> [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

` + '[<img alt="npm version" src="https://img.shields.io/npm/v/<packageName>.svg" height="20">][npm-url] ' +
`${
	packageJSONInfo.csstools?.cssdbId ?
		'[<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/<cssdbId>.svg" height="20">][css-url] ' :
		''
}` +
'[<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] ' +
'[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]');

// Insert "Usage" section
readmeDoc = readmeDoc.replace('<usage>', `## Usage

Add [<humanReadableName>] to your project:

\`\`\`bash
npm install postcss <packageName> --save-dev
\`\`\`

Use it as a [PostCSS] plugin:

\`\`\`js
const postcss = require('postcss');
const <exportName> = require('<packageName>');

postcss([
	<exportName>(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
\`\`\``);

// Insert "Env Support" section
readmeDoc = readmeDoc.replace('<envSupport>', `[<humanReadableName>] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)`);

// Insert "Link List" section
readmeDoc = readmeDoc.replace('<linkList>', `[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
${
	packageJSONInfo.csstools?.cssdbId ?
		'[css-url]: https://cssdb.org/#<cssdbId>' :
		''
}
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/<packageName>

[PostCSS]: https://github.com/postcss/postcss
[<humanReadableName>]: https://github.com/csstools/postcss-plugins/tree/main/<packagePath>`);

readmeDoc = readmeDoc.replaceAll('<cssdbId>', packageJSONInfo.csstools.cssdbId);
readmeDoc = readmeDoc.replaceAll('<exportName>', packageJSONInfo.csstools.exportName);
readmeDoc = readmeDoc.replaceAll('<humanReadableName>', packageJSONInfo.csstools.humanReadableName);
readmeDoc = readmeDoc.replaceAll('<packageName>', packageJSONInfo.name);
readmeDoc = readmeDoc.replaceAll('<packageVersion>', packageJSONInfo.version);
readmeDoc = readmeDoc.replaceAll('<packagePath>', path.join(path.basename(path.dirname(process.cwd())), path.basename(process.cwd())));
readmeDoc = readmeDoc.replaceAll('<specUrl>', packageJSONInfo.csstools.specUrl);

for (const exampleFilePath of exampleFilePaths) {
	readmeDoc = readmeDoc.replaceAll(
		`<${exampleFilePath}>`,
		(await fsp.readFile(path.join('test', 'examples', exampleFilePath), 'utf8')).toString().slice(0, -1), // trim final newline
	);
}

await fsp.writeFile('./README.md', readmeDoc);
