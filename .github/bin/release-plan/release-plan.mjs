import fs from 'fs/promises';
import path from 'path';
import { commitAfterDependencyUpdates, commitSingleDirectory } from './commit.mjs';
import { discordAnnounce, discordAnnounceDryRun } from './discord-announce.mjs';
import { nowFormatted } from './date-format.mjs';
import { npmInstall } from './npm-install.mjs';
import { npmPublish } from './npm-publish.mjs';
import { npmVersion } from './npm-version.mjs';
import { updateDocumentation } from './docs.mjs';
import { prepareCurrentReleasePlan } from './prepare-current-release-plan.mjs';
import { prepareNextReleasePlan } from './prepare-next-release-plan.mjs';
import { runAndPrintDebugOnFail } from './run-and-print-debug-on-fail.mjs';
import { npmPrepublishScripts } from './npm-prepublish-scripts.mjs';
import { minifyContextFiles } from './minify-context-files.mjs';

const {
	needsRelease,
	notReleasableNow,
	maybeNextPlan,
} = await prepareCurrentReleasePlan();

if (process.argv.slice(2).includes('--dry-run')) {
	discordAnnounceDryRun();
	process.exit(0);
}

for (const workspace of needsRelease.values()) {
	console.log(`Releasing : ${workspace.name}`);
	// Increment the version
	workspace.newVersion = await npmVersion(workspace.increment, workspace.path);
	workspace.newVersionChangeLogHeadingID = workspace.newVersion.replaceAll('.', '');

	// Update the changelog
	const changelog = workspace.changelog.replace(`Unreleased (${workspace.increment})`, `${workspace.newVersion}\n\n_${nowFormatted()}_`);
	await fs.writeFile(path.join(workspace.path, 'CHANGELOG.md'), changelog);

	// Update the documentation
	await runAndPrintDebugOnFail(
		updateDocumentation(workspace.path),
		`When releasing ${workspace.name} an error occurred.`,
		'This happened during the documentation update and before committing and publishing changes.\n' +
		'Please fix the error and try again from a clean git state.',
	);

	// Commit changes
	await runAndPrintDebugOnFail(
		commitSingleDirectory(
			`${workspace.name} v${workspace.newVersion}`, // "@csstools/css-tokenizer v1.0.0"
			workspace.path,
		),
		`When releasing ${workspace.name} an error occurred.`,
		'This happened when committing changes.\n' +
		'Please fix the error and try again from a clean git state.',
	);

	// Run pre-publish scripts
	await runAndPrintDebugOnFail(
		npmPrepublishScripts(workspace.path, workspace.name),
		`When releasing ${workspace.name} an error occurred.`,
		'This happened while running the pre-publish scripts.\n' +
		'A commit with changes relevant to this release has already been made.\n' +
		'Please fix the error and try again.',
	);

	const restoreContextFiles = await minifyContextFiles(workspace);

	// Publish to npm
	await runAndPrintDebugOnFail(
		npmPublish(workspace.path, workspace.name),
		`When releasing ${workspace.name} an error occurred.`,
		'This happened when publishing to npm.\n' +
		'A commit with changes relevant to this release has already been made.\n' +
		'Please fix the error and try again.',
	);

	await restoreContextFiles();

	// Announce on discord
	await runAndPrintDebugOnFail(
		discordAnnounce(workspace),
		`When releasing ${workspace.name} an error occurred.`,
		'This happened when announcing the update on Discord.\n' +
		'Committing relevant changes and publishing to npm succeeded.',
	);
}

const didChangeDownstreamPackages = await prepareNextReleasePlan(needsRelease, notReleasableNow);

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
		console.log('  - some packages were excluded from this plan. A next plan of releases might be available now.');
	}
}
