var postcss = require('postcss');
var expect  = require('chai').expect;

var plugin = require('../');

var test = function (input, output, opts, done) {
	postcss([ plugin(opts) ]).process(input).then(function (result) {
		expect(result.css).to.eql(output);
		expect(result.warnings()).to.be.empty;
		done();
	}).catch(function (error) {
		done(error);
	});
};

describe('postcss-nesting', function () {
	it('basic usage', function (done) {
		test(
			'a,b{color:red;{c,d{color:white;}& &{color:blue;}&:hover{color:white;}}}',
			'a,b{color:red}a c,b c,a d,b d{color:white;}a a,a b,b a,b b{color:blue;}a:hover,b:hover{color:white;}',
			{},
		done);
	});
});
