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
	// standard tests
	it(':any-link', function (done) {
		test(':any-link { background: blue; }', ':link,:visited { background: blue; }', {}, done);
	});

	it(':any-link, ul a:any-link > span', function (done) {
		test(':any-link, ul a:any-link > span { background: blue; }', ':link,:visited, ul a:link > span, ul a:visited > span { background: blue; }', {}, done);
	});

	it(':any-link :any-link', function (done) {
		test(':any-link :any-link { background: blue; }', ':link :link,:link :visited,:visited :link,:visited :visited { background: blue; }', {}, done);
	});

	// custom prefix tests
	it(':any-link (with "foo" prefix)', function (done) {
		test(':any-link { background: blue; }', ':any-link { background: blue; }', { prefix: 'foo' }, done);
	});

	it(':-foo-any-link (with no prefix)', function (done) {
		test(':-foo-any-link { background: blue; }', ':-foo-any-link { background: blue; }', {}, done);
	});

	it(':-foo-any-link (with "foo" prefix)', function (done) {
		test(':-foo-any-link { background: blue; }', ':link,:visited { background: blue; }', { prefix: 'foo' }, done);
	});

	it(':-foo-any-link, ul a:-foo-any-link > span (with "foo" prefix)', function (done) {
		test(':-foo-any-link, ul a:-foo-any-link > span { background: blue; }', ':link,:visited, ul a:link > span, ul a:visited > span { background: blue; }', { prefix: 'foo' }, done);
	});

	it(':-foo-any-link :-foo-any-link (with "foo" prefix)', function (done) {
		test(':-foo-any-link :-foo-any-link { background: blue; }', ':link :link,:link :visited,:visited :link,:visited :visited { background: blue; }', { prefix: 'foo' }, done);
	});

	it(':any-link transforms to :link and :visited', function (done) {
		test('ul a:any-link > span { background: yellow; }', 'ul a:link > span,ul a:visited > span { background: yellow; }', {}, done);
	});

	it(':any-link remains :any-link { prefix: "foo" }', function (done) {
		test('ul a:any-link > span { background: yellow; }', 'ul a:any-link > span { background: yellow; }', {
			prefix: 'foo'
		}, done);
	});

	// regression tests
	it('--any-link remains --any-link', function (done) {
		test('--any-link: { background: blue; }', '--any-link: { background: blue; }', {}, done);
	});
});
