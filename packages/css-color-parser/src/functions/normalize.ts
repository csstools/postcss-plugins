export function normalize(x: number, scale: number, min: number, max: number): number {
	return Math.min(Math.max(x / scale, min), max);
}
