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

function cleanNode(node) {
	if (!('before' in node.raws)) node.raws.before = node.parent.raws.before || '';
	if (!('after' in node.raws)) node.raws.after = node.parent.raws.after || '';
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
					raws: {
						before:  atrule.raws.before,
						between: atrule.raws.between,
						after:   atrule.raws.after
					}
				});

				if (atrule.name === name && atrule.params.indexOf('&') !== -1) {
					atrule.remove();

					newrule.selector = atrule.params;

					newrule.append(atrule.nodes);

					newrule.nodes.forEach(cleanNode);

					transpileSelectors(rule, newrule);

					root.insertAfter(rule.insertAfterNode || rule, newrule);

					rule.insertAfterNode = newrule;
				} else if (bubble.indexOf(atrule.name) !== -1) {
					atrule.remove();

					newrule.selector = rule.selector;

					newrule.append(atrule.nodes);

					newrule.nodes.forEach(cleanNode);

					atrule.removeAll();

					atrule.append(newrule);

					root.insertAfter(rule.insertAfterNode || rule, atrule);

					rule.insertAfterNode = atrule;
				}
			}
		});
	};
});
