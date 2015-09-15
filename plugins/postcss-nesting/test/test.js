var postcss = require('postcss');
var nested  = require('../');
var expect  = require('chai').expect;

var check = function (input, output, opts) {
	var processor = postcss([ nested(opts) ]);
	expect( processor.process(input).css ).to.equal(output);
};

describe('postcss-nested', function () {
	it('ignores sass nesting', function () {
		check('z { color: red } a, b { color: white; & c, & d { color: blue } }',
			  'z { color: red } a, b { color: white; & c, & d { color: blue } }');
	});

	it('unwraps css nesting', function () {
		check('z { color: red } a, b { color: white; @nest & c, & d { color: blue } }',
			  'z { color: red } a, b { color: white } a c, a d, b c, b d { color: blue }');
	});

	it('unwraps css deep nesting', function () {
		check('z { color: red } a, b { color: white; @nest & c, & d { color: blue; @nest & e, & f { color: black } } }',
			  'z { color: red } a, b { color: white } a c, a d, b c, b d { color: blue } a c e, a c f, a d e, a d f, b c e, b c f, b d e, b d f { color: black }');
	});

	it('unwraps mixed nesting', function () {
		check('a { color: red; @media { color: white; @nest b { color: blue } } }',
			  'a { color: red } @media { a { color: white } a b { color: blue } }');
	});

	it('unwraps specified at-rules', function () {
		check('a { color: red; @unknown test { color: white } } b { color: white; @phone { color: blue } @media { color: black; @nest c { color: yellow } } }',
			  'a { color: red; @unknown test { color: white } } b { color: white } @phone { b { color: blue } } @media { b { color: black } b c { color: yellow } }',
			  { bubble: ['phone'] });
	});
});
