'use strict';

// tooling
const postcss                 = require('postcss');
const transformBubblingAtrule = require('./lib/transform-bubbling-atrule');
const transformNestingAtRule  = require('./lib/transform-nesting-atrule');
const transformNestingRule    = require('./lib/transform-nesting-rule');

// plugin
module.exports = postcss.plugin('postcss-nesting', () => {
	return walk;
});

function walk(node) {
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

	if (node.nodes) {
		// conditionally walk the children of the node
		let childNode = node.nodes[0];

		while (childNode) {
			walk(childNode);

			childNode = childNode.parent && childNode.parent.nodes[childNode.parent.nodes.indexOf(childNode) + 1];
		}
	}
}
