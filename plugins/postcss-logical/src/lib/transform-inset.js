import cloneRule from './clone-rule';

export default (decl, values, dir) => {
	if ('logical' !== values[0]) {
		return [
			decl.clone({ prop: 'top', value: values[0] }),
			decl.clone({ prop: 'right', value: values[1] || values[0] }),
			decl.clone({ prop: 'bottom', value: values[2] || values[0] }),
			decl.clone({ prop: 'left', value: values[3] || values[1] || values[0] })
		];
	}

	const isLTR = !values[4] || values[4] === values[2];

	const ltrDecls = [
		decl.clone({ prop: 'top', value: values[1] }),
		decl.clone({ prop: 'left', value: values[2] || values[1] }),
		decl.clone({ prop: 'bottom', value: values[3] || values[1] }),
		decl.clone({ prop: 'right', value: values[4] || values[2] || values[1] })
	];

	const rtlDecls = [
		decl.clone({ prop: 'top', value: values[1] }),
		decl.clone({ prop: 'right', value: values[2] || values[1] }),
		decl.clone({ prop: 'bottom', value: values[3] || values[1] }),
		decl.clone({ prop: 'left', value: values[4] || values[2] || values[1] })
	];

	return isLTR || dir === 'ltr' ? ltrDecls : dir === 'rtl' ? rtlDecls : [
		cloneRule(decl, 'ltr').append(ltrDecls),
		cloneRule(decl, 'rtl').append(rtlDecls)
	];
}
