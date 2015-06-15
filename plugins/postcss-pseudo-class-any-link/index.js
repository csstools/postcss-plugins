var postcss = require('postcss');
var postcssSelectorParser = require('postcss-selector-parser');

module.exports = postcss.plugin('postcss-pseudo-class-any-link', function (opts) {
	var pseudoValue = ':' + (opts && opts.prefix ? '-' + opts.prefix + '-' : '') + 'any-link';
	var pseudoFallbackValues = [':link', ':visited'];

	function eachRule(rule) {
		rule.selector = postcssSelectorParser(function (selectors) {
			selectors.each(function (selector, index) {
				var originalIndex = index;

				pseudoFallbackValues.forEach(function (pseudoFallbackValue) {
					var clone = selector.clone();

					clone.eachPseudo(function (pseudo) {
						if (pseudo.value === pseudoValue) {
							pseudo.value = pseudoFallbackValue;

							selectors.nodes.splice(++index, 0, clone);
						}
					});
				});

				if (originalIndex !== index) {
					selector.removeSelf();
				}
			});
		}).process(rule.selector).result;
	}

	return function (css) {
		css.eachRule(eachRule);
	};
});
