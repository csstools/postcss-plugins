// tooling
const cleanNode           = require('./clean-node');
const comma               = require('postcss').list.comma;
const mergeSelectors      = require('./merge-selectors');
const postcss             = require('postcss');
const transformAfterNodes = require('./transform-after-nodes');

// transform a nesting atrule (e.g. @nest .something &)
module.exports = (node) => {
	// clean node and child nodes
	cleanNode(node).nodes.forEach(cleanNode);

	// affected nodes after the current node moved into a cloned parent node
	transformAfterNodes(node);

	// clone of the atrule as a rule
	const rule = postcss.rule({
		// merge selectors
		selectors: mergeSelectors(node.parent.selectors, node.params),
		source: node.source
	});

	// move the clone after the parent
	const parent = node.parent.after(rule);

	// remove the original node
	node.remove();

	// move child nodes into the clone
	rule.append(node.nodes);

	if (!parent.nodes.length) {
		// conditionally remove the original empty parent
		parent.remove();
	}

	return rule;
};

// whether the node is a nesting atrule (e.g. @nest .something &)
module.exports.test = (node) => node.type === 'atrule' && node.name === 'nest' && node.parent && node.parent.type === 'rule' && comma(node.params).every(
	(selector) => selector.split('&').length === 2 && /&([^\w-]|$)/.test(selector)
);
