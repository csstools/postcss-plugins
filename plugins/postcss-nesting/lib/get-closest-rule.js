'use strict';

// return the closest rule
module.exports = (node) => {
	let selectorParent = node.parent;

	while (selectorParent && selectorParent.type !== 'rule') {
		selectorParent = selectorParent.parent;
	}

	return selectorParent;
};
