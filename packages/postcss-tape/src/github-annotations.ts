export function formatGitHubActionAnnotation(message, level = 'error', options = {}) {
	let output = '::' + level;

	const outputOptions = Object.keys(options).map((key) => {
		return `${key}=${escapeValue(String(options[key]))}`;
	}).join(',');

	if (outputOptions) {
		output += ` ${outputOptions}`;
	}

	return `${output}::${escapeData(message || '')}`;
}

function escapeData(s) {
	return s.replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

function escapeValue(s) {
	return s.replace(/\r/g, '%0D')
		.replace(/\n/g, '%0A')
		.replace(/]/g, '%5D')
		.replace(/;/g, '%3B');
}
