const cloneRule = require('./clone-rule');

module.exports = (decl, values, dir) => {
	const lDecl = decl.clone({ value: 'left' });
	const rDecl = decl.clone({ value: 'right' });

	return /^inline-start$/i.test(decl.value) ? 'ltr' === dir ? lDecl : 'rtl' === dir ? rDecl : [
		cloneRule(decl, 'ltr').append(lDecl),
		cloneRule(decl, 'rtl').append(rDecl)
	] : /^inline-end$/i.test(decl.value) ? 'ltr' === dir ? rDecl : 'rtl' === dir ? lDecl : [
		cloneRule(decl, 'ltr').append(rDecl),
		cloneRule(decl, 'rtl').append(lDecl)
	] : null;
};
