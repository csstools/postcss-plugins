import parser from 'postcss-selector-parser';
import encodeCSS from './encode/encode.mjs';

const creator = (/** @type {{ preserve: true | false }} */ opts) => {
	opts = typeof opts === 'object' && opts || defaultOptions;

	/** Whether the original rule should be preserved. */
	const shouldPreserve = Boolean('preserve' in opts ? opts.preserve : true);

	return {
		postcssPlugin: 'css-has-pseudo',
		RuleExit: (rule, { result }) => {
			if (!rule.selector.includes(':has(')) {
				return;
			}

			let modifiedSelector;

			try {
				const modifiedSelectorAST = parser((selectors) => {
					selectors.walkPseudos(selector => {
						if (selector.value === ':has' && selector.nodes) {
							const attribute = parser.attribute({
								attribute: encodeCSS(String(selector)),
							});

							selector.replaceWith(attribute);
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
				rule.assign({ selector: modifiedSelector });
			}
		},
	};
};

creator.postcss = true;

/** Default options. */
const defaultOptions = { preserve: true };

export default creator;
