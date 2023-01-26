// Each condition has true possible results :
// `string` :    This is a message and we must throw an error with it.
// `true` :      The condition matches.
// `undefined` : The result is unknown. It was neither true or false.
//               This likely happens when the parameters are invalid for the condition.
export function died(conditionResult: string | true | undefined): conditionResult is string {
	if (typeof conditionResult === 'string') {
		return true;
	}

	return false;
}
