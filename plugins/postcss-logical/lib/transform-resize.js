export default decl => /^block$/i.test(decl.value)
	? decl.clone({ value: 'vertical' })
	: /^inline$/i.test(decl.value)
		? decl.clone({ value: 'horizontal' })
		: null;
