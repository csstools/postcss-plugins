/**
 * Verify that the published contents of your node package will pass a basic smoke test.
 *
 * @example
 * ```sh
 * node --test
 * ```
 *
 * ```js
 * // test/pack.test.mjs
 * import { testPack } from '@csstools/pack-test';
 *
 * await testPack("your-module-name");
 * ```
 *
 * @packageDocumentation
 */

import url from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { platform } from 'node:process';
import { spawn } from 'node:child_process';

const PACKAGE_DIR_NAME = 'package';

export async function testPack(moduleName: string): Promise<void> {
	if (platform.startsWith('win')) {
		console.log('Skipping test on Windows');

		return;
	}

	if (!('resolve' in import.meta)) {
		console.log('Skipping test on platform without `import.meta.resolve` support');

		return;
	}


	const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'csstools-pack-test-'));
	let didError = false;

	try {
		const moduleURL = new URL(import.meta.resolve(moduleName));
		console.log(`Testing module: ${moduleName}`);

		const modulePath = url.fileURLToPath(moduleURL);

		const packageJsonPath = await findPackageJsonFromDir(path.dirname(modulePath));
		const moduleRoot = path.dirname(packageJsonPath);

		const packFile = await pack(moduleRoot, tempDir);
		const packagePath = await unpack(packFile, tempDir);

		const packageInfo = await getPackageInfo(path.join(packagePath, 'package.json'));

		await eraseDevDependenciesInfo(path.join(packagePath, 'package.json'));

		await createRootPackage(tempDir, packageInfo);

		await runNPMInstall(tempDir);

		await runTest(tempDir);
	} catch (err) {
		console.error(err);
		didError = true;
	} finally {
		await fs.rm(tempDir, { recursive: true });
	}

	if (didError) {
		process.exit(1);
	}
}

async function findPackageJsonFromDir(dir: string, ceil = 10): Promise<string> {
	const packageJsonPath = path.join(dir, 'package.json');
	try {
		await fs.access(packageJsonPath);
		return packageJsonPath;
	} catch {
		if (dir === '/' || ceil <= 0) {
			throw new Error('Could not find package.json');
		}
	}

	return findPackageJsonFromDir(path.dirname(dir), ceil - 1);
}

async function pack(moduleDir: string, tmpDir: string): Promise<string> {
	const packDir = await fs.mkdir(path.join(tmpDir, 'pack'), { recursive: true });

	// run `npm pack --pack-destination <dir>`
	const npm = spawn('npm', ['pack', '--pack-destination', packDir], {
		cwd: moduleDir,
		shell: platform === 'win32',
	});

	const packFile = await new Promise<string>((resolve, reject) => {
		let stdoutBuffer = '';
		let stderrBuffer = '';

		npm.stdout.on('data', (data: Buffer | string) => {
			stdoutBuffer += data.toString();
		});

		npm.stderr.on('data', (data: Buffer | string) => {
			stderrBuffer += data.toString();
		});

		npm.on('close', (code) => {
			if (code === 0) {
				resolve(stdoutBuffer.trim());
			} else {
				console.error(stderrBuffer);
				reject(new Error(`npm pack exited with code ${code}`));
			}
		});
	});

	return path.join(packDir, packFile);
}

async function unpack(packFile: string, tmpDir: string): Promise<string> {
	const packagePath = path.join(tmpDir, PACKAGE_DIR_NAME);

	await fs.mkdir(packagePath, { recursive: true });

	// run `tar -xf  <dir>`
	const tar = spawn('tar', ['-xf', packFile, '-C', PACKAGE_DIR_NAME, '--strip-components', '1'], {
		cwd: tmpDir,
	});

	await new Promise<void>((resolve, reject) => {
		tar.on('close', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`tar exited with code ${code}`));
			}
		});
	});

	return packagePath;
}

type packageInfo = { name: string, peerDependencies?: Record<string, string> };

// Because NPM/Node is broken all over...
async function eraseDevDependenciesInfo(packageJSONPath: string): Promise<void> {
	const packageInfo = JSON.parse(await fs.readFile(packageJSONPath, 'utf8')) as Record<string, unknown>;

	delete packageInfo.devDependencies;

	await fs.writeFile(packageJSONPath, JSON.stringify(packageInfo, null, '\t'));
}

async function getPackageInfo(packageJSONPath: string): Promise<packageInfo> {
	return JSON.parse(await fs.readFile(packageJSONPath, 'utf8')) as packageInfo;
}

async function createRootPackage(rootDir: string, packageInfo: packageInfo): Promise<void> {
	await fs.writeFile(
		path.join(rootDir, 'package.json'),
		JSON.stringify({
			"name": "@csstools/pack-test--root",
			"private": true,
			"type": "module",
			"version": "1.0.0",
			"description": "",
			"workspaces": [
				PACKAGE_DIR_NAME
			],
			"dependencies": packageInfo.peerDependencies ?? {},
			"scripts": {
				"test": "node --test"
			}
		}, null, '\t')
	);

	await fs.writeFile(
		path.join(rootDir, 'index.mjs'),
		`import '${packageInfo.name}';`
	);
}

async function runNPMInstall(rootDir: string): Promise<void> {
	const npm = spawn('npm', ['install', '--omit', 'dev'], {
		cwd: rootDir,
		stdio: 'inherit',
		shell: platform === 'win32',
	});

	await new Promise<void>((resolve, reject) => {
		npm.on('close', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`npm install exited with code ${code}`));
			}
		});
	});
}

async function runTest(rootDir: string): Promise<void> {
	const npm = spawn('node', ['index.mjs'], {
		cwd: rootDir,
		stdio: 'inherit',
		shell: platform === 'win32',
	});

	await new Promise<void>((resolve, reject) => {
		npm.on('close', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`npm install exited with code ${code}`));
			}
		});
	});
}

