// tooling
const cleanNode           = require('./clean-node');
const comma               = require('postcss').list.comma;
const getClosestRule      = require('./get-closest-rule');
const mergeSelectors      = require('./merge-selectors');
const postcss             = require('postcss');
const transformAfterNodes = require('./transform-after-nodes');

// transform a nesting atrule (e.g. @nest .something &)
module.exports = (node) => {
	// clean node and child nodes
	cleanNode(node).nodes.forEach(cleanNode);

	// affected nodes after the current node moved into a cloned parent node
	const afterParent = transformAfterNodes(node);

	// get the closest rule
	const selectorParent = getClosestRule(node);

	// clone of the atrule as a rule
	const rule = postcss.rule({
		// merge selectors
		selectors: mergeSelectors(selectorParent && selectorParent.selectors || '', node.params),
		source: node.source
	});

	// clone atrule semicolon raws
	rule.raws = node.raws.semicolon ? { semicolon: true } : {};

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

	// if the next sibling shares the same selector
	if (afterParent && afterParent.selector === rule.selector) {
		rule.append(afterParent.nodes);

		afterParent.remove();
	}

	// if the previous sibling shares the same selector
	if (parent.parent && parent.next() === rule && parent.selector === rule.selector) {
		parent.append(rule.nodes);

		rule.remove();

		return parent;
	}

	return rule;
};

// whether the node is a nesting atrule (e.g. @nest .something &)
module.exports.test = (node) => node.type === 'atrule' && node.name === 'nest' && node.parent && node.parent.type === 'rule' && comma(node.params).every(
	(selector) => selector.split('&').length === 2 && /&([^\w-|]|$)/.test(selector)
);
