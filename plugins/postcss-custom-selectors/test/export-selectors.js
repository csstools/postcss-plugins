module.exports = {
	customSelectors: {
		':--foo': '.foo',
		':--any-heading': 'h1, h2, h3, h4, h5, h6',
		':--foobar': '.foo',
		':--baz': '.baz',
		':--fizzbuzz': '.fizz, .buzz',
		':--button-types': '.btn-primary,\n	.btn-success,\n	.btn-info,\n	.btn-warning,\n	.btn-danger',
		':--commented-foo': '.foo,\n	.bar > .baz',
		':--pseudo': '::before, ::after',
		':--fo-----o': 'h1, h2, h3',
		':--ba-----r': 'h4, h5, h6',
		':--multiline': '.foo,\n	.bar > .baz',
		':--button': 'button, .button',
		':--enter': ':hover, :focus',
		':--any-foobar': '.foo, .bar'
	}
};
