import cloneRule from './clone-rule';

export default (decl, values, dir) => {
	const lDecl = decl.clone({ value: 'left' });
	const rDecl = decl.clone({ value: 'right' });

	return /^inline-start$/i.test(decl.value) ? dir === 'ltr' ? lDecl : dir === 'rtl' ? rDecl : [
		cloneRule(decl, 'ltr').append(lDecl),
		cloneRule(decl, 'rtl').append(rDecl)
	] : /^inline-end$/i.test(decl.value) ? dir === 'ltr' ? rDecl : dir === 'rtl' ? lDecl : [
		cloneRule(decl, 'ltr').append(rDecl),
		cloneRule(decl, 'rtl').append(lDecl)
	] : null;
};
