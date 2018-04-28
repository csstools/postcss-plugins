import parser from 'postcss-values-parser';

// replaces a node with a word node
export default function (node, value) {
	const raws = node.raws;

	node.replaceWith(parser.word({ value, raws }));
}
