import fs from 'node:fs/promises';
import path from 'node:path';
import { updateDocumentation } from './docs.mjs';

export async function minifyContextFiles(workspace) {
	// Render a smaller `README.md` file
	await updateDocumentation(workspace.path, true);

	const originalPackageInfo = JSON.parse(await fs.readFile(path.join(workspace.path, 'package.json')));
	const originalChangelog = (await fs.readFile(path.join(workspace.path, 'CHANGELOG.md'))).toString();

	const minifiedPackageInfo = JSON.parse(JSON.stringify(originalPackageInfo));
	let minifiedChangelog = originalChangelog;

	// package.json
	// - remove some fields that are not useful for end users
	{
		delete minifiedPackageInfo.devDependencies;
		delete minifiedPackageInfo.csstools;
		delete minifiedPackageInfo.volta;
		delete minifiedPackageInfo.eslintConfig;

		// NPM prefers an empty scripts object over a missing one.
		minifiedPackageInfo.scripts = {};
	}

	// CHANGELOG.md
	// - remove some older entries
	// - keep the last 2 entries
	// - add a link to the full changelog
	{
		let headingIndex = -1;
		for (let i = 0; i < 2; i++) {
			headingIndex = minifiedChangelog.indexOf('\n### ', headingIndex + 1);

			if (headingIndex === -1) {
				break;
			}
		}

		if (headingIndex > -1) {
			minifiedChangelog = minifiedChangelog.slice(0, headingIndex);

			const dependencyLink = `https://github.com/csstools/postcss-plugins/tree/main/${workspace.path.replaceAll('\\', '/')}`;
			const versionAsLink = `[Full CHANGELOG](${dependencyLink}/CHANGELOG.md)`;
			minifiedChangelog += `\n${versionAsLink}\n`;
		}
	}

	await fs.writeFile(path.join(workspace.path, 'package.json'), JSON.stringify(minifiedPackageInfo, null, '\t') + '\n');
	await fs.writeFile(path.join(workspace.path, 'CHANGELOG.md'), minifiedChangelog);

	return async () => {
		await fs.writeFile(path.join(workspace.path, 'package.json'), JSON.stringify(originalPackageInfo, null, '\t') + '\n');
		await fs.writeFile(path.join(workspace.path, 'CHANGELOG.md'), originalChangelog);

		// Render the full `README.md` file
		await updateDocumentation(workspace.path);
	};
}
