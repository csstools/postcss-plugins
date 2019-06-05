import cloneRule from './clone-rule';
import { splitByComma, splitBySpace } from './split';

export default (decl, notValues, dir) => {
	const ltrValues = [];
	const rtlValues = [];

	splitByComma(decl.value).forEach(value => {
		let hasBeenSplit = false;

		splitBySpace(value).forEach((word, index, words) => {
			if (word in valueMap) {
				hasBeenSplit = true;

				valueMap[word].ltr.forEach(replacement => {
					const clone = words.slice();

					clone.splice(index, 1, replacement);

					if (ltrValues.length && !/^,$/.test(ltrValues[ltrValues.length - 1])) {
						ltrValues.push(',');
					}

					ltrValues.push(clone.join(''));
				});

				valueMap[word].rtl.forEach(replacement => {
					const clone = words.slice();

					clone.splice(index, 1, replacement);

					if (rtlValues.length && !/^,$/.test(rtlValues[rtlValues.length - 1])) {
						rtlValues.push(',');
					}

					rtlValues.push(clone.join(''));
				});
			}
		});

		if (!hasBeenSplit) {
			ltrValues.push(value);
			rtlValues.push(value);
		}
	});

	const ltrDecl = decl.clone({ value: ltrValues.join('') });
	const rtlDecl = decl.clone({ value: rtlValues.join('') });

	return ltrValues.length && dir === 'ltr'
		? ltrDecl
	: rtlValues.length && dir === 'rtl'
		? rtlDecl
	: ltrDecl.value !== rtlDecl.value
		? [
			cloneRule(decl, 'ltr').append(ltrDecl),
			cloneRule(decl, 'rtl').append(rtlDecl)
		]
	: null;
};

const valueMap = {
	// Logical Height and Logical Width
	'block-size': { ltr: ['height'], rtl: ['height'] },
	'inline-size': { ltr: ['width'], rtl: ['width'] },

	// Flow-relative Margins
	'margin-block-end': { ltr: ['margin-bottom'], rtl: ['margin-bottom'] },
	'margin-block-start': { ltr: ['margin-top'], rtl: ['margin-top'] },
	'margin-block': { ltr: ['margin-top', 'margin-bottom'], rtl: ['margin-top', 'margin-bottom'] },
	'margin-inline-end': { ltr: ['margin-right'], rtl: ['margin-left'] },
	'margin-inline-start': { ltr: ['margin-left'], rtl: ['margin-right'] },
	'margin-inline': { ltr: ['margin-left', 'margin-right'], rtl: ['margin-left', 'margin-right'] },

	// Flow-relative Offsets
	'inset-block-end': { ltr: ['bottom'], rtl: ['bottom'] },
	'inset-block-start': { ltr: ['top'], rtl: ['top'] },
	'inset-block': { ltr: ['top', 'bottom'], rtl: ['top', 'bottom'] },
	'inset-inline-end': { ltr: ['right'], rtl: ['left'] },
	'inset-inline-start': { ltr: ['left'], rtl: ['right'] },
	'inset-inline': { ltr: ['left', 'right'], rtl: ['left', 'right'] },
	'inset': { ltr: ['top', 'right', 'bottom', 'left'], rtl: ['top', 'right', 'bottom', 'left'] },

	// Flow-relative Padding
	'padding-block-end': { ltr: ['padding-bottom'], rtl: ['padding-bottom'] },
	'padding-block-start': { ltr: ['padding-top'], rtl: ['padding-top'] },
	'padding-block': { ltr: ['padding-top', 'padding-bottom'], rtl: ['padding-top', 'padding-bottom'] },
	'padding-inline-end': { ltr: ['padding-right'], rtl: ['padding-left'] },
	'padding-inline-start': { ltr: ['padding-left'], rtl: ['padding-right'] },
	'padding-inline': { ltr: ['padding-left', 'padding-right'], rtl: ['padding-left', 'padding-right'] },

	// Flow-relative Borders
	'border-block-color': { ltr: ['border-top-color', 'border-bottom-color'], rtl: ['border-top-color', 'border-bottom-color'] },
	'border-block-end-color': { ltr: ['border-bottom-color'], rtl: ['border-bottom-color'] },
	'border-block-end-style': { ltr: ['border-bottom-style'], rtl: ['border-bottom-style'] },
	'border-block-end-width': { ltr: ['border-bottom-width'], rtl: ['border-bottom-width'] },
	'border-block-end': { ltr: ['border-bottom'], rtl: ['border-bottom'] },
	'border-block-start-color': { ltr: ['border-top-color'], rtl: ['border-top-color'] },
	'border-block-start-style': { ltr: ['border-top-style'], rtl: ['border-top-style'] },
	'border-block-start-width': { ltr: ['border-top-width'], rtl: ['border-top-width'] },
	'border-block-start': { ltr: ['border-top'], rtl: ['border-top'] },
	'border-block-style': { ltr: ['border-top-style', 'border-bottom-style'], rtl: ['border-top-style', 'border-bottom-style'] },
	'border-block-width': { ltr: ['border-top-width', 'border-bottom-width'], rtl: ['border-top-width', 'border-bottom-width'] },
	'border-block': { ltr: ['border-top', 'border-bottom'], rtl: ['border-top', 'border-bottom'] },
	'border-inline-color': { ltr: ['border-left-color', 'border-right-color'], rtl: ['border-left-color', 'border-right-color'] },
	'border-inline-end-color': { ltr: ['border-right-color'], rtl: ['border-left-color'] },
	'border-inline-end-style': { ltr: ['border-right-style'], rtl: ['border-left-style'] },
	'border-inline-end-width': { ltr: ['border-right-width'], rtl: ['border-left-width'] },
	'border-inline-end': { ltr: ['border-right'], rtl: ['border-left'] },
	'border-inline-start-color': { ltr: ['border-left-color'], rtl: ['border-right-color'] },
	'border-inline-start-style': { ltr: ['border-left-style'], rtl: ['border-right-style'] },
	'border-inline-start-width': { ltr: ['border-left-width'], rtl: ['border-right-width'] },
	'border-inline-start': { ltr: ['border-left'], rtl: ['border-right'] },
	'border-inline-style': { ltr: ['border-left-style', 'border-right-style'], rtl: ['border-left-style', 'border-right-style'] },
	'border-inline-width': { ltr: ['border-left-width', 'border-right-width'], rtl: ['border-left-width', 'border-right-width'] },
	'border-inline': { ltr: ['border-left', 'border-right'], rtl: ['border-left', 'border-right'] },

	// Flow-relative Corner Rounding
	'border-end-end-radius': { ltr: ['border-bottom-right-radius'], rtl: ['border-bottom-left-radius'] },
	'border-end-start-radius': { ltr: ['border-bottom-left-radius'], rtl: ['border-bottom-right-radius'] },
	'border-start-end-radius': { ltr: ['border-top-right-radius'], rtl: ['border-top-left-radius'] },
	'border-start-start-radius': { ltr: ['border-top-left-radius'], rtl: ['border-top-right-radius'] }
};
