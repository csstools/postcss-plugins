import path from 'path';
import posixPath from 'path/posix';
import { promises as fsp } from 'fs';
import glob from 'glob';
import { toposort } from './toposort.mjs';

export async function listWorkspaces() {
	try {
		const rootPackageJSON = JSON.parse(await fsp.readFile('package.json'));
		const workspaces = rootPackageJSON.workspaces;

		if (process.env.VERBOSE) {
			console.log('root', rootPackageJSON.name);
			console.log('declared workspaces', rootPackageJSON.workspaces);
		}

		const packages = new Set();
		workspaces.forEach((workspace) => {
			glob.sync(posixPath.join(workspace, 'package.json')).forEach((packageJSONPath) => {
				if (process.env.VERBOSE) {
					console.log('globbed', packageJSONPath);
				}

				if (packages.has(packageJSONPath)) {
					return;
				}

				packages.add(packageJSONPath);
			});
		});

		const result = [];

		if (process.env.VERBOSE) {
			console.log('packages', Array.from(packages));
		}

		for (const packageJSONPath of Array.from(packages)) {
			const packageJSON = JSON.parse(await fsp.readFile(packageJSONPath));
			const packagePath = packageJSONPath.slice(0, -1 * '/package.json'.length);

			result.push({
				path: packagePath,
				name: packageJSON.name,
				dependencies: [
					...Object.keys(Object(packageJSON.devDependencies)),
					...Object.keys(Object(packageJSON.dependencies)),
				],
			});
		}

		const packageNames =  result.map((x) => x.name);

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
