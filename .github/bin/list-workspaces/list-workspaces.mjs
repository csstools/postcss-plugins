import path from 'node:path';
import { getFiles } from '../util/get-files.mjs';
import fs from 'node:fs';
import { toposort } from '../util/toposort.mjs';

export async function listWorkspaces() {
	try {
		const rootPackageJSON = JSON.parse(await fs.promises.readFile('package.json'));
		const workspaces = rootPackageJSON.workspaces;

		const packages = new Set();
		for (const workspace of workspaces) {
			if (workspace.endsWith('/*')) {
				const packageDirs = await getFiles(workspace.slice(0, -2), false);
				for (const packageDir of packageDirs) {
					packages.add(
						path.resolve(path.join(packageDir, 'package.json')),
					);
				}
			} else {
				packages.add(
					path.resolve(path.join(workspace, 'package.json')),
				);
			}
		}

		for (const packagePath of packages.values()) {
			if (!fs.existsSync(packagePath)) {
				packages.delete(packagePath);
			}
		}

		const result = [];

		for (const packageJSONPath of Array.from(packages)) {
			const packageJSON = JSON.parse(await fs.promises.readFile(packageJSONPath));
			const packagePath = path.relative(process.cwd(), path.dirname(packageJSONPath));

			result.push({
				path: packagePath,
				name: packageJSON.name,
				unscopedName: packageJSON.name.replace(/^@[^/]+\//, ''),
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
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err);
		throw new Error('failed to get the list of workspaces', {
			cause: err,
		});
	}
}
