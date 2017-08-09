const cloneRule = require('./clone-rule');

module.exports = (decl, values) => 'logical' === values[0]
	? !values[4] || values[2] === values[4]
		? [
			decl.clone({ prop: 'top', value: values[1] }),
			decl.clone({ prop: 'left', value: values[2] || values[1] }),
			decl.clone({ prop: 'bottom', value: values[3] || values[1] }),
			decl.clone({ prop: 'right', value: values[4] || values[2] || values[1] })
		] : [
			cloneRule(decl, 'ltr').append([
				decl.clone({ prop: 'top', value: values[1] }),
				decl.clone({ prop: 'left', value: values[2] || values[1] }),
				decl.clone({ prop: 'bottom', value: values[3] || values[1] }),
				decl.clone({ prop: 'right', value: values[4] || values[2] || values[1] })
			]),
			cloneRule(decl, 'rtl').append([
				decl.clone({ prop: 'top', value: values[1] }),
				decl.clone({ prop: 'right', value: values[2] || values[1] }),
				decl.clone({ prop: 'bottom', value: values[3] || values[1] }),
				decl.clone({ prop: 'left', value: values[4] || values[2] || values[1] })
			])
		]
	: [
		decl.clone({ prop: 'top', value: values[0] }),
		decl.clone({ prop: 'right', value: values[1] || values[0] }),
		decl.clone({ prop: 'bottom', value: values[2] || values[0] }),
		decl.clone({ prop: 'left', value: values[3] || values[1] || values[0] })
	];
