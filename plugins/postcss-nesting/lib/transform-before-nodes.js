import cleanNode from './clean-node';

// move nodes after the current node into a cloned parent node
export default node => {
	// affected nodes after the current node
	const affectedNodes = node.parent.nodes.slice(0, node.parent.nodes.indexOf(node)).map(cleanNode);

	if (affectedNodes.length) {
		// clone the current parent
		const beforeParent = cleanNode(node.parent.clone()).removeAll();

		// append the affected nodes to the parent clone
		beforeParent.append(affectedNodes);

		// insert a parent clone before the current parent
		node.parent.before(beforeParent);

		return beforeParent;
	}

	return undefined;
};
