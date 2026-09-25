/**
 * Deterministic, type-aware fuzzer for CSS math expressions.
 *
 * The generator is seeded so the corpus produced in CI is stable and failures
 * are reproducible. It favors type-correct expressions (so that `css-calc` can
 * solve them and a browser can compute them) while still injecting occasional
 * type mismatches and infinities to exercise the type-analysis guard branches.
 *
 * See https://drafts.csswg.org/css-values-4/#calc-type-checking and
 * https://drafts.csswg.org/css-values-4/#calc-ieee for the rules it targets.
 */

const TYPES = ['number', 'length', 'angle', 'time', 'percentage'];

const UNITS = {
	length: ['px', 'cm', 'mm', 'Q', 'in', 'pc', 'pt', 'em', 'rem', 'ex', 'ch', 'vw', 'vh', 'vmin', 'vmax'],
	angle: ['deg', 'grad', 'rad', 'turn'],
	time: ['s', 'ms'],
	percentage: ['%'],
};

const NUMBER_LITERALS = [
	'0', '-0', '1', '-1', '2', '-2', '0.5', '-0.5', '3', '-3', '5', '10', '-10',
	'100', '-100', '1000', '0.1', '-0.1', '0.01', '0.001', '1e3', '1e-3', '1e6', '1e-6',
];

const SPECIAL_VALUES = ['NaN', 'infinity', '-infinity', 'pi', 'e'];
const ROUNDING_STRATEGIES = ['nearest', 'up', 'down', 'to-zero'];
const TRIG = ['sin', 'cos', 'tan'];
const INVERSE_TRIG = ['asin', 'acos', 'atan'];
const EXPONENTIAL = ['sqrt', 'exp', 'log'];

function mulberry32(seed) {
	let state = seed >>> 0;

	return function random() {
		state = (state + 0x6D2B79F5) | 0;

		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function pick(rand, values) {
	return values[Math.floor(rand() * values.length)];
}

function int(rand, min, max) {
	return min + Math.floor(rand() * (max - min + 1));
}

function formatNumber(rand) {
	if (rand() < 0.3) {
		return pick(rand, NUMBER_LITERALS);
	}

	const sign = rand() < 0.5 ? '-' : '';
	const integer = int(rand, 0, 9999);
	const fraction = rand() < 0.5 ? '' : '.' + String(int(rand, 1, 999999)).padStart(6, '0').replace(/0+$/, '');

	return `${sign}${integer}${fraction}`;
}

function dimensionLeaf(rand, type) {
	const unit = pick(rand, UNITS[type]);

	if (rand() < 0.25) {
		return `${pick(rand, SPECIAL_VALUES)} * 1${unit}`;
	}

	return `${formatNumber(rand)}${unit}`;
}

function numberLeaf(rand) {
	if (rand() < 0.25) {
		return pick(rand, SPECIAL_VALUES);
	}

	return formatNumber(rand);
}

function leaf(rand, type) {
	if (type === 'number') {
		return numberLeaf(rand);
	}

	return dimensionLeaf(rand, type);
}

function gen(rand, type, depth) {
	if (depth <= 0 || rand() < 0.45) {
		return leaf(rand, type);
	}

	return compose(rand, type, depth);
}

function compose(rand, type, depth) {
	const nextDepth = depth - 1;
	const sameType = () => gen(rand, type, nextDepth);
	const number = () => gen(rand, 'number', nextDepth);
	const anyType = () => gen(rand, pick(rand, TYPES), nextDepth);

	const composers = [
		() => `abs(${sameType()})`,
		() => `min(${sameType()}, ${sameType()})`,
		() => `max(${sameType()}, ${sameType()})`,
		() => `clamp(${sameType()}, ${sameType()}, ${sameType()})`,
		() => `hypot(${sameType()}, ${sameType()})`,
		() => `mod(${sameType()}, ${sameType()})`,
		() => `rem(${sameType()}, ${sameType()})`,
		() => `round(${sameType()}, ${sameType()})`,
		() => `round(${pick(rand, ROUNDING_STRATEGIES)}, ${sameType()}, ${sameType()})`,
		() => `(${sameType()} + ${sameType()})`,
		() => `(${sameType()} - ${sameType()})`,
		() => `(${sameType()} * ${number()})`,
		() => `(${number()} * ${sameType()})`,
		() => `(${sameType()} / ${number()})`,
		() => `calc(${sameType()})`,
	];

	if (type === 'number') {
		composers.push(
			() => `sign(${anyType()})`,
			() => `${pick(rand, TRIG)}( ${gen(rand, rand() < 0.5 ? 'number' : 'angle', nextDepth)} )`,
			() => `${pick(rand, EXPONENTIAL)}( ${number()} )`,
			() => `pow(${number()}, ${number()})`,
			() => `log(${number()}, ${number()})`,
		);
	}

	if (type === 'angle') {
		composers.push(
			() => `${pick(rand, INVERSE_TRIG)}( ${number()} )`,
			() => `atan2(${number()}, ${number()})`,
		);
	}

	return pick(rand, composers)();
}

/**
 * Generate a deterministic list of math expressions.
 *
 * @param {{ seed?: number, count?: number }} [options]
 * @returns {Array<string>}
 */
export function generateCases(options = {}) {
	const seed = options.seed ?? 1;
	const count = options.count ?? 1000;

	const rand = mulberry32(seed);
	const cases = [];

	for (let i = 0; i < count; i++) {
		const type = pick(rand, TYPES);
		const expression = `calc(${gen(rand, type, 3)})`;

		cases.push(expression);
	}

	return cases;
}
