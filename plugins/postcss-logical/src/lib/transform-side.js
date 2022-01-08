import cloneDeclBefore from './clone-decl';
import cloneRule from './clone-rule';
import matchSide from './match-side';

import matchInsetPrefix from './match-inset-prefix';

export default {
	// inset-block, margin-block, padding-block
	'block': (decl, values, dir, preserve) => {
		cloneDeclBefore(decl, '-top', values[0]);
		cloneDeclBefore(decl, '-bottom', values[1] || values[0]);
		clean(decl, preserve);
	},

	// inset-block-start, margin-block-start, padding-block-start
	'block-start': (decl, values, dir, preserve) => {
		decl.cloneBefore({ prop: decl.prop.replace(matchSide, '$1-top').replace(matchInsetPrefix, '') });
		clean(decl, preserve);
	},

	// inset-block-end, margin-block-end, padding-block-end
	'block-end': (decl, values, dir, preserve) => {
		decl.cloneBefore({ prop: decl.prop.replace(matchSide, '$1-bottom').replace(matchInsetPrefix, '') });
		clean(decl, preserve);
	},

	// inset-inline, margin-inline, padding-inline
	'inline': (decl, values, dir, preserve) => {
		const ltrDecls = () => {
			return [
				cloneDeclBefore(decl, '-left', values[0]),
				cloneDeclBefore(decl, '-right', values[1] || values[0]),
			];
		};

		const rtlDecls = () => {
			return [
				cloneDeclBefore(decl, '-right', values[0]),
				cloneDeclBefore(decl, '-left', values[1] || values[0]),
			];
		};

		const isLTR = 1 === values.length || 2 === values.length && values[0] === values[1];
		if (isLTR || dir === 'ltr') {
			ltrDecls();
			clean(decl, preserve);
			return;
		} else if (dir === 'rtl') {
			rtlDecls();
			clean(decl, preserve);
			return;
		} else {
			cloneRule(decl, 'ltr').append(ltrDecls());
			cloneRule(decl, 'rtl').append(rtlDecls());
			clean(decl, preserve);
			return;
		}
	},

	// inset-inline-start, margin-inline-start, padding-inline-start
	'inline-start': (decl, values, dir, preserve) => {
		const ltrDecl = () => {
			return cloneDeclBefore(decl, '-left', decl.value);
		};
		const rtlDecl = () => {
			return cloneDeclBefore(decl, '-right', decl.value);
		};

		if (dir === 'ltr') {
			ltrDecl();
			clean(decl, preserve);
			return;
		} else if (dir === 'rtl') {
			rtlDecl();
			clean(decl, preserve);
			return;
		} else {
			cloneRule(decl, 'ltr').append(ltrDecl());
			cloneRule(decl, 'rtl').append(rtlDecl());
			clean(decl, preserve);
			return;
		}
	},

	// inset-inline-end, margin-inline-end, padding-inline-end
	'inline-end': (decl, values, dir, preserve) => {
		const ltrDecl = () => {
			return cloneDeclBefore(decl, '-right', decl.value);
		};
		const rtlDecl = () => {
			return cloneDeclBefore(decl, '-left', decl.value);
		};

		if (dir === 'ltr') {
			ltrDecl();
			clean(decl, preserve);
			return;
		} else if (dir === 'rtl') {
			rtlDecl();
			clean(decl, preserve);
			return;
		} else {
			cloneRule(decl, 'ltr').append(ltrDecl());
			cloneRule(decl, 'rtl').append(rtlDecl());
			clean(decl, preserve);
			return;
		}
	},
};

function clean(decl, preserve) {
	if (!preserve) {
		decl.remove();
	}
}
