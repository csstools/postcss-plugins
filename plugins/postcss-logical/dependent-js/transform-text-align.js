const cloneRule = require('./clone-rule');

module.exports = (decl) => /^start$/i.test(decl.value)
	? [
		cloneRule(decl, 'ltr').append([
			decl.clone({ value: 'left' })
		]),
		cloneRule(decl, 'rtl').append([
			decl.clone({ value: 'right' })
		])
	]
	: /^end$/i.test(decl.value)
		? [
			cloneRule(decl, 'ltr').append([
				decl.clone({ value: 'right' })
			]),
			cloneRule(decl, 'rtl').append([
				decl.clone({ value: 'left' })
			])
		]
		: null;
