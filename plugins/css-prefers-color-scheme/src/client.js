const colorIndexRegExp = /((?:not )?all and )?(\(color-index:\s*(22|48|70)\))/i;

export default style => {
	[].forEach.call(document.styleSheets, styleSheet => {
		[].forEach.call(styleSheet.cssRules, cssRule => {
			const mediaMatch = (Object(cssRule.media).mediaText || '').match(colorIndexRegExp);

			if (mediaMatch) {
				cssRule.media.mediaText = (
					(/^dark$/i.test(style)
						? mediaMatch[3] === '48'
					: /^light$/i.test(style)
						? mediaMatch[3] === '70'
					: mediaMatch[3] === '22')
						? 'not all and '
					: ''
				) + cssRule.media.mediaText.replace(colorIndexRegExp, '$2');
			}
		});
	});
};
