const dashedMatch = /^--/;

// returns the value of a css function as a string
export default (node) => {
	const value = String(node.nodes.slice(1, -1));

	return dashedMatch.test(value) ? value : undefined;
};
