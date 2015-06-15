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

describe('postcss-pseudo-class-any-link', function () {
	it(':any-link transforms to :link and :visited', function (done) {
		test('ul a:any-link > span { background: yellow; }', 'ul a:link > span,ul a:visited > span { background: yellow; }', {}, done);
	});

	it(':any-link remains :any-link { prefix: "foo" }', function (done) {
		test('ul a:any-link > span { background: yellow; }', 'ul a:any-link > span { background: yellow; }', {
			prefix: 'foo'
		}, done);
	});

	it(':-foo-any-link transforms to :link and :visited { prefix: "foo" }', function (done) {
		test('ul a:-foo-any-link > span { background: yellow; }', 'ul a:link > span,ul a:visited > span { background: yellow; }', {
			prefix: 'foo'
		}, done);
	});
});
