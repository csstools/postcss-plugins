// tooling
import { list } from 'postcss';
const { comma } = list;

// merge selectors
export default (fromSelectors, toSelectors) => (typeof fromSelectors === 'string' ? comma(fromSelectors) : fromSelectors).reduce(
	(selectors, fromSelector) => selectors.concat(
		(typeof toSelectors === 'string' ? comma(toSelectors) : toSelectors).map(
			toSelector => toSelector.replace(/&/g, fromSelector)
		)
	),
	[]
);
