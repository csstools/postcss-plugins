const defaultPayload = {
	content: '',
	embeds: [
		{
			title: '',
			url: '',
			description: '',
			color: 3963146,
		}
	]
};
const BASE_URL = 'https://github.com/csstools/postcss-plugins/tree/main';
const getChangelog = (changelog) => {
	const firstUnreleasedIndex = changelog.indexOf('### Unreleased');
	const firstLineBreakIndex = changelog.indexOf('\n', firstUnreleasedIndex);
	const secondRelease = changelog.indexOf('###', firstLineBreakIndex);
	return changelog.slice(firstLineBreakIndex + 1, secondRelease === -1 ? undefined : secondRelease).trim();
}

export async function discordAnnounce(workspace) {
	const discordArgument = process.argv.slice(2).find(arg => arg.includes('--discord='));
	const [,webHookUrl] = discordArgument.split('=');

	if (!webHookUrl || workspace.increment === 'patch') {
		return;
	}

	const isNew = workspace.increment === 'major' && workspace.newVersion === '1.0.0';
	const payload = { ...defaultPayload };

	if (isNew) {
		payload.content = `:tada: New package: ${ workspace.name } :tada:`;
	} else {
		payload.content = `:rocket: New release: ${ workspace.name }@${ workspace.newVersion } :rocket:`;
	}

	const relativePath = workspace.path.split('/postcss-plugins/')[1];
	payload.embeds[0].title = workspace.name;
	payload.embeds[0].url = `${ BASE_URL }/${ relativePath }`;
	payload.embeds[0].description = getChangelog(workspace.changelog);

	return fetch(webHookUrl, {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: { 'Content-Type': 'application/json' },
	});
}
