var postcss = require('postcss');

module.exports = postcss.plugin('postcss-pseudo-class-any-link', function (opts) {
	var match = new RegExp(':' + (opts && opts.prefix ? '-' + opts.prefix + '-' : '') + 'any-link\\b', 'g');

	return function (css) {
		css.eachRule(function (rule) {
			if (match.test(rule.selector)) {
				rule.selector = ['link', 'visited'].map(function (replacement) {
					return rule.selector.replace(match, ':' + replacement);
				}).join(', ');
			}
		});
	};
});
