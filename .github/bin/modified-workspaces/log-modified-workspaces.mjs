import { listModifiedWorkspaces } from "./modified-workspaces.mjs";

const modifiedWorkspaces = await listModifiedWorkspaces();
if (modifiedWorkspaces.all) {
	// root package.json will take over.
	process.stdout.write(``);
	process.exit(0);
}

if (modifiedWorkspaces.nothing) {
	// in the current form we always need to do something.
	// building/testing this package prevents error states if nothing actually changed.
	process.stdout.write(`--workspace=@csstools/selector-specificity`);
	process.exit(0);
}

process.stdout.write(`--workspace=${modifiedWorkspaces.modified.map((x) => x.name).join(' --workspace=')}`);
process.exit(0);
