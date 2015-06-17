var postcss = require('postcss');
var parser = require('postcss-selector-parser');

function parse(selector) {
	return parser().process(selector).res;
}

function isNestingRule(rule) {
	return rule && !rule.selector && rule.parent && rule.parent.type === 'rule';
}

function hasParentReference(node) {
	if (node.type === 'tag') {
		return node.value === '&';
	}

	for (var index in node.nodes) {
		if (hasParentReference(node.nodes[index])) {
			return true;
		}
	}

	return false;
}

module.exports = postcss.plugin('postcss-nesting', function (opts) {
	opts = opts || {};

	return function (css) {
		// for each rule in css
		css.eachRule(function (nestingRule) {
			// if the rule is a nesting rule
			if (isNestingRule(nestingRule)) {
				// cache parent selectors
				var parentSelectors = nestingRule.parent.selector;
				var parentSelectorsObject = parse(parentSelectors);

				// for each rule in the nesting rule
				nestingRule.eachRule(function (rule, ruleIndex) {
					var newSelectors = parser.root();

					// for each selector in the rule
					parse(rule.selector).each(function (selector) {
						// if the selector has a parent reference
						if (hasParentReference(selector)) {
							// HINT: selectors = parent selectors × parent references

							var cloneSelectorList = parser.root();

							cloneSelectorList.append(selector.clone());

							while (hasParentReference(cloneSelectorList)) {
								var cloneSelector;
								var cloneSelectorIndex = -1;
								var cloneNode;
								var cloneNodeIndex;
								var parentSelector2;
								var parentSelectorIndex;

								while ((cloneSelector = cloneSelectorList.nodes[++cloneSelectorIndex])) {
									cloneNodeIndex = -1;

									while ((cloneNode = cloneSelector.nodes[++cloneNodeIndex])) {
										if (hasParentReference(cloneNode)) {
											parentSelectorIndex = -1;

											while ((parentSelector2 = parentSelectorsObject.nodes[++parentSelectorIndex])) {
												cloneSelector.nodes.splice(cloneNodeIndex, 1, parentSelector2);

												cloneSelectorList.nodes.splice(cloneSelectorIndex + parentSelectorIndex + 1, 0, cloneSelector.clone());
											}

											cloneSelectorList.nodes.splice(cloneSelectorIndex, 1);

											break;
										}
									}
								}
							}

							newSelectors.append(cloneSelectorList);
						}
						// if the selector does not have a parent reference
						else {
							// for each parent selector
							parse(parentSelectors).each(function (parentSelector) {
								// create a new selector
								var newSelector = parser.selector();

								// append the parent selector to the new selector
								newSelector.append(parentSelector);

								// append a combinator to the new selector
								newSelector.append(parser.combinator({ value: ' ' }));

								// append the selector to the new selector
								newSelector.append(selector);

								// append the new selector to the new selectors
								newSelectors.append(newSelector);
							});
						}
					});

					// replace the rule selector with the new selectors
					rule.selector = newSelectors.toString();

					// append the rule after the nesting rule
					nestingRule.parent.parent.nodes.splice(nestingRule.parent.parent.nodes.indexOf(nestingRule.parent) + ruleIndex + 1, 0, rule);
				});

				// remove original nesting rule
				nestingRule.removeSelf();
			}
		});
	};
});
