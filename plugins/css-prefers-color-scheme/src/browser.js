/* global document,window,matchMedia */
const colorIndexRegExp = /((?:not )?all and )?(\(color-index: *(22|48|70)\))/i;
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
					const colorIndexMatch = (Object(cssRule.media).mediaText || '').match(colorIndexRegExp);

					if (colorIndexMatch) {
						// Old style which has poor browser support and can't handle complex media queries.
						cssRule.media.mediaText = (
							(/^dark$/i.test(colorScheme)
								? colorIndexMatch[3] === '48'
								: /^light$/i.test(colorScheme)
									? colorIndexMatch[3] === '70'
									: colorIndexMatch[3] === '22')
								? 'not all and '
								: ''
						) + cssRule.media.mediaText.replace(colorIndexRegExp, '$2');
					} else {
						// New style which supports complex media queries.
						const colorDepthMatch = (Object(cssRule.media).mediaText || '').match(/\( *(?:color|max-color): *(48842621|70318723|22511989) *\)/i);
						if (colorDepthMatch && colorDepthMatch.length > 1) {
							if (/^dark$/i.test(colorScheme) && (colorDepthMatch[1] === '48842621' || colorDepthMatch[1] === '22511989')) {
								// No preference or preferred is dark and rule is dark.
								cssRule.media.mediaText = cssRule.media.mediaText.replace(/\( *color: *(?:48842621|70318723) *\)/i, `(max-color: ${colorDepthMatch[1]})`);
							} else if (/^light$/i.test(colorScheme) && (colorDepthMatch[1] === '70318723' || colorDepthMatch[1] === '22511989')) {
								// No preference or preferred is light and rule is light.
								cssRule.media.mediaText = cssRule.media.mediaText.replace(/\( *color: *(?:48842621|22511989) *\)/i, `(max-color: ${colorDepthMatch[1]})`);
							} else {
								cssRule.media.mediaText = cssRule.media.mediaText.replace(/\( *max-color: *(?:48842621|70318723|22511989) *\)/i, `(color: ${colorDepthMatch[1]})`);
							}
						}
					}
				}
			});
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
