import fs from 'fs/promises'
import path from 'path'
import { addUpdatedPackagesToChangelog } from './add-to-changelog.mjs';

export async function prepareNextReleasePlan(needsRelease, notReleasableNow) {
	// Downstream dependents
	let didChangeDownstreamPackages = false;

	console.log('\nPreparing next plan');

	for (const workspace of notReleasableNow.values()) {
		const packageInfo = JSON.parse(await fs.readFile(path.join(workspace.path, 'package.json')));
		let didChange = false;

		let changeLogAdditions = '';

		for (const dependency of workspace.dependencies) {
			if (needsRelease.has(dependency)) {
				const updated = needsRelease.get(dependency);

				const dependencyLink = `https://github.com/csstools/postcss-plugins/tree/main/${updated.path.replaceAll('\\', '/')}`;
				const nameAsLink = `[\`${updated.name}\`](${dependencyLink})`;
				const versionAsLink = `[\`${updated.newVersion}\`](${dependencyLink}/CHANGELOG.md#${updated.newVersionChangeLogHeadingID})`;

				if (
					packageInfo.dependencies &&
					packageInfo.dependencies[updated.name] &&
					packageInfo.dependencies[updated.name] !== '*' &&
					updated.newVersion
				) {
					packageInfo.dependencies[updated.name] = '^' + updated.newVersion;

					if (updated.newVersion !== '1.0.0') {
						// initial releases are not mentioned as updates
						changeLogAdditions += `- Updated ${nameAsLink} to ${versionAsLink} (${updated.increment})\n`;
					}

					didChange = true;
				}
				if (
					packageInfo.devDependencies &&
					packageInfo.devDependencies[updated.name] &&
					packageInfo.devDependencies[updated.name] !== '*' &&
					updated.newVersion
				) {
					packageInfo.devDependencies[updated.name] = '^' + updated.newVersion;
					// dev dependencies are not included in the changelog
					didChange = true;
				}
				if (
					packageInfo.peerDependencies &&
					packageInfo.peerDependencies[updated.name] &&
					packageInfo.peerDependencies[updated.name] !== '*' &&
					updated.newVersion
				) {
					packageInfo.peerDependencies[updated.name] = '^' + updated.newVersion;
					changeLogAdditions += `- Updated ${nameAsLink} to ${versionAsLink} (${updated.increment})\n`;
					didChange = true;
				}
			}
		}

		if (didChange) {
			didChangeDownstreamPackages = true;
			await fs.writeFile(path.join(workspace.path, 'package.json'), JSON.stringify(packageInfo, null, '\t') + '\n');
		}

		if (didChange && changeLogAdditions) {
			let changelog = (await fs.readFile(path.join(workspace.path, 'CHANGELOG.md'))).toString();
			changelog = addUpdatedPackagesToChangelog(workspace, changelog, changeLogAdditions);

			await fs.writeFile(path.join(workspace.path, 'CHANGELOG.md'), changelog);
		}
	}

	return didChangeDownstreamPackages;
}
