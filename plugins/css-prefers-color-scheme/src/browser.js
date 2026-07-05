/* eslint-disable comma-dangle */
function prefersColorSchemeInit(initialColorScheme, options) {
	// OPTIONS
	{
		if (!options) {
			options = {};
		}

		options = {
			debug: (!!options.debug) || false,
		};
	}

	var mediaQueryString = '(prefers-color-scheme: dark)';
	var mediaQueryList = ('matchMedia' in window) && window.matchMedia(mediaQueryString);
	var hasNativeSupport = mediaQueryList && mediaQueryList.media === mediaQueryString;
	var mediaQueryListener = function mediaQueryListener() {
		set((mediaQueryList && mediaQueryList.matches) ? 'dark' : 'light');
	};
	var removeListener = function removeListener() {
		if (mediaQueryList) {
			mediaQueryList.removeListener(mediaQueryListener);
		}
	};
	var set = function set(colorScheme) {
		if (colorScheme !== 'dark' && colorScheme !== 'light') {
			if (hasNativeSupport) {
				colorScheme = mediaQueryList.matches ? 'dark' : 'light';
			} else {
				colorScheme = 'light';
			}
		}

		if (colorScheme !== currentColorScheme) {
			currentColorScheme = colorScheme;

			if (typeof result.onChange === 'function') {
				result.onChange();
			}
		}

		[].forEach.call(document.styleSheets || [], function(styleSheet) {
			try {
				// cssRules is a live list. Converting to an Array first.
				var rules = [];
				[].forEach.call(styleSheet.cssRules || [], function(cssRule) {
					rules.push(cssRule);
				});

				rules.forEach(function(cssRule) {
					var colorSchemeMatch = /prefers-color-scheme:/i.test(Object(cssRule.media).mediaText);

					if (colorSchemeMatch) {
						var index = [].indexOf.call(cssRule.parentStyleSheet.cssRules, cssRule);
						cssRule.parentStyleSheet.deleteRule(index);
					} else {
						// New style which supports complex media queries.
						var colorDepthMatch = (Object(cssRule.media).mediaText || '').match(/\( *(?:color|max-color): *(48842621|70318723) *\)/i);
						if (colorDepthMatch && colorDepthMatch.length > 1) {
							if (colorScheme === 'dark' && (colorDepthMatch[1] === '48842621')) {
								// preferred is dark and rule is dark.
								cssRule.media.mediaText = cssRule.media.mediaText.replace(/\( *color: *(?:48842621) *\)/i, '(max-color: ' + colorDepthMatch[1] + ')');
							} else if (colorScheme === 'light' && (colorDepthMatch[1] === '70318723')) {
								// preferred is light and rule is light.
								cssRule.media.mediaText = cssRule.media.mediaText.replace(/\( *color: *(?:70318723) *\)/i, '(max-color: ' + colorDepthMatch[1] + ')');
							} else {
								cssRule.media.mediaText = cssRule.media.mediaText.replace(/\( *max-color: *(?:48842621|70318723) *\)/i, '(color: ' + colorDepthMatch[1] + ')');
							}
						}
					}
				});
			} catch (e) {
				if (options.debug) {
					// eslint-disable-next-line no-console
					console.error(e);
				}
			}
		});
	};
	var result = Object.defineProperty(
		{ hasNativeSupport, removeListener },
		'scheme',
		{
			get: function get() {
				return currentColorScheme;
			},
			set: set
		}
	);

	// initialize the color scheme using the provided value, the system value, or light
	var currentColorScheme = initialColorScheme || (mediaQueryList && mediaQueryList.matches ? 'dark' : 'light');

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
