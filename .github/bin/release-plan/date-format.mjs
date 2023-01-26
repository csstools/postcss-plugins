export function nowFormatted() {
	const now = new Date();

	switch (now.getMonth()) {
		case 0:
			return `January ${now.getUTCDate()}, ${now.getUTCFullYear()}`;
		case 1:
			return `February ${now.getUTCDate()}, ${now.getUTCFullYear()}`;
		case 2:
			return `March ${now.getUTCDate()}, ${now.getUTCFullYear()}`;
		case 3:
			return `April ${now.getUTCDate()}, ${now.getUTCFullYear()}`;
		case 4:
			return `May ${now.getUTCDate()}, ${now.getUTCFullYear()}`;
		case 5:
			return `June ${now.getUTCDate()}, ${now.getUTCFullYear()}`;
		case 6:
			return `July ${now.getUTCDate()}, ${now.getUTCFullYear()}`;
		case 7:
			return `August ${now.getUTCDate()}, ${now.getUTCFullYear()}`;
		case 8:
			return `September ${now.getUTCDate()}, ${now.getUTCFullYear()}`;
		case 9:
			return `October ${now.getUTCDate()}, ${now.getUTCFullYear()}`;
		case 10:
			return `November ${now.getUTCDate()}, ${now.getUTCFullYear()}`;
		case 11:
			return `December ${now.getUTCDate()}, ${now.getUTCFullYear()}`;
		default:
			break;
	}
}
