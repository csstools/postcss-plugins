import fs from 'fs';
const data = fs.readFileSync(0, 'utf-8');
let fileNames = data.split(/\r?\n/);

const allowList = [];

fileNames = fileNames.filter((f) => {
	if (0 === f.length) {
		return false; // trailing newline
	}

	if (f.includes('node_modules')) {
		return false; // node_modules folders are not distributed
	}

	if (f.startsWith('./.git/')) {
		return false; // git stuffs
	}

	if (f.startsWith('./.github/')) {
		return false; // these are not distributed
	}

	if (f.endsWith('dist/cli.cjs')) {
		return false; // this is expected to be executable
	}

	return !allowList.includes(f);
});

if (!fileNames || !fileNames.length) {
	process.exit(0);
}

if (!process.env.GITHUB_ACTIONS) {
	console.log('Unexpected executables:');
	fileNames.forEach((f) => {
		console.log(`chmod a-x ${f}`);
	});
	process.exit(1);
}

fileNames.forEach((f) => {
	const annotation = formatGitHubActionAnnotation(
		'This file is unexpectedly executable',
		'error',
		{
			file: f,
			line: 1,
			col: 1,
		},
	);

	console.log(annotation);
});

process.exit(1);

function formatGitHubActionAnnotation(message, level = 'error', options = {}) {
	let output = '::' + level;

	const outputOptions = Object.keys(options)
		.map((key) => {
			return `${key}=${escape(String(options[key]))}`;
		})
		.join(',');

	if (outputOptions) {
		output += ` ${outputOptions}`;
	}

	return `${output}::${escapeData(message || '')}`;
}

function escapeData(s) {
	return s.replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

function escape(s) {
	return s
		.replace(/\r/g, '%0D')
		.replace(/\n/g, '%0A')
		.replace(/]/g, '%5D')
		.replace(/;/g, '%3B');
}
