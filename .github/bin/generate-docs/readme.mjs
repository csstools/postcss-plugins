import { promises as fsp } from 'fs';
import path from 'path';

const template = await fsp.readFile(path.join('docs', './README.md'), 'utf8');
const packageJSONInfo = JSON.parse(await fsp.readFile('./package.json', 'utf8'));

const exampleFilePaths = await fsp.readdir(path.join('test', 'examples'));

let installDoc = template.toString();

// Cleanup docs instructions
installDoc = installDoc.replace(`<!-- Available Variables: -->
<!-- <humanReadableName> PostCSS Your Plugin -->
<!-- <exportName> postcssYourPlugin -->
<!-- <packageName> @csstools/postcss-your-plugin -->
<!-- <packagePath> plugins/postcss-your-plugin -->
<!-- <cssdbId> your-feature -->
<!-- <specUrl> https://www.w3.org/TR/css-color-4/#funcdef-color -->
<!-- <example.css> file contents for examples/example.css -->
<!-- <header> -->
<!-- <usage> usage instructions -->
<!-- <env-support> -->
<!-- <link-list> -->

`, '');

// Insert "Header" section
installDoc = installDoc.replace('<header>', `# <humanReadableName> [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[<img alt="npm version" src="https://img.shields.io/npm/v/<packageName>.svg" height="20">][npm-url]
[<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/<cssdbId>.svg" height="20">][css-url]
[<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]`);

// Insert "Usage" section
installDoc = installDoc.replace('<usage>', `## Usage

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
installDoc = installDoc.replace('<env-support>', `[<humanReadableName>] runs in all Node environments, with special
instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |`);

// Insert "Link List" section
installDoc = installDoc.replace('<link-list>', `[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#<cssdbId>
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/<packageName>

[CSS Color]: <specUrl>
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[<humanReadableName>]: https://github.com/csstools/postcss-plugins/tree/main/<packagePath>`);

installDoc = installDoc.replaceAll('<cssdbId>', packageJSONInfo.csstools.cssdbId);
installDoc = installDoc.replaceAll('<exportName>', packageJSONInfo.csstools.exportName);
installDoc = installDoc.replaceAll('<humanReadableName>', packageJSONInfo.csstools.humanReadableName);
installDoc = installDoc.replaceAll('<packageName>', packageJSONInfo.name);
installDoc = installDoc.replaceAll('<packagePath>', path.join(path.basename(path.dirname(process.cwd())), path.basename(process.cwd())));
installDoc = installDoc.replaceAll('<specUrl>', packageJSONInfo.csstools.specUrl);

for (const exampleFilePath of exampleFilePaths) {
	console.log(exampleFilePath);
	installDoc = installDoc.replaceAll(
		`<${exampleFilePath}>`,
		(await fsp.readFile(path.join('test', 'examples', exampleFilePath), 'utf8')).toString().slice(0, -1) // trim final newline
	);
}

await fsp.writeFile('./README.md', installDoc);
