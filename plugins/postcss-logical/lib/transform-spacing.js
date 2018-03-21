import cloneRule from './clone-rule';

export default (decl, values, dir) => {
	if ('logical' !== values[0]) {
		return null;
	}

	const isLTR = !values[4] || values[4] === values[2];

	const ltrDecl = decl.clone({
		value: [
			values[1],
			values[4] || values[2] || values[1],
			values[3] || values[1],
			values[2] || values[1]
		].join(' ')
	});

	const rtlDecl = decl.clone({
		value: [
			values[1],
			values[2] || values[1],
			values[3] || values[1],
			values[4] || values[2] || values[1]
		].join(' ')
	});

	return isLTR ? decl.clone({
		value: decl.value.replace(/^\s*logical\s+/i, '')
	}) : 'ltr' === dir ? ltrDecl : 'rtl' === dir ? rtlDecl : [
		cloneRule(decl, 'ltr').append(ltrDecl),
		cloneRule(decl, 'rtl').append(rtlDecl)
	];
};
