var bubble  = ['document', 'media', 'supports'];
var postcss = require('postcss');
var prefix  = '';

function normalizeNodes(node) {
	var index = -1;
	var child;

	while (child = node.nodes[++index]) {
		child.parent = node;
	}
}

function transpileSelectors(fromRule, toRule) {
	var selectors = [];

	fromRule.selectors.forEach(function (fromSelector) {
		toRule.selectors.forEach(function (toSelector) {
			if (toSelector.indexOf('&') === -1) {
				selectors.push(fromSelector + ' ' + toSelector);
			} else {
				selectors.push(toSelector.replace(/&/g, fromSelector));
			}
		});
	});

	return selectors;
}

function transpileNestRule(fromRule, toRule, atRule) {
	var parent = fromRule.parent;

	if (!('nestedIndex' in parent)) {
		parent.nestedIndex = parent.nodes.indexOf(fromRule);
	}

	fromRule.nodes.splice(fromRule.nodes.indexOf(atRule), 1);

	toRule.nodes     = atRule.nodes.splice(0);
	toRule.parent    = parent;
	toRule.selector  = atRule.params;
	toRule.selectors = transpileSelectors(fromRule, toRule);

	normalizeNodes(toRule);

	parent.nodes.splice(++parent.nestedIndex, 0, toRule);
}

function transpileAtRule(fromRule, toRule, atRule) {
	var parent = fromRule.parent;

	if (!('nestedIndex' in parent)) {
		parent.nestedIndex = parent.nodes.indexOf(fromRule);
	}

	fromRule.nodes.splice(fromRule.nodes.indexOf(atRule), 1);

	toRule.nodes     = atRule.nodes.splice(0);
	toRule.parent    = atRule;
	toRule.selector  = fromRule.selector;

	normalizeNodes(toRule);

	atRule.nodes  = [toRule];
	atRule.parent = parent;

	parent.nodes.splice(++parent.nestedIndex, 0, atRule);
}

function transpileRule(rule) {
	var nodes = rule.nodes;
	var index = -1;
	var name  = prefix ? '-' + prefix + '-nest' : 'nest';
	var child;

	// for each node
	while (child = nodes[++index]) {
		// if node is atrule
		if (child.type === 'atrule') {
			var newRule = postcss.rule();

			// if atrule is nest
			if (child.name === name && child.params.indexOf('&') !== -1) {
				transpileNestRule(rule, newRule, child);

				transpileRule(newRule);

				--index;
			} else if (bubble.indexOf(child.name) !== -1) {
				transpileAtRule(rule, newRule, child);

				transpileRule(newRule);

				--index;
			}
		}
	}
}

module.exports = postcss.plugin('postcss-nested', function (opts) {
	if (opts && opts.bubble) bubble = bubble.concat(opts.bubble);
	if (opts && opts.prefix) prefix = opts.prefix;

	return function (css) {
		var nodes = css.nodes;
		var index = -1;
		var child;

		while (child = nodes[++index]) {
			if (child.type === 'rule') {
				transpileRule(child);
			}
		}
	};
});
