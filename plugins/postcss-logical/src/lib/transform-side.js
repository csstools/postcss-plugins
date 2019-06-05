import cloneDecl from './clone-decl';
import cloneRule from './clone-rule';
import matchSide from './match-side';

import matchInsetPrefix from './match-inset-prefix';

export default {
	// inset-block, margin-block, padding-block
	'block': (decl, values) => [
		cloneDecl(decl, '-top', values[0]),
		cloneDecl(decl, '-bottom', values[1] || values[0])
	],

	// inset-block-start, margin-block-start, padding-block-start
	'block-start': decl => {
		decl.prop = decl.prop.replace(matchSide, '$1-top').replace(matchInsetPrefix, '');
	},

	// inset-block-end, margin-block-end, padding-block-end
	'block-end': decl => {
		decl.prop = decl.prop.replace(matchSide, '$1-bottom').replace(matchInsetPrefix, '');
	},

	// inset-inline, margin-inline, padding-inline
	'inline': (decl, values, dir) => {
		const ltrDecls = [
			cloneDecl(decl, '-left', values[0]),
			cloneDecl(decl, '-right', values[1] || values[0])
		];

		const rtlDecls = [
			cloneDecl(decl, '-right', values[0]),
			cloneDecl(decl, '-left', values[1] || values[0])
		];

		const isLTR = 1 === values.length || 2 === values.length && values[0] === values[1];

		return isLTR ? ltrDecls : dir === 'ltr' ? ltrDecls : dir === 'rtl' ? rtlDecls : [
			cloneRule(decl, 'ltr').append(ltrDecls),
			cloneRule(decl, 'rtl').append(rtlDecls),
		];
	},

	// inset-inline-start, margin-inline-start, padding-inline-start
	'inline-start': (decl, values, dir) => {
		const ltrDecl = cloneDecl(decl, '-left', decl.value);
		const rtlDecl = cloneDecl(decl, '-right', decl.value);

		return dir === 'ltr' ? ltrDecl : dir === 'rtl' ? rtlDecl : [
			cloneRule(decl, 'ltr').append(ltrDecl),
			cloneRule(decl, 'rtl').append(rtlDecl)
		];
	},

	// inset-inline-end, margin-inline-end, padding-inline-end
	'inline-end': (decl, values, dir) => {
		const ltrDecl = cloneDecl(decl, '-right', decl.value);
		const rtlDecl = cloneDecl(decl, '-left', decl.value);

		return dir === 'ltr' ? ltrDecl : dir === 'rtl' ? rtlDecl : [
			cloneRule(decl, 'ltr').append(ltrDecl),
			cloneRule(decl, 'rtl').append(rtlDecl)
		];
	}
}
