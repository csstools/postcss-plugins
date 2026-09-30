import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

// Ported from the WPT `css-values/signed-zero.html` test.
//
// `-0` and `0` serialize identically, so the sign of the zero is observed
// through `clamp(-1, 1 / sign(expr), 1)`, exactly as the WPT test does.
// https://drafts.csswg.org/css-values-4/#calc-ieee
function testZero(expression, isNegative) {
	assert.strictEqual(
		calc(`clamp(-1, 1 / sign(${expression}), 1)`),
		isNegative ? '-1' : '1',
		`${expression} should be ${isNegative ? '-0' : '0'}`,
	);
}

testZero('calc(-0)', true);
testZero('calc( 0)', false);

testZero('calc(-0 * -1)', false);
testZero('calc(-0 *  1)', true);
testZero('calc( 0 * -1)', true);
testZero('calc( 0 *  1)', false);

testZero('calc(-1 / -infinity)', false);
testZero('calc(-1 /  infinity)', true);
testZero('calc( 1 / -infinity)', true);
testZero('calc( 1 /  infinity)', false);

testZero('calc(-0 + -0)', true);
testZero('calc(-0 +  0)', false);
testZero('calc( 0 + -0)', false);
testZero('calc( 0 +  0)', false);

testZero('calc(-0 - -0)', false);
testZero('calc(-0 -  0)', true);
testZero('calc( 0 - -0)', false);
testZero('calc( 0 -  0)', false);

testZero('min(-0,  0)', true);
testZero('min( 0, -0)', true);

testZero('max(-0,  0)', false);
testZero('max( 0, -0)', false);

testZero('clamp(-0, -1, -0)', true);
testZero('clamp(-0, -0, -0)', true);
testZero('clamp(-0,  0, -0)', true);
testZero('clamp(-0,  1, -0)', true);

testZero('clamp(-0, -1, 0)', true);
testZero('clamp(-0, -0, 0)', true);
testZero('clamp(-0,  0, 0)', false);
testZero('clamp(-0,  1, 0)', false);

testZero('clamp(0, -1, -0)', false);
testZero('clamp(0, -0, -0)', false);
testZero('clamp(0,  0, -0)', false);
testZero('clamp(0,  1, -0)', false);

testZero('round(nearest, -1, infinity)', true);
testZero('round(nearest, -0, infinity)', true);
testZero('round(nearest,  0, infinity)', false);
testZero('round(nearest,  1, infinity)', false);

testZero('round(up, -1, infinity)', true);
testZero('round(up, -0, infinity)', true);
testZero('round(up,  0, infinity)', false);

testZero('round(down, -0, infinity)', true);
testZero('round(down,  0, infinity)', false);
testZero('round(down,  1, infinity)', false);

testZero('mod(-1, -1)', true);
testZero('mod(-1,  1)', false);
testZero('mod( 1, -1)', true);
testZero('mod( 1,  1)', false);

testZero('rem(-1, -1)', true);
testZero('rem(-1,  1)', true);
testZero('rem( 1, -1)', false);
testZero('rem( 1,  1)', false);

testZero('asin(-0)', true);
testZero('asin( 0)', false);

testZero('atan(-0)', true);
testZero('atan( 0)', false);

testZero('atan2(-0, 0)', true);
testZero('atan2(-0, 1)', true);
testZero('atan2(-0, infinity)', true);

testZero('atan2(0, 0)', false);
testZero('atan2(0, 1)', false);
testZero('atan2(0, infinity)', false);

testZero('atan2(-1, infinity)', true);
testZero('atan2( 1, infinity)', false);

testZero('pow(-infinity, -2)', false);
testZero('pow(-infinity, -1)', true);

testZero('pow(-0, 1)', true);
testZero('pow(-0, 2)', false);

testZero('pow(0, 1)', false);
testZero('pow(0, 2)', false);

testZero('pow(infinity, -2)', false);
testZero('pow(infinity, -1)', false);

testZero('sqrt(-0)', true);
testZero('sqrt( 0)', false);

testZero('hypot(-0)', false);
testZero('hypot( 0)', false);

testZero('exp(-infinity)', false);

testZero('abs(-0)', false);
testZero('abs( 0)', false);

testZero('sign(-0)', true);
testZero('sign( 0)', false);
