export function addUpdatedPackagesToChangelog(workspace, changelog, changeLogAdditions) {
	if (changelog.includes('Unreleased')) {
		// Find the heading for the unreleased changes.
		const unreleasedSectionStart = changelog.indexOf('Unreleased');
		if (unreleasedSectionStart === -1) {
			console.log('Unable to update the Changelog for ' + workspace.name);
			return changelog;
		}

		// Find the start of the section content for the unreleased changes.
		const unreleasedSectionContent = changelog.indexOf('\n', unreleasedSectionStart) + 1;
		if (unreleasedSectionContent === 0) {
			console.log('Unable to update the Changelog for ' + workspace.name);
			return changelog;
		}

		// Find the heading for the next section (if any).
		let nextSectionStart = changelog.indexOf('### ', unreleasedSectionContent);
		if (nextSectionStart === -1) {
			nextSectionStart = changelog.length;
		}

		// Search backward from the next section to find the line for the last unreleased change.
		const listEnd = changelog.lastIndexOf('- ', nextSectionStart);
		if (listEnd < unreleasedSectionContent) {
			console.log('Unable to update the Changelog for ' + workspace.name);
			return changelog;
		}

		// Get the start of the next line after the last change.
		const nextLine = changelog.indexOf('\n', listEnd) + 1;
		if (nextLine === 0) {
			console.log('Unable to update the Changelog for ' + workspace.name);
			return changelog;
		}

		// Insert the changelog additions on the line after the last change.
		changelog = changelog.slice(0, nextLine) + changeLogAdditions + changelog.slice(nextLine);
	} else {
		// There are no unreleased changes, so prepend the changelog additions in a new unreleased segment.
		let nextSectionStart = changelog.indexOf('### ');
		if (nextSectionStart === -1) {
			nextSectionStart = changelog.length;
		}

		changelog = changelog.slice(0, nextSectionStart) + `### Unreleased (patch)\n\n${changeLogAdditions}\n` + changelog.slice(nextSectionStart);
	}

	return changelog;
}
