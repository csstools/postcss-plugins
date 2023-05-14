export function addUpdatedPackagesToChangelog(workspace, changelog, changeLogAdditions) {
	if (changelog.includes('Unreleased')) {
		let unreleasedSectionStart = changelog.indexOf('Unreleased');
		if (unreleasedSectionStart === -1) {
			console.log('Unable to update the Changelog for ' + workspace.name);
			return changelog;
		}

		let unreleasedSectionContent = changelog.indexOf('\n', unreleasedSectionStart);
		if (unreleasedSectionContent === -1) {
			console.log('Unable to update the Changelog for ' + workspace.name);
			return changelog;
		}

		let nextSectionStart = changelog.indexOf('### ', unreleasedSectionContent);
		if (nextSectionStart === -1) {
			nextSectionStart = changelog.length;
		}

		let listEnd = changelog.lastIndexOf('- ', nextSectionStart);
		if (listEnd === -1) {
			console.log('Unable to update the Changelog for ' + workspace.name);
			return changelog;
		}

		let nextLine = changelog.indexOf('\n', listEnd);
		if (nextLine === -1) {
			console.log('Unable to update the Changelog for ' + workspace.name);
			return changelog;
		}

		changelog = changelog.slice(0, nextLine + 1) + changeLogAdditions + '\n' + changelog.slice(nextLine + 1);
	} else {
		let nextSectionStart = changelog.indexOf('### ');
		if (nextSectionStart === -1) {
			nextSectionStart = changelog.length;
		}

		changelog = changelog.slice(0, nextSectionStart) + `### Unreleased (patch)\n\n${changeLogAdditions}\n\n` + changelog.slice(nextSectionStart);
	}

	return changelog;
}
