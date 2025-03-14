import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

import { parallelBuildsNotice } from './parallel-builds-notice.mjs';

const template = fs.readFileSync(path.join('docs', './README.md'), 'utf8');
const corsTemplate = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), './cors-template.md'), 'utf8');
const packageJSONInfo = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

let exampleFilePaths = [];

try {
	exampleFilePaths = (
		await fs.promises.readdir(path.join('test', 'examples'), { recursive: true, withFileTypes: true })
	).filter(x => x.isFile()).map(x => path.join(x.parentPath, x.name));
} catch {
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
<!-- <parallelBuildsNotice> -->
<!-- to generate : npm run docs -->

`, '');

// Insert sub-templates
readmeDoc = readmeDoc.replaceAll('<corsWarning>', corsTemplate);

// Insert "Header" section
function headerText() {
	const baselineBadge = packageJSONInfo.csstools?.cssdbId ?
		'<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/<cssdbId>.svg" height="20">][css-url] ' :
		'';

	const cssdbBadge = packageJSONInfo.csstools?.cssdbId ?
		'[<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/<cssdbId>.svg" height="20">][css-url] ' :
		'';

	if (process.env.MINIMAL) {
		return `# <humanReadableName> [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

\`npm install <packageName> --save-dev\``;
	}

	return `# <humanReadableName> [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

` +
'[<img alt="npm version" src="https://img.shields.io/npm/v/<packageName>.svg" height="20">][npm-url] ' +
'[<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url] ' +
'[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]' +
baselineBadge +
cssdbBadge +
`\n
\`\`\`bash
npm install <packageName> --save-dev
\`\`\``;
}

readmeDoc = readmeDoc.replace('<header>', headerText());

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

function envSupport() {
	if (process.env.MINIMAL) {
		return '';
	}

	return `[<humanReadableName>] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)`;
}

// Insert "Env Support" section
readmeDoc = readmeDoc.replace('<envSupport>', envSupport());

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

if (packageJSONInfo?.csstools?.assumesToProcessBundledCSS) {
	readmeDoc = readmeDoc.replaceAll('<parallelBuildsNotice>', parallelBuildsNotice(packageJSONInfo.csstools.humanReadableName));
} else {
	readmeDoc = readmeDoc.replaceAll('<parallelBuildsNotice>', '');
}

for (const exampleFilePath of exampleFilePaths) {
	readmeDoc = readmeDoc.replaceAll(
		`<${path.relative(path.join('test', 'examples'), exampleFilePath)}>`,
		(await fs.readFileSync(exampleFilePath, 'utf8')).toString().slice(0, -1), // trim final newline
	);
}

fs.writeFileSync('./README.md', readmeDoc);
