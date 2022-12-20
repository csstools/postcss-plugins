import browserslist from 'browserslist';

export function matchBrowserslistCondition(condition: string, browsers: Set<string>): string | true | undefined {
	const conditionBrowsers = browserslist(condition);

	for (let i = 0; i < conditionBrowsers.length; i++) {
		const conditionBrowser = conditionBrowsers[i];

		if (browsers.has(conditionBrowser)) {
			return true;
		}
	}

	return `Died because the browsers matching "${condition}" do not have any overlap with your project browserslist`;
}
