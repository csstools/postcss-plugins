// tooling
const transformBubblingAtrule = require('./transform-bubbling-atrule');
const transformNestingAtRule  = require('./transform-nesting-atrule');
const transformNestingRule    = require('./transform-nesting-rule');

// conditionally transform a nesting rule
module.exports = (node) => {
	if (transformBubblingAtrule.test(node)) {
		// conditionally transform a bubbling atrule
		transformBubblingAtrule(node);
	} else if (transformNestingAtRule.test(node)) {
		// conditionally transform a nesting atrule
		transformNestingAtRule(node);
	} else if (transformNestingRule.test(node)) {
		// conditionally transform a nesting rule
		transformNestingRule(node);
	}
};
