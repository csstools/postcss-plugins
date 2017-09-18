// tooling
const cleanNode = require('./clean-node');

// move nodes after the current node into a cloned parent node
module.exports = (node) => {
	// affected nodes after the current node
	const affectedNodes = node.parent.nodes.slice(node.parent.nodes.indexOf(node) + 1).map(cleanNode);

	if (affectedNodes.length) {
		// insert an empty parent clone after the parent
		const afterParent = cleanNode(node.parent.clone()).removeAll();

		node.parent.after(afterParent);

		// append the affected nodes to the empty parent clone
		afterParent.append(affectedNodes);

		return afterParent;
	}
};
