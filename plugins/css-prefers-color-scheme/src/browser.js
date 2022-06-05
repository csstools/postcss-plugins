/* global document,window,matchMedia */
const prefersColorSchemeRegExp = /prefers-color-scheme:/i;

const prefersColorSchemeInit = initialColorScheme => {
	const mediaQueryString = '(prefers-color-scheme: dark)';
	const mediaQueryList = window.matchMedia && matchMedia(mediaQueryString);
	const hasNativeSupport = mediaQueryList && mediaQueryList.media === mediaQueryString;
	const mediaQueryListener = () => {
		set(mediaQueryList.matches ? 'dark' : 'light');
	};
	const removeListener = () => {
		if (mediaQueryList) {
			mediaQueryList.removeListener(mediaQueryListener);
		}
	};
	const set = colorScheme => {
		if (colorScheme !== currentColorScheme) {
			currentColorScheme = colorScheme;

			if (typeof result.onChange === 'function') {
				result.onChange();
			}
		}

		[].forEach.call(document.styleSheets || [], styleSheet => {
			try {
				// cssRules is a live list. Converting to an Array first.
				const rules = [];
				[].forEach.call(styleSheet.cssRules || [], cssRule => {
					rules.push(cssRule);
				});

				rules.forEach(cssRule => {
					const colorSchemeMatch = prefersColorSchemeRegExp.test(Object(cssRule.media).mediaText);

					if (colorSchemeMatch) {
						const index = [].indexOf.call(cssRule.parentStyleSheet.cssRules, cssRule);
						cssRule.parentStyleSheet.deleteRule(index);
					} else {
						// New style which supports complex media queries.
						const colorDepthMatch = (Object(cssRule.media).mediaText || '').match(/\( *(?:color|max-color): *(48842621|70318723) *\)/i);
						if (colorDepthMatch && colorDepthMatch.length > 1) {
							if (colorScheme === 'dark' && (colorDepthMatch[1] === '48842621')) {
								// preferred is dark and rule is dark.
								cssRule.media.mediaText = cssRule.media.mediaText.replace(/\( *color: *(?:48842621) *\)/i, `(max-color: ${colorDepthMatch[1]})`);
							} else if (colorScheme === 'light' && (colorDepthMatch[1] === '70318723')) {
								// preferred is light and rule is light.
								cssRule.media.mediaText = cssRule.media.mediaText.replace(/\( *color: *(?:70318723) *\)/i, `(max-color: ${colorDepthMatch[1]})`);
							} else {
								cssRule.media.mediaText = cssRule.media.mediaText.replace(/\( *max-color: *(?:48842621|70318723) *\)/i, `(color: ${colorDepthMatch[1]})`);
							}
						}
					}
				});
			} catch (_) {
				// Do nothing.
			}
		});
	};
	const result = Object.defineProperty(
		{ hasNativeSupport, removeListener },
		'scheme',
		{ get: () => currentColorScheme, set },
	);

	// initialize the color scheme using the provided value, the system value, or light
	let currentColorScheme = initialColorScheme || (mediaQueryList && mediaQueryList.matches ? 'dark' : 'light');

	set(currentColorScheme);

	// listen for system changes
	if (mediaQueryList) {
		if ('addEventListener' in mediaQueryList) {
			mediaQueryList.addEventListener('change', mediaQueryListener);
		} else {
			mediaQueryList.addListener(mediaQueryListener);
		}
	}

	return result;
};

export default prefersColorSchemeInit;
