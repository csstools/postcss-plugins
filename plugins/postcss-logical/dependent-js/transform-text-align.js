import cloneRule from './clone-rule';

export default (decl, values, dir) => {
	const lDecl = decl.clone({ value: 'left' });
	const rDecl = decl.clone({ value: 'right' });

	return /^start$/i.test(decl.value) ? 'ltr' === dir ? lDecl : 'rtl' === dir ? rDecl : [
		cloneRule(decl, 'ltr').append(lDecl),
		cloneRule(decl, 'rtl').append(rDecl)
	] : /^end$/i.test(decl.value) ? 'ltr' === dir ? rDecl : 'rtl' === dir ? lDecl : [
		cloneRule(decl, 'ltr').append(rDecl),
		cloneRule(decl, 'rtl').append(lDecl)
	] : null;
};
