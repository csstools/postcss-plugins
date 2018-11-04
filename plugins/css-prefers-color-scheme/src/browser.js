const colorIndexRegExp = /((?:not )?all and )?(\(color-index:\s*(22|48|70)\))/i;

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

		[].forEach.call(document.styleSheets, styleSheet => {
			[].forEach.call(styleSheet.cssRules, cssRule => {
				const mediaMatch = (Object(cssRule.media).mediaText || '').match(colorIndexRegExp);

				if (mediaMatch) {
					cssRule.media.mediaText = (
						(/^dark$/i.test(colorScheme)
							? mediaMatch[3] === '48'
						: /^light$/i.test(colorScheme)
							? mediaMatch[3] === '70'
						: mediaMatch[3] === '22')
							? 'not all and '
						: ''
					) + cssRule.media.mediaText.replace(colorIndexRegExp, '$2');
				}
			});
		});
	};
	const result = Object.defineProperty(
		{ hasNativeSupport, removeListener },
		'scheme',
		{ get: () => currentColorScheme, set }
	);

	// initialize the color scheme using the provided value, the system value, or light
	let currentColorScheme = initialColorScheme || (mediaQueryList && mediaQueryList.matches ? 'dark' : 'light');

	set(currentColorScheme);

	// listen for system changes
	if (mediaQueryList) {
		mediaQueryList.addListener(mediaQueryListener);
	}

	return result;
};

export default prefersColorSchemeInit;
