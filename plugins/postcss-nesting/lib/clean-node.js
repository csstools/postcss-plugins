// clean the raws of the node
export default node => {
	node.raws = Object.assign(
		node.raws.between ? { between: node.raws.between } : {},
		node.raws.semicolon ? { semicolon: true } : {},
		node.raws.important ? { important: node.raws.important } : {}
	);

	return node;
};
