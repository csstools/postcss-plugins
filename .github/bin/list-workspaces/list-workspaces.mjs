import path from 'path';
import { promises as fsp } from 'fs';
import glob from 'glob';
import { toposort } from '../util/toposort.mjs';

export async function listWorkspaces() {
	try {
		const rootPackageJSON = JSON.parse(await fsp.readFile('package.json'));
		const workspaces = rootPackageJSON.workspaces;

		const packages = new Set();
		workspaces.forEach((workspace) => {
			// minimatch glob v5 does not allow backslashes in paths and therefor doesn't work correctly on windows.
			// it is absurd that a package mainly used to match paths is using backslashes as an escape character.
			// only way around it is to join as posix before globbing.
			glob.sync((path.posix ?? path).join(workspace, 'package.json')).forEach((packageJSONPath) => {

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
				private: packageJSON.private,
				dependencies: [
					...Object.keys(Object(packageJSON.dependencies)),
					...Object.keys(Object(packageJSON.devDependencies)),
					...Object.keys(Object(packageJSON.peerDependencies)),
				],
			});
		}

		const packageNames = result.map((x) => x.name);

		result.forEach((x) => {
			x.dependencies = x.dependencies.filter((y) => {
				return packageNames.includes(y);
			});
		});

		const dependencyGraphEdges = result.flatMap((x) => {
			return x.dependencies.map((y) => {
				return [y, x.name];
			});
		});

		const sorted = toposort(packageNames, dependencyGraphEdges);
		if (!sorted) {
			throw new Error('Circular reference detected');
		}

		result.sort((a, b) => {
			return sorted.indexOf(a) - sorted.indexOf(b);
		});

		return result;
	} catch(err) {
		console.error(err);
		throw new Error('failed to get the list of workspaces');
	}
}
