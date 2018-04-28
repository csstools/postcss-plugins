import getFnValue from './get-fn-value';
import replaceWithWord from './replace-with-word';

// update a node with an environment value
export default function (node, variables) {
	// get the value of a css function as a string
	const value = getFnValue(node);

	if (typeof value === 'string') {
		replaceWithWord(node, variables[value])
	}
}
