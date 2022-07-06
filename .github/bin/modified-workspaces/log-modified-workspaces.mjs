import { listModifiedWorkspaces } from './modified-workspaces.mjs';
import { promises as fsp } from 'fs';

const modifiedWorkspaces = await listModifiedWorkspaces();
if (process.env.GITHUB_STEP_SUMMARY) {
	let summary = '';
	if (modifiedWorkspaces.nothing) {
		summary = `## Modified workspaces

- no changes detected
- tasks need something to do
- requesting a build and test for \`@csstools/postcss-tape\`

build-and-test-all-packages: ${JSON.stringify(process.env['build-and-test-all-packages'])}
`;
	} else if (modifiedWorkspaces.all) {
		summary = `## Modified workspaces

- all workspaces are affected
- rebuilding and testing every workspace

build-and-test-all-packages: ${JSON.stringify(process.env['build-and-test-all-packages'])}
`;
	} else if (modifiedWorkspaces.modified && modifiedWorkspaces.modified.length) {
		summary = `## Modified workspaces

- ${modifiedWorkspaces.modified.map((x) => '`' + x.name + '`').join('\n- ')}

build-and-test-all-packages: ${JSON.stringify(process.env['build-and-test-all-packages'])}
`;
	}

	await fsp.appendFile(
		process.env.GITHUB_STEP_SUMMARY,
		summary,
	);
}

if (modifiedWorkspaces.all) {
	// root package.json will take over.
	process.stdout.write('');
	process.exit(0);
}

if (modifiedWorkspaces.nothing) {
	// in the current form we always need to do something.
	// building/testing any package prevents error states if nothing actually changed.
	process.stdout.write('--workspace=@csstools/postcss-tape');
	process.exit(0);
}

process.stdout.write(`--workspace=${modifiedWorkspaces.modified.map((x) => x.name).join(' --workspace=')}`);
process.exit(0);
