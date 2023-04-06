import { listModifiedWorkspaces } from './modified-workspaces.mjs';
import { promises as fsp } from 'fs';

const modifiedWorkspaces = await listModifiedWorkspaces();

// Summary
if (process.env.GITHUB_STEP_SUMMARY) {
	let summary = '';
	if (modifiedWorkspaces.nothing) {
		summary = `## Modified workspaces

- no changes detected
- tasks need something to do
- requesting a build and test for \`@csstools/postcss-tape\`
`;
	} else if (modifiedWorkspaces.all) {
		summary = `## Modified workspaces

- all workspaces are affected
- rebuilding and testing every workspace
- forced: ${modifiedWorkspaces.forced ? 'true' : 'false'}
`;
	} else if (modifiedWorkspaces.modified && modifiedWorkspaces.modified.length) {
		summary = `## Modified workspaces

- ${modifiedWorkspaces.modified.map((x) => '`' + x.name + '`').join('\n- ')}
`;
	}

	await fsp.appendFile(
		process.env.GITHUB_STEP_SUMMARY,
		summary,
	);
}

// Output modified workspaces
if (modifiedWorkspaces.all || (modifiedWorkspaces.modified && modifiedWorkspaces.modified.length >= 20)) {
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
