import path from 'path';

export function formatGitHubActionAnnotation(message: string, level = 'error', options: Record<string, unknown> = {}) {
	let output = '::' + level;

	const outputOptions = Object.keys(options).map((key) => {
		let value = String(options[key]);

		if (key === 'file' && process.env.GITHUB_WORKSPACE) {
			// make file paths relative to the workspace root.
			value = path.relative(process.env.GITHUB_WORKSPACE, path.resolve(value));
		}

		return `${key}=${escapeValue(value)}`;
	}).join(',');

	if (outputOptions) {
		output += ` ${outputOptions}`;
	}

	return `${output}::${escapeData(message || '')}`;
}

function escapeData(s: string) {
	return s.replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

function escapeValue(s: string) {
	return s.replace(/\r/g, '%0D')
		.replace(/\n/g, '%0A')
		.replace(/]/g, '%5D')
		.replace(/;/g, '%3B');
}
