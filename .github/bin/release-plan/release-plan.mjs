import fs from 'fs/promises'
import path from 'path'
import { commitAfterDependencyUpdates, commitAfterPackageRelease } from './commit.mjs';
import { discordAnnounce } from './discord-announce.mjs';
import { nowFormatted } from './date-format.mjs';
import { npmInstall } from './npm-install.mjs';
import { npmPublish } from './npm-publish.mjs';
import { npmVersion } from './npm-version.mjs';
import { updateDocumentation } from './docs.mjs';
import { prepareCurrentReleasePlan } from './prepare-current-release-plan.mjs';
import { prepareNextReleasePlan } from './prepare-next-release-plan.mjs';

const {
	needsRelease,
	notReleasableNow,
	maybeNextPlan
} = await prepareCurrentReleasePlan();

for (const workspace of needsRelease.values()) {
	console.log(`Releasing : ${workspace.name}`);
	// Increment the version
	workspace.newVersion = await npmVersion(workspace.increment, workspace.path);
	workspace.newVersionChangeLogHeadingID = workspace.newVersion.replaceAll('.', '');

	// Update the changelog
	const changelog = workspace.changelog.replace(`Unreleased (${workspace.increment})`, `${workspace.newVersion}\n\n_${nowFormatted()}_`);
	await fs.writeFile(path.join(workspace.path, 'CHANGELOG.md'), changelog);

	// Update the documentation
	await updateDocumentation(workspace.path);

	// Commit changes
	await commitAfterPackageRelease(workspace.newVersion, workspace.path, workspace.name);

	// Publish to npm
	await npmPublish(workspace.path, workspace.name);

	// Announce on discord
	await discordAnnounce(workspace);
}

const didChangeDownstreamPackages = await prepareNextReleasePlan(needsRelease, notReleasableNow, maybeNextPlan);

console.log('\nUpdating lock file');
await npmInstall();

if (didChangeDownstreamPackages) {
	await commitAfterDependencyUpdates();
}

console.log('\nDone 🎉');

if (didChangeDownstreamPackages || maybeNextPlan.size > 0) {
	console.log('\nNotes:'); // empty line
	if (didChangeDownstreamPackages) {
		console.log('  - updated "package.json" files of downstream packages.');
	}
	if (maybeNextPlan.size) {
		console.log('  - some packages where excluded from this plan. A next plan of releases might be available now.');
	}
}
