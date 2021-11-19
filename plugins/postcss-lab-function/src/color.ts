// Taken from @csstools/convert-colors
// That package is in need of maintenance but this is out of scope for preset-env
// We only need lab() -> rgb() and lch() -> rgb()

export function labToSRgb(lab: [number, number, number]): [number, number, number] {
	return xyz2rgb(lab2xyz(lab, true));
}

export function lchToSRgb(lch: [number, number, number]): [number, number, number] {
	return xyz2rgb(
		lab2xyz(lch2lab(lch),
		false, /* do not clamp "a" and "b" when processing lch */
	));
}

function lch2lab(lch: [number, number, number]): [number, number, number] {
	// Convert from polar form
	return [
		lch[0], // L is still L
		lch[1] * Math.cos(lch[2] * Math.PI / 180), // a
		lch[1] * Math.sin(lch[2] * Math.PI / 180), // b
	];
}

function lab2xyz(lab: [number, number, number], clamp : boolean): [number, number, number] {
	const [labLRaw, labARaw, labBRaw] = lab;

	const labL = Math.min(
		Math.max(
			labLRaw,
			0,
		),
		100,
	);

	let labA = 0;
	let labB = 0;

	if (clamp) {
		labA = Math.min(
			Math.max(
				labARaw,
				-128,
			),
			128,
		);

		labB = Math.min(
			Math.max(
				labBRaw,
				-128,
			),
			128,
		);
	} else {
		labA = labARaw;
		labB = labBRaw;
	}

	// compute f, starting with the luminance-related term
	const f2 = (labL + 16) / 116;
	const f1 = labA / 500 + f2;
	const f3 = f2 - labB / 200;

	// compute pre-scaled XYZ
	const [ initX, initY, initZ ] = [
		Math.pow(f1, 3) > epsilon   ? Math.pow(f1, 3)                : (116 * f1 - 16) / kappa,
		labL > kappa * epsilon      ? Math.pow((labL + 16) / 116, 3) : labL / kappa,
		Math.pow(f3, 3) > epsilon   ? Math.pow(f3, 3)                : (116 * f3 - 16) / kappa,
	];

	const [ xyzX, xyzY, xyzZ ] = matrix(
		// compute XYZ by scaling pre-scaled XYZ by reference white
		[ initX * wd50X, initY * wd50Y, initZ * wd50Z ],
		// calculate D65 XYZ from D50 XYZ
		[
			[  0.9554734527042182,   -0.023098536874261423,  0.0632593086610217   ],
			[ -0.028369706963208136,  1.0099954580058226,    0.021041398966943008 ],
			[  0.012314001688319899, -0.020507696433477912,  1.3303659366080753   ],
		],
	);

	return [ xyzX, xyzY, xyzZ ];
}

export function xyz2rgb(xyz: [number, number, number]): [number, number, number] {
	const [xyzX, xyzY, xyzZ] = xyz;
	const [ lrgbR, lrgbB, lrgbG ] = matrix([ xyzX, xyzY, xyzZ ], [
		[  3.2409699419045226,  -1.537383177570094,   -0.4986107602930034  ],
		[ -0.9692436362808796,   1.8759675015077202,   0.04155505740717559 ],
		[  0.05563007969699366, -0.20397695888897652,  1.0569715142428786  ],
	]);

	const [ rgbR, rgbG, rgbB ] = [ lrgbR, lrgbB, lrgbG ].map(
		v => v > 0.31308 ? 1.055 * Math.pow(v / 100, 1 / 2.4) * 100 - 5.5 : 12.92 * v,
	);

	return [ rgbR, rgbG, rgbB ];
}

function matrix(params: [number, number, number], mats: [[number, number, number], [number, number, number], [number, number, number]]): [number, number, number] {
	return mats.map(
		mat => mat.reduce(
			// (acc, value, index) => acc + params[index] * value,
			(acc, value, index) => acc + params[index] * precision * (value * precision) / precision / precision,
			0,
		),
	) as [number, number, number];
}

/* Precision
/* ========================================================================== */

const precision = 100000000;

/* D50 reference white
/* ========================================================================== */

const [ wd50X, wd50Y, wd50Z ] = [ 96.422, 100.000, 82.521 ];

/* Math Constants
/* ========================================================================== */

const epsilon = Math.pow(6, 3) / Math.pow(29, 3);
const kappa = Math.pow(29, 3) / Math.pow(3, 3);
