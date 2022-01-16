import cloneRule from './clone-rule';

const logicalRadii = /^(border-)(end-end|end-start|start-end|start-start)(-radius)$/i;
const ltrRadii = { 'end-end': 'bottom-right', 'end-start': 'bottom-left', 'start-end': 'top-right', 'start-start': 'top-left' };
const rtlRadii = { 'end-end': 'bottom-left', 'end-start': 'bottom-right', 'start-end': 'top-left', 'start-start': 'top-right' };

export default (decl, values, dir, preserve) => {
	if (dir === 'ltr') {
		lDecl(decl);
		clean(decl, preserve);
		return;
	}

	if (dir === 'rtl') {
		rDecl(decl);
		clean(decl, preserve);
		return;
	}

	cloneRule(decl, 'ltr').append(lDecl(decl));
	cloneRule(decl, 'rtl').append(rDecl(decl));
	clean(decl, preserve);
};

function lDecl(decl) {
	return decl.cloneBefore({
		prop: decl.prop.replace(logicalRadii, ($, prefix, direction, suffix) => `${prefix}${ltrRadii[direction]}${suffix}`),
	});
}

function rDecl(decl) {
	return decl.cloneBefore({
		prop: decl.prop.replace(logicalRadii, ($, prefix, direction, suffix) => `${prefix}${rtlRadii[direction]}${suffix}`),
	});
}

function clean(decl, preserve) {
	if (!preserve) {
		decl.remove();
	}
}
