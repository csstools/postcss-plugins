// tooling
const cleanNode           = require('./clean-node');
const mergeSelectors      = require('./merge-selectors');
const transformAfterNodes = require('./transform-after-nodes');

// transform a nesting rule (e.g. &.something)
module.exports = (node) => {
	// clean node and child nodes
	cleanNode(node).nodes.forEach(cleanNode);

	// move nodes after the current node into a cloned parent node
	transformAfterNodes(node);

	// merge selectors
	node.selectors = mergeSelectors(node.parent.selectors, node.selectors);

	// move the node after the parent
	const parent = node.parent.after(node);

	if (!parent.nodes.length) {
		// conditionally remove the original empty parent
		parent.remove();
	}
};

// whether the node is a nesting rule (e.g. &.something)
module.exports.test = (node) => node.type === 'rule' && node.parent && node.parent.type === 'rule' && node.selectors.every(
	(selector) => selector.trim().lastIndexOf('&') === 0 && /^&([^\w-|]|$)/.test(selector)
);
