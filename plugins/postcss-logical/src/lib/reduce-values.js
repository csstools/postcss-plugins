export default values => {
	const reducedValues = values.slice();

	// reduce [A, B, C, B] to [A, B, C]
	if (reducedValues.length === 4 && reducedValues[3] === reducedValues[1]) {
		reducedValues.pop();
	}

	// reduce [A, B, A] to [A, B]
	if (reducedValues.length === 3 && reducedValues[2] === reducedValues[0]) {
		reducedValues.pop();
	}

	// reduce [A, A] to [A]
	if (reducedValues.length === 2 && reducedValues[1] === reducedValues[0]) {
		reducedValues.pop();
	}

	return reducedValues;
};
