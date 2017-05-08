// tooling
const comma = require('postcss').list.comma;

// merge selectors
module.exports = (fromSelectors, toSelectors) => (typeof fromSelectors === 'string' ? comma(fromSelectors) : fromSelectors).reduce(
	(selectors, fromSelector) => selectors.concat(
		(typeof toSelectors === 'string' ? comma(toSelectors) : toSelectors).map(
			(toSelector) => toSelector.replace(/&/g, fromSelector)
		)
	),
	[]
);
