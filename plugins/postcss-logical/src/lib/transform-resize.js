export default (decl, values, dir, preserve) => {
	if (/^block$/i.test(decl.value)) {
		decl.cloneBefore({ value: 'vertical' });
		clean(decl, preserve);
		return;
	} else if (/^inline$/i.test(decl.value)) {
		decl.cloneBefore({ value: 'horizontal' });
		clean(decl, preserve);
		return;
	}
};

function clean(decl, preserve) {
	if (!preserve) {
		decl.remove();
	}
}
