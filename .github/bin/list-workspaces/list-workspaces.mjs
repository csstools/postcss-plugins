import path from 'path';
import { getFiles } from '../util/get-files.mjs';
import fs, { promises as fsp } from 'fs';
import { toposort } from '../util/toposort.mjs';

const p = (path.posix ?? path);

export async function listWorkspaces() {
	try {
		const rootPackageJSON = JSON.parse(await fsp.readFile('package.json'));
		const workspaces = rootPackageJSON.workspaces;

		const packages = new Set();
		for (const workspace of workspaces) {
			if (workspace.endsWith('/*')) {
				const packageDirs = await getFiles(workspace.slice(0, -2), false);
				for (const packageDir of packageDirs) {
					packages.add(
						p.resolve(p.join(packageDir, 'package.json'))
					);
				}
			} else {
				packages.add(
					p.resolve(p.join(workspace, 'package.json'))
				);
			}
		}

		for (const packagePath of packages.values()) {
			if (!fs.existsSync(packagePath)) {
				packages.delete(packagePath);
			}
		}

		console.error('---- workspaces ----')
		console.error(Array.from(packages.values()));
		console.error('----  ----')


		const result = [];

		for (const packageJSONPath of Array.from(packages)) {
			const packageJSON = JSON.parse(await fsp.readFile(packageJSONPath));
			const packagePath = p.relative(process.cwd(), p.dirname(packageJSONPath));

			console.error(packagePath);

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
