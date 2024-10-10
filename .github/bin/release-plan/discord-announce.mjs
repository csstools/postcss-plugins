const defaultPayload = {
	content: '',
	embeds: [
		{
			title: '',
			url: '',
			description: '',
			color: 3963146,
		},
	],
};
const BASE_URL = 'https://github.com/csstools/postcss-plugins/tree/main';
const getChangelog = (changelog) => {
	const firstUnreleasedIndex = changelog.indexOf('### Unreleased');
	const firstLineBreakIndex = changelog.indexOf('\n', firstUnreleasedIndex);
	const secondRelease = changelog.indexOf('###', firstLineBreakIndex);

	// Get the text between the first line break after the unreleased heading and the next release heading
	const text = changelog.slice(firstLineBreakIndex + 1, secondRelease === -1 ? undefined : secondRelease).trim();

	// Replace relative links with absolute links
	return text.replace(/]\(\//g, `](${ BASE_URL }/`);
};

export async function discordAnnounce(workspace) {
	if (process.env.DEBUG) {
		return;
	}

	const discordArgument = process.argv.slice(2).find(arg => arg.includes('--discord='));
	if (!discordArgument) {
		return;
	}

	const [, webHookUrl] = discordArgument.split('=');

	if (!webHookUrl || workspace.increment === 'patch') {
		return;
	}

	const isNew = workspace.increment === 'major' && workspace.newVersion === '1.0.0';
	const payload = { ...defaultPayload };

	if (isNew) {
		payload.content = `:tada: New package: ${workspace.name} :tada:`;
	} else {
		payload.content = `:rocket: New release: ${workspace.name}@${workspace.newVersion} :rocket:`;
	}

	payload.embeds[0].title = workspace.name;
	payload.embeds[0].url = `${BASE_URL}/${workspace.path}`;
	payload.embeds[0].description = getChangelog(workspace.changelog);

	return fetch(webHookUrl, {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: { 'Content-Type': 'application/json' },
	});
}

export async function discordAnnounceDryRun() {
	if (process.env.DEBUG) {
		return;
	}

	const discordArgument = process.argv.slice(2).find(arg => arg.includes('--discord='));
	if (!discordArgument) {
		// eslint-disable-next-line no-console
		console.log('Discord announce webhook URL: not set');
		return;
	}

	const [, webHookUrl] = discordArgument.split('=');

	if (!webHookUrl) {
		// eslint-disable-next-line no-console
		console.log('Discord announce webhook URL: not set');
		return;
	}

	// eslint-disable-next-line no-console
	console.log(`Discord announce webhook URL: ${webHookUrl}`);
}
