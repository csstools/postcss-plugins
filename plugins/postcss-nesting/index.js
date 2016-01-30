var postcss = require('postcss');

module.exports = postcss.plugin('postcss-nested', function (opts) {
	var bubble = ['document', 'media', 'supports'];
	var name   = 'nest';

	if (opts && opts.bubble) bubble = bubble.concat(opts.bubble);
	if (opts && opts.prefix) name   = '-' + opts.prefix + '-' + name;

	return function (css) {
		css.walk(function (target) {
			var rule = target.parent;
			var root = rule && rule.parent;

			var isAtRule = target.type === 'atrule';
			var isRule   = target.type === 'rule';

			if (root && rule.type === 'rule') {
				var newrule = postcss.rule({
					source: target.source
				});

				if (isRule && target.selectors.every(function (selector) {
					return selector.lastIndexOf('&') === 0;
				})) {
					target.remove();

					newrule.selector = target.selector;

					newrule.append(target.nodes);

					transpileSelectors(rule, newrule);

					root.insertAfter(rule.insertAfterNode || rule, newrule);

					rule.insertAfterNode = newrule;
				} else if (isAtRule && target.name === name && ~target.params.indexOf('&')) {
					target.remove();

					newrule.selector = target.params;

					newrule.append(target.nodes);

					transpileSelectors(rule, newrule);

					root.insertAfter(rule.insertAfterNode || rule, newrule);

					rule.insertAfterNode = newrule;
				} else if (isAtRule && ~bubble.indexOf(target.name)) {
					var selector = rule.selector;

					if (root.type === 'atrule' && root.name === target.name && root.parent) {
						target.params = root.params + ' and ' + target.params;

						rule = root;
						root = root.parent;
					}

					target.remove();

					newrule.selector = selector;

					newrule.append(target.nodes);

					target.removeAll();

					target.append(newrule);

					root.insertAfter(rule.insertAfterNode || rule, target);

					rule.insertAfterNode = target;
				}
			}
		});
	};
});

function transpileSelectors(fromRule, toRule) {
	var selectors = [];

	fromRule.selectors.forEach(function (fromSelector) {
		toRule.selectors.forEach(function (toSelector) {
			selectors.push(toSelector.replace(/&/g, fromSelector));
		});
	});

	toRule.selectors = selectors;
}
