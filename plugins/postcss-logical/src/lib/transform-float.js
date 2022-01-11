import cloneRule from './clone-rule';

export default (decl, values, dir, preserve) => {
	if (/^inline-start$/i.test(decl.value)) {
		if (dir === 'ltr') {
			lDecl(decl);
			clean(decl, preserve);
			return;
		} else if (dir === 'rtl') {
			rDecl(decl);
			clean(decl, preserve);
			return;
		} else {
			cloneRule(decl, 'ltr').append(lDecl(decl));
			cloneRule(decl, 'rtl').append(rDecl(decl));
			clean(decl, preserve);
			return;
		}
	} if (/^inline-end$/i.test(decl.value)) {
		if (dir === 'ltr') {
			rDecl(decl);
			clean(decl, preserve);
			return;
		} else if (dir === 'rtl') {
			lDecl(decl);
			clean(decl, preserve);
			return;
		} else {
			cloneRule(decl, 'ltr').append(rDecl(decl));
			cloneRule(decl, 'rtl').append(lDecl(decl));
			clean(decl, preserve);
			return;
		}
	}
};

function lDecl(decl) {
	return decl.cloneBefore({ value: 'left' });
}

function rDecl(decl) {
	return decl.cloneBefore({ value: 'right' });
}

function clean(decl, preserve) {
	if (!preserve) {
		decl.remove();
	}
}
