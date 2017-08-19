'use strict';

// tooling
const postcss                 = require('postcss');
const transformBubblingAtrule = require('./lib/transform-bubbling-atrule');
const transformNestingAtRule  = require('./lib/transform-nesting-atrule');
const transformNestingRule    = require('./lib/transform-nesting-rule');

// plugin
module.exports = postcss.plugin('postcss-nesting', () => {
	return (root) => root.walk(transform);
});

function transform(node) {
	// console.log('walk', [node.type], [node.name || node.selector || node.prop || 'root'], node.nodes ? `length: ${node.nodes.length}` : `value: "${node.value}"`);

	if (transformBubblingAtrule.test(node)) {
		// conditionally transform a bubbling atrule
		transformBubblingAtrule(node);
	} else if (transformNestingAtRule.test(node)) {
		// conditionally transform a nesting atrule
		node = transformNestingAtRule(node); // eslint-disable-line no-param-reassign
	} else if (transformNestingRule.test(node)) {
		// conditionally transform a nesting rule
		transformNestingRule(node);
	}

}
