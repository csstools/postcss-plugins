export function matchBeforeDateCondition(year: number, month: number, day: number): string | true | undefined {
	const targetDate = new Date();
	targetDate.setUTCFullYear(year);
	targetDate.setUTCMonth(month);
	targetDate.setUTCDate(day);

	const now = (new Date()).getTime();

	if (now < targetDate.getTime()) {
		return true;
	}

	return `Died because ${year}-${month}-${day} is in the past`;
}
