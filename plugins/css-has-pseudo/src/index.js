import parser from 'postcss-selector-parser';

const creator = (/** @type {{ preserve: true | false }} */ opts) => {
	opts = typeof opts === 'object' && opts || defaultOptions;

	/** Whether the original rule should be preserved. */
	const shouldPreserve = Boolean('preserve' in opts ? opts.preserve : true);

	return {
		postcssPlugin: 'css-has-pseudo',
		Rule: (rule, { result }) => {
			if (!rule.selector.includes(':has(')) {
				return;
			}

			let modifiedSelector;

			try {
				const modifiedSelectorAST = parser((selectors) => {
					selectors.walkPseudos(selector => {
						if (selector.value === ':has' && selector.nodes) {
							const isNotHas = isParentInNotPseudo(selector);

							selector.value = isNotHas ? ':not-has' : ':has';

							const attribute = parser.attribute({
								attribute: getEscapedCss(String(selector)),
							});

							if (isNotHas) {
								selector.parent.parent.replaceWith(attribute);
							} else {
								selector.replaceWith(attribute);
							}
						}
					});
				}).processSync(rule.selector);

				modifiedSelector = String(modifiedSelectorAST);
			} catch (_) {
				rule.warn(result, `Failed to parse selector : ${rule.selector}`);
				return;
			}

			if (typeof modifiedSelector === 'undefined') {
				return;
			}

			if (modifiedSelector === rule.selector) {
				return;
			}

			if (shouldPreserve) {
				rule.cloneBefore({ selector: modifiedSelector });
			} else {
				rule.selector = modifiedSelector;
			}
		},
	};
};

creator.postcss = true;

/** Default options. */
const defaultOptions = { preserve: true };

/** Returns the string as an escaped CSS identifier. */
const getEscapedCss = (/** @type {string} */ value) => {
	let out = '';
	let current = '';

	const flushCurrent = () => {
		if (current) {
			const encoded = encodeURIComponent(current);
			let encodedCurrent = '';
			let encodedOut = '';

			const flushEncoded = () => {
				if (encodedCurrent) {
					encodedOut += encodedCurrent;
					encodedCurrent = '';
				}
			};

			let encodedEscaped = false;
			for (let i = 0; i < encoded.length; i++) {
				const char = encoded[i];

				if (encodedEscaped) {
					encodedCurrent += char;
					encodedEscaped = false;
					continue;
				}

				switch (char) {
					case '%':
						flushEncoded();
						encodedOut += ('\\' + char);
						continue;
					case '\\':
						encodedCurrent += char;
						encodedEscaped = true;
						continue;

					default:
						encodedCurrent += char;
						continue;
				}
			}

			flushEncoded();
			out += encodedOut;
			current = '';
		}
	};

	let escaped = false;
	for (let i = 0; i < value.length; i++) {
		const char = value[i];

		if (escaped) {
			current += char;
			escaped = false;
			continue;
		}

		switch (char) {
			case ':':
			case '[':
			case ']':
			case ',':
			case '(':
			case ')':
				flushCurrent();
				out += ('\\' + char);
				continue;
			case '\\':
				current += char;
				escaped = true;
				continue;

			default:
				current += char;
				continue;
		}
	}

	flushCurrent();

	return out;
};

/** Returns whether the selector is within a `:not` pseudo-class. */
const isParentInNotPseudo = (selector) => selector.parent?.parent?.type === 'pseudo' && selector.parent.parent.value === ':not';

export default creator;
