import cloneRule from './clone-rule';

const logicalRadii = /^(border-)(end-end|end-start|start-end|start-start)(-radius)$/i;
const ltrRadii = { 'end-end': 'bottom-right', 'end-start': 'bottom-left', 'start-end': 'top-right', 'start-start': 'top-left' };
const rtlRadii = { 'end-end': 'bottom-left', 'end-start': 'bottom-right', 'start-end': 'top-left', 'start-start': 'top-right' };

export default (decl, values, dir) => {
	const ltrDecl = decl.clone({
		prop: decl.prop.replace(logicalRadii, ($, prefix, direction, suffix) => `${prefix}${ltrRadii[direction]}${suffix}`)
	});

	if (dir === 'ltr') {
		return ltrDecl;
	}

	const rtlDecl = decl.clone({
		prop: decl.prop.replace(logicalRadii, ($, prefix, direction, suffix) => `${prefix}${rtlRadii[direction]}${suffix}`)
	});

	if (dir === 'rtl') {
		return rtlDecl;
	}

	return [
		cloneRule(decl, 'ltr').append(ltrDecl),
		cloneRule(decl, 'rtl').append(rtlDecl)
	];
};
