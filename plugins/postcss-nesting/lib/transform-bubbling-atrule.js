// tooling
const cleanNode           = require('./clean-node');
const mergeParams         = require('./merge-params');
const transformAfterNodes = require('./transform-after-nodes');

// transform a bubbling atrule (e.g. @document, @media, @supports)
module.exports = (node) => {
	// clean node
	cleanNode(node);

	// affected nodes after the current node moved into a cloned parent node
	transformAfterNodes(node);

	// inner nodes within the current node
	const innerNodes = node.nodes.slice(0).map(cleanNode);

	// prepend an empty parent clone to the node
	const parentCloneForNodesWithinAtrule = cleanNode(node.parent.clone()).removeAll();

	node.prepend(parentCloneForNodesWithinAtrule);

	// append the inner nodes to the empty parent clone
	parentCloneForNodesWithinAtrule.append(innerNodes);

	// swap semicolon raws
	const semicolon = node.raws.semicolon;

	node.raws.semicolon = node.parent.raws.semicolon;
	node.parent.raws.semicolon = semicolon;

	// move the node after the parent
	const parent = node.parent.after(node);

	if (!parent.nodes.length) {
		// conditionally remove the original empty parent
		parent.remove();
	}

	// if the node and the parent are both media atrules
	if (node.parent.type === 'atrule' && node.name === node.parent.name) {
		// affected nodes after the current node moved into a cloned parent node
		transformAfterNodes(node);

		// merge media params
		node.params = mergeParams(node.parent.params, node.params);

		// move the node after the parent
		const subparent = node.parent.after(node);

		if (!subparent.nodes.length) {
			// conditionally remove the original empty parent
			subparent.remove();
		}
	}
};

// whether the node is a bubbling atrule (e.g. @document, @media, @supports)
module.exports.test = (node, bubbles) => node.type === 'atrule' && ['document', 'media', 'supports'].indexOf(node.name) !== -1 && node.parent && node.parent.type === 'rule';
