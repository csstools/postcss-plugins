import { calc } from '@csstools/css-calc';
import { isFunctionNode, isTokenNode, parseCommaSeparatedListOfComponentValues, parseComponentValue, parseListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { isTokenNumber, tokenize } from '@csstools/css-tokenizer';
import assert from 'node:assert';

function absEquivalent(input) {
	const componentValues = replaceComponentValues(
		parseCommaSeparatedListOfComponentValues(tokenize({ css: input })),
		(componentValue) => {
			if (!isFunctionNode(componentValue)) {
				return;
			}

			if (componentValue.getName().toLowerCase() === 'abs') {
				return replaceComponentValues(
					[[parseComponentValue(tokenize({ css: 'max((0), -1 * (0))' }))]],
					(other) => {
						if (isTokenNode(other) && isTokenNumber(other.value) && other.value[4].value === 0) {
							return parseListOfComponentValues(componentValue.value.flatMap((x) => x.tokens()));
						}
					},
				)[0];
			}

			// if (componentValue.getName().toLowerCase() === 'sign') {
			// 	const unit = '( ( (0) * 3.35544e07 ) / 3.35544e07 )';

			// 	return replaceComponentValues(
			// 		[[parseComponentValue(tokenize({ css: `round(to-zero, clamp(-1, tan(atan2((0), ${unit})) * 3.35544e06, 1))` }))]],
			// 		(other) => {
			// 			if (isTokenNode(other) && isTokenNumber(other.value) && other.value[4].value === 0) {
			// 				return parseListOfComponentValues(componentValue.value.flatMap((x) => x.tokens()));
			// 			}
			// 		},
			// 	)[0];
			// }
		},
	);

	return stringify(componentValues);
}

assert.strictEqual(
	calc(absEquivalent('abs(1)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('abs(sign(1))')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('abs(sign(sign(1)))')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(sign(sign(1) + sign(1)))')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('calc(abs(0.1 + 0.2) + 0.05)')),
	'0.35',
);

assert.strictEqual(
	calc(absEquivalent('calc(sign(0.1 + 0.2) - 0.05)')),
	'0.95',
);

assert.strictEqual(
	calc(absEquivalent('calc(abs(0.1 + 0.2) * 2)')),
	'0.6',
);

assert.strictEqual(
	calc(absEquivalent('calc(abs(sign(0.1) + 0.2) / 2)')),
	'0.6',
);

assert.strictEqual(
	calc(absEquivalent('calc(abs(0.1 + 0.2) * -2)')),
	'-0.6',
);

assert.strictEqual(
	calc(absEquivalent('calc(sign(0.1 - 0.2) - 0.05)')),
	'-1.05',
);

assert.strictEqual(
	calc(absEquivalent('calc(sign(1) + sign(1) - 0.05)')),
	'1.95',
);

assert.strictEqual(
	calc(absEquivalent('calc(sign(-0))')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('calc(sign(0))')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(1px)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1cm)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1mm)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1Q)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1in)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1pc)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1pt)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1em)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1ex)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1ch)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1rem)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1vh)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1vw)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1vmin)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1vmax)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1px)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1cm)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1mm)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1Q)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1in)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1pc)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1pt)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1em)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1ex)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1ch)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1rem)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1vh)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1vw)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1vmin)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1vmax)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1s)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1ms)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1s)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1ms)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1deg)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1grad)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1rad)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(1turn)')),
	'1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1deg)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1grad)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1rad)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(-1turn)')),
	'-1',
);

assert.strictEqual(
	calc(absEquivalent('sign(0px)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0cm)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0mm)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0Q)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0in)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0pc)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0pt)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0em)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0ex)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0ch)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0rem)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0vh)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0vw)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0vmin)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0vmax)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0px)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0cm)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0mm)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0Q)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0in)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0pc)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0pt)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0em)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0ex)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0ch)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0rem)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0vh)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0vw)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0vmin)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0vmax)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0s)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0ms)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0deg)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0grad)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0rad)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(0turn)')),
	'0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0deg)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0grad)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0rad)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('sign(-0turn)')),
	'-0',
);

assert.strictEqual(
	calc(absEquivalent('abs(1px)')),
	'1px',
);

assert.strictEqual(
	calc(absEquivalent('abs(1cm)')),
	'1cm',
);

assert.strictEqual(
	calc(absEquivalent('abs(1mm)')),
	'1mm',
);

assert.strictEqual(
	calc(absEquivalent('abs(1Q)')),
	'1Q',
);

assert.strictEqual(
	calc(absEquivalent('abs(1in)')),
	'1in',
);

assert.strictEqual(
	calc(absEquivalent('abs(1pc)')),
	'1pc',
);

assert.strictEqual(
	calc(absEquivalent('abs(1pt)')),
	'1pt',
);

assert.strictEqual(
	calc(absEquivalent('abs(1em)')),
	'1em',
);

assert.strictEqual(
	calc(absEquivalent('abs(1ex)')),
	'1ex',
);

assert.strictEqual(
	calc(absEquivalent('abs(1ch)')),
	'1ch',
);

assert.strictEqual(
	calc(absEquivalent('abs(1rem)')),
	'1rem',
);

assert.strictEqual(
	calc(absEquivalent('abs(1vh)')),
	'1vh',
);

assert.strictEqual(
	calc(absEquivalent('abs(1vw)')),
	'1vw',
);

assert.strictEqual(
	calc(absEquivalent('abs(1vmin)')),
	'1vmin',
);

assert.strictEqual(
	calc(absEquivalent('abs(1vmax)')),
	'1vmax',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1px)')),
	'1px',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1cm)')),
	'1cm',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1mm)')),
	'1mm',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1Q)')),
	'1Q',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1in)')),
	'1in',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1pc)')),
	'1pc',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1pt)')),
	'1pt',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1em)')),
	'1em',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1ex)')),
	'1ex',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1ch)')),
	'1ch',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1rem)')),
	'1rem',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1vh)')),
	'1vh',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1vw)')),
	'1vw',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1vmin)')),
	'1vmin',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1vmax)')),
	'1vmax',
);

assert.strictEqual(
	calc(absEquivalent('abs(1s)')),
	'1s',
);

assert.strictEqual(
	calc(absEquivalent('abs(1ms)')),
	'1ms',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1s)')),
	'1s',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1ms)')),
	'1ms',
);

assert.strictEqual(
	calc(absEquivalent('abs(1deg)')),
	'1deg',
);

assert.strictEqual(
	calc(absEquivalent('abs(1grad)')),
	'1grad',
);

assert.strictEqual(
	calc(absEquivalent('abs(1rad)')),
	'1rad',
);

assert.strictEqual(
	calc(absEquivalent('abs(1turn)')),
	'1turn',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1deg)')),
	'1deg',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1grad)')),
	'1grad',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1rad)')),
	'1rad',
);

assert.strictEqual(
	calc(absEquivalent('abs(-1turn)')),
	'1turn',
);
