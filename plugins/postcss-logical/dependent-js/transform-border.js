import cloneRule from './clone-rule';

const matchLogical = /^\s*logical\s+/i;
const matchLogicalBorder = /^border(-width|-style|-color)?$/i;
const matchLogicalBorderSide = /^border-(block|block-start|block-end|inline|inline-start|inline-end|start|end)(-(width|style|color))?$/i;

export default {
	// border
	'border': (decl, values, dir) => {
		const isLogical = matchLogical.test(values[0]);

		if (isLogical) {
			values[0] = values[0].replace(matchLogical, '');
		}

		const ltrDecls = [
			decl.clone({
				prop: `border-top${decl.prop.replace(matchLogicalBorder, '$1')}`,
				value: values[0]
			}),
			decl.clone({
				prop: `border-left${decl.prop.replace(matchLogicalBorder, '$1')}`,
				value: values[1] || values[0]
			}),
			decl.clone({
				prop: `border-bottom${decl.prop.replace(matchLogicalBorder, '$1')}`,
				value: values[2] || values[0]
			}),
			decl.clone({
				prop: `border-right${decl.prop.replace(matchLogicalBorder, '$1')}`,
				value: values[3] || values[1] || values[0]
			})
		];

		const rtlDecls = [
			decl.clone({
				prop: `border-top${decl.prop.replace(matchLogicalBorder, '$1')}`,
				value: values[0]
			}),
			decl.clone({
				prop: `border-right${decl.prop.replace(matchLogicalBorder, '$1')}`,
				value: values[1] || values[0]
			}),
			decl.clone({
				prop: `border-bottom${decl.prop.replace(matchLogicalBorder, '$1')}`,
				value: values[2] || values[0]
			}),
			decl.clone({
				prop: `border-left${decl.prop.replace(matchLogicalBorder, '$1')}`,
				value: values[3] || values[1] || values[0]
			})
		];

		return isLogical ? 1 === values.length
			? decl.clone({
				value: decl.value.replace(matchLogical, '')
			})
			: !values[3] || values[3] === values[1]
				? [
					decl.clone({
						prop: `border-top${decl.prop.replace(matchLogicalBorder, '$1')}`,
						value: values[0]
					}),
					decl.clone({
						prop: `border-right${decl.prop.replace(matchLogicalBorder, '$1')}`,
						value: values[3] || values[1] || values[0]
					}),
					decl.clone({
						prop: `border-bottom${decl.prop.replace(matchLogicalBorder, '$1')}`,
						value: values[2] || values[0]
					}),
					decl.clone({
						prop: `border-left${decl.prop.replace(matchLogicalBorder, '$1')}`,
						value: values[1] || values[0]
					})
				]
				: 'ltr' === dir ? ltrDecls : 'rtl' === dir ? rtlDecls : [
					cloneRule(decl, 'ltr').append(ltrDecls),
					cloneRule(decl, 'rtl').append(rtlDecls)
				]
			: null;
	},

	// border-block
	'border-block': (decl, values) => [
		decl.clone({
			prop: `border-top${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[0]
		}),
		decl.clone({
			prop: `border-bottom${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[0]
		})
	],

	// border-block-start
	'border-block-start': decl => {
		decl.prop = 'border-top';
	},

	// border-block-end
	'border-block-end': decl => {
		decl.prop = 'border-bottom';
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

		return isLTR ? ltrDecls : 'ltr' === dir ? ltrDecls : 'rtl' === dir ? rtlDecls : [
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

		return 'ltr' === dir ? ltrDecl : 'rtl' === dir ? rtlDecl : [
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

		return 'ltr' === dir ? ltrDecl : 'rtl' === dir ? rtlDecl : [
			cloneRule(decl, 'ltr').append(ltrDecl),
			cloneRule(decl, 'rtl').append(rtlDecl)
		];
	},

	// border-start
	'border-start': (decl, values, dir) => {
		const ltrDecls = [
			decl.clone({
				prop: `border-top${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
				value: values[0]
			}),
			decl.clone({
				prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
				value: values[1] || values[0]
			})
		];

		const rtlDecls = [
			decl.clone({
				prop: `border-top${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
				value: values[0]
			}),
			decl.clone({
				prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
				value: values[1] || values[0]
			})
		];

		return 'ltr' === dir ? ltrDecls : 'rtl' === dir ? rtlDecls : [
			cloneRule(decl, 'ltr').append(ltrDecls),
			cloneRule(decl, 'rtl').append(rtlDecls)
		];
	},

	// border-end
	'border-end': (decl, values, dir) => {
		const ltrDecls = [
			decl.clone({
				prop: `border-bottom${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
				value: values[0]
			}),
			decl.clone({
				prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
				value: values[1] || values[0]
			})
		];

		const rtlDecls = [
			decl.clone({
				prop: `border-bottom${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
				value: values[0]
			}),
			decl.clone({
				prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
				value: values[1] || values[0]
			})
		];

		return 'ltr' === dir ? ltrDecls : 'rtl' === dir ? rtlDecls : [
			cloneRule(decl, 'ltr').append(ltrDecls),
			cloneRule(decl, 'rtl').append(rtlDecls)
		];
	}
};
