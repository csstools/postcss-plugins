// https://github.com/w3c/csswg-drafts/blob/main/css-color-4/deltaEOK.js

// Calculate deltaE OK
// simple root sum of squares
export function deltaEOK(reference: [number, number, number], sample: [number, number, number]): number {
	// Given reference and sample are both in OKLab
	const [L1, a1, b1] = reference;
	const [L2, a2, b2] = sample;
	const ΔL = L1 - L2;
	const Δa = a1 - a2;
	const Δb = b1 - b2;
	return Math.sqrt(ΔL ** 2 + Δa ** 2 + Δb ** 2);
}
