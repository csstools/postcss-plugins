var postcss = require('postcss');

function transpileSelectors(fromRule, toRule) {
	var selectors = [];

	fromRule.selectors.forEach(function (fromSelector) {
		toRule.selectors.forEach(function (toSelector) {
			selectors.push(toSelector.replace(/&/g, fromSelector));
		});
	});

	toRule.selectors = selectors;
}

module.exports = postcss.plugin('postcss-nested', function (opts) {
	var bubble = ['document', 'media', 'supports'];
	var name   = 'nest';

	if (opts && opts.bubble) bubble = bubble.concat(opts.bubble);
	if (opts && opts.prefix) name   = '-' + opts.prefix + '-' + name;

	return function (css) {
		css.walkAtRules(function (atrule) {
			var rule = atrule.parent;
			var root = rule && rule.parent;

			if (root && rule.type === 'rule') {
				var newrule = postcss.rule({
					source: atrule.source
				});

				if (atrule.name === name && ~atrule.params.indexOf('&')) {
					atrule.remove();

					newrule.selector = atrule.params;

					newrule.append(atrule.nodes);

					transpileSelectors(rule, newrule);

					root.insertAfter(rule.insertAfterNode || rule, newrule);

					rule.insertAfterNode = newrule;
				} else if (~bubble.indexOf(atrule.name)) {
					atrule.remove();

					newrule.selector = rule.selector;

					newrule.append(atrule.nodes);

					atrule.removeAll();

					atrule.append(newrule);

					root.insertAfter(rule.insertAfterNode || rule, atrule);

					rule.insertAfterNode = atrule;
				}
			}
		});
	};
});
