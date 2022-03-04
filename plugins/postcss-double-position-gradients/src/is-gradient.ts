export function includesGradientsFunction(str: string): boolean {
	return (
		str.includes('conic-gradient(') ||
		str.includes('linear-gradient(') ||
		str.includes('radial-gradient(') ||
		str.includes('repeating-conic-gradient(') ||
		str.includes('repeating-linear-gradient(') ||
		str.includes('repeating-radial-gradient(')
	);
}

export function isGradientsFunctions(str: string): boolean {
	return (
		str ==='conic-gradient' ||
		str ==='linear-gradient' ||
		str ==='radial-gradient' ||
		str ==='repeating-conic-gradient' ||
		str ==='repeating-linear-gradient' ||
		str ==='repeating-radial-gradient'
	);
}
