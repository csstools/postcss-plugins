import path from 'path';
import { promises as fsp } from 'fs';
import glob from 'glob';

export async function listWorkspaces() {
	try {
		const rootPackageJSON = JSON.parse(await fsp.readFile('package.json'));
		const workspaces = rootPackageJSON.workspaces;

		const packages = new Set();
		workspaces.forEach((workspace) => {
			glob.sync(path.join(workspace, 'package.json')).forEach((packageJSONPath) => {
				if (packages.has(packageJSONPath)) {
					return;
				}

				packages.add(packageJSONPath);
			});
		});

		const result = [];

		for (const packageJSONPath of Array.from(packages)) {
			const packageJSON = JSON.parse(await fsp.readFile(packageJSONPath));
			const packagePath = packageJSONPath.slice(0, -1 * '/package.json'.length);

			result.push({
				path: packagePath,
				name: packageJSON.name,
				dependencies: [
					...Object.keys(Object(packageJSON.devDependencies)),
					...Object.keys(Object(packageJSON.dependencies)),
				]
			});
		}

		return result;
	} catch(err) {
		console.error(err);
		throw new Error('failed to get the list of workspaces');
	}
}


console.log(await listWorkspaces());
