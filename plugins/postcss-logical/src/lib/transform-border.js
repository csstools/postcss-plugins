import cloneRule from './clone-rule';

const matchLogicalBorderSide = /^border-(block|block-start|block-end|inline|inline-start|inline-end)(-(width|style|color))?$/i;

export default {
	// border-block
	'border-block': (decl, values) => [
		decl.clone({
			prop: `border-top${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[0]
		}),
		decl.clone({
			prop: `border-bottom${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[1] || values[0]
		})
	],

	// border-block-start
	'border-block-start': decl => {
		decl.prop = `border-top${decl.prop.replace(matchLogicalBorderSide, '$2')}`;
	},

	// border-block-end
	'border-block-end': decl => {
		decl.prop = `border-bottom${decl.prop.replace(matchLogicalBorderSide, '$2')}`;
	},

	// border-inline
	'border-inline': (decl, values, dir) => {
		const ltrDecls = [
			decl.clone({
				prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
				value: values[0]
			}),
			decl.clone({
				prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
				value: values[1] || values[0]
			})
		];

		const rtlDecls = [
			decl.clone({
				prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
				value: values[0]
			}),
			decl.clone({
				prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
				value: values[1] || values[0]
			})
		];

		const isLTR = 1 === values.length || 2 === values.length && values[0] === values[1];

		return isLTR ? ltrDecls : dir === 'ltr' ? ltrDecls : dir === 'rtl' ? rtlDecls : [
			cloneRule(decl, 'ltr').append(ltrDecls),
			cloneRule(decl, 'rtl').append(rtlDecls)
		];
	},

	// border-inline-start
	'border-inline-start': (decl, values, dir) => {
		const ltrDecl = decl.clone({
			prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`
		});

		const rtlDecl = decl.clone({
			prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`
		});

		return dir === 'ltr' ? ltrDecl : dir === 'rtl' ? rtlDecl : [
			cloneRule(decl, 'ltr').append(ltrDecl),
			cloneRule(decl, 'rtl').append(rtlDecl)
		];
	},

	// border-inline-end
	'border-inline-end': (decl, values, dir) => {
		const ltrDecl = decl.clone({
			prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`
		});

		const rtlDecl = decl.clone({
			prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`
		});

		return dir === 'ltr' ? ltrDecl : dir === 'rtl' ? rtlDecl : [
			cloneRule(decl, 'ltr').append(ltrDecl),
			cloneRule(decl, 'rtl').append(rtlDecl)
		];
	}
};
