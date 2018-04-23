// return the closest rule
export default node => {
	let selectorParent = node.parent;

	while (selectorParent && selectorParent.type !== 'rule') {
		selectorParent = selectorParent.parent;
	}

	return selectorParent;
};
