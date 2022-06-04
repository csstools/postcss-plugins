const fs = require('fs');
const data = fs.readFileSync(0, 'utf-8');
let fileNames = data.split(/\r?\n/);

const allowList = [];

fileNames = fileNames.filter((f) => {
	if (0 === f.length) {
		return false; // trailing newline
	}

	if (-1 !== f.indexOf('node_modules')) {
		return false; // node_modules folders are not distributed
	}

	if (0 === f.indexOf('./.git/')) {
		return false; // git stuffs
	}

	if (0 === f.indexOf('./.github/')) {
		return false; // these are not distributed
	}

	return !allowList.includes(f);
});

if (!fileNames || !fileNames.length) {
	process.exit(0);
}

if (!process.env.GITHUB_ACTIONS || process.env.DISABLE_GITHUB_ACTIONS_ANNOTATIONS) {
	fileNames.forEach((f) => {
		console.log(`Unexpected executable\n  to fix    : chmod a-x ${f}`);
	});
	process.exit(1);
}

fileNames.forEach((f) => {
	const annotation = formatGitHubActionAnnotation(
		`Unexpected executable\n  to fix    : chmod a-x ${f}`,
		'error',
		{
			file: f,
			line: 1,
			col: 1,
		}
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
